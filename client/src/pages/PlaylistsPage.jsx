import { useState } from "react";
import {
  useRootPlaylists,
  usePlaylistContent,
  usePlaylistActions,
} from "../hooks/usePlaylists";

const PlusIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
);

const ChevronRight = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
);

const TrashIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14H6L5 6"/>
      <path d="M10 11v6M14 11v6"/>
      <path d="M9 6V4h6v2"/>
    </svg>
);

const PencilIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
);

const MusicIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M9 18V5l12-2v13"/>
      <circle cx="6" cy="18" r="3"/>
      <circle cx="18" cy="16" r="3"/>
    </svg>
);

const FolderIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    </svg>
);

function ModalShell({ onClose, title, children }) {
  return (
      <div className="modal modal-open">
        <div className="modal-box max-w-sm rounded-2xl p-0 overflow-hidden mx-4 sm:mx-auto">
          <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-base-200">
            <h3 className="font-semibold text-base">{title}</h3>
            <button className="btn btn-ghost btn-xs btn-circle" onClick={onClose}>✕</button>
          </div>
          <div className="p-5">{children}</div>
        </div>
        <div className="modal-backdrop" onClick={onClose}/>
      </div>
  );
}

function CreatePlaylistModal({ parentId, onClose, onSubmit, saving }) {
  const [name, setName] = useState("");
  const [shuffle, setShuffle] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await onSubmit({ name, shuffle, parentId: parentId || undefined });
    onClose();
  };

  return (
      <ModalShell onClose={onClose} title={parentId ? "New subplaylist" : "New playlist"}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-base-content/50 uppercase tracking-widest">Name</label>
            <input
                type="text"
                className="input input-sm w-full"
                placeholder="My playlist"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
                type="checkbox"
                className="toggle toggle-sm toggle-primary"
                checked={shuffle}
                onChange={(e) => setShuffle(e.target.checked)}
            />
            <span className="text-sm text-base-content/70">Shuffle</span>
          </label>
          <button
              type="submit"
              className="btn btn-primary btn-sm w-full"
              disabled={!name.trim() || saving}
          >
            {saving ? <span className="loading loading-spinner loading-xs"/> : "Create"}
          </button>
        </form>
      </ModalShell>
  );
}

function EditPlaylistModal({ playlist, onClose, onSubmit, saving }) {
  const [name, setName] = useState(playlist.name);
  const [shuffle, setShuffle] = useState(playlist.shuffle ?? false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await onSubmit(playlist.id, { name, shuffle });
    onClose();
  };

  return (
      <ModalShell onClose={onClose} title="Edit playlist">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-base-content/50 uppercase tracking-widest">Name</label>
            <input
                type="text"
                className="input input-sm w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
                type="checkbox"
                className="toggle toggle-sm toggle-primary"
                checked={shuffle}
                onChange={(e) => setShuffle(e.target.checked)}
            />
            <span className="text-sm text-base-content/70">Shuffle</span>
          </label>
          <button
              type="submit"
              className="btn btn-primary btn-sm w-full"
              disabled={!name.trim() || saving}
          >
            {saving ? <span className="loading loading-spinner loading-xs"/> : "Save changes"}
          </button>
        </form>
      </ModalShell>
  );
}

function AddSongModal({ playlistId, onClose, onSubmit, saving }) {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    await onSubmit(playlistId, { url, name: name || undefined, author: author || undefined });
    onClose();
  };

  return (
      <ModalShell onClose={onClose} title="Add song">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-base-content/50 uppercase tracking-widest">YouTube URL</label>
            <input
                type="text"
                className="input input-sm w-full"
                placeholder="https://youtube.com/watch?v=..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                autoFocus
            />
            <p className="text-xs text-base-content/40">Title and artist will be fetched automatically</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-base-content/50 uppercase tracking-widest">
              Title <span className="normal-case font-normal">(optional)</span>
            </label>
            <input
                type="text"
                className="input input-sm w-full"
                placeholder="Override title"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-base-content/50 uppercase tracking-widest">
              Artist <span className="normal-case font-normal">(optional)</span>
            </label>
            <input
                type="text"
                className="input input-sm w-full"
                placeholder="Override artist"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
          <button
              type="submit"
              className="btn btn-primary btn-sm w-full"
              disabled={!url.trim() || saving}
          >
            {saving ? <span className="loading loading-spinner loading-xs"/> : "Add song"}
          </button>
        </form>
      </ModalShell>
  );
}

