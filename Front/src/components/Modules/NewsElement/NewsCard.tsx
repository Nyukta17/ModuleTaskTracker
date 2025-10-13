import React, { useState } from "react";
import { Button } from "react-bootstrap";
import "./NewsCardStyle.css";
import ApiRoute from "../../../api/ApiRoute";

interface NewsCardProps {
  id: number;
  title: string;
  content?: string;
  createdAt?: string;
  onDeleted: (id: number) => void;
  onUpdated: (id: number, newTitle: string, newContent: string) => void;
}

const MAX_PREVIEW_LENGTH = 150;
const api = new ApiRoute;
const NewsCard: React.FC<NewsCardProps> = ({
  id,
  title,
  content = "",
  createdAt,
  onDeleted,
  onUpdated,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editContent, setEditContent] = useState(content);
  const [error, setError] = useState<string | null>(null);

  const canExpand = content.length > MAX_PREVIEW_LENGTH;
  const displayContent =
    expanded || !canExpand ? content : content.slice(0, MAX_PREVIEW_LENGTH) + "...";

  const toggleExpand = () => {
    if (canExpand) {
      setExpanded(!expanded);
    }
  };
  
  const saveEdit = () => {
    const token = localStorage.getItem("jwtToken");
    fetch(api.updateNews(id), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ title: editTitle, content: editContent }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Ошибка ${res.status}: ${res.statusText}`);
        return res.json();
      })
      .then((updatedNews) => {
        onUpdated(id, editTitle, editContent);
        setEditing(false);
        setError(null);
      })
      .catch((e) => setError(e.message));
  };

  const deleteNews = () => {
    const token = localStorage.getItem("jwtToken");
    fetch(api.deleteNews(id), {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Ошибка ${res.status}: ${res.statusText}`);
        onDeleted(id);
      })
      .catch((e) => setError(e.message));
  };
  // Здесь можно добавить функции deleteNews и saveEdit с вызовом API

  return (
    <div className="news-card" onClick={toggleExpand} style={{ cursor: canExpand ? "pointer" : "default" }}>
      {editing ? (
        <>
          <input
            type="text"
            className="edit-input"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            autoFocus
          />
          <textarea
            className="edit-textarea"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={5}
          />
          <div className="buttons-row">
            <Button onClick={(e) => { e.stopPropagation();  saveEdit()  }}>Сохранить</Button>
            <Button onClick={(e) => { e.stopPropagation(); setEditing(false); setError(null); }}>Отмена</Button>
          </div>
          {error && <p className="error-message">{error}</p>}
        </>
      ) : (
        <>
          <h3>{title}</h3>
          <p>{displayContent}</p>
          {createdAt && <small>Дата: {new Date(createdAt).toLocaleString()}</small>}
          {canExpand && <div className="expand-toggle">{expanded ? "Свернуть" : "Читать далее"}</div>}
          <div style={{ position: "absolute", top: 16, right: 16 }}>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setEditing(true);
              }}
              style={{ marginRight: 8 }}
            >
              Изменить
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm("Удалить новость?")) {
                   deleteNews()
                }
              }}
            >
              Удалить
            </Button>
          </div>
          {error && <p className="error-message">{error}</p>}
        </>
      )}
    </div>
  );
};

export default NewsCard;
