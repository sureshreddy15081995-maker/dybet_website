import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DateUtils {
    readonly FORMAT_MMM_DD_YYYY: String = "MMM DD YYYY";
    readonly FORMAT_MMM_DD_YYYY_HH_MM: String = "MMM DD YYYY HH:MM";
    readonly FORMAT_YYYY_MM_DD_MM_HH_SS: String = "YYYY-MM-DD HH:MM:SS";
    readonly FORMAT_YYYY_MM_DD_MM_HH: String = "YYYY-MM-DD HH:MM";
    readonly FORMAT_MMM_DD_HH_MM: String = "MMM DD HH:MM";
    readonly FORMAT_HH_MM: String = "HH:MM";
    readonly FORMAT_MM: String = "MM";

    formatDateFromNumber(mSec: number, formatString: string): string {
        let objDate: Date = new Date(mSec);

        let day: string = this.formatNumber(objDate.getDate().toString());
        let month: number = objDate.getMonth();
        let fullYear: string = objDate.getFullYear().toString();

        let hour: string = this.formatNumber(objDate.getHours().toString());

        let minute: string = this.formatNumber(objDate.getMinutes().toString());

        let seconds: string = this.formatNumber(objDate.getSeconds().toString());

        let shortMonthName: string = this.getShortMonthName(month);

        if (formatString == this.FORMAT_MMM_DD_YYYY_HH_MM) {
            return shortMonthName + " " + day + " " + fullYear + " " + hour + ":" + minute;
        } else if (formatString == this.FORMAT_MMM_DD_HH_MM) {
            return shortMonthName + " " + day + " " + hour + ":" + minute;
        } else if (formatString == this.FORMAT_HH_MM) {
            return hour + ":" + minute;
        } else if (formatString == this.FORMAT_MMM_DD_YYYY) {
            return shortMonthName + " " + day + ", " + fullYear;
        } else if (formatString == this.FORMAT_YYYY_MM_DD_MM_HH_SS) {
            return fullYear + "-" + this.formatNumber((month + 1).toString()) + "-" +
                day + " " + hour + ":" + minute + ":" + seconds;
        } else if (formatString == this.FORMAT_YYYY_MM_DD_MM_HH) {
            return fullYear + "-" + this.formatNumber((month + 1).toString()) + "-" +
                day + " " + hour + ":" + minute;
        } else if (formatString == this.FORMAT_MM) {
            return minute;
        } else {
            return "";
        }
    }
    formatNumber(strInp: string): string {
        if (strInp.length == 1) {
            return "0" + strInp;
        } else {
            return strInp;
        }
    }
    getShortMonthName(month: number): string {
        let monthNames_array = ["Jan", "Feb", "Mar", "Apr",
            "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return monthNames_array[month];
    }
    getFullMonthName(month: number): string {
        let monthNames_array = ["January", "February", "March",
            "April", "May", "June", "July", "August", "September",
            "October", "November", "December"];
        return monthNames_array[month];
    }

    getHoursLeft(d: any): string {
        let curTime: number = 0;
        if (d instanceof Date)
            curTime = d.valueOf();
        else
            curTime = d;
        curTime /= 1000;
        let hours: number = (Math.floor(curTime / (60 * 60))) % 24;
        return hours.toString();
    }

    getMinutesLeft(d: any): string {
        let curTime: number = 0;
        if (d instanceof Date)
            curTime = d.valueOf();
        else
            curTime = d;
        curTime /= 1000;
        let minutes: number = (Math.floor(curTime / 60)) % 60;
        return minutes.toString();
    }

    getUniqueIdentifier(): string {
        return new Date().getTime().toString();
    }
    getTimeUTC(): number {
        let currentDate: Date = new Date();
        return Date.UTC(currentDate.getUTCFullYear(),
            currentDate.getUTCMonth(),
            currentDate.getUTCDate(),
            currentDate.getUTCHours(),
            currentDate.getUTCMinutes(),
            currentDate.getUTCSeconds(),
            currentDate.getUTCMilliseconds())
    }

}