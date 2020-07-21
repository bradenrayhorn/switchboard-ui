import React, { useEffect } from 'react';
import { Box, Flex, Grid, useColorModeValue } from '@chakra-ui/core';
import { hasOrganization } from '../../utils/user';
import { useHistory } from 'react-router';
import { useDisclosure } from '@chakra-ui/hooks';
import useIsMobile from '../../utils/is-mobile';
import ChatArea from './chat-area';
import useWebsocket from './use-websocket';
import messageTypes from '../../constants/message-types';
import { useChat } from './chat-context';
import Header from './header';
import Sidebar from './sidebar';

const Chat = () => {
  const { isOpen: isSidebarOpen, onOpen: onSidebarOpen, onClose: onSidebarClose } = useDisclosure();
  const history = useHistory();
  const websocket = useWebsocket();
  const [, chatRef] = useChat([]);
  const isMobile = useIsMobile();

  const chatBg = useColorModeValue('white', '#283747');

  const onMessageReceived = (body) => {
    if (!body) {
      return;
    }
    chatRef.current.newMessage(body);
  };

  useEffect(() => {
    if (!hasOrganization()) {
      history.push('/organization');
      return;
    }
    onSidebarOpen();
    chatRef.current.refreshOrganizations(() => {
      chatRef.current.refreshGroups();
      websocket.current.initialize();
      websocket.current.registerListener(messageTypes.groupChange, chatRef.current.refreshGroups);
      websocket.current.registerListener(messageTypes.message, onMessageReceived);
    });
    return () => {
      // eslint-disable-next-line no-unused-expressions
      websocket.current.deregisterListener(messageTypes.groupChange, chatRef.current.refreshGroups);
      websocket.current.deregisterListener(messageTypes.message, onMessageReceived);
    };
  }, []);

  return (
    <Box bg={chatBg} h="100%">
      <Grid templateColumns={{ xs: '1fr', sm: '240px 1fr' }} h="100%">
        {(!isMobile || isSidebarOpen) && (
          <Sidebar closeSidebar={onSidebarClose} fullWidth={isMobile} />
        )}
        {(!isMobile || !isSidebarOpen) && (
          <Flex height="100%" flexDirection="column">
            <Header openDrawer={onSidebarOpen} />
            <ChatArea websocketRef={websocket} />
          </Flex>
        )}
      </Grid>
    </Box>
  );
};

export default Chat;
