const devUrls = {
  coreBase: '/api',
  chatBase: 'localhost:8090/api',
};

const prodUrls = {
  coreBase: '/api',
  chatBase: 'http://switchboard.braden.cc/api/chat/api',
};

const urls = process.env.NODE_ENV === 'development' ? devUrls : prodUrls;

export default urls;
