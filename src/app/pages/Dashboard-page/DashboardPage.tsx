import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { PageTitle } from "../../../_metronic/layout/core";
import { ToolbarWrapper } from "../../../_metronic/layout/components/toolbar";
import { Content } from "../../../_metronic/layout/components/content/Content";
import { DashboardAnalyticsType } from "../../types/dashboard";

import AnalyticsDashboard from "./analyticDashboardPage";
import { useAtom } from "jotai";
import { dashboardViewAtom } from "../../atoms/dashboard-atoms/dashboardAtom";
import MainDashboard from "./mainDashbaord";
import { GetDashboardAnalytics } from "../../config/ApiCalls";
import AnimatedRouteWrapper from "../../routing/AnimatedRouteWrapper.tsx";

const DashboardPage: FC = () => {
  const [currentView] = useAtom(dashboardViewAtom);
  const [data, setData] = useState<Partial<DashboardAnalyticsType>>({});

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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - var(--bs-app-header-height))",
      }}
    >
      <ToolbarWrapper source={"dashboard"} />
      <AnalyticsDashboard />
      {/* {currentView === "main" ? <MainDashboard /> : <AnalyticsDashboard />} */}
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
