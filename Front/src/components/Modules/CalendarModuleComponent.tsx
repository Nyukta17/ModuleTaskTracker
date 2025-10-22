import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
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

interface Task {
  id?: number;
  title: string;
  description: string;
  assignedUser: string;
  status: "NEW" | "IN_PROGRESS" | "TESTING" | "DONE";
  priority?: "LOW" | "MEDIUM" | "HIGH";
  dueDate?: string; // ISO 8601 DATETIME string
}

interface CalendarProps {
  projectHubId: string;
  timeTrackerAvailable: boolean;
  newsAvailable: boolean;
}

const NewsForm: React.FC<{
  newsTitle: string;
  setNewsTitle: (v: string) => void;
  content: string;
  setContent: (v: string) => void;
}> = ({ newsTitle, setNewsTitle, content, setContent }) => (
  <Form>
    <Form.Group controlId="newsTitle" className="mb-3">
      <Form.Label>Заголовок новости</Form.Label>
      <Form.Control
        type="text"
        placeholder="Введите заголовок"
        value={newsTitle}
        onChange={(e) => setNewsTitle(e.target.value)}
        autoFocus
      />
    </Form.Group>
    <Form.Group controlId="newsContent" className="mb-3">
      <Form.Label>Текст новости</Form.Label>
      <Form.Control
        as="textarea"
        rows={5}
        placeholder="Введите текст новости"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
    </Form.Group>
  </Form>
);

const TaskForm: React.FC<{
  task: Task;
  onChange: (task: Task) => void;
  errors: { [key: string]: string };
}> = ({ task, onChange, errors }) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    let { name, value } = e.target;
    if (name === "dueDate" && value && !value.includes("T")) {
      value = value + "T00:00:00";
    }
    onChange({ ...task, [name]: value });
  };

  return (
    <Form>
      <Form.Group controlId="formTitle" className="mb-3">
        <Form.Label>Название</Form.Label>
        <Form.Control
          name="title"
          type="text"
          value={task.title}
          onChange={handleChange}
          isInvalid={!!errors.title}
          placeholder="Введите название задачи"
        />
        <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="formDescription" className="mb-3">
        <Form.Label>Описание</Form.Label>
        <Form.Control
          as="textarea"
          name="description"
          rows={3}
          value={task.description}
          onChange={handleChange}
          placeholder="Введите описание задачи"
        />
      </Form.Group>

      <Form.Group controlId="formAssignedUser" className="mb-3">
        <Form.Label>Исполнитель</Form.Label>
        <Form.Control
          name="assignedUser"
          type="text"
          value={task.assignedUser}
          onChange={handleChange}
          isInvalid={!!errors.assignedUser}
          placeholder="Имя исполнителя"
        />
        <Form.Control.Feedback type="invalid">{errors.assignedUser}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="formStatus" className="mb-3">
        <Form.Label>Статус</Form.Label>
        <Form.Select name="status" value={task.status} onChange={handleChange}>
          <option value="NEW">Новая</option>
          <option value="IN_PROGRESS">В работе</option>
          <option value="TESTING">В тестировании</option>
          <option value="DONE">Выполнена</option>
        </Form.Select>
      </Form.Group>

      <Form.Group controlId="formPriority" className="mb-3">
        <Form.Label>Приоритет</Form.Label>
        <Form.Select name="priority" value={task.priority} onChange={handleChange}>
          <option value="LOW">Низкий</option>
          <option value="MEDIUM">Средний</option>
          <option value="HIGH">Высокий</option>
        </Form.Select>
      </Form.Group>

      <Form.Group controlId="formDueDate" className="mb-3">
        <Form.Label>Срок выполнения</Form.Label>
        <Form.Control
          name="dueDate"
          type="date"
          value={task.dueDate ? task.dueDate.substring(0, 10) : ""}
          onChange={handleChange}
        />
      </Form.Group>
    </Form>
  );
};

