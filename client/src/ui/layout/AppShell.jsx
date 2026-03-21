import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "../components/Footer";

export function AppShell() {
  return (
    <div>
      <Navbar />
      <main style={{ paddingTop: 72 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
