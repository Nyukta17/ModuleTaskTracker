import { useEffect, useState } from "react";
import { Button, ListGroup, Spinner, Alert, Container, Row, Col } from "react-bootstrap";
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

  return (
    <Container className="mt-3">
      <Row>
        <Col>
          <h2>Выберите проект</h2>
          <ListGroup>
            {projects.map((proj) => (
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
