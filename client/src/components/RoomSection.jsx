import React, { useState, useEffect } from "react";
import { useGetRooms } from "../hooks/useGetRooms";
import LoadingRing from "./LoadingRing";
import { useSearchParams, useNavigate } from "react-router-dom";
import Modal from "./Modal";
import CreateRoom from "./CreateRoom";
import { deleteRoom, getTags } from "../api/room";
import {useGetUser} from "../hooks/useGetUser.js";
import {updateRoom} from "../api/room.js";
const UsersIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
);

const PlusIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
);

const FilterIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
);

const XIcon = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
);

const MusicIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M9 18V5l12-2v13"/>
      <circle cx="6" cy="18" r="3"/>
      <circle cx="18" cy="16" r="3"/>
    </svg>
);

const initials = (name = "") => name[0]?.toUpperCase() ?? "?";

const AVATAR_COLORS = [
  "bg-violet-500", "bg-pink-500", "bg-amber-500", "bg-emerald-500",
  "bg-sky-500", "bg-rose-500", "bg-indigo-500", "bg-teal-500",
];

const avatarColor = (name = "") =>
    AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

const RoomCard = ({ room, onDetails, onJoin }) => (
    <div
        className="bg-base-100 border border-base-200 rounded-2xl p-4 flex gap-3 items-center hover:border-primary/30 hover:shadow-md transition-all duration-200 cursor-pointer sm:cursor-default"
        onClick={() => onDetails(room)} // ← whole card opens details on mobile
    >
       {room.owner.avatarUrl ? (
           <img src={room.owner.avatarUrl} alt="Avatar" className="w-10 h-10 rounded-xl shrink-0 object-cover" />
       ) : (
           <div className={`${avatarColor(room.owner.username)} shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm`}>
              {initials(room.owner.username)}
           </div>
       )}

       <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
             <p className="font-semibold text-sm text-base-content truncate">{room.name}</p>
             <span className="text-xs text-base-content/40 truncate">{room.owner.username}</span>
          </div>
          {room.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                 {room.tags.map((t) => (
                     <span key={t} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-base-content/200 text-base-content/40 border border-base-content/10">
                    {t.toLowerCase()}
                  </span>
                 ))}
              </div>
          )}
       </div>

       <div className="shrink-0 flex items-center gap-2">
        <span className="hidden sm:flex items-center gap-1 text-xs text-base-content/50 bg-base-200 rounded-full px-2.5 py-1">
          <UsersIcon /> {room.listenerCount}
        </span>
          <button
              className="btn btn-ghost btn-xs text-base-content/50 hidden sm:inline-flex"
              onClick={(e) => { e.stopPropagation(); onDetails(room); }}
          >
             Details
          </button>
          <button
              className="btn bg-[#aa3bff]/60 btn-sm rounded-xl hover:bg-[#aa3bff]/70"
              onClick={(e) => { e.stopPropagation(); onJoin(); }} // ← prevent card click from firing
          >
             Join
          </button>
       </div>
    </div>
);