function PlaylistCard({ playlist, onClick, onEdit, onDelete }) {
  return (
      <div className="bg-base-100 border border-base-200 rounded-2xl p-4 flex items-center gap-3 hover:border-primary/30 hover:shadow-sm transition-all duration-200">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <FolderIcon/>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{playlist.name}</p>
          {playlist.shuffle && (
              <span className="text-xs text-base-content/40">Shuffle on</span>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
              className="btn btn-ghost btn-xs btn-circle text-base-content/40 hover:text-base-content"
              onClick={(e) => { e.stopPropagation(); onEdit(playlist); }}
          >
            <PencilIcon/>
          </button>
          <button
              className="btn btn-ghost btn-xs btn-circle text-base-content/40 hover:text-error"
              onClick={(e) => { e.stopPropagation(); onDelete(playlist.id); }}
          >
            <TrashIcon/>
          </button>
          <button
              className="btn btn-ghost btn-sm rounded-xl gap-1 text-base-content/60 text-xs"
              onClick={() => onClick(playlist)}
          >
            <span className="hidden sm:inline">Open</span> <ChevronRight/>
          </button>
        </div>
      </div>
  );
}

function PlaylistView({ playlist, onBack, actions }) {
  const { content, loading, error, reload } = usePlaylistContent(playlist.id);
  const viewActions = usePlaylistActions(reload);

  const [showAddSong, setShowAddSong] = useState(false);
  const [showAddSub, setShowAddSub] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [drillTarget, setDrillTarget] = useState(null);

  if (drillTarget) {
    return (
        <PlaylistView
            playlist={drillTarget}
            onBack={() => setDrillTarget(null)}
            actions={viewActions}
        />
    );
  }

  const songs = content.filter((c) => c.isSong);
  const subplaylists = content.filter((c) => !c.isSong);

  return (
      <div className="flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <button
                className="btn btn-ghost btn-sm rounded-xl text-base-content/50 shrink-0"
                onClick={onBack}
            >
              ←
            </button>
            <span className="text-base-content/30">/</span>
            <h2 className="font-semibold text-base truncate">{playlist.name}</h2>
            {playlist.shuffle && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0">
              shuffle
            </span>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
                className="btn btn-ghost btn-sm rounded-xl gap-1.5"
                onClick={() => setEditTarget(playlist)}
            >
              <PencilIcon/> <span className="hidden sm:inline">Edit</span>
            </button>
            <button
                className="btn btn-ghost btn-sm rounded-xl gap-1.5"
                onClick={() => setShowAddSub(true)}
            >
              <PlusIcon/> <span className="hidden sm:inline">Subplaylist</span>
            </button>
            <button
                className="btn btn-primary btn-sm rounded-xl gap-1.5"
                onClick={() => setShowAddSong(true)}
            >
              <PlusIcon/> Add song
            </button>
          </div>
        </div>

        {loading && (
            <div className="flex justify-center py-16">
              <span className="loading loading-spinner loading-md text-primary"/>
            </div>
        )}

        {!loading && error && (
            <p className="text-error text-center text-sm">{error}</p>
        )}

        {!loading && !error && content.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-base-content/30 gap-2">
              <MusicIcon/>
              <p className="text-sm font-medium">This playlist is empty</p>
              <p className="text-xs">Add a song or create a subplaylist</p>
            </div>
        )}

        {subplaylists.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-base-content/40 uppercase tracking-widest">Subplaylists</p>
              {subplaylists.map((sub) => (
                  <div
                      key={sub.id}
                      className="bg-base-100 border border-base-200 rounded-2xl p-3.5 flex items-center gap-3 hover:border-primary/30 transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <FolderIcon/>
                    </div>
                    <p className="flex-1 text-sm font-medium truncate">{sub.name}</p>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                          className="btn btn-ghost btn-xs btn-circle text-base-content/40 hover:text-error"
                          onClick={() => viewActions.remove(sub.id)}
                      >
                        <TrashIcon/>
                      </button>
                      <button
                          className="btn btn-ghost btn-sm rounded-xl gap-1 text-base-content/60 text-xs"
                          onClick={() => setDrillTarget(sub)}
                      >
                        Open <ChevronRight/>
                      </button>
                    </div>
                  </div>
              ))}
            </div>
        )}

        {songs.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-base-content/40 uppercase tracking-widest">Songs</p>
              {songs.map((song, i) => (
                  <div
                      key={song.id}
                      className="bg-base-100 border border-base-200 rounded-2xl p-3.5 flex items-center gap-3"
                  >
                    <span className="text-xs text-base-content/30 w-5 text-right shrink-0">{i + 1}</span>
                    <div className="w-8 h-8 rounded-lg bg-base-200 flex items-center justify-center text-base-content/40 shrink-0">
                      <MusicIcon/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{song.name}</p>
                      <p className="text-xs text-base-content/40 truncate">{song.author}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <a
                          href={song.url}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-ghost btn-xs rounded-lg text-xs text-base-content/50"
                      >
                        Watch
                      </a>
                      <button
                          className="btn btn-ghost btn-xs btn-circle text-base-content/40 hover:text-error"
                          onClick={() => viewActions.removeSong(song.id)}
                      >
                        <TrashIcon/>
                      </button>
                    </div>
                  </div>
              ))}
            </div>
        )}

        {showAddSong && (
            <AddSongModal
                playlistId={playlist.id}
                saving={viewActions.saving}
                onSubmit={viewActions.addSong}
                onClose={() => setShowAddSong(false)}
            />
        )}

        {showAddSub && (
            <CreatePlaylistModal
                parentId={playlist.id}
                saving={viewActions.saving}
                onSubmit={viewActions.create}
                onClose={() => setShowAddSub(false)}
            />
        )}

        {editTarget && (
            <EditPlaylistModal
                playlist={editTarget}
                saving={viewActions.saving}
                onSubmit={viewActions.update}
                onClose={() => setEditTarget(null)}
            />
        )}
      </div>
  );
}

