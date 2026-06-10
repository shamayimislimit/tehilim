import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { AuthProvider } from "@/context/auth";
import { InstanceRoute } from "@/context/instance";
import Home from "./pages/Home";
import DayPickerPage from "./pages/DayPickerPage";
import DayReadingPage from "./pages/DayReadingPage";
import PerekListPage from "./pages/PerekListPage";
import PerekReadingPage from "./pages/PerekReadingPage";
import FavoritesPage from "./pages/FavoritesPage";
import FavoritesReadingPage from "./pages/FavoritesReadingPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

/**
 * The feature routes, identical for every instance. Rendered twice below: once
 * at the root (default instance) and once under `:instance`. React Router ranks
 * the static segments (week/month/perek/favorites) above the dynamic
 * `:instance`, so `/week` hits the default instance while `/papy-jacky` is read
 * as a slug — no manual collision handling needed.
 */
const instanceRoutes = () => (
  <Route element={<Layout />}>
    <Route index element={<Home />} />
    <Route path="week" element={<DayPickerPage cycle="week" />} />
    <Route path="week/:day" element={<DayReadingPage cycle="week" />} />
    <Route path="month" element={<DayPickerPage cycle="month" />} />
    <Route path="month/:day" element={<DayReadingPage cycle="month" />} />
    <Route path="perek" element={<PerekListPage />} />
    <Route path="perek/:n" element={<PerekReadingPage />} />
    <Route path="favorites" element={<FavoritesPage />} />
    <Route path="favorites/:n" element={<FavoritesReadingPage />} />
  </Route>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <ScrollToTop />
        <Routes>
          {/* Default instance, served at the root */}
          <Route element={<InstanceRoute />}>{instanceRoutes()}</Route>
          {/* Named instances: /:instance/... */}
          <Route path=":instance" element={<InstanceRoute />}>
            {instanceRoutes()}
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
