import React, { useState, useEffect } from "react";
import NewsCard from "./NewsElement/NewsCard";
import { Button } from "react-bootstrap";

const NewsModuleComponent: React.FC = () => {
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

    // Здесь запрос на получение новостей, заполните свой API
    fetch("/api/news", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // "Authorization": "Bearer " + localStorage.getItem("jwtToken"), // если нужно
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
    fetchNews();
  }, []);

  const handleAddNews = () => {
    setFormError(null);

    // Тут соберите объект для отправки на сервер
    const dto = { title, content };

    // Запрос на добавление новости, заполните свой API
    fetch("/api/news", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "Authorization": "Bearer " + localStorage.getItem("jwtToken"),
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

  if (loading) return <p>Загрузка новостей...</p>;
  if (error) return <p style={{ color: "red" }}>Ошибка: {error}</p>;
  if (!data || data.length === 0) {
    return (
      <>
        <h1>Новостей пока нет</h1>
        <Button onClick={() => setShowForm(true)}>Добавить новость</Button>
        {showForm && (
          <div>
            <input
              placeholder="Заголовок"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Текст новости"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <Button onClick={handleAddNews}>Сохранить</Button>
            <Button onClick={() => setShowForm(false)}>Отмена</Button>
            {formError && <p style={{ color: "red" }}>{formError}</p>}
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <Button onClick={() => setShowForm(true)}>Добавить новость</Button>
      {showForm && (
        <div>
          <input
            placeholder="Заголовок"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Текст новости"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button onClick={handleAddNews}>Сохранить</Button>
          <Button onClick={() => setShowForm(false)}>Отмена</Button>
          {formError && <p style={{ color: "red" }}>{formError}</p>}
        </div>
      )}
      <div>
        {data.map((news) => (
          <NewsCard
            key={news.id}
            id={news.id}
            title={news.title}
            content={news.content}
            createdAt={news.created_at}
            onDeleted={handleDelete}
            onUpdated={handleUpdate}
          />
        ))}
      </div>
    </>
  );
};

export default NewsModuleComponent;
