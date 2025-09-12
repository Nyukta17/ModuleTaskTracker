import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { EventContentArg } from '@fullcalendar/core';
import ApiRoute from '../../api/ApiRoute';

const api = new ApiRoute();

interface BackendEvent {
  id: string;
  title: string;
  start: string; // обязателен start для FullCalendar
  // можете добавить end?: string; если нужно
}

const CalendarComponent: React.FC = () => {
  const [events, setEvents] = useState<BackendEvent[]>([]);

  const fetchEvents = async () => {
    try {
      const response = await fetch(api.getEvent(), {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('jwtToken'),
          'Content-Type': 'application/json'
        }
      });

      const text = await response.text();

      if (!response.ok) {
        throw new Error(text || 'Ошибка загрузки событий');
      }

      const data = JSON.parse(text);

      // Преобразуем данные под формат FullCalendar
      const mappedEvents = data.map((event: any) => ({
        id: event.id,
        title: event.text || event.title,
        start: event.dateTime || event.date, // дата в формате ISO 8601
      }));

      setEvents(mappedEvents);
    } catch (error: any) {
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

 const createEvent = async (newEvent: { dateTime: string; text: string }) => {
  try {
    const response = await fetch(api.setEvent(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('jwtToken'),
      },
      body: JSON.stringify(newEvent),
    });

    if (!response.ok) {
      // попытаемся получить текст ошибки
      const errorText = await response.text();
      throw new Error(errorText || 'Ошибка при создании события');
    }

    // Если сервер возвращает просто OK, не пытаемся парсить JSON
    // Перезапрашиваем список событий, чтобы обновить календарь
    await fetchEvents();
  } catch (error: any) {
    alert(error.message);
  }
};


  const handleDateClick = (arg: { dateStr: string }) => {
    const text = prompt('Введите название события');
    if (text) {
      createEvent({ text, dateTime: arg.dateStr });
    }
  };

  const renderEventContent = (eventInfo: EventContentArg) => (
    <>
      <b>{eventInfo.timeText}</b>&nbsp;
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

export default CalendarComponent;
