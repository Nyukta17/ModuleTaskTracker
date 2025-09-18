import React, { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";

type Task = {
  id?: number;
  title: string;
  description: string;
  assignedUser: string;
  status: "NEW" | "IN_PROGRESS" | "DONE";
};

const fakeApiCall = (task: Task) =>
  new Promise((resolve) => {
    setTimeout(() => {
      console.log("Fake API saved task:", task);
      resolve(task);
    }, 1000);
  });

const TaskForm: React.FC<{ initialTask?: Task; onSave?: () => void }> = ({
  initialTask,
  onSave,
}) => {
  const [task, setTask] = useState<Task>(
    initialTask || {
      title: "",
      description: "",
      assignedUser: "",
      status: "NEW",
    }
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validate = (): boolean => {
    const errs: { [key: string]: string } = {};
    if (!task.title.trim()) errs.title = "Название обязательно";
    if (!task.assignedUser.trim()) errs.assignedUser = "Исполнитель обязателен";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setTask({ ...task, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setSubmitSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSubmitSuccess(false);
    await fakeApiCall(task);
    setSubmitting(false);
    setSubmitSuccess(true);
    if (onSave) onSave();
  };

  return (
    <Form onSubmit={handleSubmit} noValidate>
      {submitSuccess && <Alert variant="success">Задача успешно сохранена!</Alert>}

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

      <Form.Group controlId="formAssignedUser" className="mb-3">
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
        <Form.Control.Feedback type="invalid">{errors.assignedUser}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="formStatus" className="mb-4">
        <Form.Label>Статус</Form.Label>
        <Form.Select
          name="status"
          value={task.status}
          onChange={handleChange}
          disabled={submitting}
        >
          <option value="NEW">Новая</option>
          <option value="IN_PROGRESS">В работе</option>
          <option value="DONE">Выполнена</option>
        </Form.Select>
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
