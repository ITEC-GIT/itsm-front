import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { PageTitle } from "../../../_metronic/layout/core";
import { ToolbarWrapper } from "../../../_metronic/layout/components/toolbar";
import { Content } from "../../../_metronic/layout/components/content/Content";
import { DashboardAnalyticsType } from "../../types/dashboard";

import AnalyticsDashboard from "./analyticDashboardPage";
import { useAtom } from "jotai";
import {
  dashboardViewAtom,
  selectedComputerDashboardAtom,
} from "../../atoms/dashboard-atoms/dashboardAtom";
import MainDashboard from "./mainDashbaord";
import { GetDashboardAnalytics } from "../../config/ApiCalls";
import AnimatedRouteWrapper from "../../routing/AnimatedRouteWrapper.tsx";
import { DashboardLanding } from "../../components/dashboard/landingComponent.tsx";

const DashboardPage: FC = () => {
  const [currentView] = useAtom(dashboardViewAtom);
  const [data, setData] = useState<Partial<DashboardAnalyticsType>>({});
  const [selectedDeviceAtom] = useAtom<number | undefined>(
    selectedComputerDashboardAtom
  );

  const fetchStatisticData = async () => {
    const res = await GetDashboardAnalytics();

    if (res.status === 200) {
      setData(res.data.Statistics);
    } else {
      //add loading
      return;
    }
  };

  useEffect(() => {
    fetchStatisticData();
  }, []);

  useEffect(() => {
    if (currentView === "main" && selectedDeviceAtom !== undefined) {
    }
  }, [currentView, selectedDeviceAtom]);

  return (
    <div
      className="d-flex flex-column"
      style={{
        height: "calc(100vh - var(--bs-app-header-height))",
      }}
    >
      <ToolbarWrapper source={"dashboard"} />
      {currentView === "main" ? (
        selectedDeviceAtom === undefined ? (
          <DashboardLanding />
        ) : (
          <MainDashboard />
        )
      ) : (
        <AnalyticsDashboard />
      )}
    </div>
  );
};

const DashboardWrapper: FC = () => {
  const intl = useIntl();
  return (
    <>
      <AnimatedRouteWrapper>
        <PageTitle breadcrumbs={[]}>
          {intl.formatMessage({ id: "MENU.DASHBOARD" })}
        </PageTitle>
        <DashboardPage />
      </AnimatedRouteWrapper>
    </>
  );
};

export { DashboardWrapper };
