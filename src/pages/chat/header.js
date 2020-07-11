import React from 'react';
import { Box, Flex, IconButton, Text, useColorMode, useColorModeValue } from '@chakra-ui/core';
import { logout } from '../../utils/user';
import { useHistory } from 'react-router';
import { FiLogOut, FiMoon, FiSun } from 'react-icons/fi';

const Header = ({ activeGroup }) => {
  const history = useHistory();
  const { toggleColorMode } = useColorMode();
  const ColorModeToggle = useColorModeValue(FiMoon, FiSun);

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
          onClick={toggleColorMode}
          icon={<Box as={ColorModeToggle} />}
          mr={2}
        />
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
