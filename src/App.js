import React from 'react';
import './App.css';
import {CSSReset, ThemeProvider} from "@chakra-ui/core";
import LoginPage from "./pages/login";
import {Route, Switch} from "react-router";
import {BrowserRouter} from "react-router-dom";
import NotFound from "./pages/404";
import Chat from "./pages/chat/chat";
import RedirectRoute from "./utils/redirect-route";
import theme  from '@chakra-ui/theme'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CSSReset/>
      <BrowserRouter>
        <Switch>
          <RedirectRoute path="/login" doesRequireNoAuth>
            <LoginPage/>
          </RedirectRoute>
          <RedirectRoute path="/" exact doesRequireAuth>
            <Chat/>
          </RedirectRoute>
          <Route path="*">
            <NotFound/>
          </Route>
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
