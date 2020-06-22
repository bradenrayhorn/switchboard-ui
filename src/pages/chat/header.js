import React from "react";
import {Button, Flex, Heading, Image} from "@chakra-ui/core";
import logo from '../../switchboard-logo-light.svg'
import {logout} from "../../utils/user";
import {useHistory} from "react-router";

const Header = () => {
  const history = useHistory();

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      bg='#212F3C'
      flexBasis={10}
      p={4}
    >
      <Flex
        align="center"
      >
        <Image src={logo} alt='switchboard logo' height={12}/>
        <Heading
          fontFamily='MuseoModerno'
          fontWeight='600'
          pl={2}
          color="#ebedef"
        >
          switchboard
        </Heading>
      </Flex>
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
  )
};

export default Header;
