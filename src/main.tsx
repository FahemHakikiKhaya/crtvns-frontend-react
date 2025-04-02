import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { AuthProvider } from "./provider/AuthProvider";
import Login from "./pages/Login";
import Layout from "./layouts";
import History from "./pages/History";
import Home from "./pages/Home";
import { SnackbarProvider } from "notistack";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SnackbarProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/history" element={<History />} />
            </Route>
          </Routes>
        </SnackbarProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
