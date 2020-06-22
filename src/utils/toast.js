const errorToast = (message, toast) => {
  toast({
    position: 'top-right',
    title: 'Error',
    description: message,
    status: 'error',
    duration: 3500,
    isClosable: true,
  });
};

const persistentToast = (title, message, toast) =>
  toast({
    position: 'top',
    title: title,
    description: message,
    status: 'warning',
    duration: null,
  });

export { errorToast, persistentToast };
