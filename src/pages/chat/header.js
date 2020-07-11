import React from 'react';
import { Box, Flex, IconButton, Text } from '@chakra-ui/core';
import { logout } from '../../utils/user';
import { useHistory } from 'react-router';
import { FiLogOut } from 'react-icons/fi';

const Header = ({ activeGroup }) => {
  const history = useHistory();

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
    >
      <Text fontWeight="600">{activeGroup?.name}</Text>
      <Box>
        <IconButton
          variant="ghost"
          onClick={() => {
            logout();
            history.push('/login');
          }}
          icon={<Box as={FiLogOut} />}
        />
      </Box>
    </Flex>
  );
};

export default Header;
