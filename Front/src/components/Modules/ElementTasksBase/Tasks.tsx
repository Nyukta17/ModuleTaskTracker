import React, { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import ApiRoute from "../../../api/ApiRoute";

const api = new ApiRoute();

type Task = {
  id?: number;
  title: string;
  description: string;
  assignedUser: string;
  status: "NEW" | "IN_PROGRESS" | "TESTING" | "DONE";
  priority?: "LOW" | "MEDIUM" | "HIGH";
  dueDate?: string; // ISO 8601 DATETIME string
};

const TaskForm: React.FC<{ initialTask?: Task; onSave?: () => void;projectHubId:string }> = ({
  initialTask,
  onSave,
  projectHubId
}) => {
  const [task, setTask] = useState<Task>(
    initialTask || {
      title: "",
      description: "",
      assignedUser: "",
      status: "NEW",
      priority: "MEDIUM",
      dueDate: "",
    }
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const validate = (): boolean => {
    const errs: { [key: string]: string } = {};
    if (!task.title.trim()) errs.title = "Название обязательно";
    if (!task.assignedUser.trim()) errs.assignedEmployee = "Исполнитель обязателен";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    let { name, value } = e.target;

    if (name === "dueDate" && value) {
      
      if (!value.includes("T")) {
        value = value + "T00:00:00";
      }
    }

    setTask({ ...task, [name]: value });
    setErrors({ ...errors, [name]: "" });
    setSubmitSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSubmitSuccess(false);
    console.log(task);
    try {
      const response = await fetch(api.createTask()+`?hubId=${projectHubId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwtToken"),
        },
        body: JSON.stringify(task),
      });
      if (!response.ok) {
        throw new Error(`Ошибка сохранения задачи: ${response.statusText}`);
      }
      setSubmitSuccess(true);
      if (onSave) onSave();
    } catch (error) {
      console.error("Ошибка при сохранении задачи:", error);
      setErrors({ ...errors, form: "Ошибка при сохранении задачи" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} noValidate>
      {submitSuccess && <Alert variant="success">Задача успешно сохранена!</Alert>}
      {errors.form && <Alert variant="danger">{errors.form}</Alert>}

      <Form.Group controlId="formTitle" className="mb-3">
        <Form.Label>Название</Form.Label>
        <Form.Control
          name="title"
          type="text"
          value={task.title}
          onChange={handleChange}
          isInvalid={!!errors.title}
          disabled={submitting}
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
          disabled={submitting}
          placeholder="Введите описание задачи"
        />
      </Form.Group>

      <Form.Group controlId="formAssignedEmployee" className="mb-3">
        <Form.Label>Исполнитель</Form.Label>
        <Form.Control
          name="assignedUser"
          type="text"
          value={task.assignedUser}
          onChange={handleChange}
          isInvalid={!!errors.assignedUser}
          disabled={submitting}
          placeholder="Имя исполнителя"
        />
        <Form.Control.Feedback type="invalid">{errors.assignedEmployee}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="formStatus" className="mb-3">
        <Form.Label>Статус</Form.Label>
        <Form.Select
          name="status"
          value={task.status}
          onChange={handleChange}
          disabled={submitting}
        >
          <option value="NEW">Новая</option>
          <option value="IN_PROGRESS">В работе</option>
          <option value="TESTING">В тестировании</option>
          <option value="DONE">Выполнена</option>
        </Form.Select>
      </Form.Group>

      <Form.Group controlId="formPriority" className="mb-3">
        <Form.Label>Приоритет</Form.Label>
        <Form.Select
          name="priority"
          value={task.priority}
          onChange={handleChange}
          disabled={submitting}
        >
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
          disabled={submitting}
        />
      </Form.Group>

      <Button variant="primary" type="submit" disabled={submitting}>
        {submitting ? (
          <>
            <Spinner animation="border" size="sm" role="status" aria-hidden="true" /> Сохраняю...
          </>
        ) : (
          "Сохранить"
        )}
      </Button>
    </Form>
  );
};

export default TaskForm;
