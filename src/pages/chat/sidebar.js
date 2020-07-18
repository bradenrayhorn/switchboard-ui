import React from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Text,
  useColorMode,
  useColorModeValue,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
} from '@chakra-ui/core';
import { useDisclosure } from '@chakra-ui/hooks';
import CreateChannelModal from './create-channel-modal';
import { FiChevronDown, FiLogOut, FiMoon, FiPlus, FiSettings, FiSun } from 'react-icons/fi';
import { getUsername, logout } from '../../utils/user';
import { useHistory } from 'react-router';
import InviteUserModal from './invite-user-modal';

const Sidebar = ({
  groups,
  refreshGroups,
  activeGroup,
  setActiveGroup,
  organization,
  fullWidth,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: inviteOpen, onOpen: inviteOnOpen, onClose: inviteOnClose } = useDisclosure();
  const history = useHistory();
  const { toggleColorMode } = useColorMode();
  const ColorModeToggle = useColorModeValue(FiMoon, FiSun);
  const bgColor = useColorModeValue('gray.50', '#212F3C');
  const hoverColor = useColorModeValue('gray.100', '#243342');
  const profileColor = useColorModeValue('gray.200', '#1b2631');
  return (
    <>
      <Flex
        height="100vh"
        borderRightWidth="1px"
        bg={bgColor}
        flexDir="column"
        display={{ xs: fullWidth ? 'flex' : 'none', sm: 'flex' }}
      >
        <Menu>
          <Flex
            align="center"
            mb={5}
            px={4}
            py={1}
            borderBottomWidth="1px"
            justifyContent="space-between"
            as={MenuButton}
            w="100%"
            borderRadius={0}
            h="calc(3rem + 1px)"
            bg={bgColor}
            flexShrink={0}
            _hover={{
              bg: hoverColor,
            }}
            _active={{
              bg: hoverColor,
            }}
          >
            <Flex flexDir="column">
              <Heading fontFamily="MuseoModerno" fontWeight="600" fontSize="1.25rem">
                switchboard
              </Heading>
              <Heading fontSize=".8rem" textAlign="left">
                {organization?.name}
              </Heading>
            </Flex>
            <Box as={FiChevronDown} />
          </Flex>
          <MenuList>
            <MenuItem onClick={inviteOnOpen}>Invite User</MenuItem>
          </MenuList>
        </Menu>
        <Flex height="100%" flexDir="column">
          <Flex px={4} flexGrow="1" h="100%" alignItems="flex-start" flexDir="column">
            <Flex justifyContent="space-between" alignItems="center" mb={2} w="100%">
              <Heading size="sm" textTransform="uppercase" fontSize="0.75rem">
                Text Channels
              </Heading>
              <IconButton onClick={onOpen} icon={<Box as={FiPlus} />} size="sm" variant="ghost" />
            </Flex>
            <Flex flexDir="column" w="100%">
              {groups.map((group, i) => (
                <Flex
                  key={i}
                  w="100%"
                  my={1}
                  py={1}
                  pl={2}
                  cursor="pointer"
                  bg={activeGroup?.id === group.id ? hoverColor : 'transparent'}
                  fontWeight={activeGroup?.id === group.id ? 'bold' : 'normal'}
                  _hover={{
                    bg: hoverColor,
                  }}
                  borderRadius={4}
                  onClick={() => setActiveGroup(group)}
                >
                  {group.name}
                </Flex>
              ))}
            </Flex>
          </Flex>
          <Flex alignItems="center" justifyContent="space-between" px={4} py={2} bg={profileColor}>
            <Text fontWeight="bold" textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">
              {getUsername()}
            </Text>
            <Flex>
              <IconButton
                variant="ghost"
                onClick={() => {
                  logout();
                  history.push('/login');
                }}
                icon={<Box as={FiLogOut} />}
                size="sm"
              />
              <IconButton
                variant="ghost"
                onClick={toggleColorMode}
                icon={<Box as={ColorModeToggle} />}
                size="sm"
              />
              <IconButton
                onClick={() => {}}
                icon={<Box as={FiSettings} />}
                variant="ghost"
                size="sm"
              />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <CreateChannelModal
        isOpen={isOpen}
        onClose={onClose}
        refreshGroups={refreshGroups}
        organization={organization}
      />
      <InviteUserModal isOpen={inviteOpen} onClose={inviteOnClose} organization={organization} />
    </>
  );
};

export default Sidebar;
