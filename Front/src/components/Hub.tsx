import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ApiRoute from "../api/ApiRoute";

interface Module {
  id: number;
  name: string;
  // остальные поля модуля
}
const api = new ApiRoute;
const Hub: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const hubId = Number(id);

  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModules = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("jwtToken");
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const response = await fetch(api.getModuleForHub(hubId), {
          method: "GET",
          headers,
        });
        if (!response.ok) {
          throw new Error(`Ошибка загрузки: ${response.statusText}`);
        }
        const data = await response.json();
        setModules(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [hubId]); // если хотите подгружать модули при смене hubId

  return (
    <div>
      <h1>Детали хаба с ID: {hubId}</h1>
      {loading && <p>Загрузка модулей...</p>}
      {error && <p>Ошибка: {error}</p>}
      {!loading && !error && (
        <ul>
          {modules.map((mod) => (
            <li key={mod.id}>{mod.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Hub;
