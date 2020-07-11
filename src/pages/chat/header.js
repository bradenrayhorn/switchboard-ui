import React from 'react';
import { Box, Flex, IconButton, Text, useToast } from '@chakra-ui/core';
import { getID } from '../../utils/user';
import { FiLogOut } from 'react-icons/fi';
import axios from 'axios';
import { errorToast, successToast } from '../../utils/toast';

const Header = ({ activeGroup, leaveGroup }) => {
  const toast = useToast();

  const handleLeaveGroup = () => {
    axios
      .post('/groups/update', {
        id: activeGroup.id,
        remove_users: [getID()],
      })
      .then(() => {
        successToast('Group Left', 'You have left the group.', toast);
        leaveGroup(activeGroup.id);
      })
      .catch(() => {
        errorToast('Failed to leave the group.', toast);
      });
  };

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      flexBasis={10}
      py={1}
      px={4}
      borderBottomWidth="1px"
      minHeight="calc(3rem + 1px)"
    >
      <Text fontWeight="600">{activeGroup?.name}</Text>
      <Box>
        {!!activeGroup?.id && (
          <IconButton variant="ghost" onClick={handleLeaveGroup} icon={<Box as={FiLogOut} />} />
        )}
      </Box>
    </Flex>
  );
};

export default Header;
