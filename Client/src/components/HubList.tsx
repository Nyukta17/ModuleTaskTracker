import { useEffect, useState } from "react";
import ApiRoute from "../api/ApiRoute";
import ModulesDTO from "../DTO/ModulesDTO";
import CompanyDTO from "../DTO/CompanyDTO";

const api = new ApiRoute();

interface HubListProps {
  token: string;
  onSelectProject: (project: ModulesDTO) => void;
}

const Hublist: React.FC<HubListProps> = ({ token, onSelectProject }) => {
  const [projects, setProjects] = useState<ModulesDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(api.getCompanyModules(), {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка загрузки проектов");
        return res.json();
      })
      .then((data: any[]) => {
        const modules = data.map(createModuleFromJson);
        setProjects(modules);
        setLoading(false);
      })
      .catch((e: Error) => {
        setError(e.message);
        setLoading(false);
      });
  }, [token]);

  if (loading) return <p>Загрузка проектов...</p>;
  if (error) return <p>Ошибка: {error}</p>;
  if (!projects.length) return <p>Проекты не найдены.</p>;

  return (
    <div>
      <h2>Выберите проект</h2>
      <ul>
        {projects.map((proj) => (
          <li key={proj.id}>
            <button onClick={() => onSelectProject(proj)}>
              Проект {proj.company.company}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Hublist;


function createCompanyFromJson(json: any): CompanyDTO {
  return new CompanyDTO(
    json.id,
    json.email,
    json.password,
    json.company,
    json.role,
    json.createdAt
  );
}

function createModuleFromJson(json: any): ModulesDTO {
  return new ModulesDTO(
    json.id,
    createCompanyFromJson(json.company),
    json.analytics,
    json.timeTracker,
    json.calendar,
    json.companyNews,
    json.task_tracker_base
  );
}
