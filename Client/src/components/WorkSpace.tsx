import React, { useState } from "react";
import Header from './Header';
import DynamicTabs from "./DynamicTabs";
import InviteModal from "./InviteModal"; // компонент из предыдущего примера
import type ModulesDTO from "../DTO/ModulesDTO";
import ApiRoute from "../api/ApiRoute";

const api = new ApiRoute();

interface WorkspaceProps {
  module: ModulesDTO;
  role: string | null; // роль пользователя, например "employee" или "manager"
}

const Workspace: React.FC<WorkspaceProps> = ({ module, role }) => {
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("jwtToken")||"";

  if (!module) {
    return <div>Модуль не выбран</div>;
  }

  const dataForTabs: Record<string, boolean> = {
    analytics: module.analytics,
    timeTracker: module.timeTracker,
    calendar: module.calendar,
    companyNews: module.companyNews,
    task_tracker_base: module.task_tracker_base,
  };

  const createInviteLink = async () => {
    setLoading(true);
    setError(null);
    setInviteLink(null);
    try {
      const response = await fetch(api.CreateUrlForRegUsers(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem("jwtToken"),
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при создании ссылки');
      }

      const link = await response.text();
      setInviteLink(link);
      setModalOpen(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Условный объект пропсов для Header в зависимости от роли
  const headerProps = role === "employee"
    ? {
        companyName: module.company.company,
        info: "Сотрудник",
        onCreateInviteLink: () => {}, // у сотрудников нет кнопки (можно отключить или не передавать)
        loading: false,
      }
    : {
        companyName: module.company.company,
        info: module.company.role,
        onCreateInviteLink: createInviteLink,
        loading,
      };

  return (
    <>
      <Header token={token} {...headerProps} />
      <DynamicTabs data={dataForTabs} projectHubId={module.id.toString()} />
      {error && <div style={{ color: 'red', padding: '10px 20px' }}>{error}</div>}

      {modalOpen && inviteLink && (
        <InviteModal link={inviteLink} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
};

export default Workspace;
