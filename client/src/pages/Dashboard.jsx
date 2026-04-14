import React from "react";

import { useGetUser } from "../hooks/useGetUser";
import LoadingRing from "../components/LoadingRing";
import RoomSection from "../components/RoomSection";
import { useNavigate } from "react-router-dom";
const Dashboard = () => {
  
  const { user, loading, error } = useGetUser();

  return (
    <div className="min-h-screen">
      <div className="p-4 flex justify-center">
        {loading ? (
          <LoadingRing />
        ) : (
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold ">
            Welcome, {user.username}
          </div>
        )}
        <section>{error ? error : ""}</section>
      </div>
      <div>
        <RoomSection />
      </div>
    </div>
  );
};

export default Dashboard;
