import React, { useState } from 'react';
import {
  Box,
  Flex,
  IconButton,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
} from '@chakra-ui/core';
import { FiLogOut, FiUsers, FiChevronLeft } from 'react-icons/fi';
import LeaveGroupConfirmation from './leave-group-confirmation';
import { useChat } from './chat-context';

const Header = ({ openDrawer }) => {
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [{ activeGroup }] = useChat(['activeGroup']);

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
      <Flex alignItems="center">
        <IconButton
          variant="ghost"
          onClick={openDrawer}
          icon={<Box as={FiChevronLeft} />}
          display={{
            xs: 'inline-flex',
            sm: 'none',
          }}
          mr={2}
        />
        <Text fontWeight="600">{activeGroup.name}</Text>
      </Flex>
      <Box>
        {!!activeGroup.id && (
          <>
            <Popover>
              <PopoverTrigger>
                <IconButton variant="ghost" icon={<Box as={FiUsers} />} mx={1} />
              </PopoverTrigger>
              <PopoverContent>
                <PopoverHeader>Users</PopoverHeader>
                <PopoverCloseButton />
                <PopoverBody>
                  {activeGroup.users?.map((u, i) => (
                    <Text key={i}>{u.username}</Text>
                  ))}
                </PopoverBody>
              </PopoverContent>
            </Popover>
            <IconButton
              variant="ghost"
              onClick={() => setLeaveOpen(true)}
              icon={<Box as={FiLogOut} />}
              mx={1}
            />
          </>
        )}
      </Box>
      <LeaveGroupConfirmation isOpen={leaveOpen} onClose={() => setLeaveOpen(false)} />
    </Flex>
  );
};

export default Header;
