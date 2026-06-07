import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Home from "./pages/Home";
import DayPickerPage from "./pages/DayPickerPage";
import DayReadingPage from "./pages/DayReadingPage";
import PerekListPage from "./pages/PerekListPage";
import PerekReadingPage from "./pages/PerekReadingPage";
import FavoritesPage from "./pages/FavoritesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/week" element={<DayPickerPage cycle="week" />} />
            <Route path="/week/:day" element={<DayReadingPage cycle="week" />} />
            <Route path="/month" element={<DayPickerPage cycle="month" />} />
            <Route path="/month/:day" element={<DayReadingPage cycle="month" />} />
            <Route path="/perek" element={<PerekListPage />} />
            <Route path="/perek/:n" element={<PerekReadingPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