export default function PlaylistsPage() {
  const { playlists, loading, error, reload } = useRootPlaylists();
  const actions = usePlaylistActions(reload);

  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [activePlaylist, setActivePlaylist] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this playlist?")) return;
    await actions.remove(id);
  };

  if (activePlaylist) {
    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full">
          <PlaylistView
              playlist={activePlaylist}
              onBack={() => setActivePlaylist(null)}
              actions={actions}
          />
        </div>
    );
  }

  return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold">Playlists</h1>
            <p className="text-xs text-base-content/40 mt-0.5">
              {playlists.length} playlist{playlists.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
              className="btn btn-primary btn-sm rounded-xl gap-1.5"
              onClick={() => setShowCreate(true)}
          >
            <PlusIcon/> New playlist
          </button>
        </div>

        {loading && (
            <div className="flex justify-center py-20">
              <span className="loading loading-spinner loading-md text-primary"/>
            </div>
        )}

        {!loading && error && (
            <p className="text-error text-center text-sm">{error}</p>
        )}

        {!loading && !error && playlists.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-base-content/30 gap-2">
              <FolderIcon/>
              <p className="text-sm font-medium mt-1">No playlists yet</p>
              <p className="text-xs">Create one to get started</p>
            </div>
        )}

        {!loading && !error && playlists.length > 0 && (
            <div className="flex flex-col gap-3">
              {playlists.map((p) => (
                  <PlaylistCard
                      key={p.id}
                      playlist={p}
                      onClick={setActivePlaylist}
                      onEdit={setEditTarget}
                      onDelete={handleDelete}
                  />
              ))}
            </div>
        )}

        {showCreate && (
            <CreatePlaylistModal
                parentId={null}
                saving={actions.saving}
                onSubmit={actions.create}
                onClose={() => setShowCreate(false)}
            />
        )}

        {editTarget && (
            <EditPlaylistModal
                playlist={editTarget}
                saving={actions.saving}
                onSubmit={actions.update}
                onClose={() => setEditTarget(null)}
            />
        )}
      </div>
  );
}