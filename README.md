# x-datetimepicker-vue

> 时间选择器，时间区间选择器。
> 支持多语言。
> 源码有完整示例代码。

[Demo](https://mikexia930.github.io/xDatetimePicker/)

### 版本
***
* v1.1.8

### 基于
***
* vue2
* momentjs

### 安装
***
````
npm install momentjs
npm install x-datetimepicker-vue
````

### 使用
***
**全局引入**

在main.js中引入
````
import xDatetimePicker from 'x-datetimepicker-vue';
vue.use(xDatetimePicker);
````
**或者 在组件中引入**
```
import { xDatetimePicker } from 'x-datetimepicker-vue';
```

**组件中使用**
````
<x-datetime-picker
  :language="language"
  :use-h-m-s="useHMS"
  :popover-h-m-s="popoverHMS"
  :datetime="datetime"
  :limit="limit"
  :is-range="isRange"
  :choose-span="chooseSpan"
  :is-week-begin-from-sunday="isWeekBeginFromSunday"
  :is-hide-year-month-arrow="isHideYearMonthArrow"
  :current-utc="currentUtc"
  @handleDatetime="handleDatetime"
>
    <template v-slot:deductYear>
      // 年份递减的按钮
    </template>
    <template v-slot:deductMonth>
      // 月份递减的按钮
    </template>
    <template v-slot:addYear>
      // 年份递增的按钮
    </template>
    <template v-slot:addMonth>
      // 月份递增的按钮
    </template>
    <template v-slot:showTime="{ hour, minute, second }">
      // 时分秒显示
    </template>
</x-datetime-picker>
````

### 参数说明
***
| 参数 | 类型 | 说明 |
| ------ | ------ | ------ |
|language|string|当前语言，使用momentjs的多语言|
|useHMS| string | 使用的时间格式，''/hour/minute/second |
|popoverHMS|boolean|时分秒使用弹层设置，还是使用平铺设置|
|isRange|boolean|选择时间点还是时间区间|
|isWeekBeginFromSunday|boolean|周从星期日开始还是从星期一开始|
|datetime|string/array|当前时间，时间区间为 [ 开始时间, 结束时间]|
|limit|object|时间选择范围限制，具体参考下方配置说明|
|chooseSpan|string/number|单次点击选择区间，''/week/month/秒数|
|isHideYearMonthArrow|boolean|是否不受limit限制显示年月筛选箭头|
|currentUtc|string/number|当前utc -16～16|
|handleDatetime|function|点击响应|

### language 说明
[momentjs国际化](https://momentjs.com/docs/#/i18n/)
```
zh_CN, fr, ja等，使用momentjs支持的语言即可
```

### useHMS 说明
```
''： 不使用小时分钟秒
hour: 使用小时
minute: 使用小时分钟
second: 使用小时分钟秒
```

### popoverHMS 说明
```
true：使用时分秒时，弹层设置时分秒
false: 使用时分秒时，平铺设置时分秒
```

### isRange 说明
```
true，使用时间区间
false，使用时间点
```

### isWeekBeginFromSunday 说明
```
true，从周日开始新的一周
false，从周一开始新的一周
```

### datetime 说明
```
选择器当前选择的时间
isRange等于true的时候使用数组，[开始时间, 结束时间]
isRange等于false的时候使用字符串，例如：2021-10-10 10:10:10
```

### limit 说明
```
{
     begin: ''(不限制) / 'now'(当前时间) / 数字(天数，当前时间点加或者减天数，负数为之前时间)  / 2020-01-01 20:10:10(具体时间),
     end: ''(不限制) / 'now'(当前时间) / 数字(天数，当前时间点加或者减天数，负数为之前时间) / 2020-01-01 20:10:10(具体时间).
}
```

### chooseSpan 说明
```
'': 不设置
week：选择当前时间点的周，从周一到周日
month: 选择当前时间点的月
秒数: 间隔的秒数，数字为当前时间点加或者减秒数
```

### isHideYearMonthArrow 说明
```
true，受 limit 限制
false，不受 limit 限制
```

### currentUtc 说明
```
时区只对需转化为时间点的参数起作用，例如：limit 的空，数字等，如传入是合法的时间格式，则默认为当前时区的。
```

### handleDatetime 说明
```
handleDatetime(emitData) {
  // emitData 当前选择的时间，单点时为字符串，区间时为数组;
}
```

***
**样式说明 less**

组件只完成了核心功能，样式用户可根据各自的UI交互，自行完成，更多样式请查看浏览器的解析。

|样式|说明|
| ------ | ------ |
|.x-datetime|最外层包裹层|
|.x-span|年月日显示的区域｜
|.x-show|日期选择区域|
|.x-minute|时分秒的显示区域|

````
/deep/ .x-datetime {
   ....
}
````
