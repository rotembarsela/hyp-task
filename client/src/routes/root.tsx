import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AppProvider } from "../context/AppProvider";
import PageLayout from "../components/PageLayout";
import { ToastProvider } from "../context/ToastProvider";

function Root() {
  return (
    <AppProvider>
      <ToastProvider>
        <div className="min-h-[100dvh] grid grid-rows-[auto_1fr_auto]">
          <Header />
          <PageLayout>
            <Outlet />
          </PageLayout>
          <Footer />
        </div>
      </ToastProvider>
    </AppProvider>
  );
}

export default Root;
