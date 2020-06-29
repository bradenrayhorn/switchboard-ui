const devUrls = {
  coreBase: '/api',
  chatBase: 'localhost:8090/api',
};

const prodUrls = {
  coreBase: '/api',
  chatBase: '/api/chat/api',
};

const urls = process.env.NODE_ENV === 'development' ? devUrls : prodUrls;

export default urls;
