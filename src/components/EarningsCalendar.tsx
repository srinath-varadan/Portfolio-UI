import React from 'react';

const EarningsCalendar: React.FC<{ events: any[] }> = ({ events }) => {
  return (
    <div>
      <h3>Upcoming Earnings</h3>
      <ul>
        {events.map((event, index) => (
          <li key={index}>
            {event.company} - {event.date} - EPS: {event.estimate}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EarningsCalendar;