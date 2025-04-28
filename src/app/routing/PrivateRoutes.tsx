import { lazy, FC, Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { MasterLayout } from "../../_metronic/layout/MasterLayout";
import TopBarProgress from "react-topbar-progress-indicator";
import { DashboardWrapper } from "../pages/Dashboard-pages/DashboardPage";
import { getCSSVariableValue } from "../../_metronic/assets/ts/_utils";
import { WithChildren } from "../../_metronic/helpers";
import TicketPageWrapper from "../pages/tickets-pages/TicketPageWrapper";
import TicketsDetailPage from "../pages/tickets-pages/TicketsDetailPage";
import { HyperCommandsWrapper } from "../pages/HyperCommands-pages/hyperCommandsPage";
import { SoftwareInstallationPage } from "../pages/HyperCommands-pages/softwareInstallationPage";
import { RemoteSSHPage } from "../pages/HyperCommands-pages/remoteSSHServicePage";
import { RemoteConsolePage } from "../pages/HyperCommands-pages/remoteConsolePage";
import { PerformanceMonitoringPage } from "../pages/HyperCommands-pages/performanceMonitoringPage";
import { AssetsPageWrapper } from "../pages/Assets-pages/assetsPage";
import { AssetDetailsPageWrapper } from "../pages/Assets-pages/assetDetailsPage";
import { AssetCreationPage } from "../pages/Assets-pages/AssetCreationPage";
import { RolesPageWrapper } from "../pages/user-management-pages/roles-page";
import { GroupsPageWrapper } from "../pages/user-management-pages/groups-page";
import { DepartmentsPageWrapper } from "../pages/user-management-pages/departments-page";
import { LocationsPageWrapper } from "../pages/user-management-pages/locations-page";
import { ComputerAliasesPageWrapper } from "../pages/user-management-pages/aliases-page";
import { UsersPageWrapper } from "../pages/user-management-pages/users-page";
import { FieldRulesPageWrapper } from "../pages/user-management-pages/field-rules";
import { SettingsPageWrapper } from "../pages/user-management-pages/settings-page";
import { ComputerDetailsPageWrapper } from "../pages/Assets-pages/computerDetailsPage";
import { SoftwareInstallationStaticPage } from "../pages/HyperCommands-pages/softwareInstallationStaticPage";
import { RemoteConsoleDashboardComponent } from "../pages/Dashboard-pages/remoteConsoleDashboard";

const PrivateRoutes = () => {
  const ProfilePage = lazy(() => import("../modules/profile/ProfilePage"));
  const WizardsPage = lazy(() => import("../modules/wizards/WizardsPage"));
  const AccountPage = lazy(() => import("../modules/accounts/AccountPage"));
  const WidgetsPage = lazy(() => import("../modules/widgets/WidgetsPage"));
  const ChatPage = lazy(() => import("../modules/apps/chat/ChatPage"));
  const UsersPage = lazy(
    () => import("../modules/apps/user-management/UsersPage")
  );

  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login/registartion */}
        <Route path="auth/*" element={<Navigate to="/dashboard" />} />
        {/* Pages */}
        <Route path="dashboard" element={<DashboardWrapper />} />

        <Route
          path="/dashboard/vnc/computer/:computerId/:computerIp"
          element={<RemoteConsoleDashboardComponent />}
        />

        <Route path="hyper-commands" element={<HyperCommandsWrapper />} />
        <Route
          path="hyper-commands/software-installation/:userId?"
          element={<SoftwareInstallationStaticPage />}
        />
        <Route path="hyper-commands/remote-ssh" element={<RemoteSSHPage />} />
        <Route
          path="hyper-commands/remote-console"
          element={<RemoteConsolePage />}
        />
        <Route
          path="hyper-commands/performance-monitoring"
          element={<PerformanceMonitoringPage />}
        />
        <Route path="/assets" element={<AssetsPageWrapper />} />
        <Route
          path="/assets/asset-details/:id/:hash"
          element={<AssetDetailsPageWrapper />}
        />
        <Route
          path="assets/asset-details/computer/:id"
          element={<ComputerDetailsPageWrapper />}
        />
        <Route path="assets/new" element={<AssetCreationPage />} />
        <Route path="tickets" element={<TicketPageWrapper />} />
        <Route path="/ticket/:id" element={<TicketsDetailPage />} />
        <Route path="/user-management/roles" element={<RolesPageWrapper />} />
        <Route path="/user-management/groups" element={<GroupsPageWrapper />} />
        <Route
          path="/user-management/departments"
          element={<DepartmentsPageWrapper />}
        />
        <Route
          path="/user-management/locations"
          element={<LocationsPageWrapper />}
        />
        <Route
          path="/user-management/aliases"
          element={<ComputerAliasesPageWrapper />}
        />
        <Route path="/user-management/users" element={<UsersPageWrapper />} />
        <Route
          path="/user-management/field-rules"
          element={<FieldRulesPageWrapper />}
        />
        <Route
          path="/user-management/settings"
          element={<SettingsPageWrapper />}
        />
        {/* 
        <Route path='menu-test' element={<MenuTestPage />} /> */}
        {/* Lazy Modules */}
        {/* <Route
          path='crafted/pages/profile/*'
          element={
            <SuspensedView>
              <ProfilePage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/pages/wizards/*'
          element={
            <SuspensedView>
              <WizardsPage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/widgets/*'
          element={
            <SuspensedView>
              <WidgetsPage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/account/*'
          element={
            <SuspensedView>
              <AccountPage />
            </SuspensedView>
          }
        />
        <Route
          path='apps/chat/*'
          element={
            <SuspensedView>
              <ChatPage />
            </SuspensedView>
          }
        />
        <Route
          path='apps/user-management/*'
          element={
            <SuspensedView>
              <UsersPage />
            </SuspensedView>
          }
        /> */}
        {/* Page Not Found */}
        <Route path="*" element={<Navigate to="/error/404" />} />
      </Route>
    </Routes>
  );
};

const SuspensedView: FC<WithChildren> = ({ children }) => {
  const baseColor = getCSSVariableValue("--bs-primary");
  TopBarProgress.config({
    barColors: {
      "0": baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  });
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>;
};

export { PrivateRoutes };
