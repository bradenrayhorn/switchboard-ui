import React, { useState } from 'react';
import { Flex, Input, InputGroup, Text } from '@chakra-ui/core';
import messageTypes from '../../constants/message-types';
import { getID } from '../../utils/user';
import { useChat } from './chat-context';

const ChatArea = ({ websocketRef }) => {
  const [message, setMessage] = useState('');

  const [chatState, chatRef] = useChat(['activeMessages', 'activeGroup']);

  const sendMessage = (messageText) => {
    if (!messageText) {
      return;
    }
    websocketRef.current.sendMessage(messageTypes.message, {
      message: messageText,
      group_id: chatRef.current.activeGroup?.id,
    });
    chatRef.current.newMessage({
      group_id: chatRef.current.activeGroup?.id,
      user_id: getID(),
      message: messageText,
    });
  };

  return (
    <Flex height="100%" flexDirection="column" flexGrow="1">
      <Flex flexGrow="1" flexDirection="column" overflow="scroll" flexBasis="0" px={4} pt={4}>
        {chatState.activeMessages.map((message, i) => (
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
                sendMessage(message.trim());
                setMessage('');
              }
            }}
            placeholder="Start typing..."
            pr={0}
            disabled={!chatState.activeGroup.id}
          />
        </InputGroup>
      </Flex>
    </Flex>
  );
};

export default ChatArea;
