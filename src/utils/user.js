import store from 'store';

const keys = {
  jwt: 'jwt',
  username: 'username',
  id: 'user_id',
};

const login = (jwt, username, id) => {
  store.set(keys.jwt, jwt);
  store.set(keys.username, username);
  store.set(keys.id, id);
};

const getUsername = () => store.get(keys.username);

const isLoggedIn = () => !!store.get(keys.jwt);

const getToken = () => store.get(keys.jwt);

const getID = () => store.get(keys.id);

const logout = () => store.clearAll();

export { login, isLoggedIn, getToken, logout, getUsername, getID };
