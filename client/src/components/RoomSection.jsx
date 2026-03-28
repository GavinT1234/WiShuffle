import React from "react";
import { useGetRooms } from "../hooks/useGetRooms";
import LoadingRing from "./LoadingRing";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

const RoomSection = () => {
  const { rooms, loading, error } = useGetRooms();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selected, setSelected] = useState([]);
  const selectedGenres = searchParams.getAll("genre");

  const filtered = rooms.filter(
    (r) =>
      selectedGenres.length === 0 ||
      selectedGenres.some((g) => r.tags.includes(g)),
  );
  if (loading) {
    return <LoadingRing />;
  }

  if (error) {
    return error;
  }

  const handleChange = (e) => {
    const { checked, value } = e.target;

    const next = new URLSearchParams(searchParams);
    next.delete("genre");

    const updatedSelected = checked
      ? [...selected, value]
      : selected.filter((item) => item !== value);

    updatedSelected.forEach((genre) => next.append("genre", genre));
    setSelected(updatedSelected);
    setSearchParams(next);
  };

  return (
    <div className="flex flex-col lg:flex-row justify-center gap-6 p-4 w-full">
      <div className="overflow-x-auto w-full lg:w-[70%]">
        <table className="table w-full">
          <thead>
            <tr className="bg-base-200 text-xs text-base-content/50 uppercase">
              <th>Host</th>
              <th>Name</th>
              <th>Listeners</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id}>
                <td>
                  <div className="font-medium text-xl">{r.owner.username}</div>
                </td>
                <td className="">
                  {r.name}
                  <br />
                  {r.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap mt-1">
                      {r.tags.map((t) => (
                        <span className="badge badge-ghost badge-sm rounded-full text-xs px-2 py-0.5 text-base-content/60">
                          <section>#{t.toLowerCase()}</section>
                        </span>
                      ))}
                    </div>
                  )}
                </td>

                <td>{r.listenerCount}</td>
                <td className="flex gap-2 items-center justify-center">
                  <button className="btn btn-success btn-sm">JOIN</button>
                  <button className="btn btn-ghost btn-xs">details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-black w-full lg:w-[30%] min-h-50">
        <div>
          <form className="flex gap-2">
            <input
              className="btn"
              type="checkbox"
              name="frameworks"
              value="HIPHIP"
              aria-label="#hip-hop"
              onChange={handleChange}
            />
            <input
              className="btn"
              type="checkbox"
              name="frameworks"
              aria-label="#rnb"
              value="RNB"
              onChange={handleChange}
            />
            <input
              className="btn"
              type="checkbox"
              name="frameworks"
              aria-label="#pop"
              value="POP"
              onChange={handleChange}
            />
            <input
              className="btn"
              type="checkbox"
              name="frameworks"
              aria-label="#lofi"
              value="LOFI"
              onChange={handleChange}
            />
            <input
              className="btn btn-square"
              type="reset"
              value="×"
              onClick={() => {
                setSelected([]);
                setSearchParams({});
              }}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default RoomSection;
