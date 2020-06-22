import React from 'react';
import { Box, Button, Divider, Heading, Skeleton } from '@chakra-ui/core';

const Sidebar = ({ groups, loading }) => {
  return (
    <Box p={4}>
      <Heading size="md">Groups</Heading>
      <Divider />
      <Skeleton hasLoaded={!loading}>
        {groups.map((group, i) => (
          <Box key={i}>{group.name}</Box>
        ))}
      </Skeleton>
      <Button width="100%" mt={5}>
        Create Group
      </Button>
    </Box>
  );
};

export default Sidebar;
