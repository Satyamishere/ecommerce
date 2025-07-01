import React from 'react'
import { useNavigate } from "react-router-dom";

function AdminDashboardPage() {
  const navigate = useNavigate(); 

  return (
    <div>
      <div>
        <button onClick={() => navigate("/getsales")}>
          Display Sales
        </button>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
