import React, { useState, useEffect } from "react";
import { useGetRooms } from "../hooks/useGetRooms";
import LoadingRing from "./LoadingRing";
import { useSearchParams, useNavigate } from "react-router-dom";
import Modal from "./Modal";
import CreateRoom from "./CreateRoom";
import { deleteRoom, getTags } from "../api/room";
import { useAuth } from "../context/AuthContext";

const UsersIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const FilterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
);
const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);
const XIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const MusicIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
  </svg>
);

const initials = (name = "") => name[0]?.toUpperCase() ?? "?";

const AVATAR_COLORS = [
  "bg-violet-500","bg-pink-500","bg-amber-500","bg-emerald-500",
  "bg-sky-500","bg-rose-500","bg-indigo-500","bg-teal-500",
];
const avatarColor = (name = "") =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

const RoomCard = ({ room, onDetails, onJoin }) => (
  <div className="group bg-base-100 border border-base-200 rounded-2xl p-4 flex gap-3 items-center hover:border-primary/30 hover:shadow-md transition-all duration-200">
    {/* Avatar */}
    <div className={`${avatarColor(room.owner.username)} shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
      {initials(room.owner.username)}
    </div>

    {/* Info */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 flex-wrap">
        <p className="font-semibold text-sm text-base-content leading-tight truncate">{room.name}</p>
        <span className="text-xs text-base-content/40">{room.owner.username}</span>
      </div>
      {room.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1.5">
          {room.tags.map((t) => (
            <span key={t} className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 leading-none">
              {t.toLowerCase()}
            </span>
          ))}
        </div>
      )}
    </div>

    {/* Listeners */}
    <span className="shrink-0 hidden sm:flex items-center gap-1 text-xs text-base-content/50 bg-base-200 rounded-full px-2.5 py-1">
      <UsersIcon /> {room.listenerCount}
    </span>

    {/* Actions */}
    <div className="shrink-0 flex items-center gap-2">
      <button
        className="btn btn-ghost btn-xs text-base-content/50"
        onClick={() => onDetails(room)}
      >
        Details
      </button>
      <button
        className="btn btn-success btn-sm rounded-xl"
        onClick={onJoin}
      >
        Join
      </button>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════
   DETAILS MODAL CONTENT
═══════════════════════════════════════════════════════════════════════ */
const RoomDetails = ({ room, user, isDeleting, onClose, onJoin, onDelete }) => (
  <div className="bg-base-100 rounded-2xl w-full max-w-sm overflow-hidden">
    {/* Hero strip */}
    <div className={`${avatarColor(room.owner.username)} p-6 flex items-center gap-4`}>
      <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white text-2xl font-bold shadow">
        {initials(room.owner.username)}
      </div>
      <div className="text-white">
        <h2 className="text-lg font-bold leading-tight">{room.name}</h2>
        <p className="text-sm opacity-75">by {room.owner.username}</p>
      </div>
    </div>

    {/* Body */}
    <div className="p-5 space-y-4">
      {/* Stats row */}
      <div className="flex gap-3">
        <div className="flex-1 bg-base-200 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-base-content">{room.listenerCount}</p>
          <p className="text-xs text-base-content/40 mt-0.5">listeners</p>
        </div>
        <div className="flex-1 bg-base-200 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-base-content">{room.tags.length}</p>
          <p className="text-xs text-base-content/40 mt-0.5">genres</p>
        </div>
      </div>

 
      {room.tags.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-base-content/40 uppercase tracking-widest mb-2">Genres</p>
          <div className="flex flex-wrap gap-1.5">
            {room.tags.map((t) => (
              <span key={t} className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                {t.toLowerCase()}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>


    <div className="px-5 pb-5 flex gap-2">
      <button className="btn btn-ghost flex-1 btn-sm" onClick={onClose}>Close</button>
      <button className="btn btn-success flex-1 btn-sm" onClick={onJoin}>Join Room</button>
      {user?.id === room.ownerId && (
        <button
          className="btn btn-error btn-outline btn-sm"
          onClick={onDelete}
          disabled={isDeleting}
        >
          {isDeleting ? <span className="loading loading-spinner loading-xs" /> : "Delete"}
        </button>
      )}
    </div>
  </div>
);

const RoomSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { rooms, loading, error, fetchRooms } = useGetRooms();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selected, setSelected] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [detailsRoom, setDetailsRoom] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    getTags().then(setGenres).catch(console.error);
  }, []);

  // Sync selected from URL on mount
  useEffect(() => {
    setSelected(searchParams.getAll("genre"));
  }, []);

  const selectedGenres = searchParams.getAll("genre");

  const filtered = rooms.filter(
    (r) =>
      selectedGenres.length === 0 ||
      selectedGenres.some((g) => r.tags.includes(g))
  );

  const handleTagToggle = (genre) => {
    const next = new URLSearchParams(searchParams);
    next.delete("genre");
    const updated = selected.includes(genre)
      ? selected.filter((g) => g !== genre)
      : [...selected, genre];
    updated.forEach((g) => next.append("genre", g));
    setSelected(updated);
    setSearchParams(next);
  };

  const handleClearFilters = () => {
    setSelected([]);
    setSearchParams({});
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    setIsDeleting(true);
    try {
      await deleteRoom(roomId);
      setDetailsRoom(null);
      fetchRooms();
    } catch {
      alert("Failed to delete room");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <LoadingRing />;
  if (error) return <p className="text-error text-center mt-10">{error}</p>;

  return (
    <div className="max-w-screen-2xl mx-auto px-4 lg:px-10 py-6 w-full">

    
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <MusicIcon />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">Rooms</h1>
            <p className="text-xs text-base-content/40">{filtered.length} available</p>
          </div>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="btn btn-primary btn-sm gap-1.5 rounded-xl shadow-sm"
        >
          <PlusIcon /> Create
        </button>
      </div>

     
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="flex items-center gap-1 text-xs font-semibold text-base-content/40 uppercase tracking-widest">
            <FilterIcon /> Genres
          </span>
          {selected.length > 0 && (
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1 text-xs text-error hover:underline ml-auto"
            >
              <XIcon /> Clear {selected.length}
            </button>
          )}
        </div>

  
        <div className="flex flex-wrap gap-1.5">
          {genres.map((genre) => {
            const active = selected.includes(genre);
            return (
              <button
                key={genre}
                onClick={() => handleTagToggle(genre)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-150 ${
                  active
                    ? "bg-primary text-primary-content border-primary shadow-sm"
                    : "bg-base-100 text-base-content/60 border-base-200 hover:border-primary/30 hover:text-base-content"
                }`}
              >
                {genre.toLowerCase()}
              </button>
            );
          })}
        </div>
      </div>

  
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-base-content/30">
          <MusicIcon />
          <p className="text-base font-medium mt-3">No rooms found</p>
          <p className="text-sm mt-1">Try different genres or create one</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((r) => (
            <RoomCard
              key={r.id}
              room={r}
              onDetails={setDetailsRoom}
              onJoin={() => navigate(`/room/${r.id}`)}
            />
          ))}
        </div>
      )}

      
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)}>
        <CreateRoom
          onClose={() => setIsCreateOpen(false)}
          onSuccess={fetchRooms}
        />
      </Modal>

      {/* ── Details Modal ── */}
      <Modal isOpen={!!detailsRoom} onClose={() => setDetailsRoom(null)}>
        {detailsRoom && (
          <RoomDetails
            room={detailsRoom}
            user={user}
            isDeleting={isDeleting}
            onClose={() => setDetailsRoom(null)}
            onJoin={() => navigate(`/room/${detailsRoom.id}`)}
            onDelete={() => handleDeleteRoom(detailsRoom.id)}
          />
        )}
      </Modal>
    </div>
  );
}

export default RoomSection;