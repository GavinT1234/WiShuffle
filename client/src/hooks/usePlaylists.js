import { useState, useEffect, useCallback } from "react";
import {
   fetchPlaylists,
   fetchPlaylistContent,
   createPlaylist,
   updatePlaylist,
   deletePlaylist,
   addSong,
   deleteSong,
} from "../api/playlist";

export function useRootPlaylists() {
   const [playlists, setPlaylists] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   const load = useCallback(async () => {
      try {
         setLoading(true);
         const data = await fetchPlaylists();
         setPlaylists(data);
      } catch (err) {
         setError(err.message);
      } finally {
         setLoading(false);
      }
   }, []);

   useEffect(() => { load(); }, [load]);

   return { playlists, loading, error, reload: load };
}

export function usePlaylistContent(id) {
   const [content, setContent] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   const load = useCallback(async () => {
      if (!id) return;
      try {
         setLoading(true);
         const data = await fetchPlaylistContent(id);
         setContent(data);
      } catch (err) {
         setError(err.message);
      } finally {
         setLoading(false);
      }
   }, [id]);

   useEffect(() => { load(); }, [load]);

   return { content, loading, error, reload: load };
}

export function usePlaylistActions(reload) {
   const [saving, setSaving] = useState(false);

   const withSave = async (fn) => {
      setSaving(true);
      try {
         await fn();
         await reload();
      } finally {
         setSaving(false);
      }
   };

   return {
      saving,
      create: (data) => withSave(() => createPlaylist(data)),
      update: (id, data) => withSave(() => updatePlaylist(id, data)),
      remove: (id) => withSave(() => deletePlaylist(id)),
      addSong: (playlistId, data) => withSave(() => addSong(playlistId, data)),
      removeSong: (songId) => withSave(() => deleteSong(songId)),
   };
}