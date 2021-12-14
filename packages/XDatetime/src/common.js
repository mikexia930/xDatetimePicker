function getFullDatetime(datetime) {
  return String(datetime).length < 2 ? `0${datetime}` : datetime;
}

function resetFullDatetime(datetime) {
  let curDatetime = '';
  if (datetime) {
    const splitDatetime = datetime.split(' ');
    const splitDate = splitDatetime[0].split('-');
    let year = '';
    let month = '';
    let day = '';
    let hour = '';
    let minute = '';
    let second = '';
    let millisecond = '';
    if (splitDate.length === 3) {
      year = splitDate[0];
      month = getFullDatetime(splitDate[1]);
      day = getFullDatetime(splitDate[2]);
      if (splitDatetime.length > 1 && splitDatetime[1]) {
        const splitMillisecond = splitDatetime[1].split('.');
        if (splitMillisecond.length === 2) {
          millisecond = splitMillisecond[1];
        }
        const splitTime = splitMillisecond[0].split(':');
        hour = getFullDatetime(splitTime[0]);
        if (splitTime.length > 1) {
          minute = getFullDatetime(splitTime[1]);
        }
        if (splitTime.length > 2) {
          second = getFullDatetime(splitTime[2]);
        }
      }
      curDatetime = `${year}-${month}-${day}`;
      if (hour) {
        curDatetime = `${curDatetime} ${hour}`;
        if (minute) {
          curDatetime = `${curDatetime}:${minute}`;
          if (second) {
            curDatetime = `${curDatetime}:${second}`;
            if (millisecond) {
              curDatetime = `${curDatetime}.${millisecond}`;
            }
          }
        }
      }
    }
  }
  return curDatetime;
}

function getCorrectDatetime(year, month = '', day = '', hour = '', minute = '', second = '', millisecond = '') {
  let curDatetime = year;
  if (month) {
    curDatetime = `${curDatetime} ${getFullDatetime(month)}`;
    if (day) {
      curDatetime = `${curDatetime} ${getFullDatetime(day)}`;
      if (hour) {
        curDatetime = `${curDatetime} ${getFullDatetime(hour)}`;
        if (minute) {
          curDatetime = `${curDatetime}:${getFullDatetime(minute)}`;
          if (second) {
            curDatetime = `${curDatetime}:${getFullDatetime(second)}`;
            if (millisecond) {
              curDatetime = `${curDatetime}.${millisecond}`;
            }
          }
        }
      }
    }
  }
  return curDatetime;
}

export {
  getFullDatetime,
  resetFullDatetime,
  getCorrectDatetime,
};
