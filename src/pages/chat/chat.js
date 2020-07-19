import React, { useEffect, useRef } from 'react';
import {
  Box,
  Flex,
  Grid,
  Input,
  InputGroup,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/core';
import Header from './header';
import Sidebar from './sidebar';
import axios from 'axios';
import { errorToast, persistentToast } from '../../utils/toast';
import { getToken, getUsername, hasOrganization, setHasOrganization } from '../../utils/user';
import urls from '../../constants/urls';
import messageTypes from '../../constants/message-types';
import { useHistory } from 'react-router';
import { useDisclosure } from '@chakra-ui/hooks';
import useIsMobile from '../../utils/is-mobile';

let client;

const Chat = () => {
  const { isOpen: isSidebarOpen, onOpen: onSidebarOpen, onClose: onSidebarClose } = useDisclosure();
  const [message, setMessage] = React.useState('');
  const [activeGroup, setActiveGroup] = React.useState({});
  const [activeOrganization, setActiveOrganization] = React.useState(null);
  const [messages, setMessages] = React.useState([]);
  const history = useHistory();
  const toast = useToast();

  const groupRef = useRef([]);
  const organizations = useRef([]);
  const activeGroupRef = useRef({});
  const connectionToastID = useRef(0);
  const reconnectTimeout = useRef(0);

  const isMobile = useIsMobile();

  useEffect(() => {
    activeGroupRef.current = activeGroup;
  }, [activeGroup]);

  const getGroups = () => {
    axios
      .get('/channels')
      .then((response) => {
        const groups = response.data.data.map((g) => ({
          ...g,
          name: g.name || g.users.map((u) => u.name).join(', '),
        }));
        groupRef.current = groups;
        // set active group
        const activeGroupID = activeGroupRef.current?.id;
        if (!activeGroupID && groups.length > 0) {
          switchGroup(null);
        } else if (
          !!activeGroupID &&
          (groups.length === 0 || !groups.find((g) => g.id === activeGroupID))
        ) {
          switchGroup(null);
        }
      })
      .catch(() => {
        errorToast('Failed to get groups.', toast);
      });
  };

  const getOrganizations = (onComplete) => {
    axios
      .get('/organizations')
      .then((response) => {
        organizations.current = response.data.data;
        if (organizations.current.length > 0) {
          setActiveOrganization(organizations.current[0]);
        } else {
          setHasOrganization(false);
          history.push('/organization');
          return;
        }
        onComplete();
      })
      .catch(() => {
        errorToast('Failed to get organizations.', toast);
      });
  };

  const sendMessage = () => {
    if (!message) {
      return;
    }
    if ([client.CLOSED, client.CLOSING].includes(client.readyState)) {
      tryReconnect();
      return;
    }
    client.send(
      JSON.stringify({
        message: message,
        group_id: activeGroupRef.current?.id,
      })
    );
    setMessages((messages) => [
      ...messages,
      {
        message: message,
        sender: getUsername(),
      },
    ]);
    setMessage('');
  };

  const tryReconnect = () => {
    clearInterval(reconnectTimeout.current);
    if (!toast.isActive(connectionToastID.current)) {
      connectionToastID.current = persistentToast(
        'Connection Lost',
        'Attempting to reconnect...',
        toast
      );
    }
    reconnectTimeout.current = setInterval(() => {
      if (client.readyState === client.OPEN) {
        stopReconnect();
      } else {
        setupWebsocket();
      }
    }, 5000);
  };

  const stopReconnect = () => {
    clearInterval(reconnectTimeout.current);
    if (toast.isActive(connectionToastID.current)) {
      toast.close(connectionToastID.current);
      toast({
        position: 'top',
        title: 'Connected',
        description: 'You have been reconnected.',
        status: 'success',
        duration: 2000,
      });
    }
  };

  const setupWebsocket = () => {
    client = new WebSocket(`ws://${urls.chatBase.replace('http://', '')}/ws?auth=` + getToken());

    client.onopen = () => {
      console.log('connected to ws');
      stopReconnect();
    };

    client.onmessage = (e) => {
      const { type, body } = JSON.parse(e.data);
      switch (type) {
        case messageTypes.message:
          if (!body || activeGroupRef.current?.id !== body?.group_id) {
            break;
          }
          const group = groupRef.current.find((g) => g.id === body.group_id);
          setMessages((messages) => [
            ...messages,
            {
              message: body.message,
              sender: group.users.find((u) => u.id === body.user_id).username,
            },
          ]);
          break;
        case messageTypes.groupChange:
          getGroups();
          break;
        default:
          break;
      }
    };

    client.onclose = (e) => {
      if (e.code === 4001) {
        return;
      }
      tryReconnect();
    };
  };

  useEffect(() => {
    if (!hasOrganization()) {
      history.push('/organization');
      return;
    }
    onSidebarOpen();
    getOrganizations(() => {
      getGroups();
      setupWebsocket();
    });
    return () => {
      // eslint-disable-next-line no-unused-expressions
      client?.close(4001);
    };
  }, []);

  const chatBg = useColorModeValue('white', '#283747');

  const switchGroup = (newGroup) => {
    setMessages([]);
    if (!newGroup && groupRef.current.length > 0) {
      setActiveGroup(groupRef.current[0]);
    } else if (!newGroup) {
      setActiveGroup({});
    } else {
      setActiveGroup(newGroup);
    }
  };

  return (
    <Box bg={chatBg} h="100%">
      <Grid templateColumns={{ xs: '1fr', sm: '240px 1fr' }} h="100%">
        {(!isMobile || isSidebarOpen) && (
          <Sidebar
            groups={groupRef.current}
            refreshGroups={getGroups}
            activeGroup={activeGroup}
            setActiveGroup={(newGroup) => {
              setActiveGroup(newGroup);
              onSidebarClose();
            }}
            organization={activeOrganization}
            fullWidth={isMobile}
          />
        )}
        {(!isMobile || !isSidebarOpen) && (
          <Flex height="100%" flexDirection="column">
            <Header
              activeGroup={activeGroup}
              leaveGroup={(groupID) => {
                groupRef.current = groupRef.current.filter((g) => g.id !== groupID);
                switchGroup(null);
              }}
              openDrawer={onSidebarOpen}
            />
            {!!activeGroup?.id && (
              <Flex height="100%" flexDirection="column" flexGrow="1">
                <Flex
                  flexGrow="1"
                  flexDirection="column"
                  overflow="scroll"
                  flexBasis="0"
                  px={4}
                  pt={4}
                >
                  {messages.map((message, i) => (
                    <Flex key={i}>
                      <Text>
                        <b>{message.sender} </b>
                        {message.message}
                      </Text>
                    </Flex>
                  ))}
                  <Flex pb={3} />
                </Flex>
                <Flex px={4} pb={4}>
                  <InputGroup>
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.keyCode === 13) {
                          sendMessage();
                        }
                      }}
                      placeholder="Start typing..."
                      pr={0}
                    />
                  </InputGroup>
                </Flex>
              </Flex>
            )}
          </Flex>
        )}
      </Grid>
    </Box>
  );
};

export default Chat;
