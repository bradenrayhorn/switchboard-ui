import React from 'react';
import { Box, Button, Divider, Heading, Skeleton, Image, Flex } from '@chakra-ui/core';
import { useDisclosure } from '@chakra-ui/hooks';
import AddGroupModal from './add-group-modal';
import logo from '../../switchboard-logo-light.svg';

const Sidebar = ({ groups, loading, refreshGroups, setActiveGroup }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Box p={4} height="100vh" bg="#212F3C" color="#D5D8DC">
        <Flex align="center" pb={4}>
          <Image src={logo} alt="switchboard logo" height="2.25rem" />
          <Heading
            fontFamily="MuseoModerno"
            fontWeight="600"
            pl={2}
            color="#ebedef"
            fontSize="1.7rem"
          >
            switchboard
          </Heading>
        </Flex>
        <Heading size="md">Groups</Heading>
        <Divider mt={2} mb={2} />
        <Skeleton hasLoaded={!loading}>
          {groups.map((group, i) => (
            <Button key={i} variant="link" onClick={() => setActiveGroup(group)}>
              {group.name}
            </Button>
          ))}
        </Skeleton>
        <Button width="100%" mt={5} onClick={onOpen} variant="link">
          Create Group
        </Button>
      </Box>
      <AddGroupModal isOpen={isOpen} onClose={onClose} refreshGroups={refreshGroups} />
    </>
  );
};

export default Sidebar;
