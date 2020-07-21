const callbackIfExists = (callback) => {
  if (callback) {
    callback();
  }
};

export default callbackIfExists;
