import React from "react";
import { useGetRooms } from "../hooks/useGetRooms";
import LoadingRing from "./LoadingRing";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Modal from "./Modal";
import CreateRoom from "./CreateRoom";
const RoomSection = () => {
  const { rooms, loading, error, fetchRooms } = useGetRooms();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selected, setSelected] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const selectedGenres = searchParams.getAll("genre");

  const filtered = rooms.filter(
    (r) =>
      selectedGenres.length === 0 ||
      selectedGenres.some((g) => r.tags.includes(g))
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

  const GENRES = [
    "HIPHOP",
    "RNB",
    "POP",
    "RAP",
    "ROCK",
    "ELECTRONIC",
    "JAZZ",
    "CLASSICAL",
    "REGGAE",
    "LATIN",
    "COUNTRY",
    "METAL",
    "INDIE",
    "SOUL",
    "FUNK",
    "LOFI",
    "AFROBEATS",
    "KPOP",
    "EDM",
    "HOUSE",
    "TRAP",
  ];

  return (
    <div className="flex flex-col lg:flex-row justify-center gap-6 p-4 w-full">
      <div className="overflow-x-auto w-full lg:w-[70%]">
        <table className="table w-full">
          <thead>
            <tr className="bg-base-200 text-xs text-base-content/50 uppercase">
              <th className="w-[20%]">Host</th>
              <th className="w-[35%]">Name</th>
              <th className="w-[15%]">Listeners</th>
              <th className="w-[30%]">
                <div className="flex justify-between items-center">
                  <span>Options</span>
                  <button
                    onClick={() => setIsOpen(true)}
                    className="btn border border-secondary btn-sm"
                  >
                    + Create Room
                  </button>
                  <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                    <CreateRoom
                      onClose={() => setIsOpen(false)}
                      onSuccess={fetchRooms}
                    />
                  </Modal>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const visibleTags = r.tags.slice(0, 5);
              const remaining = r.tags.length - 5;
              const remainingTags = r.tags.slice(5);

              return (
                <tr key={r.id}>
                  <td>
                    <div className="font-medium text-xl">
                      {r.owner.username}
                    </div>
                  </td>
                  <td className="max-w-0">
                    {r.name}
                    <br />
                    {r.tags.length > 0 && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {visibleTags.map((t) => (
                          <span
                            key={t}
                            className="badge badge-ghost badge-sm rounded-full text-xs px-2 py-0.5 text-base-content/60"
                          >
                            #{t.toLowerCase()}
                          </span>
                        ))}
                        {remaining > 0 && (
                          <span className="tooltip rounded-full text-xs px-2 py-0.5 text-base-content/40">
                            <div className="tooltip-content flex flex-wrap gap-1 max-w-xs p-1">
                              {remainingTags.map((t) => (
                                <span
                                  key={t}
                                  className="badge badge-ghost badge-sm rounded-full text-xs px-2 py-0.5 text-base-content/60"
                                >
                                  #{t.toLowerCase()}
                                </span>
                              ))}
                            </div>
                            +{remaining} more
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                  <td>{r.listenerCount}</td>
                  <td>
                    <div className="flex gap-2 items-center">
                      <button className="btn btn-success btn-sm">JOIN</button>
                      <button className="btn btn-ghost btn-xs">details</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="bg-base-content/10 w-full lg:w-[30%] min-h-50 p-4">
        <div>
          <h1 className="font-medium mb-4">Filter tags:</h1>
          <form className="flex gap-2 flex-wrap">
            {GENRES.map((genre) => (
              <input
                key={genre}
                className="btn"
                type="checkbox"
                name="frameworks"
                checked={selected.includes(genre)}
                value={genre}
                aria-label={`#${genre.toLowerCase()}`}
                onChange={handleChange}
              />
            ))}
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
