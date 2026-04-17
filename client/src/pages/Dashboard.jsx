import { useUser } from "../context/UserContext";
import LoadingRing from "../components/LoadingRing";
import RoomSection from "../components/RoomSection";

const Dashboard = () => {
    const { user, loading } = useUser();

    return (
        <div className="min-h-screen">
            <div className="p-4 flex justify-center">
                {loading ? (
                    <LoadingRing />
                ) : (
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold ">
                        Welcome, {user?.username || "User"}
                    </div>
                )}
                {/*<section>{error ? error : ""}</section>*/}
            </div>
            <div>
                <RoomSection />
            </div>
        </div>
    );
};

export default Dashboard;