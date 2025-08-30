import { useEffect, useState } from "react";
import ApiRoute from "../api/ApiRoute";
import type ModulesDTO from "../DTO/ModulesDTO";
import Header from './Header'
import DynamicTabs from "./DynamicTabs";

const api = new ApiRoute;

const MainMenu = () => {
  const [data, setData] = useState<ModulesDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    async function getModules() {
      try {
        const response = await fetch(api.getCompanyModules(), {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Ошибка загрузки данных");
        const json = await response.json();
        setData(json);
        console.log(json)
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Неизвестная ошибка");
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
      <Header companyName={data!.company.company}info={data?.company.role}></Header>
      {data && <DynamicTabs data={data}/>}
    </>
  );
};


export default MainMenu;