import { useEffect, useRef } from 'react';
import urls from '../../constants/urls';
import { getToken } from '../../utils/user';
import { persistentToast } from '../../utils/toast';
import { useToast } from '@chakra-ui/core';

const useWebsocket = () => {
  const toast = useToast();
  const reconnectTimeout = useRef(0);
  const connectionToastID = useRef(0);
  const websocketConnection = useRef({});
  const listeners = useRef({});

  const registerListener = (type, callback) => {
    let listenersOfType = listeners.current[type];
    if (listenersOfType) {
      listenersOfType.push(callback);
    } else {
      listenersOfType = [callback];
    }
    listeners.current[type] = listenersOfType;
  };

  const deregisterListener = (type, callback) => {
    let listenersOfType = listeners.current[type];
    if (listenersOfType) {
      listenersOfType = listenersOfType.filter((c) => c !== callback);
    }
    listeners.current[type] = listenersOfType;
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
    const { client } = websocketConnection.current;
    reconnectTimeout.current = setInterval(() => {
      if (client?.readyState === client?.OPEN) {
        stopReconnect();
      } else {
        initialize();
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

  const initialize = () => {
    // close previously existing client
    if (!!websocketConnection.current.client) {
      // eslint-disable-next-line no-unused-expressions
      websocketConnection.current.client?.close(4001);
    }
    // create new client
    websocketConnection.current.client = new WebSocket(
      `ws://${urls.chatBase.replace('http://', '')}/ws?auth=` + getToken()
    );

    websocketConnection.current.client.onopen = () => {
      stopReconnect();
    };

    websocketConnection.current.client.onmessage = (e) => {
      const { type, body } = JSON.parse(e.data);
      listeners.current[type].forEach((callback) => {
        callback(body);
      });
    };

    websocketConnection.current.client.onclose = (e) => {
      if (e.code === 4001) {
        return;
      }
      tryReconnect();
    };
  };

  const sendMessage = (messageID, message) => {
    const { client } = websocketConnection.current;
    if (!client || [client.CLOSED, client.CLOSING].includes(client.readyState)) {
      tryReconnect();
      return;
    }
    client.send(JSON.stringify(message));
  };

  useEffect(() => {
    websocketConnection.current = {
      client: null,
      sendMessage: sendMessage,
      initialize: initialize,
      registerListener: registerListener,
      deregisterListener: deregisterListener,
    };
    return () => {
      // eslint-disable-next-line no-unused-expressions, react-hooks/exhaustive-deps
      websocketConnection.current?.client?.close(4001);
    };
  }, []);

  return websocketConnection;
};

export default useWebsocket;
