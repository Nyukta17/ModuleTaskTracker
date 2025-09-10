import React, { useState } from "react";
import { Button } from "react-bootstrap";

interface NewsCardProps {
  id: number;
  title: string;
  content: string;
  createdAt?: string;
  onDeleted: (id: number) => void;  // callback при удалении
  onUpdated: (id: number, newTitle: string, newContent: string) => void; // callback при обновлении
}

const MAX_PREVIEW_LENGTH = 150;

const NewsCard: React.FC<NewsCardProps> = ({
  id,
  title,
  content,
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
    expanded || !canExpand
      ? content
      : content.slice(0, MAX_PREVIEW_LENGTH) + "...";

  const toggleExpand = () => {
    if (canExpand) {
      setExpanded(!expanded);
    }
  };

  const apiBaseUrl = "http://localhost:8080/news"; 

  const deleteNews = () => {
    const token = localStorage.getItem("jwtToken");
    fetch(`${apiBaseUrl}/deleteNews/${id}`, {
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

  const saveEdit = () => {
    const token = localStorage.getItem("jwtToken");
    fetch(`${apiBaseUrl}/changeNews/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ title: editTitle, content: editContent }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Ошибка ${res.status}: ${res.statusText}`);
        onUpdated(id, editTitle, editContent); 
        setEditing(false);
        setError(null);
      })
      .catch((e) => setError(e.message));
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1200px",
        margin: "10px auto",
        padding: "16px",
        borderRadius: "8px",
        boxSizing: "border-box",
        cursor: canExpand ? "pointer" : "default",
        border: "1px solid transparent",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        transition: "border-color 0.3s ease",
        overflowWrap: "break-word",
        whiteSpace: "normal",
        position: "relative",
      }}
      onClick={toggleExpand}
      onMouseEnter={(e) => {
        if (canExpand) e.currentTarget.style.borderColor = "#007BFF";
      }}
      onMouseLeave={(e) => {
        if (canExpand) e.currentTarget.style.borderColor = "transparent";
      }}
    >
      {editing ? (
        <>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            style={{ width: "100%", marginBottom: 8 }}
            autoFocus
          />
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={5}
            style={{ width: "100%" }}
          />
          <div style={{ marginTop: 8 }}>
            <Button onClick={(e) => { e.stopPropagation(); saveEdit(); }}>Сохранить</Button>
            <Button onClick={(e) => { e.stopPropagation(); setEditing(false); setError(null); }}>Отмена</Button>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </>
      ) : (
        <>
          <h3 style={{ marginTop: 0 }}>{title}</h3>
          <p style={{ marginBottom: "8px" }}>{displayContent}</p>
          {createdAt && <small>Дата: {new Date(createdAt).toLocaleString()}</small>}
          {canExpand && (
            <div style={{ color: "#007BFF", marginTop: 10, fontWeight: "bold" }}>
              {expanded ? "Свернуть" : "Читать далее"}
            </div>
          )}
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
                  deleteNews();
                }
              }}
            >
              Удалить
            </Button>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </>
      )}
    </div>
  );
};

export default NewsCard;
