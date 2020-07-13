import React, { useEffect } from 'react';
import { Box } from '@chakra-ui/core';
import { useDisclosure } from '@chakra-ui/hooks';
import AddOrganizationModal from './add-organization-modal';

const OrganizationPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    onOpen();
  }, []);

  return (
    <Box w="100vw" h="100vh" bg="#212F3C">
      <AddOrganizationModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};

export default OrganizationPage;
