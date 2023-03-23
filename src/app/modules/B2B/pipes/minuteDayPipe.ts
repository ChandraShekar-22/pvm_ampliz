
import { Pipe } from '@angular/core';

@Pipe({ name: 'minuteDay' })
export class MinuteDayPipe {
    transform(value: any) {
        return this.getDiff(value);
    }


    getDiff(val) {
        const today: any = new Date();
        const thatDay: any = new Date(val);
        var seconds: any = Math.floor((today - thatDay) / 1000);
        var interval = seconds / 31536000;

        if (interval > 1) {
            return Math.floor(interval) + " year ago";
        }
        interval = seconds / 2592000;
        if (interval > 1) {
            return Math.floor(interval) + " month ago";
        }
        interval = seconds / 86400;
        if (interval > 1) {
            return Math.floor(interval) + " day ago";
        }
        interval = seconds / 3600;
        if (interval > 1) {
            return Math.floor(interval) + " hour ago";
        }
        interval = seconds / 60;
        if (interval > 1) {
            return Math.floor(interval) + " minute ago";
        }
        return Math.floor(seconds) + " second ago";
        // console.log(seconds, "Seconds");
        // return 0;
    }

}
