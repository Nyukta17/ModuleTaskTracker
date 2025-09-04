import React from "react";
import Header from './Header';
import DynamicTabs from "./DynamicTabs";
import type ModulesDTO from "../DTO/ModulesDTO";

interface WorkspaceProps {
  module: ModulesDTO;
}

const Workspace: React.FC<WorkspaceProps> = ({ module }) => {
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

  return (
    <>
      <Header companyName={module.company.company} info={module.company.role} />
      <DynamicTabs data={dataForTabs} />
    </>
  );
};

export default Workspace;
