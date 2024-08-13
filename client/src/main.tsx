// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Root from "./routes/root";
import ErrorPage from "./error-page";
import Excels from "./routes/excels";
import UserSelection from "./routes/user-selection";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <UserSelection />,
      },
      {
        path: "excels",
        element: (
          <ProtectedRoute>
            <Excels />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

console.log("hello");
createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <RouterProvider router={router} />
  // </StrictMode>
);
