import React from 'react';
import './Service.css'; // Import CSS for styling

function Service() {
  const events = [
    {
      date: '20-08-2019',
      title: 'Birthday',
      icon: 'fa fa-birthday-cake',
      color: 'purple',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel, nam! Nam eveniet ut aliquam ab asperiores, accusamus iure veniam corporis incidunt reprehenderit accusantium id aut architecto harum quidem dolorem in!'
    },
    {
      date: '20-08-2019',
      title: 'Lunch',
      icon: 'fa fa-utensils',
      color: 'orange',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel, nam! Nam eveniet ut aliquam ab asperiores, accusamus iure veniam corporis incidunt reprehenderit accusantium id aut architecto harum quidem dolorem in!'
    },
    {
      date: '20-08-2019',
      title: 'Exercise',
      icon: 'fa fa-dumbbell',
      color: 'green',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel, nam! Nam eveniet ut aliquam ab asperiores, accusamus iure veniam corporis incidunt reprehenderit accusantium id aut architecto harum quidem dolorem in!'
    },
    {
      date: '20-08-2019',
      title: 'Birthday',
      icon: 'fa fa-birthday-cake',
      color: 'purple',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel, nam! Nam eveniet ut aliquam ab asperiores, accusamus iure veniam corporis incidunt reprehenderit accusantium id aut architecto harum quidem dolorem in!'
    }
  ];

  return (
    <div className="service-container">
      <div className="timeline">
        {events.map((event, index) => (
          <div key={index} className="timeline-event">
            <div className="timeline-icon" style={{ backgroundColor: event.color }}>
              <i className={event.icon} />
            </div>
            <div className="timeline-details">
              <div className="timeline-date">{event.date}</div>
              <div className="timeline-content">
                <h4>{event.title}</h4>
                <p>{event.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Service;
