import { useState } from "react";
import Sidebar from "../Sidebar";
import "../../styles/index.css";

const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="app-layout">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <main className="app-main">{children}</main>
    </div>
  );
};

export default AppLayout;


