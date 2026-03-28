import React from "react";

import { useGetUser } from "../hooks/useGetUser";
const Dashboard = () => {
  const { user, loading, error } = useGetUser();

  return <div className="">hello</div>;
};

export default Dashboard;
