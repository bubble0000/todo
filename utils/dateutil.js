const formatDateThis = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  return [year, month, day].map(formatNumber).join('-')
}
function compareTime(startTime, endTime) {
  //结束时间大于开始时间就是true  ， 反之则为 false
  if (startTime.localeCompare(endTime) == -1) {
    return true;
  }

  return false;
}
const formatTime = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return [year, month, day].map(formatNumber).join('-');
}

module.exports = {
  formatDateThis:formatDateThis,
  compareTime:compareTime,
  formatTime: formatTime
}