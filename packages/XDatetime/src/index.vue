<template>
  <div class="x-datetime">
    <template v-if="!isRange">
      <x-single
        :lang="lang"
        :date-format="getDateFormat"
        :datetime="beginDatetime"
        :use-h-m-s="useHMS"
        :popover-h-m-s="popoverHMS"
        :limit="limitDatetime.begin"
        :is-week-begin-from-sunday="isWeekBeginFromSunday"
        :is-hide-year-month-arrow="isHideYearMonthArrow"
        :choose-span="chooseSpan"
        @handleSingle="handleSingle"
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
      </x-single>
    </template>
    <template v-else>
      <div>
        <x-single
          :is-range="isRange"
          range-position="begin"
          :lang="lang"
          :date-format="getDateFormat"
          :datetime="beginDatetime"
          :use-h-m-s="useHMS"
          :popover-h-m-s="popoverHMS"
          :limit="limitDatetime.begin"
          :is-week-begin-from-sunday="isWeekBeginFromSunday"
          :is-hide-year-month-arrow="isHideYearMonthArrow"
          :choose-span="chooseSpan"
          @handleSingle="handleSingle"
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
        </x-single>
      </div>
      <div>
        <x-single
          :is-range="isRange"
          range-position="end"
          :date-format="getDateFormat"
          :lang="lang"
          :datetime="endDatetime"
          :use-h-m-s="useHMS"
          :popover-h-m-s="popoverHMS"
          :limit="limitDatetime.end"
          :is-week-begin-from-sunday="isWeekBeginFromSunday"
          :is-hide-year-month-arrow="isHideYearMonthArrow"
          :choose-span="chooseSpan"
          @handleSingle="handleSingle"
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
        </x-single>
      </div>
    </template>
  </div>
</template>

<script>
import XSingle from './single.vue';
import moment from 'moment';

