import { useState } from "react";

const MOCK_RESULTS = [
   { id: "5qap5aO4i9A", title: "lofi hip hop radio - beats to relax/study to", channel: "Lofi Girl" },
   { id: "jfKfPfyJRdk", title: "lofi hip hop radio - beats to sleep/chill to", channel: "Lofi Girl" },
   { id: "DWcJFNfaw9c", title: "night drive playlist — chill rap & lo-fi", channel: "vibe playlist" },
   { id: "4xDzrJKXOOY", title: "synthwave rides again (full album)", channel: "Darksynth" },
   { id: "HMnrl6UD8cw", title: "phonk drift mix 2024", channel: "PHONKR" },
];

// TODO: replace with real YouTube API call
const searchYouTube = async (query) => {
   // const res = await fetch(
   //   `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(query)}&key=${import.meta.env.VITE_YOUTUBE_API_KEY}&maxResults=10`
   // );
   // const data = await res.json();
   // return data.items.map((item) => ({
   //   id: item.id.videoId,
   //   title: item.snippet.title,
   //   channel: item.snippet.channelTitle,
   //   thumbnail: item.snippet.thumbnails.default.url,
   // }));
   return MOCK_RESULTS;
};

export const SongSearchModal = ({ playlistId, onSongsAdded }) => {
   const [query, setQuery] = useState("");
   const [results, setResults] = useState([]);
   const [addedSongs, setAddedSongs] = useState([]);
   const [loading, setLoading] = useState(false);
   const [activeTab, setActiveTab] = useState("results");

   const handleSearch = async () => {
      if (!query.trim()) return;
      setLoading(true);
      try {
         const data = await searchYouTube(query);
         setResults(data);
      } finally {
         setLoading(false);
      }
   };

   const toggleSong = (song) => {
      setAddedSongs((prev) =>
          prev.find((s) => s.id === song.id)
              ? prev.filter((s) => s.id !== song.id)
              : [...prev, song]
      );
   };

   const isAdded = (id) => addedSongs.some((s) => s.id === id);

   const handleConfirm = () => {
      if (addedSongs.length === 0) return;
      // TODO: replace with real service call
      // await addSongsToPlaylist(playlistId, addedSongs);
      onSongsAdded?.(addedSongs);
      setAddedSongs([]);
      setResults([]);
      setQuery("");
      document.getElementById("song_search_modal").close();
   };

   const handleClose = () => {
      setAddedSongs([]);
      setResults([]);
      setQuery("");
      setActiveTab("results");
   };

   return (
       <>
          <button
              className="btn btn-outline btn-sm"
              onClick={() => document.getElementById("song_search_modal").showModal()}
          >
             + Add Songs
          </button>

          <dialog id="song_search_modal" className="modal">
             <div className="modal-box bg-base-200 max-w-lg">
                <div className="flex items-center justify-between mb-4">
                   <h3 className="font-bold text-lg">Add Songs</h3>
                   <span className="badge badge-outline badge-warning text-xs">YouTube API</span>
                </div>

                {/* Search bar */}
                <div className="flex gap-2 mb-3">
                   <input
                       type="text"
                       placeholder="Search YouTube..."
                       className="input input-bordered flex-1"
                       value={query}
                       onChange={(e) => setQuery(e.target.value)}
                       onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                   />
                   <button
                       className={`btn bg-[#aa3bff] text-white border-[#aa3bff] hover:bg-[#8b28cc] hover:border-[#8b28cc] ${loading ? "loading" : ""}`}
                       onClick={handleSearch}
                       disabled={loading}
                   >
                      Search
                   </button>
                </div>

                {/* Remove this block when backend is ready */}
                <div className="text-xs text-base-content/30 border border-dashed border-base-content/10 rounded-lg p-3 mb-3">
                   GET youtube/v3/search?q=... — add VITE_YOUTUBE_API_KEY to .env
                </div>

                {/* Tabs */}
                <div className="tabs tabs-bordered mb-3">
                   <button
                       className={`tab ${activeTab === "results" ? "tab-active" : ""}`}
                       onClick={() => setActiveTab("results")}
                   >
                      Results
                   </button>
                   <button
                       className={`tab ${activeTab === "added" ? "tab-active" : ""}`}
                       onClick={() => setActiveTab("added")}
                   >
                      Added {addedSongs.length > 0 && `(${addedSongs.length})`}
                   </button>
                </div>

                {/* Results list */}
                <div className="flex flex-col gap-1 max-h-56 overflow-y-auto">
                   {activeTab === "results" && (
                       results.length === 0 ? (
                           <p className="text-center text-base-content/30 text-sm py-8">
                              Search for songs above to see results
                           </p>
                       ) : (
                           results.map((song) => (
                               <SongItem
                                   key={song.id}
                                   song={song}
                                   added={isAdded(song.id)}
                                   onToggle={() => toggleSong(song)}
                               />
                           ))
                       )
                   )}

                   {activeTab === "added" && (
                       addedSongs.length === 0 ? (
                           <p className="text-center text-base-content/30 text-sm py-8">
                              No songs added yet
                           </p>
                       ) : (
                           addedSongs.map((song) => (
                               <SongItem
                                   key={song.id}
                                   song={song}
                                   added={true}
                                   onToggle={() => toggleSong(song)}
                                   removeMode
                               />
                           ))
                       )
                   )}
                </div>

                <div className="modal-action">
                   <form method="dialog">
                      <button className="btn btn-ghost" onClick={handleClose}>Cancel</button>
                   </form>
                   <button
                       className="btn bg-[#aa3bff] text-white border-[#aa3bff] hover:bg-[#8b28cc] hover:border-[#8b28cc]"
                       onClick={handleConfirm}
                       disabled={addedSongs.length === 0}
                   >
                      Add to Playlist
                   </button>
                </div>
             </div>

             <form method="dialog" className="modal-backdrop">
                <button onClick={handleClose}>close</button>
             </form>
          </dialog>
       </>
   );
};

const SongItem = ({ song, added, onToggle, removeMode = false }) => (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-base-300 transition-colors">
       {/* Thumbnail placeholder — swap with <img src={song.thumbnail} /> when real */}
       <div className="w-14 h-10 rounded bg-base-300 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 fill-base-content/30" viewBox="0 0 16 16">
             <path d="M4 3l9 5-9 5V3z" />
          </svg>
       </div>

       <div className="flex-1 min-w-0">
          <p className="text-sm truncate">{song.title}</p>
          <p className="text-xs text-base-content/40">{song.channel}</p>
       </div>

       <button
           onClick={onToggle}
           className={`btn btn-xs btn-outline`} style={{borderColor: added ? '#aa3bff' : '#aa3bff', color: added ? '#aa3bff' : '#aa3bff'}}
       >
          {removeMode ? "✕ Remove" : added ? "✓ Added" : "+ Add"}
       </button>
    </div>
);