import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { EventContentArg } from '@fullcalendar/core';

interface BackendEvent {
  id: string;
  title: string;
  date: string;
}

const сalendarComponent: React.FC = () => {
  const [events, setEvents] = useState<BackendEvent[]>([]);

  // Фейковая загрузка событий с бекенда
  const fetchEvents = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    setEvents([
      { id: '1', title: 'Событие 1', date: '2025-09-15' },
      { id: '2', title: 'Событие 2', date: '2025-09-20' },
    ]);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Обработка клика по дате
  const handleDateClick = (arg: { dateStr: string }) => {
    alert(`Вы выбрали дату: ${arg.dateStr}`);
  };

  // Отрисовка события (можно кастомизировать)
  const renderEventContent = (eventInfo: EventContentArg) => (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={events}
      dateClick={handleDateClick}
      eventContent={renderEventContent}
      height={600}
    />
  );
};

export default сalendarComponent;
