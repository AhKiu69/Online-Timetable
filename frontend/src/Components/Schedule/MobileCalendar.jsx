import React from 'react';

const MobileCalendar = ({events = []}) => {
  const daysOfWeek = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  const hoursOfDay = Array.from({length: 9}, (_, i) => i + 9);

  return (
    <div className='absolute'>
      <table className='h-full table-auto select-none'>
        <thead className=''>
          <tr>
            <th>时间</th>
            {daysOfWeek.map((day, i) => (
              <th className='w-[30vw]' key={i}>
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody >
          {hoursOfDay.map((hour) => (
            <tr key={hour} >
              <td className='sticky left-0 w-[10vw]'>{hour}:00</td>
              {daysOfWeek.map((day, i) => (
                <td className='w-[30vw]' key={i}>
                  {events
                    .filter(
                      (event) =>
                        new Date(event.start).getDay() === i &&
                        new Date(event.start).getHours() === hour
                    )
                    .map((event) => (
                      <div key={event.title}>{event.title}</div>
                    ))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MobileCalendar;
