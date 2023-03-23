
import { Pipe } from '@angular/core';

@Pipe({ name: 'dateVal' })
export class DatevalPipe {
    transform(value: any, ...args: any[]) {
        const diff = this.getDiff(value);
        switch (diff) {
            case 0: {
                return 'Today';
            }
            case 1: {
                return 'Yesterday';
            }
            default: {
                return value
            }
        }
    }

    getDiff(val) {
        const date1: any = new Date(val);
        const date2: any = new Date();
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        // console.log(diffTime + " milliseconds");
        // console.log(diffDays + " days");
        return diffDays;
    }

}
