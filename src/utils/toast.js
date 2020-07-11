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

const successToast = (title, message, toast) => {
  toast({
    position: 'top-right',
    title: title,
    description: message,
    status: 'success',
    duration: 4000,
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

export { errorToast, successToast, persistentToast };
