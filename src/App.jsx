import React from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { appConfigRoutes } from "./config/routes/appConfigRoutes.jsx";
import { AlertProvider } from "./shared/components/Alert.jsx";

function AppRoutes() {
  return useRoutes(appConfigRoutes);
}

export default function App() {
  return (
    <BrowserRouter>
      <AlertProvider>
        <AppRoutes />
      </AlertProvider>
    </BrowserRouter>
  );
}
