<template>
  <div class="x-single x-time">
    <div class="x-span" v-if="!popoverHMS">
      <div></div>
      <div>
        <a @click.stop.prevent="refresh">
          {{ year }} - {{ month }} - {{ date }}
        </a>
      </div>
      <div></div>
    </div>
    <div class="x-show-time">
      <div>
        <ul>
          <li
            :key="`hour-${index}`"
            v-for="(value, index) in hours"
          >
            <div
              :class="{
               'x-time-selected': value === curHour,
               'x-limit': value < hourLimit.begin || value > hourLimit.end
              }"
              :value="value"
              @click.stop="selectHour"
            >
              {{ getShowValue(value) }}
            </div>
          </li>
        </ul>
      </div>
      <div>
        <ul @click="selectMinute">
          <li
            :key="minute-`${index}`"
            v-for="(value, index) in minutes"
          >
            <div
              :class="{
                'x-time-selected': value === curMinute,
                'x-limit': useHMS === 'hour' || value < minuteLimit.begin || value > minuteLimit.end
              }"
              :value="value"
              @click.stop="selectMinute"
            >
              {{ getShowValue(value) }}
            </div>
          </li>
        </ul>
      </div>
      <div v-if="useHMS === 'second'">
        <ul @click="selectSecond">
          <li
            :key="`second-${index}`"
            v-for="(value, index) in seconds"
          >
            <div
              :value="value"
              :class="{
                'x-time-selected': value === curSecond,
                'x-limit': useHMS !== 'second' || value < secondLimit.begin || value > secondLimit.end
              }"
              @click.stop="selectSecond"
            >
              {{ getShowValue(value) }}
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="x-time-confirm" v-if="!popoverHMS">
      <button @click="cancelTime">cancel</button>
      <button @click="selectTime">ok</button>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'x-time',
  created() {
    this.getLimitTimes();
  },
  props: {
    popoverHMS: Boolean, // 是否弹层设置时分秒
    isRange: Boolean, // 是否是时间区间
    rangePosition: String, // 对比日期的位置 begin 开始时间 / end 结束时间
    datetime: String, // 当前日期 2020-21-10 10:00:00
    year: Number, // 当前年
    month: Number, // 当前月
    date: Number, // 当前天
    hour: Number, // 当前小时
    minute: Number, // 当前分钟
    second: Number, // 当前秒
    useHMS: String, // 是否使用时分, '' / hour / minute / second，未使用分秒的补 00 分 00 秒
    limit: [Boolean, Object], // 区域限制 { begin: 0 不限制 / 2020-01-01 20:10:10, end: 0 不限制 / today / 2020-01-01 20:10:10 }
  },
  computed: {
    hours() {
      const backData = [];
      for (let i = 0; i <= 23; i += 1) {
        backData.push(i);
      }
      return backData;
    },
    minutes() {
      const backData = [];
      for (let i = 0; i <= 59; i += 1) {
        backData.push(i);
      }
      return backData;
    },
    seconds() {
      const backData = [];
      for (let i = 0; i <= 59; i += 1) {
        backData.push(i);
      }
      return backData;
    },
  },
  watch: {
    limit: {
      handler(newVal) {
        this.limit = newVal;
        this.getLimitTimes();
      },
      deep: true,
    },
    hour(newVal) {
      this.curHour = newVal;
    },
    minute(newVal) {
      this.curMinute = newVal;
    },
    second(newVal) {
      this.curSecond = newVal;
    },
  },
  data() {
    return {
      curHour: this.hour,
      curMinute: this.minute,
      curSecond: this.second,
      hourLimit: {
        begin: 0,
        end: 23,
      },
      minuteLimit: {
        begin: 0,
        end: 59,
      },
      secondLimit: {
        begin: 0,
        end: 59,
      },
    };
  },
  methods: {
    /**
     * 0-9 补 0
     * @param value
     * return {string}
     */
    getShowValue(value) {
      return value < 10 ? `0${value}` : value;
    },
    /**
     * 获取当前可用的小时分钟秒数
     * return {Array}
     */
    getLimitTimes() {
      const limitBegin = this.limit.begin;
      const limitEnd = this.limit.end;
      let hourBegin = 0;
      let hourEnd = 23;
      let minuteBegin = 0;
      let minuteEnd = 59;
      let secondBegin = 0;
      let secondEnd = 59;
      if (limitBegin || limitEnd) {
        const curMoment = moment(this.datetime);
        if (limitBegin) {
          const beginMoment = moment(limitBegin);
          const beginDiff = beginMoment.diff(curMoment, 'days');
          if (beginDiff === 0) {
            hourBegin = beginMoment.hour();
            if (hourBegin === this.curHour) {
              minuteBegin = beginMoment.minute();
              secondBegin = beginMoment.second();
            }
          }
        }
        if (limitEnd) {
          const endMoment = moment(limitEnd);
          const endDiff = endMoment.diff(curMoment, 'days');
          if (endDiff === 0) {
            hourEnd = endMoment.hour();
            if (hourEnd === this.curHour) {
              minuteEnd = endMoment.minute();
              secondEnd = endMoment.second();
            }
          }
        }
      }
      this.hourLimit.begin = hourBegin;
      this.hourLimit.end = hourEnd;
      this.minuteLimit.begin = minuteBegin;
      this.minuteLimit.end = minuteEnd;
      this.secondLimit.begin = secondBegin;
      this.secondLimit.end = secondEnd;

      if (this.curMinute < this.minuteLimit.begin || this.curMinute > this.minuteLimit.end) {
        this.curMinute = this.minuteLimit.begin;
      }

      if (this.curSecond < this.secondLimit.begin || this.curSecond > this.secondLimit.end) {
        this.curSecond = this.secondLimit.begin;
      }
    },
    refresh() {
      this.curHour = this.hour;
      this.curMinute = this.minute;
      this.curSecond = this.second;
    },
    cancelTime() {
      this.emitTo('cancelTime');
    },
    selectHour(e) {
      this.getSelectValue(e, 'hour');
    },
    selectMinute(e) {
      this.getSelectValue(e, 'minute');
    },
    selectSecond(e) {
      this.getSelectValue(e, 'second');
    },
    getSelectValue(e, type) {
      const targetClass = e.target.getAttribute('class');
      if (!(targetClass && targetClass.indexOf('x-limit') > -1)) {
        const value = parseInt(e.target.getAttribute('value'), 10);
        // e.target.parentElement.scrollTop = e.target.offsetTop;
        switch (type) {
          case 'second':
            this.curSecond = value;
            this.getLimitTimes();
            break;
          case 'minute':
            this.curMinute = value;
            this.getLimitTimes();
            break;
          case 'hour':
          default:
            this.curHour = value;
            break;
        }
        if (this.popoverHMS) {
          this.selectTime();
        }
      }
    },
    selectTime() {
      this.emitTo('selectTime', {
        hour: this.curHour,
        minute: this.curMinute,
        second: this.curSecond,
      });
    },
    emitTo(type, data) {
      this.$emit('handleDate', {
        type,
        data,
      });
    },
  },
};
</script>
