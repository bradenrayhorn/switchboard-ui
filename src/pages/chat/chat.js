import React, { useEffect, useRef } from 'react';
import {
  Box,
  Grid,
  Input,
  Text,
  useToast,
  InputGroup,
  Flex,
  useColorModeValue,
} from '@chakra-ui/core';
import Header from './header';
import Sidebar from './sidebar';
import axios from 'axios';
import { errorToast, persistentToast } from '../../utils/toast';
import { getToken, getUsername } from '../../utils/user';
import urls from '../../constants/urls';
import messageTypes from '../../constants/message-types';

let client;

const Chat = () => {
  const [loading, setLoading] = React.useState(true);
  const [message, setMessage] = React.useState('');
  const [activeGroup, setActiveGroup] = React.useState({});
  const [messages, setMessages] = React.useState([]);
  const toast = useToast();

  const groupRef = useRef([]);
  const activeGroupRef = useRef({});
  const connectionToastID = useRef(0);
  const reconnectTimeout = useRef(0);

  useEffect(() => {
    activeGroupRef.current = activeGroup;
  }, [activeGroup]);

  const getGroups = () => {
    setLoading(true);
    axios
      .get('/groups')
      .then((response) => {
        const groups = response.data.data.map((g) => ({
          ...g,
          name: g.name || g.users.map((u) => u.name).join(', '),
        }));
        groupRef.current = groups;
        setLoading(false);
        if (groups.length > 0) {
          setActiveGroup(groups[0]);
        }
      })
      .catch(() => {
        errorToast('Failed to get groups.', toast);
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
      if (!body) {
        return;
      }
      switch (type) {
        case messageTypes.message:
          const group = groupRef.current.find((g) => g.id === body.group_id);
          setMessages((messages) => [
            ...messages,
            {
              message: body.message,
              sender: group.users.find((u) => u.id === body.user_id).name,
            },
          ]);
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
    getGroups();
    setupWebsocket();
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
    <Box bg={chatBg}>
      <Grid templateColumns="240px 1fr">
        <Sidebar
          groups={groupRef.current}
          loading={loading}
          refreshGroups={getGroups}
          activeGroup={activeGroup}
          setActiveGroup={switchGroup}
        />
        <Flex height="100vh" flexDirection="column">
          <Header
            activeGroup={activeGroup}
            leaveGroup={(groupID) => {
              groupRef.current = groupRef.current.filter((g) => g.id !== groupID);
              switchGroup(null);
            }}
          />
          {!!activeGroup?.id && (
            <Flex p={4} height="100%" flexDirection="column" flexGrow="1">
              <Flex flexGrow="1" flexDirection="column">
                {messages.map((message, i) => (
                  <Flex key={i}>
                    <Text>
                      <b>{message.sender} </b>
                      {message.message}
                    </Text>
                  </Flex>
                ))}
              </Flex>
              <Flex>
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
      </Grid>
    </Box>
  );
};

export default Chat;