const CalendarModuleComponent: React.FC<CalendarProps> = ({
  projectHubId,
  timeTrackerAvailable,
  newsAvailable,
}) => {
  const [events, setEvents] = useState<BackendEvent[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [calendarTitle, setCalendarTitle] = useState("");
  const [newsTitle, setNewsTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Управление данными задачи в модальном окне
  const [task, setTask] = useState<Task>({
    title: "",
    description: "",
    assignedUser: "",
    status: "NEW",
    priority: "MEDIUM",
    dueDate: selectedStartDate ? selectedStartDate + "T00:00:00" : "",
  });
  const [taskErrors, setTaskErrors] = useState<{ [key: string]: string }>({});

  const token = localStorage.getItem("jwtToken") ?? "";

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch(api.getAllEvents() + `?hubId=${projectHubId}`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
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

  const formatLocalDateTime = (dateStr: string) => {
    if (!dateStr) return "";
    return dateStr.includes("T") ? dateStr : dateStr + "T00:00:00";
  };

  const resetForm = () => {
    setCalendarTitle("");
    setNewsTitle("");
    setContent("");
    setType("");
    setTask({
      title: "",
      description: "",
      assignedUser: "",
      status: "NEW",
      priority: "MEDIUM",
      dueDate: "",
    });
    setTaskErrors({});
    setError(null);
  };

  const handleSelect = (selectInfo: any) => {
    setSelectedStartDate(selectInfo.startStr);
    setSelectedEndDate(selectInfo.endStr);
    setShowModal(true);
    resetForm();
  };

  // Валидация задачи
  const validateTask = (): boolean => {
    const errs: { [key: string]: string } = {};
    if (!task.title.trim()) errs.title = "Название обязательно";
    if (!task.assignedUser.trim()) errs.assignedUser = "Исполнитель обязателен";
    setTaskErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!calendarTitle.trim()) {
      setError("Введите заголовок для календаря");
      return;
    }
    if ((type === "EVENT" || type === "GOAL") && newsAvailable && !newsTitle.trim()) {
      setError("Введите заголовок новости");
      return;
    }
    if ((type === "TASK" || type === "GOAL") && timeTrackerAvailable && !validateTask()) {
      return;
    }
    try {
      const eventResponse = await fetch(`${api.createEvent()}?hubId=${projectHubId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title: calendarTitle,
          startDateTime: formatLocalDateTime(selectedStartDate),
          endDateTime: formatLocalDateTime(selectedEndDate),
          type,
        }),
      });
      if (!eventResponse.ok) throw new Error(`Ошибка ${eventResponse.status}`);

      if ((type === "EVENT" || type === "GOAL") && newsAvailable) {
        const newsResponse = await fetch(api.createNewsCompany() + `?hubId=${projectHubId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            title: newsTitle || calendarTitle,
            content,
            projectHubId,
          }),
        });
        if (!newsResponse.ok) throw new Error(`Ошибка при создании новости: ${newsResponse.status}`);
      }

      if ((type === "TASK" || type === "GOAL") && timeTrackerAvailable) {
        // Отправка задачи
        const taskResponse = await fetch(api.createTask() + `?hubId=${projectHubId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(task),
        });
        if (!taskResponse.ok) throw new Error(`Ошибка при создании задачи: ${taskResponse.status}`);
      }

      setShowModal(false);
      resetForm();
      fetchEvents();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleEventClick = (clickInfo: any) => {
    setSelectedEventId(clickInfo.event.id);
    setShowDeleteModal(true);
  };

  const handleDeleteEvent = async () => {
    if (!selectedEventId) return;
    try {
      const res = await fetch(api.deleteEvent(Number(selectedEventId)), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Ошибка ${res.status}`);
      setShowDeleteModal(false);
      setSelectedEventId(null);
      fetchEvents();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const renderEventContent = (eventInfo: any) => <i>{eventInfo.event.title}</i>;

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
        headerToolbar={{ left: "prev,next today", center: "title", right: "dayGridMonth" }}
        eventClick={handleEventClick}
      />

      <Modal show={showModal} onHide={() => { setShowModal(false); resetForm(); }}>
        <Modal.Header closeButton>
          <Modal.Title>Создать событие</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group controlId="eventType" className="mb-3">
            <Form.Label>Тип события</Form.Label>
            <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">Не выбрано</option>
              <option value="EVENT">Событие</option>
              <option value="TASK">Задача</option>
              <option value="GOAL">Цель</option>
            </Form.Select>
          </Form.Group>

          <h1>Календарное событие</h1>
          <Form.Group controlId="calendarTitle" className="mb-3">
            <Form.Label>Заголовок для календаря</Form.Label>
            <Form.Control
              value={calendarTitle}
              onChange={(e) => setCalendarTitle(e.target.value)}
              placeholder="Введите заголовок для календаря"
            />
          </Form.Group>

          {(type === "EVENT" || type === "GOAL") && newsAvailable && (
            <>
              <h1>Новость</h1>
              <NewsForm
                newsTitle={newsTitle}
                setNewsTitle={setNewsTitle}
                content={content}
                setContent={setContent}
              />
            </>
          )}

          {(type === "TASK" || type === "GOAL") && timeTrackerAvailable && (
            <>
              <h1>Задача</h1>
              <TaskForm task={task} onChange={setTask} errors={taskErrors} />
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowModal(false); resetForm(); }}>
            Отмена
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Создать
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Удалить событие</Modal.Title>
        </Modal.Header>
        <Modal.Body>Вы уверены, что хотите удалить это событие?</Modal.Body>
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
