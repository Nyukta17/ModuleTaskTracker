import React, { useState, useRef, useEffect } from "react";
import { Container, Row, Col, Button, Form, Card, Spinner } from "react-bootstrap";
import "./css/prioriti-tasks.css"

interface Sticker {
  id: number;
  text: string;
  x: number;
  y: number;
  isEditing: boolean;
  done: boolean;
}

const PrioritiTasks: React.FC = () => {
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [newText, setNewText] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const boardRef = useRef<HTMLDivElement | null>(null);

  const addSticker = () => {
    if (!newText.trim()) return;
    setStickers((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: newText,
        x: 20,
        y: 20,
        isEditing: false,
        done: false,
      },
    ]);
    setNewText("");
  };

  const deleteSticker = (id: number) => {
    setStickers((prev) => prev.filter((s) => s.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditingText("");
    }
  };

  const startEditing = (id: number) => {
    const sticker = stickers.find((s) => s.id === id);
    if (sticker) {
      setEditingId(id);
      setEditingText(sticker.text);
    }
  };

  const saveEditing = (id: number) => {
    setStickers((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, text: editingText, isEditing: false } : s
      )
    );
    setEditingId(null);
    setEditingText("");
  };

  const toggleDone = (id: number) => {
    setStickers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, done: !s.done } : s))
    );
  };

  const onDragStart = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    id: number,
    offsetX: number,
    offsetY: number
  ) => {
    e.preventDefault();
    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!boardRef.current) return;
      const rect = boardRef.current.getBoundingClientRect();
      let newX = moveEvent.clientX - rect.left - offsetX;
      let newY = moveEvent.clientY - rect.top - offsetY;
      newX = Math.max(0, Math.min(newX, rect.width - 220));
      newY = Math.max(0, Math.min(newY, rect.height - 200));
      setStickers((prev) =>
        prev.map((s) => (s.id === id ? { ...s, x: newX, y: newY } : s))
      );
    };
    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const AutoResizeTextarea: React.FC<{
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onBlur: () => void;
    autoFocus?: boolean;
  }> = ({ value, onChange, onBlur, autoFocus }) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
      }
    }, [value]);

    return (
      <Form.Control
        as="textarea"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        autoFocus={autoFocus}
        ref={textareaRef}
        style={{
          resize: "none",
          overflow: "hidden",
          width: "100%",
          boxSizing: "border-box",
          fontSize: 14,
        }}
        rows={1}
      />
    );
  };

  const handleSaveToServer = async () => {
    setSaving(true);
    setError(null);
    try {
      await fetch("/api/save-prioriti-tasks", {  // Поставьте свой URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stickers }),
      });
      alert("Данные сохранены");
    } catch (e) {
      setError("Ошибка сохранения данных");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container fluid>
      <Row className="mb-3 align-items-center">
        <Col xs={9} md={8}>
          <Form.Control
            type="text"
            placeholder="Новая задача..."
            value={newText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewText(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter") {
                addSticker();
                e.preventDefault();
              }
            }}
          />
        </Col>
        <Col xs={3} md={2}>
          <Button variant="primary" onClick={addSticker} className="w-100">
            Добавить
          </Button>
        </Col>
        <Col xs={12} md={2} className="d-flex justify-content-end">
          <Button variant="success" onClick={handleSaveToServer} disabled={saving}>
            {saving ? <Spinner animation="border" size="sm" /> : "Сохранить"}
          </Button>
        </Col>
      </Row>

      {error && (
        <Row className="mb-3">
          <Col>
            <div className="text-danger">{error}</div>
          </Col>
        </Row>
      )}

      <div className="prioriti-tasks-board" ref={boardRef}>
        {stickers.map(({ id, text, x, y, done }) => (
          <Card
            key={id}
            className={`prioriti-sticker${done ? " done" : ""}`}
            style={{
              left: x,
              top: y,
              position: "absolute",
              width: 220,
              minHeight: 80,
              maxWidth: 320,
              paddingTop: 25,
              cursor: editingId === id ? "text" : "grab",
            }}
            onMouseDown={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
              const target = e.target as HTMLElement;
              if (
                !target.closest(".prioriti-sticker-close") &&
                !target.closest("textarea") &&
                editingId !== id
              ) {
                const rect = e.currentTarget.getBoundingClientRect();
                const offsetX = e.clientX - rect.left;
                const offsetY = e.clientY - rect.top;
                onDragStart(e, id, offsetX, offsetY);
              }
            }}
          >
            <Button
              variant="light"
              size="sm"
              className="prioriti-sticker-close"
              onClick={() => deleteSticker(id)}
              aria-label="Удалить стикер"
            >
              ×
            </Button>
            <Card.Body className="d-flex flex-column p-2">
              {editingId === id ? (
                <AutoResizeTextarea
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onBlur={() => saveEditing(id)}
                  autoFocus
                />
              ) : (
                <>
                  <Card.Text
                    className="flex-grow-1"
                    style={{
                      whiteSpace: "pre-wrap",
                      textDecoration: done ? "line-through" : "none",
                      wordBreak: "break-word",
                      marginBottom: "1rem",
                    }}
                  >
                    {text}
                  </Card.Text>
                  <div className="d-flex flex-column">
                    <Button
                      variant={done ? "success" : "outline-success"}
                      size="sm"
                      className="mb-2"
                      onClick={() => toggleDone(id)}
                    >
                      {done ? "Выполнено" : "Отметить"}
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => startEditing(id)}
                    >
                      Редактировать
                    </Button>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        ))}
      </div>
    </Container>
  );
};

export default PrioritiTasks;
