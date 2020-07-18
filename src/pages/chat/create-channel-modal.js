import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
  useToast,
} from '@chakra-ui/core';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { errorToast } from '../../utils/toast';
import { getID } from '../../utils/user';

const CreateChannelModal = ({ isOpen, onClose, refreshGroups, organization }) => {
  const { handleSubmit, register, formState, errors } = useForm();
  const toast = useToast();
  const [availableChannels, setAvailableChannels] = useState([]);

  useEffect(() => {
    if (isOpen) {
      axios.get(`/organizations/${organization?.id}/channels`).then(
        (response) => {
          setAvailableChannels(
            response.data.data.filter(
              (channel) => channel.users.filter((u) => u.id === getID()).length < 1
            )
          );
        },
        () => {
          errorToast('Failed to get channels.', toast);
          onClose();
        }
      );
    }
  }, [isOpen]);

  const createChannel = ({ channelName, isPrivate }) => {
    return new Promise((resolve) => {
      axios
        .post('/channels', {
          name: channelName,
          organization_id: organization?.id,
          private: isPrivate,
        })
        .then(() => {
          resolve();
          refreshGroups();
          onClose();
        })
        .catch(() => {
          errorToast('Failed to create channel.', toast);
          resolve();
        });
    });
  };

  const joinChannel = (channelID) => {
    axios
      .post('/channels/join', {
        organization_id: organization?.id,
        channel_id: channelID,
      })
      .then(() => {
        refreshGroups();
        onClose();
      })
      .catch(() => {
        errorToast('Failed to join channel.', toast);
      });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay>
        <ModalContent>
          <form onSubmit={handleSubmit(createChannel)}>
            <ModalBody>
              <Heading size="md" my={4}>
                Join Channel
              </Heading>
              <Box>
                {availableChannels.map((c, i) => (
                  <Link my={2} onClick={() => joinChannel(c.id)} key={i}>
                    #{c.name}
                  </Link>
                ))}
                {availableChannels.length < 1 && <Text>No channels found.</Text>}
              </Box>
              <Divider my={4} />
              <Heading size="md">Create Channel</Heading>
              <FormControl mt="4" isInvalid={errors.channelName}>
                <FormLabel htmlFor="channelName">Channel Name</FormLabel>
                <Input
                  type="text"
                  name="channelName"
                  ref={register({
                    pattern: /^[a-zA-Z_-]+$/,
                    required: true,
                  })}
                  placeholder="Example: chat-group"
                />
                <FormErrorMessage>{errors.channelName && 'Invalid channel name.'}</FormErrorMessage>
              </FormControl>
              <FormControl mt="4" display="flex" alignItems="center">
                <FormLabel htmlFor="isPrivate" display="inline" m={0}>
                  Private
                </FormLabel>
                <Checkbox type="text" name="isPrivate" ref={register()} ml={4} />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" type="submit" isLoading={formState.isSubmitting}>
                Create Channel
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

export default CreateChannelModal;
