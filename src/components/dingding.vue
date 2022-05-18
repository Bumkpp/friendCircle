<template>
  <div>
    <div>{{res}}</div>
<div>{{code}}</div>
  </div>
</template>

<script>
import * as dd from 'dingtalk-jsapi';

export default {
  data() {
    return {
      code: '',
      res: '',
    };
  },
  mounted() {
    // eslint-disable-next-line no-console
    console.log(dd.env.platform);
    // dd.ready参数为回调函数，在环境准备就绪时触发，jsapi的调用需要保证在该回调函数触发后调用，否则无效。
    // eslint-disable-next-line eqeqeq
    if (dd.env.platform != 'notInDingTalk') {
      dd.ready(() => {
        dd.runtime.permission.requestAuthCode({ corpId: 'ding322bf8c51662adf3a1320dcb25e91351' }).then((result) => {
          // eslint-disable-next-line no-console
          console.log(result);
          this.res = result;
          this.code = result.code;
        }).catch((err) => {
          // eslint-disable-next-line no-console
          console.log(err);
          // eslint-disable-next-line no-alert
          alert(err);
        });
      });
    } else {
      // eslint-disable-next-line no-console
      console.warn('请在钉钉中访问本应用!');
    }
  },
};
</script>

<style scoped>
</style>
