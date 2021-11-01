<template>
  <div class="x-single">
    <div class="x-span">
      <div>
        <a
          v-show="!checkYearMonthIsLimit('beginYear')"
          @click.prevent="deductYear"
        >
          <slot name="deductYear">&lt;&lt; </slot>
        </a>
      </div>
      <div>
        <a @click.prevent="refresh">{{ year }}</a>
      </div>
      <div>
        <a
          v-show="!checkYearMonthIsLimit('endYear')"
          @click.prevent="addYear"
        >
          <slot name="addYear">&gt;&gt;</slot>
        </a>
      </div>
    </div>
    <div class="x-show">
      <table>
        <tbody>
          <tr :key="`year-${index}`"  v-for="(group, index) in years">
            <td
              :class="{
                'x-not-current': curYear.last || curYear.next,
                'x-current': curYear.current,
                'x-limit': checkYearIsLimit(curYear.value)
              }"
              :title="curYear.value"
              :key="`year-${curYear.value}`"
              v-for="(curYear) in group"
            >
              <span
                :class="{
                  'x-selected': checkYearIsSelected(curYear.value),
                }"
                @click.prevent="selectYear(curYear.value)"
              >
                {{ curYear.value }}
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
  name: 'x-year',
  created() {
    this.getYears();
  },
  props: {
    year: Number, // 当前年份 2020
    limit: [Boolean, Object], // 区域限制 { begin: 0 不限制 / 2020-01-01 20:10:10, end: 0 不限制 / today / 2020-01-01 20:10:10 }
  },
  watch: {
    year(newVal) {
      this.curYear = newVal;
      this.getYears();
    },
  },
  data() {
    return {
      curYear: this.year,
      years: [],
    };
  },
  methods: {
    /**
     * 获取当前年份
     * return {Array}
     */
    getYears() {
      const beginYear = parseInt(String(this.curYear / 10), 10) * 10;
      const endYear = beginYear + 10;
      const yearData = [];
      yearData.push({
        last: true,
        value: beginYear - 1,
      });
      for (let i = beginYear; i <= endYear; i += 1) {
        yearData.push({
          current: true,
          value: i,
        });
      }
      const backData = [];
      for (let i = 0; i <= 4; i += 1) {
        const begin = i * 3;
        backData.push(yearData.slice(begin, begin + 3));
      }
      this.years = backData;
    },
    /**
     * 验证当前年份是否被选中
     * return {Boolean}
     */
    checkYearIsSelected(curYear) {
      let backData = false;
      if (String(curYear) === String(this.year)) {
        backData = true;
      }
      return backData;
    },
    /**
     * 验证年月是否可以被选中
     * @type 验证类型 beginMonth / endMonth / beginYear / endYear
     * return {Boolean}
     */
    checkYearIsLimit(curYear) {
      let backData = false;
      if (this.limit) {
        if (this.limit.begin) {
          let begin = (this.limit.begin).split('-');
          begin = parseInt(begin[0], 10);
          if (curYear < begin) {
            backData = true;
          }
        }
        if (this.limit.end) {
          let end = (this.limit.end).split('-');
          end = parseInt(end[0], 10);
          if (curYear > end) {
            backData = true;
          }
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
      if (this.limit) {
        const dateFormat = 'YYYY';
        if (dateFormat) {
          switch (type) {
            case 'beginYear':
              if (this.limit.begin) {
                const begin = moment(this.limit.begin, dateFormat);
                if (begin.isValid()) {
                  if (this.years[0][0].value <= begin.year()) {
                    backData = true;
                  }
                }
              }
              break;
            case 'endYear':
              if (this.limit.end) {
                const end = moment(this.limit.end, dateFormat);
                if (end.isValid()) {
                  if (this.years[3][2].value >= end.year()) {
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
    deductYear() {
      this.curYear -= 10;
      this.getYears();
    },
    addYear() {
      this.curYear += 10;
      this.getYears();
    },
    refresh() {
      this.curYear = this.year;
      this.getYears();
    },
    selectYear(curYear) {
      if (!this.checkYearIsLimit(curYear)) {
        this.emitTo('selectYear', {
          year: curYear,
        });
      }
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
