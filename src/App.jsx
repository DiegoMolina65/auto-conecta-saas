import React from "react";
import  { BrowserRouter, useRoutes } from "react-router-dom";
import { appConfigRoutes } from "./config/routes/appConfigRoutes.jsx";

function AppRoutes() {
  return useRoutes(appConfigRoutes);
}

export default function App() {
  return (
    <BrowserRouter>
     <AppRoutes/>
    </BrowserRouter>
  );
}
