import React from "react";
import { EventsAnalytics } from "./AnaliticksElements/EventsAnalytics";
import { NewsAnalytics } from "./AnaliticksElements/NewsAnalyticsProps";

interface AnalyticsModuleProps {
  projectHubId: number;
}

const AnalyticsModuleComponent: React.FC<AnalyticsModuleProps> = ({ projectHubId }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px", // отступ между элементами
        padding: "20px", // внутренние отступы по бокам и сверху/снизу
      }}
    >
      <NewsAnalytics hubId={projectHubId} />
      <EventsAnalytics hubId={projectHubId} />
    </div>
  );
};

export default AnalyticsModuleComponent;
