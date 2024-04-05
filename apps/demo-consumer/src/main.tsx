import React from "react";
import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { AuthContextProvider } from "./components/AuthContext";
import { GlobalStyle } from "./components/GlobalStyle";
import Home from "./pages/Home";
import ZupassPopupRedirect from "./pages/popup";

const router = createHashRouter([
  { path: "popup", element: <ZupassPopupRedirect /> },
  { path: "/", element: <Home /> }
]);

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <GlobalStyle />
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  </React.StrictMode>
);
