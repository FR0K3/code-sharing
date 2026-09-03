import { BrowserRouter, Route, Routes } from "react-router";
import App from "../pages/App";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/:id" element={<App />} />
      </Routes>
    </BrowserRouter>
  )
}
