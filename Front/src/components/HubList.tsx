import React, { useEffect, useState } from "react";
import { Button, Form, ListGroup, Spinner, Alert, Container, Row, Col } from "react-bootstrap";

interface Project {
  id: number;
  name: string;
  description?: string;
}

interface Module {
  id: number;
  name: string;
}

interface HubListProps {
  role: "ADMIN" | "USER";
  companyId: number;
}

const HubList: React.FC<HubListProps> = ({ role, companyId }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [errorProjects, setErrorProjects] = useState<string | null>(null);
  const [newProjectName, setNewProjectName] = useState("");

  const [modules, setModules] = useState<Module[]>([]);
  const [loadingModules, setLoadingModules] = useState(false);
  const [errorModules, setErrorModules] = useState<string | null>(null);
  const [newModuleName, setNewModuleName] = useState("");

  // Загрузка проектов по компании
  const fetchProjects = async () => {
    setLoadingProjects(true);
    setErrorProjects(null);
    try {
      const response = await fetch(`/api/projects/company/${companyId}`);
      if (!response.ok) throw new Error("Ошибка загрузки проектов");
      const data = await response.json();
      setProjects(data);
      // Если ранее выбранного проекта нет, выбрать первый автоматически
      if(data.length > 0) setSelectedProject(data[0]);
    } catch (err: any) {
      setErrorProjects(err.message || "Неизвестная ошибка");
    } finally {
      setLoadingProjects(false);
    }
  };

  // Загрузка модулей выбранного проекта
  const fetchModules = async (projectId: number) => {
    setLoadingModules(true);
    setErrorModules(null);
    try {
      const response = await fetch(`/api/modules/project/${projectId}`);
      if (!response.ok) throw new Error("Ошибка загрузки модулей");
      const data = await response.json();
      setModules(data);
    } catch (err: any) {
      setErrorModules(err.message || "Неизвестная ошибка");
    } finally {
      setLoadingModules(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [companyId]);

  // При смене выбранного проекта подгружаем его модули
  useEffect(() => {
    if (selectedProject) {
      fetchModules(selectedProject.id);
    } else {
      setModules([]);
    }
  }, [selectedProject]);

  // Создание нового проекта
  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newProjectName.trim(), companyId }),
      });
      if (!response.ok) throw new Error("Ошибка при создании проекта");
      const created: Project = await response.json();
      setProjects((prev) => [...prev, created]);
      setNewProjectName("");
      setSelectedProject(created);
    } catch (err: any) {
      setErrorProjects(err.message || "Неизвестная ошибка");
    }
  };

  // Создание нового модуля
  const handleCreateModule = async () => {
    if (!selectedProject || !newModuleName.trim()) return;
    try {
      const response = await fetch("/api/modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newModuleName.trim(), projectId: selectedProject.id }),
      });
      if(!response.ok) throw new Error("Ошибка при создании модуля");
      const created: Module = await response.json();
      setModules((prev) => [...prev, created]);
      setNewModuleName("");
    } catch (err: any) {
      setErrorModules(err.message || "Неизвестная ошибка");
    }
  };

  return (
    <Container>
      <h2>Проекты</h2>
      {loadingProjects && <Spinner animation="border" />}
      {errorProjects && <Alert variant="danger">{errorProjects}</Alert>}

      <ListGroup className="mb-3">
        {projects.map((project) => (
          <ListGroup.Item
            key={project.id}
            active={selectedProject?.id === project.id}
            onClick={() => setSelectedProject(project)}
            style={{ cursor: "pointer" }}
          >
            {project.name} {project.description && <small className="text-muted">- {project.description}</small>}
          </ListGroup.Item>
        ))}
      </ListGroup>

      {role === "ADMIN" && (
        <Form onSubmit={e => { e.preventDefault(); handleCreateProject(); }}>
          <Row className="align-items-center mb-4">
            <Col xs="auto">
              <Form.Control
                type="text"
                placeholder="Название проекта"
                value={newProjectName}
                onChange={e => setNewProjectName(e.target.value)}
              />
            </Col>
            <Col xs="auto">
              <Button type="submit">Создать проект</Button>
            </Col>
          </Row>
        </Form>
      )}

      <h2>Модули проекта: {selectedProject?.name || "не выбран"}</h2>
      {loadingModules && <Spinner animation="border" />}
      {errorModules && <Alert variant="danger">{errorModules}</Alert>}

      <ListGroup className="mb-3">
        {modules.map((mod) => (
          <ListGroup.Item key={mod.id}>{mod.name}</ListGroup.Item>
        ))}
      </ListGroup>

      {role === "ADMIN" && selectedProject && (
        <Form onSubmit={e => { e.preventDefault(); handleCreateModule(); }}>
          <Row className="align-items-center">
            <Col xs="auto">
              <Form.Control
                type="text"
                placeholder="Название модуля"
                value={newModuleName}
                onChange={e => setNewModuleName(e.target.value)}
              />
            </Col>
            <Col xs="auto">
              <Button type="submit">Создать модуль</Button>
            </Col>
          </Row>
        </Form>
      )}
    </Container>
  );
};


export default HubList;
