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
    <>
      <ToolbarWrapper source={"dashboard"} />

      {currentView === "main" ? (
        <>
          <MainDashboard />
          {/* <StatisticsList data={data} /> */}
        </>
      ) : (
        <AnalyticsDashboard />
      )}
    </>
  );
};

const DashboardWrapper: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.DASHBOARD" })}
      </PageTitle>
      <DashboardPage />
    </>
  );
};

export { DashboardWrapper };

//   return (
//     <Content>
//       <ItsmToolbar
//         branches={branchesOption}
//         users={usersOption}
//         setSelectedBranch={setSelectedBranch}
//         setSelectedUser={setSelectedUser}
//         setSearchString={setSearchString}
//       />

//       <StatisticsList data={data} />
//     </Content>
//   );
// };
