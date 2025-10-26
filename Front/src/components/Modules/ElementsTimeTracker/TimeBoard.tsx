import React, { useState, useRef, useEffect } from "react";
import "./css/timeboard.css";
import { Modal, Button } from "react-bootstrap";
import ApiRoute from "../../../api/ApiRoute";

interface Marker {
  id: number;
  startHour: number;
  durationHours: number;
  verticalOffset: number;
  title: string;
}

interface MyTasksProps {
  hubId: string;
}

const api = new ApiRoute();
const HOURS = Array.from({ length: 10 }, (_, i) => i + 8);

const TimeBoard: React.FC<MyTasksProps> = ({ hubId }) => {
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [resizeId, setResizeId] = useState<number | null>(null);
  const [dragId, setDragId] = useState<number | null>(null);
  const [dragStartPos, setDragStartPos] = useState<{ x: number; y: number } | null>(null);
  const [startWidth, setStartWidth] = useState<number>(0);
  const [startVerticalOffset, setStartVerticalOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);

  const [modalMarker, setModalMarker] = useState<Marker | null>(null);
  const [modalTitle, setModalTitle] = useState("");

  const boardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const response = await fetch(api.getMarkers(hubId), {
          headers: {
            Authorization: `Bearer ` + localStorage.getItem("jwtToken"),
            Accept: "application/json",
          },
        });
        if (response.ok) {
          const data: Marker[] = await response.json();
          setMarkers(data);
        } else {
          console.error("Ошибка загрузки маркеров:", response.statusText);
        }
      } catch (err) {
        console.error("Ошибка загрузки маркеров:", err);
      }
    };
    fetchMarkers();
  }, [hubId]);

  const computeVerticalOffset = (newMarker: Marker) => {
    const markerHeight = 50;
    const gap = 6;
    const overlappingMarkers = markers.filter((m) => {
      const mLeft = m.startHour;
      const mRight = m.startHour + m.durationHours;
      const newLeft = newMarker.startHour;
      const newRight = newMarker.startHour + newMarker.durationHours;
      return !(mRight <= newLeft || mLeft >= newRight);
    });
    let offset = 0;
    while (
      overlappingMarkers.some(
        (m) => Math.abs((m.verticalOffset || 0) - offset) < markerHeight + gap
      )
    ) {
      offset += markerHeight + gap;
    }
    return offset;
  };

  // Удаление одного маркера через API
  const deleteMarker = async (id: number) => {
    try {
      const response = await fetch(
        api.clearMarker(id), // подставьте URL удаления одного маркера, например `/api/timeboard/deleteMarker?id=${id}`
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ` + localStorage.getItem("jwtToken"),
          },
        }
      );
      if (response.ok) {
        setMarkers((prev) => prev.filter((marker) => marker.id !== id));
        setModalMarker(null);
      } else {
        console.error("Ошибка удаления маркера:", response.statusText);
      }
    } catch (err) {
      console.error("Ошибка удаления маркера:", err);
    }
  };

  // Удаление всех маркеров через API, отправляя список id
  const clearMarkersOnServer = async () => {
    try {
      const ids = markers.map((m) => m.id);
      const response = await fetch(
        api.clearMarkers(),
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ` + localStorage.getItem("jwtToken"),
          },
          body: JSON.stringify(ids),
        }
      );
      if (response.ok) {
        setMarkers([]);
      } else {
        console.error("Ошибка очистки маркеров:", response.statusText);
      }
    } catch (err) {
      console.error("Ошибка очистки маркеров:", err);
    }
  };

  const handleSaveToServer = async () => {
  try {
    const response = await fetch(api.saveTimeBoard(hubId), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("jwtToken"),
      },
      body: JSON.stringify(markers),
    });
    if (response.ok) {
      console.log("Маркиры успешно сохранены на сервере");
    } else {
      console.error("Ошибка при сохранении маркеров:", response.statusText);
    }
  } catch (error) {
    console.error("Ошибка при сохранении маркеров:", error);
  }
};


  // Остальной код (обработчики, рендер и т.д.) без изменений

  const onBoardClick = (e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      return;
    }
    if (!boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const boardWidth = rect.width;
    const columnWidth = boardWidth / HOURS.length;
    const hourClicked = Math.floor(clickX / columnWidth) + 8;

    let newMarker: Marker = {
      id: Date.now(),
      startHour: Math.min(Math.max(hourClicked, 8), 17),
      durationHours: 1,
      verticalOffset: 0,
      title: "Новая задача",
    };

    newMarker.verticalOffset = computeVerticalOffset(newMarker);

    setMarkers((prev) => [...prev, newMarker]);
  };

  const onResizeMouseDown = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setIsDragging(true);
    setResizeId(id);
    setDragStartPos({ x: e.clientX, y: e.clientY });
    const marker = markers.find((m) => m.id === id);
    setStartWidth(marker ? marker.durationHours : 0);
  };

  const onDragMouseDown = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setIsDragging(true);
    setDragId(id);
    setDragStartPos({ x: e.clientX, y: e.clientY });
    const marker = markers.find((m) => m.id === id);
    setStartVerticalOffset(marker ? marker.verticalOffset : 0);
    setStartWidth(marker ? marker.durationHours : 0);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    const board = boardRef.current;
    if (!board) return;
    const boardWidth = board.getBoundingClientRect().width;
    const columnWidth = boardWidth / HOURS.length;

    if (resizeId !== null && dragStartPos) {
      const deltaX = e.clientX - dragStartPos.x;
      let newDuration = Math.round(startWidth + deltaX / columnWidth);
      newDuration = Math.max(newDuration, 1);

      const marker = markers.find((m) => m.id === resizeId);
      if (!marker) return;

      if (marker.startHour + newDuration > 17) {
        newDuration = 17 - marker.startHour;
      }

      setMarkers((prev) =>
        prev.map((m) =>
          m.id === resizeId ? { ...m, durationHours: newDuration } : m
        )
      );
    } else if (dragId !== null && dragStartPos) {
      const deltaY = e.clientY - dragStartPos.y;
      let newOffset = startVerticalOffset + deltaY;
      newOffset = Math.max(0, newOffset);

      const marker = markers.find((m) => m.id === dragId);
      if (!marker) return;

      const overlappingMarkers = markers.filter((m) => {
        if (m.id === dragId) return false;
        const mLeft = m.startHour;
        const mRight = m.startHour + m.durationHours;
        const dragMarkerLeft = marker.startHour;
        const dragMarkerRight = marker.startHour + marker.durationHours;
        return !(mRight <= dragMarkerLeft || mLeft >= dragMarkerRight);
      });

      const markerHeight = 50;
      const gap = 6;
      while (
        overlappingMarkers.some(
          (m) => Math.abs((m.verticalOffset || 0) - newOffset) < markerHeight + gap
        )
      ) {
        newOffset += markerHeight + gap;
      }

      setMarkers((prev) =>
        prev.map((m) =>
          m.id === dragId ? { ...m, verticalOffset: newOffset } : m
        )
      );
    }
  };

  const onMouseUp = () => {
    setResizeId(null);
    setDragId(null);
    setDragStartPos(null);
    setTimeout(() => setIsDragging(false), 0);
  };

  const clearMarkers = () => {
    clearMarkersOnServer();
  };

  const openModal = (marker: Marker) => {
    setModalMarker(marker);
    setModalTitle(marker.title);
  };

  const handleModalSave = () => {
    if (modalMarker) {
      setMarkers((prev) =>
        prev.map((m) => (m.id === modalMarker.id ? { ...m, title: modalTitle } : m))
      );
      setModalMarker(null);
    }
  };

  const handleDeleteMarker = () => {
    if (modalMarker) {
      deleteMarker(modalMarker.id);
    }
  };

  return (
    <div className="timeboard-wrapper">
      <div className="timeboard-clear-button-container">
        <button className="timeboard-clear-button" onClick={clearMarkers}>
          Очистить
        </button>
        <button className="timeboard-save-button" onClick={handleSaveToServer}>
          Сохранить
        </button>
      </div>

      <div
        className="timeboard"
        ref={boardRef}
        onClick={onBoardClick}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      >
        <div className="timeboard-header">
          {HOURS.map((hour) => (
            <div key={hour} className="timeboard-column">
              {hour}:00
            </div>
          ))}
        </div>

        <div className="timeboard-panel">
          {markers.map((marker) => (
            <div
              key={marker.id}
              className={`timeboard-marker ${
                resizeId === marker.id || dragId === marker.id
                  ? "timeboard-marker-active"
                  : ""
              }`}
              style={{
                left: ((marker.startHour - 8) * 100) / HOURS.length + "%",
                width: (marker.durationHours * 100) / HOURS.length + "%",
                top: marker.verticalOffset,
              }}
              onMouseDown={(e) => onDragMouseDown(e, marker.id)}
            >
              <div className="timeboard-marker-text">
                {marker.title} ({marker.startHour}:00 - {marker.startHour + marker.durationHours}:00)
                <Button
                  className="details-button"
                  variant="dark"
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal(marker);
                  }}
                  title="Подробнее"
                  style={{ marginLeft: "6px", fontSize: "0.7em", padding: "2px 5px", cursor: "pointer" }}
                >
                  ⋯
                </Button>
              </div>
              <div
                className="timeboard-marker-resize-handle"
                onMouseDown={(e) => onResizeMouseDown(e, marker.id)}
              />
            </div>
          ))}
        </div>
      </div>

      <Modal show={!!modalMarker} onHide={() => setModalMarker(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Редактирование задачи</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            value={modalTitle}
            onChange={(e) => setModalTitle(e.target.value)}
            className="form-control"
            autoFocus
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDeleteMarker}>
            Удалить
          </Button>
          <Button variant="secondary" onClick={() => setModalMarker(null)}>
            Отмена
          </Button>
          <Button variant="primary" onClick={handleModalSave}>
            Сохранить
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TimeBoard;
