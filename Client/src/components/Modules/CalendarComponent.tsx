import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { EventContentArg, DateSelectArg } from '@fullcalendar/core';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

import ApiRoute from '../../api/ApiRoute';

const api = new ApiRoute();

interface BackendEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  type?: string;
  startTime?: string;
  endTime?: string;
}

type UserRole = 'Boss' | 'administrator' | 'employee';

const CalendarComponent: React.FC = () => {
  const [events, setEvents] = useState<BackendEvent[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState('EVENT');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const roleFromToken = localStorage.getItem('userRole') as UserRole | null;
    setUserRole(roleFromToken);
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(api.getEvent(), {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('jwtToken'),
          'Content-Type': 'application/json',
        },
      });
      const text = await response.text();
      if (!response.ok) {
        throw new Error(text || 'Ошибка загрузки событий');
      }
      const data = JSON.parse(text);
      const mappedEvents = data.map((event: any) => ({
        id: event.id,
        title: event.text || event.title,
        start: event.dateTime || event.date,
        end: event.endDateTime || event.endDate,
        type: event.type || 'EVENT',
        startTime: event.startTime,
        endTime: event.endTime,
      }));
      setEvents(mappedEvents);
    } catch (error: any) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const createEvent = async (newEvent: {
    startDateTime: string;
    endDateTime: string;
    text: string;
    type: string;
    startTime?: string;
    endTime?: string;
  }) => {
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
        const errorText = await response.text();
        throw new Error(errorText || 'Ошибка при создании события');
      }
      await fetchEvents();
      setShowModal(false);
      setTitle('');
      setType('EVENT');
      setStartTime('09:00');
      setEndTime('17:00');
      setSelectedStartDate('');
      setSelectedEndDate('');
      setError(null);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const isToday = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dateStr === today;
  };

  const handleSelect = (selectInfo: DateSelectArg) => {
    if (userRole === 'Boss' || userRole === 'administrator') {
      setSelectedStartDate(selectInfo.startStr);
      setSelectedEndDate(selectInfo.endStr);
      setShowModal(true);
      setError(null);
    } else {
      setError('У вас нет прав для создания события');
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      setError('Введите название события');
      return;
    }

    if (type === 'COMMON_TASK' && isToday(selectedStartDate.split('T')[0])) {
      if (!startTime || !endTime) {
        setError('Выберите время начала и конца задачи');
        return;
      }
      if (endTime <= startTime) {
        setError('Время окончания должно быть больше времени начала');
        return;
      }
    }

    createEvent({
      startDateTime: selectedStartDate,
      endDateTime: selectedEndDate,
      text: title,
      type,
      startTime: type === 'COMMON_TASK' ? startTime : undefined,
      endTime: type === 'COMMON_TASK' ? endTime : undefined,
    });
  };

  const renderEventContent = (eventInfo: EventContentArg) => (
    <>
      <b>{eventInfo.timeText}</b>&nbsp;
      <i>{eventInfo.event.title}</i> {eventInfo.event.extendedProps.type && `(${eventInfo.event.extendedProps.type})`}
      {eventInfo.event.extendedProps.startTime && eventInfo.event.extendedProps.endTime && (
        <>
          <br />
          <small>{eventInfo.event.extendedProps.startTime} - {eventInfo.event.extendedProps.endTime}</small>
        </>
      )}
    </>
  );

  return (
    <>
      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        select={handleSelect}
        events={events}
        eventContent={renderEventContent}
        height={600}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth',
        }}
      />

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Создать событие</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="eventDateRange">
              <Form.Label>Выделенный период</Form.Label>
              <Form.Control type="text" plaintext readOnly value={`${selectedStartDate} - ${selectedEndDate}`} />
            </Form.Group>

            <Form.Group controlId="eventTitle" className="mt-3">
              <Form.Label>Название</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Введите название события"
              />
            </Form.Group>

            <Form.Group controlId="eventType" className="mt-3">
              <Form.Label>Тип</Form.Label>
              <Form.Select value={type} onChange={e => setType(e.target.value)}>
                <option value="EVENT">Событие</option>
                <option value="COMMON_TASK">Общая задача</option>
              </Form.Select>
            </Form.Group>

            {type === 'COMMON_TASK' && isToday(selectedStartDate.split('T')[0]) && (
              <>
                <Form.Group controlId="startTime" className="mt-3">
                  <Form.Label>Время начала</Form.Label>
                  <Form.Control
                    type="time"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="endTime" className="mt-3">
                  <Form.Label>Время окончания</Form.Label>
                  <Form.Control
                    type="time"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                  />
                </Form.Group>
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Отмена</Button>
          <Button variant="primary" onClick={handleSubmit}>Создать</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CalendarComponent;
