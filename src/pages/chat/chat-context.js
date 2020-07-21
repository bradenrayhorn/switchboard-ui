import React, { useEffect, useState } from 'react';
import useChatTarget from './chat-target';

const ChatContext = React.createContext();

const ChatContextProvider = ({ children }) => {
  const chatData = useChatTarget();
  return <ChatContext.Provider value={chatData}>{children}</ChatContext.Provider>;
};

const useChatRef = () => React.useContext(ChatContext);

const useChatState = (
  watching = ['groups', 'activeGroup', 'organizations', 'activeOrganization', 'activeMessages']
) => {
  const chatRef = useChatRef();
  const [chatState, setChatState] = useState(chatRef.current);
  useEffect(() => {
    const onChange = () => {
      setChatState(chatRef.current);
    };
    if (watching.length > 0) {
      chatRef.current.addListener(watching, onChange);
      return () => {
        chatRef.current.removeListener(watching, onChange);
      };
    }
  }, []);

  return chatState;
};

const useChat = (watching) => {
  const chatRef = useChatRef();
  const chatState = useChatState(watching);

  return [chatState, chatRef];
};

export { ChatContextProvider, useChat };
