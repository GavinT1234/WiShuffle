import React from "react";

import { useGetUser } from "../hooks/useGetUser";
import LoadingRing from "../components/LoadingRing";
import RoomSection from "../components/RoomSection";
const Dashboard = () => {
  const { user, loading, error } = useGetUser();

  return (
    <div className="">
      <div className="p-4 flex justify-center">
        {loading ? (
          <LoadingRing />
        ) : (
          <div className="text-4xl">Welcome, {user.username}</div>
        )}
        <section>{error ? error : ""}</section>
      </div>
      <div>
        <RoomSection/>
      </div>
    </div>
  );
};

export default Dashboard;
