import { useState } from "react";
import { useCreateRoom } from "../hooks/useCreateRoom";
import GenreSelect from "./GenreSelect";

const XIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
);

const CreateRoom = ({ onClose, onSuccess }) => {
  const { loading, create } = useCreateRoom();
  const [name, setName] = useState("");
  const [tags, setTags] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await create({ name, tags });
    onSuccess();
    onClose();
  };

  return (
      <div className="bg-base-100 rounded-2xl w-full max-w-sm">
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-base-200">
          <h2 className="text-base font-semibold">Create a room</h2>
          <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost btn-xs btn-circle text-base-content/40"
          >
            <XIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-base-content/50 uppercase tracking-widest">
              Room name
            </label>
            <input
                type="text"
                className="input input-sm w-full"
                placeholder="e.g. Late night jazz"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-base-content/50 uppercase tracking-widest">
              Genres
            </label>
            <GenreSelect selected={tags} onChange={setTags} />
          </div>

          <button
              type="submit"
              className="btn btn-primary btn-sm w-full mt-1"
              disabled={!name.trim() || loading}
          >
            {loading ? <span className="loading loading-spinner loading-xs" /> : "Create room"}
          </button>
        </form>
      </div>
  );
};

export default CreateRoom;