<template>
  <div>
    <template v-if="showType === 'year'">
      <x-year
        :year="curYear"
        :limit="limit"
        :is-hide-year-month-arrow="isHideYearMonthArrow"
        @handleDate="handleDate"
      >
        <template v-slot:deductYear>
          <slot name="deductYear"></slot>
        </template>
        <template v-slot:addYear>
          <slot name="addYear"></slot>
        </template>
      </x-year>
    </template>
    <template v-else-if="showType === 'month'">
      <x-month
        :lang="lang"
        :year="curYear"
        :month="curMonth"
        :limit="limit"
        :is-hide-year-month-arrow="isHideYearMonthArrow"
        @handleDate="handleDate"
      >
        <template v-slot:deductYear>
          <slot name="deductYear"></slot>
        </template>
        <template v-slot:addYear>
          <slot name="addYear"></slot>
        </template>
      </x-month>
    </template>
    <template v-else-if="showType === 'time' && !popoverHMS">
      <x-time
        :is-range="isRange"
        :range-position="rangePosition"
        :datetime="curDatetime"
        :year="curYear"
        :month="curMonth"
        :date="curDate"
        :hour="curHour"
        :minute="curMinute"
        :second="curSecond"
        :limit="limit"
        :use-h-m-s="useHMS"
        :popover-h-m-s="popoverHMS"
        @handleDate="handleDate"
      />
    </template>
    <template v-else>
      <x-date
        :is-range="isRange"
        :range-position="rangePosition"
        :lang="lang"
        :useHMS="useHMS"
        :datetime="curDatetime"
        :year="curYear"
        :month="curMonth"
        :date="curDate"
        :hour="curHour"
        :minute="curMinute"
        :second="curSecond"
        :limit="limit"
        :isWeekBeginFromSunday="isWeekBeginFromSunday"
        :is-hide-year-month-arrow="isHideYearMonthArrow"
        @handleDate="handleDate"
      >
        <template v-slot:deductYear>
          <slot name="deductYear"></slot>
        </template>
        <template v-slot:deductMonth>
          <slot name="deductMonth"></slot>
        </template>
        <template v-slot:addYear>
          <slot name="addYear"></slot>
        </template>
        <template v-slot:addMonth>
          <slot name="addMonth"></slot>
        </template>
        <template v-slot:showTime="{ hour, minute, second }">
          <slot
            name="showTime"
            :hour="hour"
            :minute="minute"
            :second="second"
          ></slot>
        </template>
        <template v-slot:selectTime>
          <div class="x-minute-show" v-if="popoverHMS" v-show="showPopoverTime">
            <x-time
              :is-range="isRange"
              :range-position="rangePosition"
              :datetime="curDatetime"
              :year="curYear"
              :month="curMonth"
              :date="curDate"
              :hour="curHour"
              :minute="curMinute"
              :second="curSecond"
              :limit="limit"
              :use-h-m-s="useHMS"
              :popover-h-m-s="popoverHMS"
              @handleDate="handleDate"
            />
          </div>
        </template>
      </x-date>
    </template>
  </div>
</template>

<script>
import XDate from './date.vue';
import XYear from './year.vue';
import XMonth from './month.vue';
import XTime from './time.vue';
import moment from 'moment';

