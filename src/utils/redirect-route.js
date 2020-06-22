import { isLoggedIn } from './user';
import { Redirect, Route } from 'react-router';
import React from 'react';

const RedirectRoute = ({ doesRequireAuth, doesRequireNoAuth, children, ...rest }) => {
  const loggedIn = isLoggedIn();

  if (loggedIn && doesRequireNoAuth) {
    return <Redirect to="/" />;
  } else if (!loggedIn && doesRequireAuth) {
    return <Redirect to="/login" />;
  } else {
    return <Route {...rest}>{children}</Route>;
  }
};

export default RedirectRoute;
