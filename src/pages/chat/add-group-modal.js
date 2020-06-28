import React, { useEffect, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { components } from 'react-select';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/core';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { errorToast } from '../../utils/toast';
import { getID, getUsername, login } from '../../utils/user';

const RemoveButton = (props) => {
  if (props.data.value === getID()) {
    return <></>;
  }
  return <components.MultiValueRemove {...props} />;
};

const AddGroupModal = ({ isOpen, onClose, refreshGroups }) => {
  const defaultUsers = [{ value: getID(), label: getUsername() }];

  const { handleSubmit, register, formState } = useForm();
  const [users, setUsers] = useState(defaultUsers);
  const toast = useToast();

  const createGroup = ({ groupName }) => {
    return new Promise((resolve) => {
      axios
        .post('/groups/create', {
          name: !!groupName || null,
          users: users.map((x) => x.value),
        })
        .then(() => {
          resolve();
          refreshGroups();
          onClose();
        })
        .catch(() => {
          errorToast('Failed to create group.', toast);
          resolve();
        });
    });
  };

  const handleSelectChange = (value) => {
    if (!value || value?.length < 1) {
      setUsers(defaultUsers);
    } else {
      setUsers(value);
    }
  };

  const searchUsers = (name) =>
    new Promise((resolve) => {
      axios
        .post('/users/search', {
          username: name,
        })
        .then((response) => {
          resolve(
            response.data.data
              .filter((x) => x.id !== getID())
              .map((x) => ({ value: x.id, label: x.username }))
          );
        })
        .catch((err) => {
          console.error(err);
          resolve([]);
          errorToast('User search failed.', toast);
        });
    });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay>
        <ModalContent>
          <ModalHeader>Create Group</ModalHeader>
          <form onSubmit={handleSubmit(createGroup)}>
            <ModalBody>
              <FormControl mt="4">
                <FormLabel htmlFor="groupName">Group Name</FormLabel>
                <Input type="text" name="groupName" ref={register()} />
              </FormControl>
              <FormControl mt="4">
                <FormLabel htmlFor="users">Users</FormLabel>
                <AsyncSelect
                  cacheOptions
                  value={users}
                  onChange={handleSelectChange}
                  defaultOptions={[]}
                  loadOptions={searchUsers}
                  placeholder="Search..."
                  isMulti
                  autocomplete="false"
                  components={{ MultiValueRemove: RemoveButton }}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                mr={3}
                type="submit"
                isLoading={formState.isSubmitting}
                disabled={users.length < 2}
              >
                Save Group
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

export default AddGroupModal;
