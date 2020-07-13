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
import { errorToast } from '../../utils/toast';

const AddOrganizationModal = ({ isOpen, onClose }) => {
  const { handleSubmit, errors, register, formState } = useForm();
  const history = useHistory();
  const toast = useToast();

  const handleCreate = (values) => {
    return new Promise((resolve) => {
      axios
        .post('/organizations', {
          name: values.name,
        })
        .then(() => {
          setHasOrganization(true);
          history.push('/');
          resolve();
        })
        .catch(() => {
          errorToast('Failed to save organization.', toast);
          resolve();
        });
    });
  };

  const refreshOrganizations = () => {
    axios
      .get('/organizations')
      .then((response) => {
        if (response.data.data.length > 0) {
          setHasOrganization(true);
          history.push('/');
        } else {
          errorToast('Could not find any organizations', toast);
        }
      })
      .catch(() => {
        errorToast('Failed to refresh.', toast);
      });
  };

  const handleLogout = () => {
    logout();
    history.push('/login');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnEsc={false} closeOnOverlayClick={false}>
      <ModalOverlay>
        <ModalContent>
          <form onSubmit={handleSubmit(handleCreate)}>
            <ModalHeader>Welcome</ModalHeader>
            <ModalBody>
              <Text>
                To begin using Switchboard you must be a member of an organization. You may either
                create an organization or wait to be added to an existing organization. If you
                believe you have been added to an organization please{' '}
                <Link onClick={refreshOrganizations} color="blue.600">
                  refresh your invites
                </Link>
                .
              </Text>
              <Divider my={4} />
              <Heading size="md">New Organization</Heading>
              <FormControl mt="4" isInvalid={errors.name}>
                <FormLabel htmlFor="name">Name</FormLabel>
                <Input type="text" name="name" ref={register({ required: true })} />
                <FormErrorMessage>{errors.name && 'Name is required.'}</FormErrorMessage>
              </FormControl>
            </ModalBody>
            <ModalFooter justifyContent="space-between">
              <Button onClick={handleLogout}>Logout</Button>
              <Button colorScheme="blue" type="submit" isLoading={formState.isSubmitting}>
                Save
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

export default AddOrganizationModal;
