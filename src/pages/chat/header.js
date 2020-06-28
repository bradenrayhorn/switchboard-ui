import React from 'react';
import { Button, Flex, Text } from '@chakra-ui/core';
import { logout } from '../../utils/user';
import { useHistory } from 'react-router';

const Header = ({ activeGroup }) => {
  const history = useHistory();

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      flexBasis={10}
      p={4}
      borderBottom="1px solid #ABB2B9"
    >
      <Text fontWeight="600">{activeGroup?.name}</Text>
      <Button
        variant="link"
        onClick={() => {
          logout();
          history.push('/login');
        }}
      >
        Logout
      </Button>
    </Flex>
  );
};

export default Header;
