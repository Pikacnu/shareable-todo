import { useMemo, useState } from 'react';

interface DateInfo {
  day: number;
  notCurrentMonth: boolean;
  today?: boolean;
}

export default function Calendar() {
  const [month, setMonth] = useState(new Date().getMonth());
  const data = useMemo(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), month, 1);
    const lastDay = new Date(today.getFullYear(), month + 1, 0);
    const daysOfTheMonth = lastDay.getDate();

    const firstDayWeek = firstDay.getDay();
    //const lastDate = lastDay.getDate();
    const prevLastDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      0,
    ).getDate();
    const prev = Array(firstDayWeek)
      .fill(0)
      .map((_, i) => ({
        day: prevLastDate - firstDayWeek + i + 1,
        notCurrentMonth: true,
      }));
    const current = Array(daysOfTheMonth)
      .fill(0)
      .map((_, i) => ({
        day: i + 1,
        notCurrentMonth: false,
        today: today.getDate() === i + 1 && today.getMonth() === month,
      }));
    const next = Array(42 - (prev.length + current.length))
      .fill(0)
      .map((_, i) => ({
        day: i + 1,
        notCurrentMonth: true,
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
          if (dateInfo.today) {
            return (
              <div
                key={`${dateInfo.day}-${dateInfo.notCurrentMonth}`}
                className={`text-xl bg-yellow-400	`}
              >
                {dateInfo.day}
              </div>
            );
          }
          return (
            <div
              key={`${dateInfo.day}-${dateInfo.notCurrentMonth}`}
              className={`${
                dateInfo.notCurrentMonth ? 'text-blue-400' : ' text-black'
              } text-xl`}
            >
              {dateInfo.day}
            </div>
          );
        }),
      )}
    </div>
  );
}
