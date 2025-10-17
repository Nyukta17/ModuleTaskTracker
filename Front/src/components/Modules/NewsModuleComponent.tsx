import React, { useState, useEffect } from "react";
import NewsCard from "./NewsElement/NewsCard";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import ApiRoute from "../../api/ApiRoute";

const api = new ApiRoute();

interface NewsModuleComponentProps {
  projectHubId: string;
}

const NewsModuleComponent: React.FC<NewsModuleComponentProps> = ({ projectHubId }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const fetchNews = () => {
    setLoading(true);
    setError(null);

    fetch(api.getAllNewsCompany() + `?hubId=${projectHubId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwtToken"),
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Ошибка ${res.status}`);
        return res.json();
      })
      .then((data) => setData(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (projectHubId) {
      fetchNews();
    }
  }, [projectHubId]);

  const handleAddNews = () => {
    setFormError(null);

    if (!title.trim()) {
      setFormError("Заголовок обязателен");
      return;
    }
    if (!content.trim()) {
      setFormError("Текст новости обязателен");
      return;
    }

    const dto = {
      title,
      content,
      hubId: projectHubId,
    };

    fetch(api.createNewsCompany(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwtToken"),
      },
      body: JSON.stringify(dto),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Ошибка ${res.status}`);
        return res.text();
      })
      .then(() => {
        setTitle("");
        setContent("");
        setShowForm(false);
        fetchNews();
      })
      .catch((err) => setFormError(err.message));
  };

  const handleDelete = (id: number) => {
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdate = (id: number, newTitle: string, newContent: string) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, title: newTitle, content: newContent } : item
      )
    );
  };

  return (
    <>
      {loading && <p>Загрузка новостей...</p>}
      {error && <p style={{ color: "red" }}>Ошибка: {error}</p>}

      <Button onClick={() => setShowForm(true)} className="mb-3">
        Добавить новость
      </Button>

      <Modal show={showForm} onHide={() => setShowForm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Добавить новость</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formError && <Alert variant="danger">{formError}</Alert>}
          <Form>
            <Form.Group controlId="newsTitle" className="mb-3">
              <Form.Label>Заголовок</Form.Label>
              <Form.Control
                type="text"
                placeholder="Введите заголовок"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowForm(false)}>
            Отмена
          </Button>
          <Button variant="primary" onClick={handleAddNews}>
            Сохранить
          </Button>
        </Modal.Footer>
      </Modal>

      {!loading && !error && data.length === 0 && <h1>Новостей пока нет</h1>}

      {data.map((news) => (
        <NewsCard
          key={news.id}
          id={news.id}
          title={news.title}
          content={news.content ?? ""}
          createdAt={news.createdAt || news.created_at}
          onDeleted={handleDelete}
          onUpdated={handleUpdate}
        />
      ))}
    </>
  );
};

export default NewsModuleComponent;
