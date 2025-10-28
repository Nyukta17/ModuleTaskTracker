import React, { useEffect, useState } from "react";

interface NewsAnalyticsProps {
  hubId: number;
}

export const NewsAnalytics: React.FC<NewsAnalyticsProps> = ({ hubId }) => {
  const [newsCount, setNewsCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewsCount = async () => {
      setError(null);
      try {
        const response = await fetch(`http://localhost:8080/api/news/count?hubId=${hubId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken") || ""}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Ошибка запроса: ${response.statusText}`);
        }
        const data = await response.json();
        // Предполагается, что API вернёт объект вида { count: number }
        setNewsCount(data.count);
      } catch (e: any) {
        setError(e.message || "Ошибка при загрузке");
      }
    };

    fetchNewsCount();
  }, [hubId]);

  if (error) return <div>Ошибка: {error}</div>;
  if (newsCount === null) return <div>Загрузка данных...</div>;

  return (
    <div>
      <h4>Аналитика новостей</h4>
      <p>Количество новостей: {newsCount}</p>
    </div>
  );
};
