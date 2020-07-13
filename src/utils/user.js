import store from 'store';

const keys = {
  jwt: 'jwt',
  username: 'username',
  id: 'user_id',
  hasOrganization: 'has_organization',
};

const login = (jwt, username, id, hasOrganization) => {
  store.set(keys.jwt, jwt);
  store.set(keys.username, username);
  store.set(keys.id, id);
  store.set(keys.hasOrganization, hasOrganization);
};

const getUsername = () => store.get(keys.username);

const isLoggedIn = () => !!store.get(keys.jwt);

const getToken = () => store.get(keys.jwt);

const getID = () => store.get(keys.id);

const hasOrganization = () => store.get(keys.hasOrganization);

const setHasOrganization = (value) => store.set(keys.hasOrganization, value);

const logout = () => store.clearAll();

export {
  login,
  isLoggedIn,
  getToken,
  logout,
  getUsername,
  getID,
  hasOrganization,
  setHasOrganization,
};
