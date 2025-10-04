import React from "react";
import { useParams } from "react-router-dom";

const Hub: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // получаем параметр id из URL

  // Преобразуйте id в число, если нужно
  const hubId = Number(id);

  return (
    <div>
      <h1>Детали хаба с ID: {hubId}</h1>
      {/* Здесь загружайте и отображайте данные выбранного хаба */}
    </div>
  );
};

export default Hub;
