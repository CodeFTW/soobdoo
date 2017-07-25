

const TimeConverter = {
    fromTimeToMilliseconds(time) {
        //00:02:01,720 --> 00:02:04,200
        //hours:minutes:seconds:milliseconds
        const [hours, minutes, secondsWithMilliseconds] = time.split(':');
        let [seconds, milliseconds] = secondsWithMilliseconds.split(',');

        return parseInt(milliseconds) + seconds*1000 + minutes*60*1000 + hours*60*60*1000;
    },

    fromMilliseconsToTime(milliseconds) {
      var hours = milliseconds / (1000*60*60);
      var absoluteHours = Math.floor(hours);
      var h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;

      //Get remainder from hours and convert to minutes
      var minutes = (hours - absoluteHours) * 60;
      var absoluteMinutes = Math.floor(minutes);
      var m = absoluteMinutes > 9 ? absoluteMinutes : '0' +  absoluteMinutes;

      //Get remainder from minutes and convert to seconds
      var seconds = (minutes - absoluteMinutes) * 60;
      var absoluteSeconds = Math.floor(seconds);
      var s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds;
      console.log(h + ':' + m + ':' + s);
      return h + ':' + m + ':' + s;
    }
};

export default TimeConverter;