export default {
  name: 'x-datetime-picker',
  components: {
    XSingle,
  },
  created() {
    moment.suppressDeprecationWarnings = true;
    moment.locale(this.language);
    this.getLan();
    this.initDatetime(this.datetime);
  },
  watch: {
    datetime(newVal) {
      this.initDatetime(newVal);
    },
    language(newVal) {
      moment.locale(newVal);
      this.getLan();
    },
    useHMS(newVal) {
      this.useHMS = newVal;
      this.initDatetime(this.datetime);
    },
    currentUtc(newVal) {
      this.utc = newVal;
      this.initDatetime(this.datetime);
    },
  },
  props: {
    isRange: Boolean, // 是否为时间区间
    language: String, // 当前语言，复用 moment 的国际化
    useHMS: String, // 是否使用时分, '' / hour / minute / second，未使用分秒的补 00 分 00 秒
    popoverHMS: Boolean, // 是否弹层设置时分秒
    datetime: [String, Array], // 当前日期 2020-12-10 10:00:00，[ 2020-12-09 10:00:00,  2020-12-10 10:00:00]
    limit: [Boolean, Object], // 选择时间限制 { begin: '' 不限制 / 数字 / now / 2020-01-01 20:10:10, end: '' 不限制 / 数字 / now / 2020-01-01 20:10:10 }
    chooseSpan: [String, Number], // '' 为任意选中，选中区间 week 周 month 月 数字代表间隔的秒数
    isWeekBeginFromSunday: Boolean, // 一周是否从周日开始
    isHideYearMonthArrow: Boolean, // 是否隐藏切换年月箭头，如果使用，则根据limit来控制显示隐藏，否则一直显示
    currentUtc: {
      type: [String, Number],
      default: '',
    }, // 使用的utc时区
  },
  data() {
    return {
      standardFormat: 'YYYY-MM-DD HH:mm:ss',
      beginDatetime: '', // 区间选择的开始时间 和 单日期选择的当前时间
      endDatetime: '', // 区间选择的结束时间
      utc: '',
      limitDatetime: {
        begin: [],
        end: [],
      },
      lang: {
        month: [],
        week: [],
      },
    };
  },
  computed: {
    getDateFormat() {
      let backData = '';
      switch (this.useHMS) {
        case 'hour':
          backData = ' HH';
          break;
        case 'minute':
          backData = ' HH:mm';
          break;
        case 'second':
          backData = ' HH:mm:ss';
          break;
        default:
          break;
      }
      return `YYYY-MM-DD${backData}`;
    },
    /**
     * 初始化 limit 时间段
     * 1、数字转化为时间点，使用 utc 时间
     * 2、如果开始时间大于结束时间，开始时间置空
     */
    getLimitDatetime() {
      const backData = {
        begin: '',
        end: '',
      };
      if (this.limit) {
        if (this.limit.begin !== undefined && this.limit.begin !== '') {
          if (this.limit.begin === 'now') {
            backData.begin = this.getUTCMomentIns().format(this.standardFormat);
          } else {
            if (!Number.isNaN(Number(this.limit.begin))) {
              backData.begin = this.getUTCMomentIns().add(this.limit.begin, 'days').startOf('date').format(this.standardFormat);
            } else if (this.checkDatetimeIsValid(this.limit.begin)) {
              backData.begin = this.formatHMSDatetime('begin', this.limit.begin);
            }
          }
        }
        if (this.limit.end !== undefined && this.limit.end !== '') {
          if (this.limit.end === 'now') {
            backData.end = this.getUTCMomentIns().format(this.standardFormat);
          } else {
            if (!Number.isNaN(Number(this.limit.end))) {
              backData.end = this.getUTCMomentIns().add(this.limit.end, 'days').endOf('date').format(this.standardFormat);
            } else if (this.checkDatetimeIsValid(this.limit.end)) {
              backData.end = this.formatHMSDatetime('end', this.limit.end);
            }
          }
        }
        if (backData.begin && backData.end) {
          if (moment(backData.begin).isAfter(backData.end)) {
            backData.begin = '';
          }
        }
      }
      return backData;
    },
  },
  methods: {
    /**
     * utc 的 moment 实例
     */
    getUTCMomentIns(datetime = '') {
      let momentDatetime = '';
      if (datetime) {
        momentDatetime = moment(datetime).utcOffset(this.utc);
      } else {
        momentDatetime = moment().utcOffset(this.utc);
      }
      return momentDatetime
    },
    /**
     * 根据当前语言获取 moment 的语言包
     */
    getLan() {
      this.lang = {
        month: moment.monthsShort(),
        week: moment.weekdaysMin(),
      };
    },
    /**
     * 1、初始 utc，如未传入，则使用当前时区
     * 2、验证传入时间是否合法
     * ---- 如没有传入时间，则使用当前时间
     * ---- 判断传入的时间是否合法，不合法，则用当前时间替代
     * 3、重置 limit 时间
     * ---- 时间区间，开始时间作为结束时间的 limit begin ，结束时间作为开始时间的 limit end
     * @param datetime
     */
    initDatetime(datetime) {
      let useDatetime;
      if (!this.currentUtc) {
        this.utc = moment().utcOffset() / 60;
      } else {
        this.utc = this.currentUtc;
      }
      if (this.isRange) {
        // 时间区间
        // 非数组，则自动补充结束时间
        if (!Array.isArray(datetime)) {
          if (datetime && this.checkDatetimeIsValid(datetime)) {
            useDatetime = moment(useDatetime);
          } else {
            useDatetime = this.getUTCMomentIns();
          }
          this.beginDatetime = useDatetime.format(this.getDateFormat);
          this.endDatetime = this.beginDatetime;
        } else {
          if (datetime.length !== 2) {
            if (datetime.length === 1 && this.checkDatetimeIsValid(datetime[0])) {
              useDatetime = moment(useDatetime);
            } else {
              useDatetime = this.getUTCMomentIns();
            }
            this.beginDatetime = useDatetime.format(this.getDateFormat);
            this.endDatetime = this.beginDatetime;
          } else {
            if (this.checkDatetimeIsValid(datetime[0]) && this.checkDatetimeIsValid(datetime[1])) {
              this.beginDatetime = moment(datetime[0]).format(this.getDateFormat);
              this.endDatetime = moment(datetime[1]).format(this.getDateFormat);
            } else {
              useDatetime =this.getUTCMomentIns();
              this.beginDatetime = useDatetime.format(this.getDateFormat);
              this.endDatetime = this.beginDatetime;
            }
          }
        }
        // 如果开始时间大于结束时间，结束时间取开始时间
        if (moment(this.beginDatetime).isAfter(this.endDatetime)) {
          this.endDatetime = this.beginDatetime;
        }
        // 格式化时分秒
        this.beginDatetime = this.formatHMSDatetime('begin', this.beginDatetime);
        this.endDatetime = this.formatHMSDatetime('end', this.endDatetime);
      } else {
        // 非时间区间
        if (datetime && this.checkDatetimeIsValid(datetime)) {
          useDatetime = moment(useDatetime);
        } else {
          useDatetime = this.getUTCMomentIns();
        }
        this.beginDatetime = useDatetime.format(this.getDateFormat);
      }
      // 验证当前时间是否符合时间区间
      // 如果约束开始大于结束，则取消开始限制
      if (this.getLimitDatetime.begin) {
        if (moment(this.beginDatetime).isBefore(this.getLimitDatetime.begin)) {
          this.beginDatetime = this.getLimitDatetime.begin;
        }
      }
      if (this.getLimitDatetime.end) {
        if (moment(this.endDatetime).isAfter(this.getLimitDatetime.end)) {
          this.endDatetime = this.getLimitDatetime.end;
        }
      }
      if (moment(this.beginDatetime).isAfter(this.endDatetime)) {
        this.beginDatetime = this.endDatetime;
      }
      // 重置 limit 时间
      if (this.isRange) {
        this.limitDatetime = {
          begin: {
            begin: this.getLimitDatetime.begin,
            end: this.endDatetime,
          },
          end: {
            begin: this.beginDatetime,
            end: this.getLimitDatetime.end,
          },
        };
      } else {
        this.limitDatetime = {
          begin: {
            begin: this.getLimitDatetime.begin,
            end: this.getLimitDatetime.end,
          },
        };
      }
    },
    /**
     * 时分秒时约束时间
     * @param datetime
     * @return {string}
     */
    formatHMSDatetime(position, datetime) {
      let backData = datetime;
      if (this.useHMS) {
        if (position === 'begin') {
          backData = moment(datetime).startOf(this.useHMS).format(this.getDateFormat);
        } else {
          backData = moment(datetime).endOf(this.useHMS).format(this.getDateFormat);
        }
      }
      return backData;
    },
    /**
     * 验证日期格式是否合法
     * @param datetime 需要验证的时间
     * @return {boolean}
     */
    checkDatetimeIsValid(datetime) {
      let backData = true;
      if (!moment(datetime).isValid()) {
        backData = false;
      }
      return backData;
    },
    /**
     * 重置日期
     * @param position 开始时间/结束时间
     * @param datetime
     */
    resetDatetime(position, datetime) {
      switch (position) {
        case 'end':
          this.endDatetime = datetime;
          if (this.isRange) {
            this.limitDatetime.begin.end = datetime;
          }
          break;
        case 'begin':
        default:
          this.beginDatetime = datetime;
          if (this.isRange) {
            this.limitDatetime.end.begin = datetime;
          }
          break;
      }
    },
    /**
     * 选择时间
     * @param emitDate
     */
    handleSingle(emitDate) {
      const { type, data } = emitDate;
      let backData;
      switch (type) {
        case 'selectDate':
        case 'selectTime':
          this.resetDatetime(data.position, data.datetime);
          if (this.isRange) {
            let curBegin = this.beginDatetime;
            let curEnd = this.endDatetime;
            let diff = 0;
            if (this.chooseSpan) {
              let useDatetime;
              let weekBeginDay;
              if (data.position === 'begin') {
                useDatetime = this.beginDatetime;
              } else if (data.position === 'end') {
                useDatetime = this.endDatetime;
              }
              switch (this.chooseSpan) {
                case 'month':
                case 'week':
                  curBegin = moment(useDatetime).startOf(this.chooseSpan).format(this.getDateFormat);
                  curEnd = moment(useDatetime).endOf(this.chooseSpan).format(this.getDateFormat);
                  // 如果是周，需要判断周开始
                  if (this.chooseSpan === 'week') {
                    weekBeginDay = moment(curBegin).day();
                    if (weekBeginDay === 1) {
                      if (this.isWeekBeginFromSunday) {
                        curBegin = moment(curBegin).subtract(1, 'days').format(this.getDateFormat);
                        curEnd = moment(curEnd).subtract(1, 'days').format(this.getDateFormat);
                      }
                    } else if (weekBeginDay === 0) {
                      if (!this.isWeekBeginFromSunday) {
                        curBegin = moment(curBegin).add(1, 'days').format(this.getDateFormat);
                        curEnd = moment(curEnd).add(1, 'days').format(this.getDateFormat);
                      }
                    }
                  }
                  if (this.limit) {
                    if (this.limit.begin && moment(curBegin).isBefore(this.limit.begin)) {
                      curBegin = this.limit.begin;
                    }
                    if (this.limit.end && moment(curEnd).isAfter(this.limit.end)) {
                      curEnd = this.limit.end;
                    }
                  }
                  this.resetDatetime('begin', curBegin);
                  this.resetDatetime('end', curEnd);
                  break;
                default:
                  if (this.chooseSpan && !Number.isNaN(Number(this.chooseSpan))) {
                    if (data.position === 'begin') {
                      curEnd = moment(useDatetime).add(this.chooseSpan, 'seconds').format(this.getDateFormat);
                      if (this.limit && this.limit.end && moment(curEnd).isAfter(this.limit.end)) {
                        diff = moment(curEnd).diff(moment(this.limit.end), 'seconds');
                        curEnd = this.limit.end;
                        curBegin = moment(curBegin).subtract(diff, 'seconds').format(this.getDateFormat);
                        if (this.limit && this.limit.begin && moment(curBegin).isBefore(this.limit.begin)) {
                          curBegin = this.limit.begin;
                        }
                      }
                    } else {
                      curBegin = moment(useDatetime).subtract(this.chooseSpan, 'seconds').format(this.getDateFormat);
                      if (this.limit && this.limit.begin && moment(curBegin).isBefore(this.limit.begin)) {
                        diff = moment(this.limit.begin).diff(moment(curBegin), 'seconds');
                        curBegin = this.limit.begin;
                        curEnd = moment(curBegin).add(diff, 'seconds').format(this.getDateFormat);
                        if (this.limit && this.limit.end && moment(curEnd).isAfter(this.limit.end)) {
                          curEnd = this.limit.end;
                        }
                      }
                    }
                  }
                  break;
              }
              curBegin = this.formatHMSDatetime('begin', curBegin);
              curEnd = this.formatHMSDatetime('end', curEnd);
              this.resetDatetime('begin', curBegin);
              this.resetDatetime('end', curEnd);
            }
            // 如果为秒，精确到毫秒，结束为 999
            /*
            if (this.useHMS) {
              switch (this.useHMS) {
                case 'second':
                  curBegin = `${this.beginDatetime}.000`;
                  curEnd = `${this.endDatetime}.999`;
                  break;
                case 'minute':
                  curBegin = `${this.beginDatetime}:00`;
                  curEnd = `${this.endDatetime}:59`;
                  break;
                case 'hour':
                  curBegin = `${this.beginDatetime}:00:00`;
                  curEnd = `${this.endDatetime}:59:59`;
                  break;
                default:
                  curBegin = this.beginDatetime;
                  curEnd = this.endDatetime;
                  break;
              }
            } else {
              curBegin = this.beginDatetime;
              curEnd = this.endDatetime;
            }
             */
            backData = [curBegin, curEnd];
          } else {
            backData = this.beginDatetime;
          }
          this.emitTo('select', {
            utc: this.utc,
            value: backData
          });
          break;
        default:
          break;
      }
    },
    emitTo(type, data) {
      this.$emit('handleDatetime', data);
    },
  },
};
</script>

<style lang="less" scoped>
.x-datetime {
  display: flex;
  justify-content: space-around;
  width: 490px;
  >div{
    width: 100%;
  }
}
</style>