export default {
  name: 'x-single',
  components: {
    XYear,
    XMonth,
    XDate,
    XTime,
  },
  created() {
    this.initYearMonth();
  },
  mounted() {
    this.listenPopover();
  },
  props: {
    isRange: Boolean, // 是否是时间区间
    rangePosition: String, // 对比日期的位置 begin 开始时间 / end 结束时间
    lang: Object, // 日期语言包，{ month: [一月,二月，三月], week: [日, 一]}
    useHMS: String, // 是否使用时分, '' / hour / minute / second，未使用分秒的补 00 分 00 秒
    popoverHMS: Boolean, // 是否弹层设置时分秒
    datetime: String, // 当前日期 2020-12-10 10:00:00， 如多当前时间不在 limit 区间里，则直接使用 limit 的时间，如果 limit 有限制前后，则取左区间时间，否则取 limit 后区间。
    dateFormat: String, // 时间格式 YYYY-MM-DD HH:mm:ss
    limit: [Boolean, Object], // 区域限制 { begin: '' 不限制 / 2020-01-01 20:10:10, end: '' 不限制 / 2020-01-01 20:10:10 }
    isWeekBeginFromSunday: Boolean, // 一周是否从周日开始
    isHideYearMonthArrow: Boolean,
  },
  watch: {
    datetime(newVal) {
      this.curDatetime = newVal;
      this.initYearMonth();
    },
    useHMS(newVal) {
      if (newVal) {
        this.listenPopover();
      }
    },
  },
  data() {
    return {
      curDatetime: this.datetime,
      showType: 'date',
      showPopoverTime: false,
      yearFrom: 'date',
      curYear: 2000,
      curMonth: 1,
      curDate: 1,
      curHour: 0,
      curMinute: 0,
      curSecond: 0,
    };
  },
  methods: {
    listenPopover() {
      if (this.popoverHMS) {
        this.$nextTick(() => {
          document.addEventListener('click', () => {
            this.showPopoverTime = false;
          });
          document.querySelectorAll('.x-minute span').forEach((dom) => {
            dom.addEventListener('click', (e) => {
              e.stopPropagation();
            });
          });
          document.querySelectorAll('.x-show-time div').forEach((dom) => {
            dom.addEventListener('click', (e) => {
              e.stopPropagation();
            });
          });
        });
      }
    },
    showDate() {
      this.showType = 'date';
      this.listenPopover();
    },
    /**
     * 初始化年月
     * @param type
     */
    initYearMonth() {
      let curValue;
      if (this.datetime && moment(this.datetime).isValid()) {
        curValue = moment(this.datetime);
      } else {
        curValue = moment();
      }
      if (this.isRange && this.rangePosition === 'end' && this.useHMS) {
        curValue = curValue.endOf(this.useHMS);
      }
      this.curYear = curValue.year();
      this.curMonth = curValue.month() + 1;
      this.curDate = curValue.date();
      this.curHour = curValue.hour();
      this.curMinute = curValue.minute();
      this.curSecond = curValue.second();
      this.curDatetime = this.setCurrentDatetime();
    },
    setCurrentDatetime() {
      let datetime = `${this.curYear}-${this.curMonth}-${this.curDate}`;
      if (this.useHMS) {
        const hour = String(this.curHour).length < 2 ? `0${this.curHour}` : this.curHour;
        const minute = String(this.curMinute).length < 2 ? `0${this.curMinute}` : this.curMinute;
        const second = String(this.curSecond).length < 2 ? `0${this.curSecond}` : this.curSecond;
        datetime = `${datetime} ${hour}:${minute}:${second}`;
      }
      return moment(datetime).format(this.dateFormat);
    },
    handleDate(emitDate) {
      const { type, data } = emitDate;
      switch (type) {
        case 'selectYear':
          this.curYear = data.year;
          this.showType = this.yearFrom;
          if (this.yearFrom === 'date') {
            this.showDate();
          }
          break;
        case 'selectMonth':
          this.curYear = data.year;
          this.curMonth = data.month;
          this.showDate();
          break;
        case 'selectTime':
          this.curMinute = data.minute;
          this.curHour = data.hour;
          this.curSecond = data.second;
          if (!this.popoverHMS) {
            this.showDate();
          }
          this.emitTo(type, {
            position: this.rangePosition,
            datetime: this.setCurrentDatetime(),
          });
          break;
        case 'cancelTime':
          this.showDate();
          break;
        case 'selectDate':
          this.curYear = data.year;
          this.curMonth = data.month;
          this.curDate = data.date;
          this.curHour = data.hour;
          this.curMinute = data.minute;
          this.curSecond = data.second;
          this.emitTo(type, {
            position: this.rangePosition,
            datetime: this.setCurrentDatetime(),
          });
          break;
        case 'showYear':
          this.showType = 'year';
          this.yearFrom = data.from || 'date';
          break;
        case 'showMonth':
          this.showType = 'month';
          this.yearFrom = 'date';
          break;
        case 'showTime':
          if (!this.popoverHMS) {
            this.showType = 'time';
          } else {
            this.showPopoverTime = true;
          }
          this.yearFrom = 'date';
          break;
        default:
          break;
      }
    },
    emitTo(type, data) {
      this.$emit('handleSingle', {
        type,
        data,
      });
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .x-single {
  color: #52575D;
  width: 236px;
  font-size: 12px;
  .x-span {
    height: 40px;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    >div:first-child,
    >div:last-child {
      min-width: 50px;
    }
    >div{
      >a,
      >span {
        cursor: pointer;
      }
    }
  }
  .x-minute {
    position: relative;
    text-align: center;
    >span {
      cursor: pointer;
    }
    .x-minute-show {
      position: absolute;
      bottom: 20px;
      left: 0;
      background-color: white;
    }
  }
  .x-show-time {
    border-top: 1px solid #C5C5C5;
    border-bottom: 1px solid #C5C5C5;
    margin-top: 10px;
    display: flex;
    justify-content: space-around;
    height: 220px;
    >div {
      ul, li{
        padding: 0;
        margin: 0;
        list-style: none;
      }
      ul {
        min-width: 70px;
        overflow-y: auto;
        height: 220px;
        position: relative;
        >li {
          text-align: center;
          line-height: 30px;
        }
        >li:not(.x-limit):not(.x-time-selected){
          cursor: pointer;
          &:hover{
            background-color: #FFF4F3;
          }
        }
      }
    }
    >div:not(:first-child) {
      border-left: 1px solid #C5C5C5;
    }
    .x-time-selected {
      color: #fff;
      background: #f96656;
    }
  }
  .x-time-confirm {
    box-sizing: border-box;
    padding-top: 12px;
    text-align: right;
    >button {
      cursor: pointer;
      margin-left: 8px;
    }
  }
  .x-show {
    .x-not-current {
      color: #B9BEC1;
    }
    .x-selected-bg-begin {
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }
    .x-selected-bg-end {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
    .x-selected {
      color: #fff;
      background: #f96656;
      border-radius: 4px;
    }
    .x-range-ends {
      color: #fff;
      background: #FA8578;
      border-radius: 4px;
    }
    .x-in-range {
      background-color: #FFF4F3;
    }
    table {
      border-collapse:collapse;
      width: 100%;
      th {
        text-align: center;
      }
      td {
        text-align: center;
        padding: 0;
        border: 0;
        border-bottom: 2px #ffffff solid;
        >div {
          height: 24px;
          display: flex;
          justify-content: center;
        }
        span {
          display: block;
          box-sizing: border-box;
          line-height: 24px;
          width: 24px;
          height: 24px;
        }
      }
      td:not(.x-limit){
        cursor: pointer;
        &:hover{
          span:not(.x-selected):not(.x-range-ends) {
            background-color: #FFF4F3;
            border-radius: 4px;
          }
        }
      }
    }
  }
  .x-limit {
    cursor: not-allowed;
    color: #B9BEC1;
  }
}
</style>
