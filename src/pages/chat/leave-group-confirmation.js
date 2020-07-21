import React, { useRef } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useToast,
} from '@chakra-ui/core';
import axios from 'axios';
import { errorToast, successToast } from '../../utils/toast';
import { useChat } from './chat-context';

const LeaveGroupConfirmation = ({ isOpen, onClose }) => {
  const cancelRef = useRef();
  const toast = useToast();

  const [, chatRef] = useChat([]);

  const handleLeaveGroup = () => {
    axios
      .post('/channels/leave', {
        channel_id: chatRef.current.activeGroup.id,
      })
      .then(() => {
        successToast('Channel Left', 'You have left the channel.', toast);
        chatRef.current.leaveGroup(chatRef.current.activeGroup.id);
        chatRef.current.switchGroup(null);
        onClose();
      })
      .catch(() => {
        errorToast('Failed to leave the channel.', toast);
      });
  };

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Leave Channel
          </AlertDialogHeader>

          <AlertDialogBody>Are you sure you wish to leave this channel?</AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleLeaveGroup} ml={3}>
              Leave Channel
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default LeaveGroupConfirmation;