const RoomDetails = ({ room, user, isDeleting, isSaving, genres, onClose, onJoin, onDelete, onSave }) => {
   const isOwner = user?.id === room.owner.id;
   const [isEditing, setIsEditing] = useState(false);
   const [editName, setEditName] = useState(room.name);
   const [editTags, setEditTags] = useState(room.tags);

   const toggleTag = (tag) =>
       setEditTags((prev) =>
           prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
       );

   const handleSave = () => {
      onSave({ name: editName, tags: editTags });
      setIsEditing(false);
   };

   return (
       <div className="bg-base-100 rounded-2xl w-full max-w-sm overflow-hidden">
          <div className={`${avatarColor(room.owner.username)} p-5 sm:p-6 flex items-center gap-4`}>
             <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white text-xl sm:text-2xl font-bold">
                {initials(room.owner.username)}
             </div>
             <div className="text-white min-w-0 flex-1">
                {isEditing ? (
                    <input
                        className="input input-sm w-full text-base-content rounded-lg font-bold"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        autoFocus
                    />
                ) : (
                    <>
                       <h2 className="text-base sm:text-lg font-bold leading-tight truncate">{room.name}</h2>
                       <p className="text-sm opacity-75">by {room.owner.username}</p>
                    </>
                )}
             </div>
          </div>

          <div className="p-4 sm:p-5 space-y-4">
             {!isEditing && (
                 <div className="flex gap-3">
                    <div className="flex-1 bg-base-200 rounded-xl p-3 text-center">
                       <p className="text-xl font-bold">{room.listenerCount}</p>
                       <p className="text-xs text-base-content/40 mt-0.5">listeners</p>
                    </div>
                    <div className="flex-1 bg-base-200 rounded-xl p-3 text-center">
                       <p className="text-xl font-bold">{room.tags.length}</p>
                       <p className="text-xs text-base-content/40 mt-0.5">genres</p>
                    </div>
                 </div>
             )}

             {isEditing ? (
                 <div>
                    <p className="text-xs font-semibold text-base-content/40 uppercase tracking-widest mb-2">Genres</p>
                    <div className="flex flex-wrap gap-1.5">
                       {genres.map((tag) => {
                          const active = editTags.includes(tag);
                          return (
                              <button
                                  key={tag}
                                  onClick={() => toggleTag(tag)}
                                  className={`text-xs font-medium px-2.5 py-1 rounded-full border transition-all duration-150 ${
                                      active
                                          ? "bg-primary text-primary-content border-primary shadow-sm"
                                          : "bg-base-100 text-base-content/60 border-base-200 hover:border-primary/30"
                                  }`}
                              >
                                 {tag.toLowerCase()}
                              </button>
                          );
                       })}
                    </div>
                 </div>
             ) : (
                 room.tags.length > 0 && (
                     <div>
                        <p className="text-xs font-semibold text-base-content/40 uppercase tracking-widest mb-2">Genres</p>
                        <div className="flex flex-wrap gap-1.5">
                           {room.tags.map((t) => (
                               <span key={t} className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {t.toLowerCase()}
                  </span>
                           ))}
                        </div>
                     </div>
                 )
             )}
          </div>

          <div className="px-4 sm:px-5 pb-4 sm:pb-5 flex gap-2">
             <button className="btn btn-ghost flex-1 btn-sm" onClick={isEditing ? () => setIsEditing(false) : onClose}>
                {isEditing ? "Cancel" : "Close"}
             </button>
             {!isEditing && (
                 <button className="btn btn-success flex-1 btn-sm" onClick={onJoin}>Join Room</button>
             )}
             {isEditing && (
                 <button className="btn btn-primary flex-1 btn-sm" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? <span className="loading loading-spinner loading-xs" /> : "Save"}
                 </button>
             )}
          </div>

          {isOwner && !isEditing && (
              <div className="px-4 sm:px-5 pb-4 sm:pb-5 flex gap-2 justify-center">
                 <button className="btn btn-error btn-outline btn-sm" onClick={onDelete} disabled={isDeleting}>
                    {isDeleting ? <span className="loading loading-spinner loading-xs" /> : "Delete"}
                 </button>
                 <button className="btn btn-warning btn-outline btn-sm" onClick={() => setIsEditing(true)}>
                    Update
                 </button>
              </div>
          )}
       </div>
   );
};

const RoomSection = () => {
  const navigate = useNavigate();
  const { user } = useGetUser();
  const { rooms, loading, error, fetchRooms } = useGetRooms();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selected, setSelected] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [detailsRoom, setDetailsRoom] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [genres, setGenres] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

   const handleUpdateRoom = async ({ name, tags }) => {
      setIsSaving(true);
      try {
         await updateRoom(detailsRoom.id, { name, tags });
         await fetchRooms();
         // Patch the detailsRoom so the modal reflects the new values immediately
         setDetailsRoom((prev) => ({ ...prev, name, tags }));
      } catch {
         alert("Failed to update room");
      } finally {
         setIsSaving(false);
      }
   };
  useEffect(() => {
    getTags().then(setGenres).catch(console.error);
  }, []);

  useEffect(() => {
    setSelected(searchParams.getAll("genre"));
  }, [searchParams]);

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
  if (error) return <p className="text-error text-center mt-10 text-sm">{error}</p>;

  return (
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 py-6 w-full">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#aa3bff]/10 flex items-center justify-center text-[#aa3bff] shrink-0">
              <MusicIcon />
            </div>
            <div>
              <h2 className="text-base font-bold leading-tight">Rooms</h2>
              <p className="text-xs text-base-content/40">{filtered.length} available</p>
            </div>
          </div>

          <button
              onClick={() => setIsCreateOpen(true)}
              className="btn bg-[#aa3bff] btn-sm gap-1.5 rounded-xl"
          >
            <PlusIcon /> <span className="hidden xs:inline">Create</span>
          </button>
        </div>

        {genres.length > 0 && (
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2.5">
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
        )}

        {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-base-content/30 gap-3">
              <MusicIcon />
              <div className="text-center">
                <p className="text-sm font-medium">No rooms found</p>
                <p className="text-xs mt-0.5">Try different genres or create one</p>
              </div>
            </div>
        ) : (
            <div className="flex flex-col gap-2.5">
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

        <Modal isOpen={!!detailsRoom} onClose={() => setDetailsRoom(null)}>
          {detailsRoom && (
              <RoomDetails
                  room={detailsRoom}
                  user={user}
                  genres={genres}           
                  isDeleting={isDeleting}
                  isSaving={isSaving}
                  onClose={() => setDetailsRoom(null)}
                  onJoin={() => navigate(`/room/${detailsRoom.id}`)}
                  onDelete={() => handleDeleteRoom(detailsRoom.id)}
                  onSave={handleUpdateRoom}
              />
          )}
        </Modal>
      </div>
  );
};

export default RoomSection;