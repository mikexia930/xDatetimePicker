<template>
  <div class="x-single">
    <div class="x-span">
      <div>
        <a
          v-show="!checkYearMonthIsLimit('beginYear')"
          @click.prevent="deductYear()"
        >
          <slot name="deductYear">&lt;&lt; </slot>
        </a>
        <a
          v-show="!checkYearMonthIsLimit('beginMonth')"
          @click.prevent="deductMonth()"
        >
          <slot name="deductMonth">&lt; </slot>
        </a>
      </div>
      <div>
        <a @click.prevent="showYear">{{ getShowYear }}</a>
        -
        <a @click.prevent="showMonth">{{ getShowMonth }}</a>
      </div>
      <div>
        <a
          v-show="!checkYearMonthIsLimit('endMonth')"
          @click.prevent="addMonth()"
        >
          <slot name="addMonth">&gt; </slot>
        </a>
        <a
          v-show="!checkYearMonthIsLimit('endYear')"
          @click.prevent="addYear()"
        >
          <slot name="addYear">&gt;&gt;</slot>
        </a>
      </div>
    </div>
    <div class="x-show">
      <table>
        <thead>
        <tr>
          <th :key="`week-${index}`" v-for="(name, index) in getWeekFormat">
            {{ name }}
          </th>
        </tr>
        </thead>
        <tbody>
        <tr :key="`day-${index}`"  v-for="(group, index) in getMonthDays()">
          <td
            :title="`${datetime.year}-${datetime.month}-${datetime.value}`"
            :key="`${datetime.year}-${datetime.month}-${datetime.value}`"
            v-for="(datetime) in group"
            @click.prevent="selectDate(`${datetime.year}-${datetime.month}-${datetime.value}`)"
          >
            <div
              :class="{
                'x-not-current': datetime.last || datetime.next,
                'x-current': datetime.current,
                'x-limit': checkDateIsLimit(`${datetime.year}-${datetime.month}-${datetime.value}`),
                'x-in-range': checkIsInRange(`${datetime.year}-${datetime.month}-${datetime.value}`),
                'x-selected-bg-begin': checkIsBeginEnds(`${datetime.year}-${datetime.month}-${datetime.value}`),
                'x-selected-bg-end': checkIsEndEnds(`${datetime.year}-${datetime.month}-${datetime.value}`),
              }"
            >
              <span
                :class="{
                  'x-selected': checkIsSelected(`${datetime.year}-${datetime.month}-${datetime.value}`),
                  'x-range-ends': checkIsRangeEnds(`${datetime.year}-${datetime.month}-${datetime.value}`),
                }"
              >
                {{ datetime.value }}
              </span>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="x-minute">
      <span v-if="useHMS" @click="showTime">
        <slot name="showTime" :hour="curHour" :minute="curMinute" :second="curSecond">
          {{curHour}} : {{curMinute}} : {{curSecond}}
        </slot>
      </span>
      <slot name="selectTime"></slot>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'x-date',
  props: {
    isRange: Boolean, // 是否是时间区间
    rangePosition: String, // 对比日期的位置 begin 开始时间 / end 结束时间
    lang: Object, // 日期语言包，7天
    useHMS: String, // 是否使用时分, '' / hour / minute / second，未使用分秒的补 00 分 00 秒
    datetime: String, // 当前日期 2020-21-10 10:00:00
    year: [String, Number], // 当前年份 2020
    month: [String, Number], // 当前月份 10
    date: [String, Number], // 当前日期 5
    hour: [String, Number], // 当前小时 5
    minute: [String, Number], // 当前分钟 5
    second: [String, Number], // 当前秒数 5
    limit: [Boolean, Object], // 区域限制 { begin: 0 不限制 / 2020-01-01 20:10:10, end: 0 不限制 / today / 2020-01-01 20:10:10 }
    isWeekBeginFromSunday: Boolean,
    isHideYearMonthArrow: Boolean,
  },
  created() {
    this.initGroup();
    this.getMonthDays();
  },
  data() {
    return {
      curYear: this.year,
      curMonth: this.month,
      curDate: this.date,
      formatGroup: {
        year: 0,
        month: 0,
        monthDays: 0,
        monthBeginDayOfWeek: 0,
        lastYear: 0,
        lastMonth: 0,
        lastMonthDays: 0,
        nextYear: 0,
        nextMonth: 0,
      },
    };
  },
  watch: {
    year(newVal) {
      this.curYear = newVal;
      this.initGroup();
      this.getMonthDays();
    },
    month(newVal) {
      this.curMonth = newVal;
      this.initGroup();
      this.getMonthDays();
    },
  },
  computed: {
    curHour() {
      return this.hour < 10 ? `0${this.hour}` : this.hour;
    },
    curMinute() {
      return this.minute < 10 ? `0${this.minute}` : this.minute;
    },
    curSecond() {
      return this.second < 10 ? `0${this.second}` : this.second;
    },
    getWeekFormat() {
      let backData;
      if (this.isWeekBeginFromSunday) {
        backData = this.lang.week;
      } else {
        backData = [...(this.lang.week.slice(1)), this.lang.week[0]];
      }
      return backData;
    },
    getShowYear() {
      return this.curYear;
    },
    getShowMonth() {
      return this.curMonth < 10 ? `0${this.curMonth}` : this.curMonth;
    },
  },
  methods: {
    checkIsBeginEnds(date) {
      let backData = false;
      if (this.isRange) {
        switch (this.rangePosition) {
          case 'begin':
            if (this.checkIsSelected(date)) {
              backData = true;
            }
            break;
          case 'end':
            if (this.checkIsRangeEnds(date)) {
              backData = true;
            }
            break;
          default:
            break;
        }
      }
      return backData;
    },
    checkIsEndEnds(date) {
      let backData = false;
      if (this.isRange) {
        switch (this.rangePosition) {
          case 'begin':
            if (this.checkIsRangeEnds(date)) {
              backData = true;
            }
            break;
          case 'end':
            if (this.checkIsSelected(date)) {
              backData = true;
            }
            break;
          default:
            break;
        }
      }
      return backData;
    },
    /**
     * 初始化当前显示月的信息，包括天数，上月下月信息
     */
    initGroup() {
      let curValue = '';
      if (this.curMonth) {
        curValue = moment(`${this.curYear}-${this.curMonth}`);
      } else {
        curValue = moment();
      }

      this.formatGroup.year = curValue.year();
      this.formatGroup.month = curValue.month() + 1;

      const month = `${this.formatGroup.year}-${this.formatGroup.month}`;
      const monthFirstDay = moment(`${month}-1`);
      this.formatGroup.monthDays = moment(`${month}`).daysInMonth();
      this.formatGroup.monthBeginDayOfWeek = monthFirstDay.day();

      const nextMonth = moment(`${month}-1`).add(1, 'month');
      this.formatGroup.nextYear = nextMonth.year();
      this.formatGroup.nextMonth = nextMonth.month() + 1;

      const lastMonth = moment(`${month}-1`).add(-1, 'month');
      this.formatGroup.lastYear = lastMonth.year();
      this.formatGroup.lastMonth = lastMonth.month() + 1;
      this.formatGroup.lastMonthDays = moment(`${this.formatGroup.lastYear}-${this.formatGroup.lastMonth}`).daysInMonth();
    },
    /**
     * 获取当前月页面所需显示的天数，包括补全的上月和下月
     * return {Array}
     */
    getMonthDays() {
      // 用上个月补全星期
      const dateData = [];
      let lastBeginDay = 0;
      if (this.isWeekBeginFromSunday) {
        if (this.formatGroup.monthBeginDayOfWeek > 0) {
          lastBeginDay = this.formatGroup.lastMonthDays - this.formatGroup.monthBeginDayOfWeek + 1;
        }
      } else if (this.formatGroup.monthBeginDayOfWeek === 0) {
        lastBeginDay = this.formatGroup.lastMonthDays - 5;
      } else if (this.formatGroup.monthBeginDayOfWeek > 1) {
        lastBeginDay = this.formatGroup.lastMonthDays - this.formatGroup.monthBeginDayOfWeek + 2;
      }
      if (lastBeginDay > 0) {
        for (let i = lastBeginDay; i <= this.formatGroup.lastMonthDays; i += 1) {
          dateData.push({
            last: true,
            year: this.formatGroup.lastYear,
            month: this.formatGroup.lastMonth,
            value: i,
          });
        }
      }
      // 当前月数据
      for (let i = 1; i <= this.formatGroup.monthDays; i += 1) {
        dateData.push({
          current: true,
          year: this.formatGroup.year,
          month: this.formatGroup.month,
          value: i,
        });
      }
      // 用下个月补全星期
      const nextLeftDays = 42 - dateData.length;
      if (nextLeftDays > 0) {
        for (let i = 1; i <= nextLeftDays; i += 1) {
          dateData.push({
            next: true,
            year: this.formatGroup.nextYear,
            month: this.formatGroup.nextMonth,
            value: i,
          });
        }
      }
      const backData = [];
      for (let i = 0; i <= 6; i += 1) {
        const begin = i * 7;
        backData.push(dateData.slice(begin, begin + 7));
      }
      return backData;
    },
    /**
     * 验证当前日期是否被选中
     * return {Boolean}
     */
    checkIsSelected(curDate) {
      let backData = false;
      if (moment(curDate).isSame(this.datetime, 'date')) {
        backData = true;
      }
      return backData;
    },
    /**
     * 验证当前日期是否在选择区间里
     * return {Boolean}
     */
    checkIsInRange(curDate) {
      let backData = false;
      if (this.isRange) {
        let curBegin;
        let curEnd;
        switch (this.rangePosition) {
          case 'begin':
            curBegin = this.datetime;
            curEnd = this.limit.end;
            break;
          case 'end':
          default:
            curBegin = this.limit.begin;
            curEnd = this.datetime;
            break;
        }
        backData = moment(curDate).isBetween(curBegin, curEnd, 'date', '[]');
      }
      return backData;
    },
    /**
     * 是否是时间区间的节点
     */
    checkIsRangeEnds(curDate) {
      let backData = false;
      if (this.isRange) {
        switch (this.rangePosition) {
          case 'begin':
            if (moment(curDate).isSame(this.limit.end, 'date')) {
              backData = true;
            }
            break;
          case 'end':
          default:
            if (moment(curDate).isSame(this.limit.begin, 'date')) {
              backData = true;
            }
            break;
        }
      }
      return backData;
    },
    /**
     * 当前时间点是否允许被选中
     * return {Boolean}
     */
    checkDateIsLimit(curDate) {
      let backData = false;
      if (this.limit) {
        if (this.limit.begin) {
          if (moment(this.limit.begin).isValid()) {
            backData = moment(curDate).isBefore(this.limit.begin, 'date');
          }
        }
        if (!backData && this.limit.end) {
          if (moment(this.limit.end).isValid()) {
            backData = moment(curDate).isAfter(this.limit.end, 'date');
          }
        }
      }
      return backData;
    },
    /**
     * 验证年月是否可以被选中
     * @type 验证类型 beginMonth / endMonth / beginYear / endYear
     * return {Boolean}
     */
    checkYearMonthIsLimit(type) {
      let backData = false;
      if (this.limit && this.isHideYearMonthArrow) {
        let dateFormat = 'year';
        switch (type) {
          case 'beginMonth':
          case 'endMonth':
            dateFormat = 'month';
            break;
          case 'beginYear':
          case 'endYear':
            dateFormat = 'year';
            break;
          default:
            break;
        }
        if (dateFormat) {
          const current = `${this.formatGroup.year}-${this.formatGroup.month}`;
          switch (type) {
            case 'beginMonth':
            case 'beginYear':
              if (this.limit.begin) {
                const begin = moment(this.limit.begin);
                if (begin.isValid()) {
                  backData = moment(current).isSameOrBefore(this.limit.begin, dateFormat);
                }
              }
              break;
            case 'endMonth':
            case 'endYear':
              if (this.limit.end) {
                const end = moment(this.limit.end);
                if (end.isValid()) {
                  backData = moment(current).isSameOrAfter(this.limit.end, dateFormat);
                }
              }
              break;
            default:
              break;
          }
        }
      }
      return backData;
    },
    deductYear() {
      this.curYear -= 1;
      this.initGroup();
    },
    deductMonth() {
      this.curMonth -= 1;
      if (this.curMonth < 1) {
        this.curMonth = 12;
        this.curYear -= 1;
      }
      this.initGroup();
    },
    addYear() {
      this.curYear += 1;
      this.initGroup();
    },
    addMonth() {
      this.curMonth += 1;
      if (this.curMonth > 12) {
        this.curMonth = 1;
        this.curYear += 1;
      }
      this.initGroup();
    },
    selectDate(curDate) {
      if (!this.checkDateIsLimit(curDate)) {
        const splitData = curDate.split('-');
        const year = parseInt(String(splitData[0]), 10);
        const month = parseInt(String(splitData[1]), 10);
        const date = parseInt(String(splitData[2]), 10);
        this.emitTo('selectDate', {
          year,
          month,
          date,
          hour: this.hour,
          minute: this.minute,
          second: this.second,
        });
      }
    },
    showYear() {
      this.emitTo('showYear', {
        from: 'date',
      });
    },
    showMonth() {
      this.emitTo('showMonth', {
        from: 'date',
      });
    },
    showTime() {
      this.emitTo('showTime', {
        from: 'time',
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
