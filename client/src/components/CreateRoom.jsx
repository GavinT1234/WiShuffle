import React from "react";
import { useCreateRoom } from "../hooks/useCreateRoom";
import { useState } from "react";
import LoadingRing from "../components/LoadingRing";
import GenreSelect from "./GenreSelect";

const CreateRoom = ({ onClose, onSuccess }) => {
  const { room, loading, error, create } = useCreateRoom();

  const [name, setName] = useState("");
  const [tags, setTags] = useState([]);

  const handleChange = (t) => {
    const { checked, value } = t.target;

    const updatedSelected = checked
      ? [...tags, value]
      : tags.filter((tag) => tag !== value);

    setTags(updatedSelected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await create({ name, tags });
    onSuccess();
    onClose();
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
    <div className="flex place-items-center justify-center">
      <form onSubmit={handleSubmit}>
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
          <legend className="fieldset-legend">Create Room</legend>
          <label className="label">Room Name</label>
          <input
            type="text"
            className="input"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          />
          <GenreSelect selected={tags} onChange={setTags} /> {/* ✅ */}
          <input
            className="btn "
            type="reset"
            value="×"
            onClick={() => {
              setSelected([]);
            }}
          />
          <button
            className="btn btn-neutral mt-4"
            disabled={!name.trim() || loading}
          >
            {loading ? <LoadingRing /> : "Create Room"}
          </button>
        </fieldset>
      </form>
    </div>
  );
};

export default CreateRoom;
