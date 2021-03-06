import math from 'mathjs';
import toDate from 'normalize-date';
import _ from 'underscore';
import dateArithmetic from 'date-arithmetic';

const calculatePosition = (plotPoints) => {
    console.log('hi');
    const MAX_DURATION_LIMIT = 300;
    const plotPointsWithNumberDate = plotPoints.map((point) => {
        point.date = toDate(point.start_time);
        return point;
    });
    const sortedByDate = _.sortBy(plotPointsWithNumberDate, (plotPoint) => plotPoint.date.getTime());
    const start_date = _.first(sortedByDate).date;
    const last_date = _.last(sortedByDate).date;
    function getMonth(date) {
        let number = date.getMonth() + 1;
        if (number < 10) {
            return `0${number}`;
        }
        return number;
    }
    let minDay = toDate(`${start_date.getFullYear()}-${getMonth(start_date)}-${start_date.getDate()}T00:00:00Z`);
    let maxDay = toDate(`${last_date.getFullYear()}-${getMonth(last_date)}-${last_date.getDate() + 1}T00:00:00Z`);
    const numberOfDays = dateArithmetic.diff(minDay, maxDay, 'day', false);
    const MIN_TIME = minDay.valueOf();
    const MAX_TIME = maxDay.valueOf();
    const splitXTimeLineProps = {
        numberOfDays,
        start_day: start_date,
        last_day: last_date
    };
    const toPosY = (duration) => {
        return math.chain(duration)
            .multiply(100)
            .divide(MAX_DURATION_LIMIT)
            .done();
    };
    const toPosX = (rfcDate) => {
        const res1 = math.chain(toDate(rfcDate).valueOf())
            .subtract(MIN_TIME).done();
        const res2 = math.chain(MAX_TIME)
            .subtract(MIN_TIME)
            .done();
        return math.chain(res1)
            .divide(res2)
            .multiply(100)
            .done();
    };
    const points = sortedByDate.map((point, index) => {
        return {
            posY: `${toPosY(point.duration)}%`,
            posX: `${toPosX(point.start_time)}%`,
            status: point.status,
            id: index
        }
    });

    return {points, splitXTimeLineProps}
};

export default calculatePosition;