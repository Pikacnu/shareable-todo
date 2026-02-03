import { useCallback, useMemo, useState } from 'react';
import { Todo } from './tododroplist';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DateInfo {
  day: number;
  monthDelta: number;
  today?: boolean;
}

export default function Calendar({
  todoListData,
  onDateClick,
  isRangeSelection = false,
}: {
  todoListData?: Todo[];
  onDateClick?: (date: Date) => void;
  isRangeSelection?: boolean;
}) {
  const [month, setMonth] = useState(new Date().getMonth());

  const [rangeStartDate, setRangeStartDate] = useState<Date | null>(null);
  const [rangeEndDate, setRangeEndDate] = useState<Date | null>(null);

  const { weekDateInfo, currentMonth, currentYear } = useMemo(() => {
    const today = new Date();
    const firstDayOfTheMonth = new Date(today.getFullYear(), month, 1);
    const displayYear = firstDayOfTheMonth.getFullYear();
    const displayMonth = firstDayOfTheMonth.getMonth();
    const lastDayOfTheMonth = new Date(displayYear, displayMonth + 1, 0);
    const dayCountsOfTheMonth = lastDayOfTheMonth.getDate();

    const firstDayWeek = firstDayOfTheMonth.getDay();
    const prevMonthLastDate = new Date(displayYear, displayMonth, 0).getDate();

    const prevMonth = Array(firstDayWeek)
      .fill(0)
      .map((_, i) => ({
        day: prevMonthLastDate - firstDayWeek + i + 1,
        monthDelta: -1,
      }));

    const currentMonth = Array(dayCountsOfTheMonth)
      .fill(0)
      .map((_, i) => ({
        day: i + 1,
        monthDelta: 0,
        today:
          today.getDate() === i + 1 &&
          today.getMonth() === displayMonth &&
          today.getFullYear() === displayYear,
      }));

    const nextMonth = Array(7 * 6 - (prevMonth.length + currentMonth.length))
      .fill(0)
      .map((_, i) => ({
        day: i + 1,
        monthDelta: 1,
      }));
    const weekDateInfo: DateInfo[][] = [prevMonth, currentMonth, nextMonth];

    return {
      weekDateInfo,
      currentMonth: displayMonth,
      currentYear: displayYear,
    };
  }, [month]);

  const dateButtonHandler = useCallback(
    (dateInfo: Date) => {
      onDateClick && onDateClick(dateInfo);
      if (!isRangeSelection) {
        return;
      }
      const date = new Date(dateInfo);
      date.setHours(0, 0, 0, 0);
      console.log(date);
      const isEarlierThanStartDate =
        rangeStartDate && date.getTime() < rangeStartDate.getTime();
      const isLaterThanEndDate =
        rangeEndDate && date.getTime() > rangeEndDate.getTime();
      if (!rangeStartDate) {
        return setRangeStartDate(date);
      }
      if (!rangeEndDate) {
        if (isEarlierThanStartDate) {
          setRangeEndDate(rangeStartDate);
          setRangeStartDate(date);
          return;
        } else {
          return setRangeEndDate(date);
        }
      }
      if (isEarlierThanStartDate) {
        return setRangeStartDate(date);
      }
      if (isLaterThanEndDate) {
        return setRangeEndDate(date);
      }
      const deltaTimeToStart = Math.abs(
        rangeStartDate!.getTime() - date.getTime(),
      );
      const deltaTimeToStartAsDays = Math.floor(
        deltaTimeToStart / (1000 * 60 * 60 * 24),
      );
      const deltaTimeToEnd = Math.abs(rangeEndDate!.getTime() - date.getTime());
      const deltaTimeToEndAsDays = Math.floor(
        deltaTimeToEnd / (1000 * 60 * 60 * 24),
      );
      console.log({ deltaTimeToStartAsDays, deltaTimeToEndAsDays });
      if (deltaTimeToStartAsDays === 0) {
        return setRangeStartDate(null);
      }
      if (deltaTimeToEndAsDays === 0) {
        return setRangeEndDate(null);
      }
      if (deltaTimeToStart > deltaTimeToEnd) {
        return setRangeEndDate(date);
      } else {
        return setRangeStartDate(date);
      }
    },
    [isRangeSelection, onDateClick, rangeEndDate, rangeStartDate],
  );

  const monthDisplay = month < 0 ? 12 + (month % 12) : month % 12;
  const yearDisplay = new Date().getFullYear() + Math.floor(month / 12);

  return (
    <div className="w-full h-full grid grid-rows-7 grid-cols-7 text-slate-700 *:text-center relative *:select-none bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="items-center justify-center flex bg-slate-50">
        <button
          onClick={() => setMonth((prev) => prev - 1)}
          className="hover:bg-slate-200/70 text-slate-600 font-semibold rounded-lg p-2 px-4 transition-colors"
        >
          <ChevronLeft />
        </button>
      </div>
      <div className="flex grid-cols-subgrid col-span-5 items-center justify-center text-center bg-slate-50 font-semibold text-slate-800">
        {yearDisplay}/{monthDisplay + 1}
      </div>
      <div className="items-center justify-center flex bg-slate-50">
        <button
          onClick={() => setMonth((prev) => prev + 1)}
          className="hover:bg-slate-200/70 text-slate-600 font-semibold rounded-lg p-2 px-4 transition-colors"
        >
          <ChevronRight />
        </button>
      </div>
      {weekDateInfo.map((week) => {
        return week.map((dateInfo) => {
          const DuringThisDate = todoListData?.filter((todo) => {
            const startDate = new Date((todo?.startTime || '')?.slice(0, 10));
            const endDate = new Date((todo?.endTime || '')?.slice(0, 10));
            const currentBlockDate = new Date(
              `${currentYear}-${(currentMonth + 1)
                .toString()
                .padStart(2, '0')}-${dateInfo.day.toString().padStart(2, '0')}`,
            );
            if (
              todo.isToday &&
              startDate.getTime() === currentBlockDate.getTime()
            ) {
              return true;
            }
            if (
              startDate.getTime() <= currentBlockDate.getTime() &&
              endDate.getTime() >= currentBlockDate.getTime()
            ) {
              return true;
            }
            return false;
          });
          const countsOfEventOnThisDate = DuringThisDate?.length || 0;
          const isOutsideMonth = dateInfo.monthDelta !== 0;
          const hasEvents = countsOfEventOnThisDate > 0;
          const date = new Date();
          const currentTime = new Date();
          date.setFullYear(currentYear);
          date.setMonth(currentMonth + dateInfo.monthDelta);
          date.setDate(dateInfo.day);
          const MidNightDate = new Date(date);
          date.setHours(currentTime.getHours());
          date.setMinutes(currentTime.getMinutes());
          date.setSeconds(currentTime.getSeconds());
          date.setMilliseconds(currentTime.getMilliseconds());
          const isInRange =
            rangeStartDate &&
            rangeEndDate &&
            MidNightDate.getTime() >= rangeStartDate.getTime() &&
            MidNightDate.getTime() <=
              rangeEndDate.getTime() + 10 * 60 * 60 * 24;
          if (dateInfo.today) {
            return (
              <button
                key={`${dateInfo.day}-${dateInfo.monthDelta}`}
                className={`bg-indigo-50 border border-indigo-200 rounded-lg flex flex-col m-1 ${
                  isInRange ? 'bg-indigo-100' : ''
                }`}
                onClick={() => {
                  dateButtonHandler(date);
                }}
              >
                <p className="self-end text-lg">
                  <span className="p-2 text-blue-700 font-semibold">
                    {dateInfo.day}
                  </span>
                </p>
                <span className="text-sm text-blue-700 max-md:text-lg">
                  {hasEvents && `${countsOfEventOnThisDate} Events`}
                </span>
              </button>
            );
          }
          return (
            <button
              onClick={() => {
                dateButtonHandler(date);
              }}
              key={`${dateInfo.day}-${dateInfo.monthDelta}`}
              className={`flex flex-col m-1 rounded-lg border border-transparent ${
                isOutsideMonth ? 'text-slate-300' : 'text-slate-700'
              } ${hasEvents ? 'bg-amber-50' : 'bg-white'} ${
                isInRange ? 'bg-indigo-100' : ''
              } hover:bg-slate-100 transition-colors`}
            >
              <p className="self-end text-base">
                <span className="p-2">{dateInfo.day}</span>
              </p>
              <span
                className={`${
                  hasEvents ? 'text-amber-600' : 'text-slate-500'
                } max-md:text-xs text-sm`}
              >
                {hasEvents && `${countsOfEventOnThisDate} Events`}
              </span>
            </button>
          );
        });
      })}
    </div>
  );
}
