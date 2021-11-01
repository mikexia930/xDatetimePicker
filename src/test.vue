<template>
  <div id="app">
    sad
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'App',
  created() {
    this.getData();
  },
  methods: {
    getData() {
      const time = '2020-10-11'
      const format = 'YYYY-MM-DD HH:mm:ss.SSS';
      if (moment(time).isValid()) {
        console.log('valid date');
      } else {
        console.log('invalid date');
      }
      const a = moment(time).format(format);
      console.log(a);
    }
  }
}
</script>

<style lang="less" scoped>
.selected {
  font-size: 12px;
  padding-top: 30px;
  height: 50px;
  line-height: 50px;
}
.operation {
  padding-top: 20px;
  >div {
    margin-bottom: 10px;
    >button {
      margin-right: 5px;
      border: 0;
      padding: 10px;
      cursor: pointer;
    }
    .choose {
      background-color: #f96656;
      color: white;
    }
  }
}
</style>
