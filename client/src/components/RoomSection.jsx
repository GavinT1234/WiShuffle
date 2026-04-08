import React from "react";
import { useGetRooms } from "../hooks/useGetRooms";
import LoadingRing from "./LoadingRing";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Modal from "./Modal";
import CreateRoom from "./CreateRoom";
import { useNavigate } from "react-router-dom";
const RoomSection = () => {

  const navigate = useNavigate();

  const { rooms, loading, error, fetchRooms } = useGetRooms();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selected, setSelected] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const selectedGenres = searchParams.getAll("genre");
  console.log("rooms", rooms);
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
      <div className="overflow-x-auto lg:w-[70%]">
        <table className="table w-full">
          <thead>
            <tr className="bg-base-200 text-xs text-base-content/50 uppercase">
              <th className="w-[40%] sm:w-[20%]">Host</th>
              <th className="w-[35%] md:w-[35%]">Name</th>
              <th className="md:w-[15%] hidden md:table-cell">
                Listeners
              </th>{" "}
              <th>
                <div className="flex  items-center justify-end md:justify-between">
                  <span className="hidden md:block">Options</span>
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
                    <div className="font-medium">{r.owner.username}</div>
                  </td>
                  <td className="max-w-0">
                    {r.name}
                    {r.tags.length > 0 && (
                      <>
                        {/* mobile — first tag + count */}
                        <div className="flex items-center gap-1 mt-1 md:hidden">
                          <span className="badge badge-ghost badge-sm rounded-full text-xs">
                            #{r.tags[0].toLowerCase()}
                          </span>
                          {r.tags.length > 1 && (
                            <span className="text-xs text-base-content/40">
                              +{r.tags.length - 1}
                            </span>
                          )}
                        </div>

                        {/* desktop — full tags with +more tooltip */}
                        <div className="hidden md:flex gap-1 mt-2 flex-wrap">
                          {visibleTags.map((t) => (
                            <span
                              key={t}
                              className="badge badge-ghost badge-sm rounded-full text-xs"
                            >
                              #{t.toLowerCase()}
                            </span>
                          ))}
                          {remaining > 0 && (
                            <span className="tooltip rounded-full text-xs text-base-content/40">
                              <div className="tooltip-content flex flex-wrap gap-1 max-w-xs p-1 shadow-lg bg-base-300">
                                {remainingTags.map((t) => (
                                  <span
                                    key={t}
                                    className="badge badge-ghost badge-sm rounded-full text-xs"
                                  >
                                    #{t.toLowerCase()}
                                  </span>
                                ))}
                              </div>
                              +{remaining} more
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </td>
                  <td className="hidden md:table-cell">{r.listenerCount}</td>{" "}
                  <td>
                    <div className="flex gap-2 items-center justify-end md:justify-start">
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => navigate(`/room/${r.id}`)}
                      >
                        JOIN
                      </button>
                      <button className="btn btn-ghost btn-xs hidden md:block">
                        details
                      </button>{" "}
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
