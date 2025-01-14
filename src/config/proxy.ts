export default {
  isRequestProxy: true,
  development: {
    // 开发环境接口请求
    host: 'http://127.0.0.1:6061',
    // 开发环境 cdn 路径
    cdn: '',
  },
  test: {
    // 测试环境接口地址
    host: '',
    // 测试环境 cdn 路径
    cdn: '',
  },
  release: {
    // 正式环境接口地址
    host: 'https://app.go-cinch.top',
    // 正式环境 cdn 路径
    cdn: '',
  },
};
