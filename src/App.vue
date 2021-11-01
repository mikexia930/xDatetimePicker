<template>
  <div id="app">
    <x-datetime-picker
      :language="language"
      :use-h-m-s="useHMS"
      :popover-h-m-s="popoverHMS"
      :datetime="datetime"
      :limit="limit"
      :is-range="isRange"
      :choose-span="chooseSpan"
      :is-week-begin-from-sunday="isWeekBeginFromSunday"
      @handleDatetime="handleDatetime"
    />
    <div class="selected"> {{ selected }}</div>
    <div class="operation">
      <div class="weekBegin">
        <button
          :key="`wb-${index}`"
          :class="{'choose': (item.value === 'su' && isWeekBeginFromSunday) || (item.value === 'mo' && !isWeekBeginFromSunday)}"
          @click="setWeekBegin(item.value)"
          v-for="(item, index) in config.weekBegin"
        >
          {{ item.name }}
        </button>
      </div>
      <div class="range">
        <button
          :key="`range-${index}`"
          :class="{'choose': item.value === isRange}"
          @click="setRange(item.value)"
          v-for="(item, index) in config.range"
        >
          {{ item.name }}
        </button>
      </div>
      <div class="language">
        <button
          :key="item.value"
          :class="{'choose': item.value === language}"
          @click="setLanguage(item.value)"
          v-for="(item) in config.lang"
        >
          {{ item.name }}
        </button>
      </div>
      <div class="time">
        <button
          :key="item.value"
          :class="{'choose': item.value === useHMS}"
          @click="setTime(item.value)"
          v-for="(item) in config.time"
        >
          {{ item.name }}
        </button>
      </div>
      <div class="howToChooseTime">
        <button
          :key="item.value"
          :class="{'choose': item.value === popoverHMS}"
          @click="setHowToChooseTime(item.value)"
          v-for="(item) in config.howToChooseTime"
        >
          {{ item.name }}
        </button>
      </div>
      <div class="span">
        <button
          :key="item.value"
          :class="{'choose': item.value === chooseSpan}"
          @click="setSpan(item.value)"
          v-for="(item) in config.span"
        >
          {{ item.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import XDatetimePicker from '../packages/XDatetime/src/index.vue';
import moment from 'moment';

export default {
  name: 'App',
  components: {
    XDatetimePicker,
  },
  created() {
    this.initDatetime();
  },
  data() {
    return {
      config: {
        howToChooseTime: [
          {
            name: '弹层设置时分秒',
            value: true
          },
          {
            name: '平铺设置时分秒',
            value: false
          }
        ],
        weekBegin: [
          {
            name: '星期日开始',
            value: 'su'
          },
          {
            name: '星期一开始',
            value: 'mo'
          }
        ],
        range: [
          {
            name: '时间点',
            value: false
          },
          {
            name: '时间段',
            value: true
          },
        ],
        lang: [
          {
            name: '中文',
            value: 'zh_CN'
          },
          {
            name: '英文',
            value: 'en'
          },
          {
            name: '日文',
            value: 'ja'
          },
          {
            name: '法文',
            value: 'fr'
          },
        ],
        time: [
          {
            name: '按天',
            value: ''
          },
          {
            name: '按小时',
            value: 'hour'
          },
          {
            name: '按分钟',
            value: 'minute'
          },
          {
            name: '按秒',
            value: 'second'
          },
        ],
        span: [
          {
            name: '任意',
            value: ''
          },
          {
            name: '周',
            value: 'week'
          },
          {
            name: '月',
            value: 'month'
          },
          {
            name: '7天',
            value: 7
          },
        ]
      },
      useHMS: 'second',
      popoverHMS: true,
      datetime: '',
      isRange: true,
      language: 'zh_CN',
      limit: {
        begin: '',
        end: '2021-10-30 12:00:00',
      },
      chooseSpan: '',
      isWeekBeginFromSunday: true,
      selected: this.datetime,
    };
  },
  methods: {
    initDatetime() {
      let dateFormat;
      if (this.useHMS) {
        dateFormat = 'YYYY-MM-DD HH:mm:ss';
      } else {
        dateFormat = 'YYYY-MM-DD';
      }
      if (this.isRange) {
        this.datetime = [moment().format(dateFormat), moment().format(dateFormat)];
      } else {
        this.datetime = moment().format(dateFormat);
      }
      this.selected = this.datetime;
    },
    handleDatetime(emitData) {
      this.selected = emitData;
    },
    setLanguage(lan) {
      this.language = lan;
    },
    setTime(time) {
      this.useHMS = time;
      this.initDatetime();
    },
    setSpan(span) {
      this.chooseSpan = span;
    },
    setRange(range) {
      this.isRange = range;
      this.initDatetime();
    },
    setWeekBegin(wb) {
      if (wb === 'su') {
        this.isWeekBeginFromSunday = true;
      } else {
        this.isWeekBeginFromSunday = false;
      }
    },
    setHowToChooseTime(isPopover) {
      this.popoverHMS = isPopover;
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
