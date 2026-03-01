/*
** Oracle Field Service Debriefing plugin
**
** Copyright (c) 2023, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
*/

define(['constants'], (Constants) => {

    let defaultLocale = 'en-US';
    class LaborTimeUtils {

        _autoPopulateLaborStartTime(activityStartTime){
            let defaultStartTime = this._formatTime(this._getTimeIn24HourFormat(
                this._getDefaultDateWithTime(activityStartTime)));
            return defaultStartTime;
        }

        _autoPopulateLaborEndTime(activityStartTime, activityEndTime, resourceCurrentTime, durationInMinutes){
            let defaultEndTime = this._formatTime(this._getTimeIn24HourFormat(
                this._getDefaultDateWithTime(activityEndTime)));
            if(this._compareIfTechTimeGreaterThanEndTime(activityStartTime,activityEndTime,resourceCurrentTime,durationInMinutes)){
                defaultEndTime = this._formatTime(this._getTimeIn24HourFormat(resourceCurrentTime));
            }
            return defaultEndTime;
        }

        _autoPopulateTravelStartTime(activityStartTime, travelTime){
            let travelStartTime = "";
            if(travelTime != null) {
                travelStartTime = this._formatTime(this._calculateStartTimeBasedOnTravelDuration(travelTime, activityStartTime));
            }
            return travelStartTime;
        }

        _autoPopulateTravelEndTime(activityStartTime, travelTime){
            let travelEndTime = "";
            if(travelTime != null) {
                travelEndTime = this._formatTime(this._getTimeIn24HourFormat(this._getDefaultDateWithTime(activityStartTime)));
            }
            return travelEndTime;
        }

        _formatTime(timeString){
            return "T"+timeString+":00";
        }

        /** This method construct Date object with time and out of which there is no relevance for the date part. **/
        _getDefaultDateWithTime(laborTime){
            let defaultDate =new Date().toLocaleDateString(defaultLocale)
            return defaultDate + " " +laborTime;
        }

        _compareIfTechTimeGreaterThanEndTime(activityStartTime,defaultEndTime, technicianTime,durationInMinutes) {
            if(this._checkIfOverNightActivity(activityStartTime,technicianTime,durationInMinutes)){
                return false;
            }
            let technicianTimeIn24Hour = technicianTime.split(" ")[1];
            let activityTimeIn24Hour = this._getTimeIn24HourFormat(this._getDefaultDateWithTime(defaultEndTime));
            return (Date.parse(this._getDefaultDateWithTime(technicianTimeIn24Hour)) > Date.parse(this._getDefaultDateWithTime(activityTimeIn24Hour)))
        }
        /** Check if its over-night activity **/
        _checkIfOverNightActivity(startTime, resourceCurrentTime, duration) {
            let defaultDate = new Date(this._getDefaultDateWithTime(startTime));
            let calculatedEndTime = defaultDate.setMinutes(defaultDate.getMinutes() + duration);
            let calculatedEndDate = new Date(calculatedEndTime).toLocaleDateString(defaultLocale);
            let resourceCurrentDate = new Date(resourceCurrentTime).toLocaleDateString(defaultLocale);
            return (calculatedEndDate>resourceCurrentDate)
        }

        _getTimeIn24HourFormat(technicianTime){
            let technicianCurrentTime = new Date(technicianTime);
            let options = { timeStyle: 'short', hour12: false };
            return technicianCurrentTime.toLocaleTimeString(this.defaultLocale, options);
        }
        _calculateStartTimeBasedOnTravelDuration(travelTime, travelEndTime) {
            let defaultDate = new Date(this._getDefaultDateWithTime(travelEndTime));
            const currentMinutes = defaultDate.getMinutes();
            let temp = defaultDate.setMinutes(currentMinutes - travelTime);
            return this._getTimeIn24HourFormat(temp);
        }

        _calculateDuration(dateTimeConverter, startTime, endTime) {
            let durationInTotalMinutes = dateTimeConverter.compareISODates(
                dateTimeConverter.parse(endTime),
                dateTimeConverter.parse(startTime)
            ) / (1000 * 60)
            return this._formatDuration(durationInTotalMinutes);
        }

        _formatDuration(durationInTotalMinutes) {
            const hours = Math.floor(durationInTotalMinutes / 60);
            const minutes = durationInTotalMinutes % 60;
            const formatDuration = (value, unit) => (value !== 0 ? `${value} ${unit}` : "");

            // Combine with proper spacing
            let hrsUnit = (hours === 1) ? Constants.HOUR: Constants.HOURS;
            let minsUnit = (minutes === 1) ? Constants.MINUTE: Constants.MINUTES;
            return [formatDuration(hours < 0 ? hours + 24 : hours, hrsUnit),
                formatDuration(minutes < 0 ? minutes + 60 : minutes, minsUnit)
            ].filter(Boolean).join(" ");
        }

        _convertToUTC(localDateTimeStr, timezoneOffsetMinutes) {
            let offsetVal = this._formatOffset(timezoneOffsetMinutes);
            let dateWithOffset = `${localDateTimeStr}${offsetVal}`;
            const localDate = new Date(dateWithOffset);
            const utcTime = new Date(localDate.getTime());
            return utcTime.toISOString();
        }

        _formatOffset(offsetMinutes) {
            const sign = offsetMinutes >= 0 ? "+" : "-";
            const abs = Math.abs(offsetMinutes);
            const hours = String(Math.floor(abs / 60)).padStart(2, '0');
            const minutes = String(abs % 60).padStart(2, '0');
            return `${sign}${hours}:${minutes}`;
        }


    }
    return LaborTimeUtils;
});