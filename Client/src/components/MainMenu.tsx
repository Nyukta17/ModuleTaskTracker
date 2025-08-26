import { useEffect, useState } from "react";
import ApiRoute from "../api/ApiRoute";


const api = new ApiRoute;

const MainMenu = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const token = localStorage.getItem("jwtToken");

    useEffect(() => {
        async function getModules() {
            try {
                const response = await fetch(api.getCompanyModules(),{
                    headers:{
                        "Authorization": `Bearer ${token}`,
                        "Content-Type":"application/json",
                    }
                });
                if (!response.ok) throw new Error('Ошибка загрузки данных');
                const json = await response.json();
                setData(json);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Неизвестная ошибка');
                }
            } finally {
                setLoading(false);
            }
        }

        getModules();
    }, []);

    if (loading) return <div>Загрузка данных...</div>;
    if (error) return <div>Ошибка: {error}</div>;
    return (
    <>
      <h1>Ты в основном меню</h1>
      {data && (
        <div>
          <h2>Company Info:</h2>
          <p>ID: {data.id}</p>
          <p>Company ID: {data.company?.id}</p>
          <p>Email: {data.company?.email}</p>
          <p>Company Name: {data.company?.company}</p>
          <p>Role: {data.company?.role}</p>
          <p>Created At: {data.company?.createdAt}</p>

          <h2>Features:</h2>
          <p>Analytics: {data.analytics ? "Да" : "Нет"}</p>
          <p>Time Tracker: {data.timeTracker ? "Да" : "Нет"}</p>
          <p>Calendar: {data.calendar ? "Да" : "Нет"}</p>
          <p>Company News: {data.companyNews ? "Да" : "Нет"}</p>
        </div>
      )}
    </>
  );
}

export default MainMenu;