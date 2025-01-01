import { useMemo, useState } from 'react';
import { Todo } from './tododroplist';

interface DateInfo {
  day: number;
  monthDelta: number;
  today?: boolean;
}

export default function Calendar({ todoListData }: { todoListData?: Todo[] }) {
  const [month, setMonth] = useState(new Date().getMonth());
  const data = useMemo(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), month, 1);
    const lastDay = new Date(today.getFullYear(), month + 1, 0);
    const daysOfTheMonth = lastDay.getDate();

    const firstDayWeek = firstDay.getDay();
    const prevLastDate = new Date(today.getFullYear(), month, 0).getDate();
    const prev = Array(firstDayWeek)
      .fill(0)
      .map((_, i) => ({
        day: prevLastDate - firstDayWeek + i + 1,
        monthDelta: -1,
      }));
    const current = Array(daysOfTheMonth)
      .fill(0)
      .map((_, i) => ({
        day: i + 1,
        monthDelta: 0,
        today: today.getDate() === i + 1 && today.getMonth() === month,
      }));
    const next = Array(42 - (prev.length + current.length))
      .fill(0)
      .map((_, i) => ({
        day: i + 1,
        monthDelta: 1,
      }));
    const data: DateInfo[][] = [prev, current, next];

    return data;
  }, [month]);

  const monthDisplay = month < 0 ? 12 + (month % 12) : month % 12;
  const yearDisplay = new Date().getFullYear() + Math.floor(month / 12);

  return (
    <div className="w-full h-full grid grid-rows-7 grid-cols-7 text-black *:outline-1 *:outline *:outline-black *:text-center relative *:select-none">
      <div className=" absolute w-full h-full grid grid-rows-7 grid-cols-7 pointer-events-none">
        <div className="flex grid-cols-subgrid col-span-7"></div>
        <div className="flex flex-col-reverse grid-cols-subgrid col-span-7 relative h-full *:outline-slate-50 *:border *:rounded-lg"></div>
        <div className="flex flex-col-reverse grid-cols-subgrid col-span-7 relative h-full *:outline-slate-50 *:border *:rounded-lg"></div>
        <div className="flex flex-col-reverse grid-cols-subgrid col-span-7 relative h-full *:outline-slate-50 *:border *:rounded-lg"></div>
        <div className="flex flex-col-reverse grid-cols-subgrid col-span-7 relative h-full *:outline-slate-50 *:border *:rounded-lg"></div>
        <div className="flex flex-col-reverse grid-cols-subgrid col-span-7 relative h-full *:outline-slate-50 *:border *:rounded-lg"></div>
        <div className="flex flex-col-reverse grid-cols-subgrid col-span-7 relative h-full *:outline-slate-50 *:border *:rounded-lg"></div>
      </div>
      <button onClick={() => setMonth((prev) => prev - 1)}>prev</button>
      <div className=" flex grid-cols-subgrid col-span-5 items-center justify-center text-center">
        {yearDisplay}/{monthDisplay + 1}
      </div>

      <button onClick={() => setMonth((prev) => prev + 1)}>next</button>
      {data.map((week) =>
        week.map((dateInfo) => {
          const currentMonth = (month + dateInfo.monthDelta + 12) % 12;
          const currentYear =
            new Date().getFullYear() +
            Math.floor((month + dateInfo.monthDelta) / 12);
          const DuringThisDate = todoListData?.filter((todo) => {
            const startDate = new Date((todo?.startTime || '')?.slice(0, 10));
            const endDate = new Date((todo?.endTime || '')?.slice(0, 10));
            const now = new Date(
              `${currentYear}-${currentMonth + 1}-${dateInfo.day}`,
            );
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
                className={` bg-yellow-400`}
              >
                <p>{dateInfo.day}</p>

                <p
                  className={`${
                    countsOfEventOnThisDate > 0
                      ? 'text-blue-400'
                      : 'text-gray-600'
                  }
                  `}
                >
                  {countsOfEventOnThisDate > 0
                    ? `${countsOfEventOnThisDate} Events`
                    : 'No Event'}
                </p>
              </div>
            );
          }
          return (
            <div
              key={`${dateInfo.day}-${dateInfo.monthDelta}`}
              className={`${
                dateInfo.monthDelta === 0 ? 'text-blue-400' : ' text-gray-400'
              } `}
            >
              {dateInfo.day}
              <p
                className={`${
                  countsOfEventOnThisDate > 0 ? 'text-red-400' : 'text-gray-200'
                }`}
              >
                {countsOfEventOnThisDate > 0
                  ? `${countsOfEventOnThisDate} Events`
                  : 'No Event'}
              </p>
            </div>
          );
        }),
      )}
    </div>
  );
}
