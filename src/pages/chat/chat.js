import React, {useEffect, useRef} from "react";
import {Box, Grid, Input, Text, useToast} from "@chakra-ui/core";
import Header from "./header";
import Sidebar from "./sidebar";
import axios from "axios";
import {errorToast, persistentToast} from "../../utils/toast";
import {getToken, getUsername} from "../../utils/user";
import urls from "../../constants/urls";

let client;

const Chat = () => {
  const [loading, setLoading] = React.useState(true);
  const [message, setMessage] = React.useState("");
  const [groups, setGroups] = React.useState([]);
  const [messages, setMessages] = React.useState([]);
  const toast = useToast();

  const groupRef = useRef([]);
  const connectionToastID = useRef(0);
  const reconnectTimeout = useRef(0);

  useEffect(() => {
    groupRef.current = groups;
  }, [groups])

  const getGroups = () => {
    axios.get('/groups')
      .then(response => {
        setGroups(response.data.data);
        setLoading(false);
      }).catch(() => {
      errorToast("Failed to get groups.", toast);
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
    client.send(JSON.stringify({
      message: message,
      group_id: groups[0].id,
    }));
    setMessages(messages => [...messages, {
      message: message,
      sender: getUsername(),
    }]);
    setMessage('');
  };

  const tryReconnect = () => {
    clearInterval(reconnectTimeout.current);
    if (!toast.isActive(connectionToastID.current)) {
      connectionToastID.current = persistentToast("Connection Lost", "Attempting to reconnect...", toast);
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
        position: "top",
        title: "Connected",
        description: "You have been reconnected.",
        status: "success",
        duration: 2000,
      })
    }
  };

  const setupWebsocket = () => {
    client = new WebSocket(`ws://${urls.chatBase}/ws?auth=` + getToken());

    client.onopen = () => {
      console.log('connected to ws');
      stopReconnect();
    };

    client.onmessage = (e) => {
      let message = JSON.parse(e.data);
      if (message.message) {
        let group = groupRef.current.find(g => g.id === message.group_id);
        setMessages(messages => [...messages, {
          message: message.message,
          sender: group.users.find(u => u.id === message.user_id).name,
        }]);
      }
    };

    client.onclose = e => {
      if (e.code === 4001) {
        return;
      }
      tryReconnect();
    }
  };

  useEffect(() => {
    getGroups();
    setupWebsocket();
    return () => { // eslint-disable-next-line no-unused-expressions
      client?.close(4001);
    };
  }, []);

  return (
    <Box>
      <Header/>
      <Grid templateColumns="240px 1fr" gap={6}>
        <Sidebar groups={groups} loading={loading}/>
        <Box
          height="100%"
          alignItems="bottom"
        >
          {messages.map((message, i) => (
            <Box key={i}>
              <Text>
                <b>{message.sender}: </b>{message.message}
              </Text>
            </Box>
          ))}
          <Input
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={e => {
              if (e.keyCode === 13) {
                sendMessage();
              }
            }}
          />
        </Box>
      </Grid>
    </Box>
  )
};

export default Chat;
