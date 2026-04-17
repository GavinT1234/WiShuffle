import React from "react";
import { useGetUser } from "../hooks/useGetUser";
import LoadingRing from "../components/LoadingRing";
import RoomSection from "../components/RoomSection";

const Dashboard = () => {
   const { user, loading, error } = useGetUser();

   return (
       <div className="min-h-screen bg-base-200">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 pt-8 pb-2">
             {loading ? (
                 <LoadingRing />
             ) : error ? (
                 <p className="text-error text-sm">{error}</p>
             ) : (
                 <div className="text-center">
                    <div>
                       <p className="text-xs font-semibold uppercase tracking-widest text-base-content/30 mb-1 text">
                          Welcome back
                       </p>
                       <h1 className="text-2xl sm:text-3xl font-bold text-base-content truncate">
                          {user?.username || "User"}
                       </h1>
                    </div>
                 </div>
                 
             )}
          </div>
          <RoomSection />
       </div>
   );
};

export default Dashboard;