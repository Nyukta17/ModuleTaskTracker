import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventContentArg, EventClickArg, DateSelectArg } from "@fullcalendar/core";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import ApiRoute from "../../api/ApiRoute";

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

const CalendarModuleComponent: React.FC = () => {
  const [events, setEvents] = useState<BackendEvent[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("EVENT");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("jwtToken") ?? "";

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch(api.getAllEvents(), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error(`Ошибка ${res.status}`);
      const data = await res.json();
      setEvents(
        data.map((e: any) => ({
          id: e.id?.toString() ?? "",
          title: e.title,
          start: e.startDateTime,
          end: e.endDateTime,
          type: e.type,
          startTime: e.startTime,
          endTime: e.endTime,
        }))
      );
    } catch (e: any) {
      setError(e.message);
    }
  };

  const createEvent = async (newEvent: {
    startDateTime: string;
    endDateTime: string;
    text: string;
    type: string;
    startTime?: string;
    endTime?: string;
  }) => {
    try {
      const formatDateTime = (dateTimeStr: string, timeStr?: string) => {
        if (!dateTimeStr) return "";
        if (dateTimeStr.includes("T")) return dateTimeStr;
        const timePart = timeStr ? timeStr : "00:00:00";
        return `${dateTimeStr}T${timePart}`;
      };

      const start = formatDateTime(newEvent.startDateTime, newEvent.startTime);
      const end = formatDateTime(newEvent.endDateTime, newEvent.endTime);

      const res = await fetch(api.createEvent(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newEvent.text,
          startDateTime: start,
          endDateTime: end,
          type: newEvent.type,
          startTime: newEvent.startTime,
          endTime: newEvent.endTime,
        }),
      });
      if (!res.ok) throw new Error(`Ошибка ${res.status}`);
      await fetchEvents();
      setShowModal(false);
      resetForm();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const resetForm = () => {
    setTitle("");
    setType("EVENT");
    setStartTime("09:00");
    setEndTime("17:00");
    setSelectedStartDate("");
    setSelectedEndDate("");
    setError(null);
  };

  const isToday = (dateStr: string) => {
    const today = new Date().toISOString().split("T")[0];
    return dateStr === today;
  };

  const handleSelect = (selectInfo: DateSelectArg) => {
    setSelectedStartDate(selectInfo.startStr);
    setSelectedEndDate(selectInfo.endStr);
    setShowModal(true);
    setError(null);
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      setError("Введите название события");
      return;
    }
    if (type === "COMMON_TASK" && isToday(selectedStartDate.split("T")[0])) {
      if (!startTime || !endTime) {
        setError("Выберите время начала и конца задачи");
        return;
      }
      if (endTime <= startTime) {
        setError("Время окончания должно быть больше времени начала");
        return;
      }
    }
    createEvent({
      startDateTime: selectedStartDate,
      endDateTime: selectedEndDate,
      text: title,
      type,
      startTime: type === "COMMON_TASK" ? startTime : undefined,
      endTime: type === "COMMON_TASK" ? endTime : undefined,
    });
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    setSelectedEventId(clickInfo.event.id);
    setShowDeleteModal(true);
  };

  const handleDeleteEvent = async () => {
    try {
      if (!selectedEventId) return;
      const res = await fetch(api.deleteEvent(Number(selectedEventId)), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`Ошибка ${res.status}`);
      setShowDeleteModal(false);
      setSelectedEventId(null);
      await fetchEvents();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const renderEventContent = (eventInfo: EventContentArg) => (
    <>
      <b>{eventInfo.timeText}</b>&nbsp;
      <i>{eventInfo.event.title}</i>{" "}
      {eventInfo.event.extendedProps.type &&
        `(${eventInfo.event.extendedProps.type})`}
      {eventInfo.event.extendedProps.startTime &&
        eventInfo.event.extendedProps.endTime && (
          <>
            <br />
            <small>
              {eventInfo.event.extendedProps.startTime} -{" "}
              {eventInfo.event.extendedProps.endTime}
            </small>
          </>
        )}
    </>
  );

  return (
    <>
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        select={handleSelect}
        events={events}
        eventContent={renderEventContent}
        height={600}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth",
        }}
        eventClick={handleEventClick}
      />
      {/* Модальное окно создания события */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Создать событие</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="eventDateRange">
              <Form.Label>Выделенный период</Form.Label>
              <Form.Control
                type="text"
                plaintext
                readOnly
                value={`${selectedStartDate} - ${selectedEndDate}`}
              />
            </Form.Group>
            <Form.Group controlId="eventTitle" className="mt-3">
              <Form.Label>Название</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Введите название события"
              />
            </Form.Group>
            <Form.Group controlId="eventType" className="mt-3">
              <Form.Label>Тип</Form.Label>
              <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="EVENT">Событие</option>
                <option value="COMMON_TASK">Общая задача</option>
              </Form.Select>
            </Form.Group>
            {type === "COMMON_TASK" && isToday(selectedStartDate.split("T")[0]) && (
              <>
                <Form.Group controlId="startTime" className="mt-3">
                  <Form.Label>Время начала</Form.Label>
                  <Form.Control
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="endTime" className="mt-3">
                  <Form.Label>Время окончания</Form.Label>
                  <Form.Control
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </Form.Group>
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Отмена
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Создать
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Модальное окно подтверждения удаления */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Удалить событие</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Вы уверены, что хотите удалить это событие?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Отмена
          </Button>
          <Button variant="danger" onClick={handleDeleteEvent}>
            Удалить
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CalendarModuleComponent;
