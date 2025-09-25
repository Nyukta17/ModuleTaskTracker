import { useEffect, useState } from "react";
import { Button, ListGroup, Spinner, Alert, Container, Row, Col } from "react-bootstrap";
import ApiRoute from "../api/ApiRoute";
import ModulesDTO from "../DTO/ModulesDTO";
import CompanyDTO from "../DTO/CompanyDTO";
import { useNavigate } from 'react-router-dom';

const api = new ApiRoute();

interface HubListProps {
  token: string;
  onSelectProject: (project: ModulesDTO) => void;
}

// Функция для декодирования payload JWT и извлечения роли
function getRoleFromToken(token: string): string | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    return payload.role || null;
  } catch {
    return null;
  }
}

const Hublist: React.FC<HubListProps> = ({ token, onSelectProject }) => {
  const [projects, setProjects] = useState<ModulesDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    
    const savedRole = localStorage.getItem('userRole');
    if (savedRole) {
      setRole(savedRole);
    } else {
      
      const decodedRole = getRoleFromToken(token);
      if (decodedRole) {
        localStorage.setItem('userRole', decodedRole);
        setRole(decodedRole);
      } else {
        setRole(null);
      }
    }

    setLoading(true);
    setError(null);
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

  if (loading)
    return (
      <Container className="text-center mt-3">
        <Spinner animation="border" role="status" />
        <p>Загрузка проектов...</p>
      </Container>
    );

  if (error)
    return (
      <Container className="mt-3">
        <Alert variant="danger">Ошибка: {error}</Alert>
      </Container>
    );

  if (!projects.length)
    return (
      <Container className="mt-3">
        <Alert variant="warning">Проекты не найдены.</Alert>
      </Container>
    );

  if (role === "Boss") {
    return (
      <Container className="mt-3">
        <h2>Проекты</h2>
        
        <Row className="justify-content-center">
          <Col md={6} lg={5} className="text-center">
            <ListGroup>
              {projects.map(proj => (
                <ListGroup.Item
                  key={proj.id}
                  className="d-flex justify-content-between align-items-center"
                >
                  <div>Проект {proj.company.company}</div>
                  <Button variant="primary" size="sm" onClick={() => onSelectProject(proj)}>
                    Выбрать
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <Button
              variant="success"
              size="lg"
              className="my-3"
              onClick={() => navigate("/create-project")}
              title="Создать новый проект"
            >
              +
            </Button>
          </Col>
        </Row>
      </Container>
    );
  } else if (role === "employee") {
    return (
      <Container className="mt-3">
        <h2>Проекты</h2>
       
        <Row className="justify-content-center">
          <Col md={6} lg={5} className="text-center">
            <ListGroup>
              {projects.map(proj => (
                <ListGroup.Item
                  key={proj.id}
                  className="d-flex justify-content-between align-items-center"
                >
                  <div>Проект {proj.company.company}</div>
                  <Button variant="primary" size="sm" onClick={() => onSelectProject(proj)}>
                    Выбрать
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        </Row>
      </Container>
    );
  } else {
    
    return (
      <Container className="mt-3">
        <Alert variant="warning">Нет доступа к панели: роль не распознана</Alert>
      </Container>
    );
  }
};

export default Hublist;

function createCompanyFromJson(json: any): CompanyDTO {
  return new CompanyDTO(json.id, json.email, json.password, json.company, json.role, json.createdAt);
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
