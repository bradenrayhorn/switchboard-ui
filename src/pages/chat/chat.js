import React, { useEffect, useRef } from 'react';
import {
  Box,
  Grid,
  Input,
  Text,
  useToast,
  InputGroup,
  InputRightElement,
  Icon,
  Flex,
} from '@chakra-ui/core';
import Header from './header';
import Sidebar from './sidebar';
import axios from 'axios';
import { errorToast, persistentToast } from '../../utils/toast';
import { getToken, getUsername } from '../../utils/user';
import urls from '../../constants/urls';

let client;

const Chat = () => {
  const [loading, setLoading] = React.useState(true);
  const [message, setMessage] = React.useState('');
  const [groups, setGroups] = React.useState([]);
  const [activeGroup, setActiveGroup] = React.useState({});
  const [messages, setMessages] = React.useState([]);
  const toast = useToast();

  const groupRef = useRef([]);
  const connectionToastID = useRef(0);
  const reconnectTimeout = useRef(0);

  useEffect(() => {
    groupRef.current = groups;
  }, [groups]);

  const getGroups = () => {
    setLoading(true);
    axios
      .get('/groups')
      .then((response) => {
        const groups = response.data.data.map((g) => ({
          ...g,
          name: g.name || g.users.map((u) => u.name).join(', '),
        }));
        setGroups(groups);
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
        group_id: groups[0].id,
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
      let message = JSON.parse(e.data);
      if (message.message) {
        let group = groupRef.current.find((g) => g.id === message.group_id);
        setMessages((messages) => [
          ...messages,
          {
            message: message.message,
            sender: group.users.find((u) => u.id === message.user_id).name,
          },
        ]);
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

  return (
    <Box>
      <Grid templateColumns="240px 1fr">
        <Sidebar
          groups={groups}
          loading={loading}
          refreshGroups={getGroups}
          setActiveGroup={setActiveGroup}
        />
        <Flex height="100vh" flexDirection="column">
          <Header activeGroup={activeGroup} />
          {!!activeGroup?.id && (
            <Flex p={4} height="100%" flexDirection="column" flexGrow="1">
              <Flex flexGrow="1" flexDirection="column">
                {messages.map((message, i) => (
                  <Flex key={i}>
                    <Text>
                      <b>{message.sender}: </b>
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
                  />
                  <InputRightElement>
                    <Icon name="ArrowRightIcon" />
                  </InputRightElement>
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
