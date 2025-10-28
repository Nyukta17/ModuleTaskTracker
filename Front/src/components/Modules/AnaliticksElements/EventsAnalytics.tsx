import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import type { PieLabelRenderProps } from "recharts";

interface TasksData {
  new: number;
  inProgress: number;
  testing: number;
  completed: number;
}

interface EventsAnalyticsProps {
  hubId: number;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export const EventsAnalytics: React.FC<EventsAnalyticsProps> = ({ hubId }) => {
  const [tasksData, setTasksData] = useState<TasksData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("jwtToken") || "";
        const response = await fetch("http://localhost:8080/api/task/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ hubId }),
        });

        if (!response.ok) {
          throw new Error(`Ошибка: ${response.statusText}`);
        }

        const data = await response.json();
        setTasksData({
          new: data.NEW || 0,
          inProgress: data.IN_PROGRESS || 0,
          testing: data.TESTING || 0,
          completed: data.COMPLETED || 0,
        });
      } catch (err: any) {
        setError(err.message || "Ошибка запроса");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [hubId]);

  if (loading) return <div>Загрузка данных...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  if (!tasksData) return <div>Нет данных</div>;

  const chartData = [
    { name: "Новые", value: tasksData.new },
    { name: "В работе", value: tasksData.inProgress },
    { name: "В тестировании", value: tasksData.testing },
    { name: "Выполнены", value: tasksData.completed },
  ];

  return (
    <div>
      <h4>Аналитика задач для хаба {hubId}</h4>
      <PieChart width={400} height={300}>
        <Pie
          data={chartData}
          cx={200}
          cy={150}
          labelLine={false}
          label={({ name, percent }: PieLabelRenderProps) => {
            const safePercent = typeof percent === "number" ? percent : 0;
            return `${name} ${(safePercent * 100).toFixed(0)}%`;
          }}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};
