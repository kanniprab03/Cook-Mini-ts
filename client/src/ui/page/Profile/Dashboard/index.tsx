import { Outlet } from "react-router-dom";

export default function RecipeDashboard() {
  return (
    <div className="flex flex-row">
      {<Outlet /> ? <Outlet /> : <h1>404</h1>}
    </div>
  );
}
