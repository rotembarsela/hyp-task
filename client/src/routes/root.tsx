import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AppProvider } from "../context/AppProvider";

function Root() {
  return (
    <AppProvider>
      <div className="min-h-[100dvh] grid grid-rows-[auto_1fr_auto]">
        <Header />
        <main id="main">
          <Outlet />
        </main>
        <Footer />
      </div>
    </AppProvider>
  );
}

export default Root;
