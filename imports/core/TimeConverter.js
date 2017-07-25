

const TimeConverter = {
    fromTimeToMilliseconds(time) {
        //00:02:01,720 --> 00:02:04,200
        //hours:minutes:seconds:milliseconds
        const [hours, minutes, secondsWithMilliseconds] = time.split(':');
        let [seconds, milliseconds] = secondsWithMilliseconds.split(',');

        return milliseconds + seconds*1000 + minutes*60*1000 + hours*60*60*1000;


    }
};

export default TimeConverter;