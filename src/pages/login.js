import React from 'react';
import {Box, Button, FormControl, FormErrorMessage, FormLabel, Image, Input, useToast} from "@chakra-ui/core";
import logo from "../switchboard-full.svg"
import {useForm} from "react-hook-form";
import {login} from "../utils/user";
import {useHistory} from "react-router";
import axios from "axios";
import {errorToast} from "../utils/toast";

const LoginPage = () => {
  const {handleSubmit, errors, register, formState} = useForm();
  const history = useHistory()
  const toast = useToast();

  const attemptLogin = values => {
    return new Promise((resolve) => {
      axios.post('/auth/login', {
        username: values.username,
        password: values.password,
      }).then(response => {
        login(response.data.token, values.username);
        history.push('/');
        resolve();
      }).catch(error => {
        errorToast("Invalid login credentials.", toast);
        resolve();
      });
    })
  }

  return (
    <Box w="100vw" h="100vh" bg="#212F3C">
      <Box
        width={[
          "98%",
          "300px",
        ]}
        bg="#F4F6F7"
        p="4"
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -100%)"
      >
        <Image src={logo} alt="switchboard logo" w="100%"/>
        <form onSubmit={handleSubmit(attemptLogin)}>
          <FormControl mt="4" isInvalid={errors.username}>
            <FormLabel htmlFor="username">Username</FormLabel>
            <Input
              type="text"
              name="username"
              ref={register({required: true})}
            />
            <FormErrorMessage>
              {errors.username && "Username is required."}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.password}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              type="password"
              name="password"
              ref={register({required: true})}
            />
            <FormErrorMessage>
              {errors.password && "Password is required."}
            </FormErrorMessage>
          </FormControl>
          <Box
            textAlign="center"
          >
            <Button
              isLoading={formState.isSubmitting}
              mt="4"
              type="submit"
            >
              Login
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  )
};

export default LoginPage;
