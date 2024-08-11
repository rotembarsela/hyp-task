import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AppProvider } from "../context/AppProvider";
import PageLayout from "../components/PageLayout";

function Root() {
  return (
    <AppProvider>
      <div className="min-h-[100dvh] grid grid-rows-[auto_1fr_auto]">
        <Header />
        <PageLayout>
          <Outlet />
        </PageLayout>
        <Footer />
      </div>
    </AppProvider>
  );
}

export default Root;
