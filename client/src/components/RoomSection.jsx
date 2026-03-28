import React from "react";
import { useGetRooms } from "../hooks/useGetRooms";
import LoadingRing from "./LoadingRing";
const RoomSection = () => {
  const { rooms, loading, error } = useGetRooms();

  if (loading) {
    return <LoadingRing />;
  }

  if (error) {
    return error;
  }

  return (
    <div className="overflow-x-auto flex justify-center place-items-center gap-6">
      <table className="table">
        <thead>
          <tr>
            <th>
              <label></label>
            </th>
            <th>Host</th>
            <th>Name</th>
            <th>Listeners</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((r) => {
            return (
              <tr>
                <th>
                  <label>
                    {/* <input type="checkbox" className="checkbox" /> */}
                  </label>
                </th>
                <td>
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-bold">{r.owner.username}</div>
                      {/* <div className="text-sm opacity-50">United States</div> */}
                    </div>
                  </div>
                </td>
                <td>
                  {r.name}
                  <br />
                  {/* <span className="badge badge-ghost badge-sm">
                    Desktop Support Technician
                  </span> */}
                </td>
                <td>{r.listenerCount}</td>
                <th className="flex gap-2 place-items-center">
                  <button className="btn btn-success">JOIN</button>
                  <button className="btn btn-ghost btn-xs">details</button>
                </th>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="bg-black">sidebar</div>
    </div>
  );
};

export default RoomSection;
