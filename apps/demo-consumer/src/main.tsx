import React from "react";
import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { AuthContextProvider } from "./components/AuthContext";
import { GlobalStyle } from "./components/GlobalStyle";
import { PCDForm } from "./components/PCDForm";
import { Auth } from "./pages/Auth";
import Home from "./pages/Home";
import ZupassPopupRedirect from "./pages/popup";

const router = createHashRouter([
  { path: "popup", element: <ZupassPopupRedirect /> },
  { path: "/", element: <Home /> },
  { path: "/pod", element: <PCDForm /> },
  { path: "/auth", element: <Auth /> }
]);

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <GlobalStyle />
    <AuthContextProvider>
      <div className="App">
        <div className="ellipse grid-center" />
        <div className="form-container grid-center">
          <RouterProvider router={router} />
        </div>
      </div>
    </AuthContextProvider>
  </React.StrictMode>
);
