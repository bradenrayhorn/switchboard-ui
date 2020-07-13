import React from 'react';
import {
  Button,
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
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
} from '@chakra-ui/core';
import { useForm } from 'react-hook-form';
import { logout, setHasOrganization } from '../../utils/user';
import { useHistory } from 'react-router';
import axios from 'axios';
import { errorToast, successToast } from '../../utils/toast';

const InviteUserModal = ({ isOpen, onClose, organization }) => {
  const { handleSubmit, errors, register, formState } = useForm();
  const toast = useToast();

  const handleInvite = (values) => {
    return new Promise((resolve) => {
      axios
        .post('/organizations/invite-user', {
          username: values.name,
          organization_id: organization?.id,
        })
        .then(() => {
          successToast(
            'User Added',
            values.name + ' has been added to ' + organization.name + '.',
            toast
          );
          resolve();
          onClose();
        })
        .catch((error) => {
          errorToast(error?.response?.data?.error || 'Failed to invite user.', toast);
          resolve();
        });
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay>
        <ModalContent>
          <form onSubmit={handleSubmit(handleInvite)}>
            <ModalHeader>Invite User to Organization</ModalHeader>
            <ModalBody>
              <FormControl isInvalid={errors.name}>
                <FormLabel htmlFor="name">Username</FormLabel>
                <Input type="text" name="name" ref={register({ required: true })} />
                <FormErrorMessage>{errors.name && 'Username is required.'}</FormErrorMessage>
              </FormControl>
            </ModalBody>
            <ModalFooter justifyContent="space-between">
              <Button colorScheme="blue" type="submit" isLoading={formState.isSubmitting}>
                Add User
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

export default InviteUserModal;
