export const TimeSeriesOptions = {
    THREE_MONTH: '3 MO',
    SIX_MONTH: '6 MO',
    ONE_YEAR: '1 YR',
    TWO_YEAR: '2 YR',
    THREE_YEAR: '3 YR',
    FIVE_YEAR: '5 YR',
    ALL: 'All'
} as const;

export type TimeSeries = typeof TimeSeriesOptions[keyof typeof TimeSeriesOptions];
