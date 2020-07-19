import { useMediaQuery } from '@chakra-ui/core';

const useIsMobile = () => {
  const [isDesktop] = useMediaQuery('(min-width: 30em)');

  return !isDesktop;
};

export default useIsMobile;
