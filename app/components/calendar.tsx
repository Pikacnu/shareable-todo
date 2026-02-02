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
    const lastDayOfTheMonth = new Date(today.getFullYear(), month + 1, 0);
    const dayCountsOfTheMonth = lastDayOfTheMonth.getDate();

    const firstDayWeek = firstDayOfTheMonth.getDay();
    const prevMonthLastDate = new Date(today.getFullYear(), month, 0).getDate();

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
        today: today.getDate() === i + 1 && today.getMonth() === month,
      }));

    const nextMonth = Array(42 - (prevMonth.length + currentMonth.length))
      .fill(0)
      .map((_, i) => ({
        day: i + 1,
        monthDelta: 1,
      }));
    const weekDateInfo: DateInfo[][] = [prevMonth, currentMonth, nextMonth];

    return {
      weekDateInfo,
      currentMonth: month,
      currentYear: today.getFullYear(),
    };
  }, [month]);

  const monthDisplay = month < 0 ? 12 + (month % 12) : month % 12;
  const yearDisplay = new Date().getFullYear() + Math.floor(month / 12);

  return (
    <div className="w-full h-full grid grid-rows-7 grid-cols-7 text-amber-600 *:text-center relative *:select-none bg-orange-100 rounded-lg">
      <div className="items-center justify-center flex">
        <button
          onClick={() => setMonth((prev) => prev - 1)}
          className=" hover:bg-black/40 font-bold rounded-lg p-2 px-4"
        >
          <ChevronLeft />
        </button>
      </div>
      <div className=" flex grid-cols-subgrid col-span-5 items-center justify-center text-center">
        {yearDisplay}/{monthDisplay + 1}
      </div>
      <div className="items-center justify-center flex">
        <button
          onClick={() => setMonth((prev) => prev + 1)}
          className="hover:bg-black/40 font-bold rounded-lg p-2 px-4"
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
            if (todo.isToday && startDate.getTime() == now.getTime()) {
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
          if (dateInfo.today) {
            return (
              <div
                key={`${dateInfo.day}-${dateInfo.monthDelta}`}
                className="bg-black/5 rounded-md flex flex-col"
              >
                <p className="self-end">
                  <span className="p-2">{dateInfo.day}</span>
                </p>
                <span
                  className={`${
                    countsOfEventOnThisDate > 0 && 'text-gray-800'
                  }`}
                >
                  {countsOfEventOnThisDate > 0 &&
                    `${countsOfEventOnThisDate} Events`}
                </span>
              </div>
            );
          }
          return (
            <div
              key={`${dateInfo.day}-${dateInfo.monthDelta}`}
              className="flex flex-col"
            >
              <p className="self-end">
                <span className="p-2">{dateInfo.day}</span>
              </p>
              <span
                className={`${
                  countsOfEventOnThisDate > 0 ? 'text-red-400' : 'text-gray-200'
                }`}
              >
                {countsOfEventOnThisDate > 0 &&
                  `${countsOfEventOnThisDate} Events`}
              </span>
            </div>
          );
        });
      })}
    </div>
  );
}
