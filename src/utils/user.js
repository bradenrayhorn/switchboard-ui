import store from "store";

const keys = {
  jwt: 'jwt',
  username: 'username',
};

const login = (jwt, username) => {
  store.set(keys.jwt, jwt);
  store.set(keys.username, username);
};

const getUsername = () => store.get(keys.username);

const isLoggedIn = () => !!store.get(keys.jwt);

const getToken = () => store.get(keys.jwt);

const logout = () => store.clearAll();

export {login, isLoggedIn, getToken, logout, getUsername}
