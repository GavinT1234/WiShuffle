import { useState } from "react";

export const CreatePlaylistModal = ({ onConfirm }) => {
   const [name, setName] = useState("");
   const [description, setDescription] = useState("");

   const handleCreate = () => {
      if (!name.trim()) return;
      // TODO: replace with real service call
      // await createPlaylist(name, description);
      onConfirm?.({ name, description });
      setName("");
      setDescription("");
      document.getElementById("create_playlist_modal").close();
   };

   return (
       <>
          <button
              className="btn btn-primary"
              onClick={() => document.getElementById("create_playlist_modal").showModal()}
          >
             + Create Playlist
          </button>

          <dialog id="create_playlist_modal" className="modal">
             <div className="modal-box bg-base-200">
                <div className="flex items-center justify-between mb-4">
                   <h3 className="font-bold text-lg">Create Playlist</h3>
                   <span className="badge badge-outline badge-primary text-xs">Placeholder</span>
                </div>

                <div className="flex flex-col gap-4">
                   <div>
                      <label className="label">
                         <span className="label-text text-xs text-base-content/50">Playlist name</span>
                      </label>
                      <input
                          type="text"
                          placeholder="e.g. Chill Vibes..."
                          className="input input-bordered w-full"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                      />
                   </div>

                   <div>
                      <label className="label">
                <span className="label-text text-xs text-base-content/50">
                  Description <span className="opacity-40">(optional)</span>
                </span>
                      </label>
                      <input
                          type="text"
                          placeholder="What's this playlist about?"
                          className="input input-bordered w-full"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                      />
                   </div>

                   {/* Remove this block when backend is ready */}
                   <div className="text-xs text-base-content/30 border border-dashed border-base-content/10 rounded-lg p-3">
                      POST /api/playlists — will send name + userId from auth context
                   </div>
                </div>

                <div className="modal-action">
                   <form method="dialog">
                      <button className="btn btn-ghost">Cancel</button>
                   </form>
                   <button className="btn btn-primary" onClick={handleCreate}>
                      Create
                   </button>
                </div>
             </div>

             <form method="dialog" className="modal-backdrop">
                <button>close</button>
             </form>
          </dialog>
       </>
   );
};