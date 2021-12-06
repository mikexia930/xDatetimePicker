<template>
  <div class="x-single x-month">
    <div class="x-span">
      <div>
        <a
         v-show="!checkYearMonthIsLimit('beginYear')"
         @click.stop.prevent="deductYear"
        >
          <slot name="deductYear">&lt;&lt; </slot>
        </a>
      </div>
      <div>
        <a @click.stop.prevent="showYear">{{ getShowYear }}</a>
        -
        <a @click.stop.prevent="refresh">{{ getShowMonth }}</a>
      </div>
      <div>
        <a
          v-show="!checkYearMonthIsLimit('endYear')"
          @click.stop.prevent="addYear"
        >
          <slot name="addYear">&gt;&gt;</slot>
        </a>
      </div>
    </div>
    <div class="x-show">
      <table>
        <tbody>
        <tr :key="`month-${index}`"  v-for="(group, index) in months">
          <td
            :class="{
              'x-limit': checkMonthIsLimit(month)
            }"
            :title="`${curYear}-${month}`"
            :key="`month-${curYear}-${month}`"
            v-for="(month) in group"
          >
            <span
              :class="{
                'x-selected': checkMonthIsSelected(month),
              }"
              @click.stop="selectMonth(month)"
            >
              {{ month }}
            </span>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'x-month',
  created() {
    this.getMonths();
  },
  props: {
    lang: Object, // 日期语言包，月
    year: [String, Number], // 当前年份
    month: [String, Number], // 当前月份
    limit: [Boolean, Object], // 区域限制 { begin: 0 不限制 / 2020-01-01 20:10:10, end: 0 不限制 / today / 2020-01-01 20:10:10 }
    isHideYearMonthArrow: Boolean,
  },
  computed: {
    getShowYear() {
      return this.curYear;
    },
    getShowMonth() {
      return this.curMonth < 10 ? `0${this.curMonth}` : this.curMonth;
    },
  },
  watch: {
    year(newVal) {
      this.curYear = newVal;
      this.getMonths();
    },
    month(newVal) {
      this.curMonth = newVal;
      this.getMonths();
    },
    lang(newVal) {
      this.lang = newVal;
      this.getMonths();
    },
  },
  data() {
    return {
      curYear: this.year,
      curMonth: this.month,
      months: [],
    };
  },
  methods: {
    /**
     * 获取月份列表
     * return {Array}
     */
    getMonths() {
      const backData = [];
      for (let i = 0; i <= 4; i += 1) {
        const begin = i * 3;
        backData.push(this.lang.month.slice(begin, begin + 3));
      }
      this.months = backData;
    },
    /**
     * 获取当前月的索引下标
     */
    getMonthIndex(curMonth) {
      return this.lang.month.findIndex((month) => String(month) === String(curMonth)) + 1;
    },
    /**
     * 验证当前年月是否已被选中
     * return {Boolean}
     */
    checkMonthIsSelected(curMonth) {
      let backData = false;
      const current = `${this.curYear}-${this.getMonthIndex(curMonth)}`;
      const last = `${this.year}-${this.month}`;
      if (moment(current).isSame(last, 'month')) {
        backData = true;
      }
      return backData;
    },
    /**
     * 验证年月是否可以被选
     * return {Boolean}
     */
    checkMonthIsLimit(curMonth) {
      let backData = false;
      if (this.limit) {
        const current = `${this.curYear}-${this.getMonthIndex(curMonth)}`;
        if (this.limit.begin && moment(this.limit.begin).isValid()) {
          backData = moment(current).isBefore(this.limit.begin, 'months');
        }
        if (!backData && this.limit.end && moment(this.limit.end).isValid()) {
          backData = moment(current).isAfter(this.limit.end, 'months');
        }
      }
      return backData;
    },
    /**
     * 验证年是否可以被切换
     * @type 验证类型 beginYear / endYear
     * return {Boolean}
     */
    checkYearMonthIsLimit(type) {
      let backData = false;
      if (this.limit && this.isHideYearMonthArrow) {
        const dateFormat = 'YYYY';
        if (dateFormat) {
          switch (type) {
            case 'beginYear':
              if (this.limit.begin) {
                const begin = moment(this.limit.begin, dateFormat);
                if (begin.isValid()) {
                  if (this.getShowYear <= begin.year()) {
                    backData = true;
                  }
                }
              }
              break;
            case 'endYear':
              if (this.limit.end) {
                const end = moment(this.limit.end, dateFormat);
                if (end.isValid()) {
                  if (this.getShowYear >= end.year()) {
                    backData = true;
                  }
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
    selectMonth(curMonth) {
      if (!this.checkMonthIsLimit(curMonth)) {
        this.emitTo('selectMonth', {
          year: this.curYear,
          month: this.getMonthIndex(curMonth),
        });
      }
    },
    deductYear() {
      this.curYear -= 1;
    },
    addYear() {
      this.curYear += 1;
    },
    refresh() {
      this.curYear = this.year;
      this.curMonth = this.month;
    },
    showYear() {
      this.emitTo('showYear', {
        from: 'month',
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

<style lang="less" scoped>
.x-month {
  .x-show {
    table {
      tr {
        td {
          span {
            width: 45px !important;
            line-height: 26px !important;
          }
        }
      }
    }
  }
}
</style>
