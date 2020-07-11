import React from 'react';
import { Box, Button, Flex, Heading, IconButton, Text, useColorModeValue } from '@chakra-ui/core';
import { useDisclosure } from '@chakra-ui/hooks';
import AddGroupModal from './add-group-modal';
import { FiChevronDown, FiPlus, FiSettings } from 'react-icons/fi';
import { getUsername } from '../../utils/user';

const Sidebar = ({ groups, loading, refreshGroups, activeGroup, setActiveGroup }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue('gray.50', '#212F3C');
  const hoverColor = useColorModeValue('gray.100', '#243342');
  const profileColor = useColorModeValue('gray.200', '#1b2631');
  return (
    <>
      <Flex height="100vh" borderRightWidth="1px" bg={bgColor} flexDir="column">
        <Flex
          align="center"
          mb={5}
          px={4}
          py={1}
          borderBottomWidth="1px"
          justifyContent="space-between"
          as={Button}
          w="100%"
          borderRadius={0}
          h="calc(3rem + 1px)"
          bg={bgColor}
          flexShrink={0}
          _hover={{
            bg: hoverColor,
          }}
        >
          <Heading fontFamily="MuseoModerno" fontWeight="600" fontSize="1.25rem">
            switchboard
          </Heading>
          <Box as={FiChevronDown} />
        </Flex>
        <Flex height="100%" flexDir="column">
          {!loading && (
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
          )}
          <Flex alignItems="center" justifyContent="space-between" px={4} py={2} bg={profileColor}>
            <Text fontWeight="bold">{getUsername()}</Text>
            <IconButton onClick={() => {}} icon={<Box as={FiSettings} />} variant="ghost" />
          </Flex>
        </Flex>
      </Flex>
      <AddGroupModal isOpen={isOpen} onClose={onClose} refreshGroups={refreshGroups} />
    </>
  );
};

export default Sidebar;
