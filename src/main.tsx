import { createRoot } from "react-dom/client";
// Axios
import axios from "axios";
import { Chart, registerables } from "chart.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// Apps
import { MetronicI18nProvider } from "./_metronic/i18n/Metronici18n";
import "./_metronic/assets/sass/style.react.scss";
import "./_metronic/assets/fonticon/fonticon.css";
import "./_metronic/assets/keenicons/duotone/style.css";
import "./_metronic/assets/keenicons/outline/style.css";
import "./_metronic/assets/keenicons/solid/style.css";
import "./_metronic/assets/sass/style.scss";
import { AppRoutes } from "./app/routing/AppRoutes";
import { BrowserRouter } from "react-router-dom";
import { createStore, Provider as JotaiProvider } from "jotai";
import { DevTools } from "jotai-devtools";
import 'jotai-devtools/styles.css'
import '@fortawesome/fontawesome-free/css/all.min.css';

/**
 * Creates `axios-mock-adapter` instance for provided `axios` instance, add
 * basic Metronic mocks and returns it.
 *
 * @see https://github.com/ctimmerm/axios-mock-adapter
 */
/**
 * Inject Metronic interceptors for axios.
 *
 * @see https://github.com/axios/axios#interceptors
 */
// setupAxios(axios);
Chart.register(...registerables);

const queryClient = new QueryClient();
const container = document.getElementById("root");
const customStore = createStore();
if (container) {
  createRoot(container).render(
    <QueryClientProvider client={queryClient}>
      <MetronicI18nProvider>
        <JotaiProvider store={customStore}>
          {process.env.NODE_ENV === "development" && (
            <DevTools store={customStore} />
          )}
          <AppRoutes />
        </JotaiProvider>
      </MetronicI18nProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
