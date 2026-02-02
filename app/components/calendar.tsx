import { useMemo, useState } from 'react';
import { Todo } from './tododroplist';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DateInfo {
  day: number;
  monthDelta: number;
  today?: boolean;
}

export default function Calendar({ todoListData }: { todoListData?: Todo[] }) {
  const [month, setMonth] = useState(new Date().getMonth());
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
            const now = new Date(
              `${currentYear}-${(currentMonth + 1)
                .toString()
                .padStart(2, '0')}-${dateInfo.day.toString().padStart(2, '0')}`,
            );
            if (todo.isToday && startDate.getTime() === now.getTime()) {
              return true;
            }
            if (
              startDate.getTime() <= now.getTime() &&
              endDate.getTime() >= now.getTime()
            ) {
              return true;
            }
            return false;
          });
          const countsOfEventOnThisDate = DuringThisDate?.length || 0;
          const isOutsideMonth = dateInfo.monthDelta !== 0;
          const hasEvents = countsOfEventOnThisDate > 0;
          if (dateInfo.today) {
            return (
              <div
                key={`${dateInfo.day}-${dateInfo.monthDelta}`}
                className="bg-indigo-50 border border-indigo-200 rounded-lg flex flex-col m-1"
              >
                <p className="self-end">
                  <span className="p-2 text-indigo-700 font-semibold">
                    {dateInfo.day}
                  </span>
                </p>
                <span className="text-sm text-indigo-700">
                  {hasEvents && `${countsOfEventOnThisDate} Events`}
                </span>
              </div>
            );
          }
          return (
            <div
              key={`${dateInfo.day}-${dateInfo.monthDelta}`}
              className={`flex flex-col m-1 rounded-lg border border-transparent ${
                isOutsideMonth ? 'text-slate-300' : 'text-slate-700'
              } ${hasEvents ? 'bg-amber-50' : 'bg-white'}`}
            >
              <p className="self-end">
                <span className="p-2">{dateInfo.day}</span>
              </p>
              <span className={hasEvents ? 'text-amber-600' : 'text-slate-200'}>
                {hasEvents && `${countsOfEventOnThisDate} Events`}
              </span>
            </div>
          );
        });
      })}
    </div>
  );
}
