import { useLayout } from "../../../core";
import { PageTitleDashboard } from "./PageTitleDashboard";

const PageTitleWrapperDashboard = () => {
  const { config } = useLayout();
  if (!config.app?.pageTitle?.display) {
    return null;
  }

  return <PageTitleDashboard />;
};

export { PageTitleWrapperDashboard };
