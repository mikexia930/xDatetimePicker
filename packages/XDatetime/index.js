import XDatetime from './src/index.vue';

// 为组件提供 install 安装方法，供按需引入
XDatetime.install = function (Vue) {
  Vue.component(XDatetime.name, XDatetime);
};

// 导出组件
export default XDatetime;
