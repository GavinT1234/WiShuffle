import { useState, useEffect } from 'react';
import { useRootPlaylists } from '../hooks/usePlaylists';
import { fetchPlaylistContent } from '../api/playlist';

export function PlaylistImportModal({ isOpen, onClose, onImport }) {
    const { playlists, loading, error } = useRootPlaylists();
    const [selectedId, setSelectedId] = useState(null);
    const [importing, setImporting] = useState(false);

    const handleImport = async () => {
        if (!selectedId) return;
        
        setImporting(true);
        try {
            const playlistItem = playlists.find(p => p.id === selectedId);
            const songs = await fetchAllSongsRecursive(selectedId, playlistItem.shuffle);
            onImport(songs);
            setSelectedId(null);
            onClose();
        } catch (err) {
            console.error('Import failed:', err);
            alert('Failed to import playlist');
        } finally {
            setImporting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={styles.modalOverlay} onClick={onClose}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h2 style={styles.modalTitle}>Import Playlist</h2>
                
                {loading ? (
                    <p style={styles.loadingText}>Loading playlists...</p>
                ) : error ? (
                    <p style={styles.errorText}>Error: {error}</p>
                ) : (
                    <div style={styles.playlistsContainer}>
                        {playlists.length === 0 ? (
                            <p style={styles.emptyText}>No playlists found</p>
                        ) : (
                            playlists.map((playlist) => (
                                <button
                                    key={playlist.id}
                                    style={{
                                        ...styles.playlistOption,
                                        ...(selectedId === playlist.id ? styles.playlistOptionSelected : {}),
                                    }}
                                    onClick={() => setSelectedId(playlist.id)}
                                >
                                    <input
                                        type="radio"
                                        checked={selectedId === playlist.id}
                                        onChange={() => setSelectedId(playlist.id)}
                                        style={styles.radio}
                                    />
                                    <span>{playlist.name}</span>
                                </button>
                            ))
                        )}
                    </div>
                )}

                <div style={styles.modalFooter}>
                    <button
                        style={styles.btnSecondary}
                        onClick={onClose}
                        disabled={importing}
                    >
                        Cancel
                    </button>
                    <button
                        style={styles.btnPrimary}
                        onClick={handleImport}
                        disabled={!selectedId || importing}
                    >
                        {importing ? 'Importing...' : 'Import'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// Recursively fetch all songs from a playlist, respecting shuffle settings
// Add this temporary logging to debug

async function fetchAllSongsRecursive(playlistId, shuffle) {
    const content = await fetchPlaylistContent(playlistId);
    console.log('Fetched content for playlist', playlistId, ':', content);
    if (shuffle) {
        for (let i = content.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [content[i], content[j]] = [content[j], content[i]];
        }
    }
    let songs = [];

    for (const item of content) {
        
        console.log('Processing item:', item);
        
        if (item.isSong) {
            // It's a song, add it directly
            songs.push(item);
        } else {
            // It's a subplaylist, recursively fetch its songs
            const subSongs = await fetchAllSongsRecursive(item.id, item.shuffle);
            songs = songs.concat(subSongs);
        }
    }

    console.log('Final songs array:', songs);
    return songs;
}

const styles = {
    modalOverlay: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    },
    modalContent: {
        background: '#1a1a1a',
        border: '1px solid #2e2e2e',
        borderRadius: '8px',
        padding: '24px',
        width: '90%',
        maxWidth: '400px',
        maxHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
    },
    modalTitle: {
        margin: '0 0 16px 0',
        color: '#fff',
        fontSize: '16px',
        fontWeight: '600',
    },
    playlistsContainer: {
        flex: 1,
        overflowY: 'auto',
        marginBottom: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    playlistOption: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px',
        background: '#111',
        border: '1px solid #2e2e2e',
        borderRadius: '6px',
        color: '#ccc',
        fontSize: '13px',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.2s',
    },
    playlistOptionSelected: {
        background: '#2a1a3d',
        borderColor: '#aa3bff',
        color: '#fff',
    },
    radio: {
        cursor: 'pointer',
        accentColor: '#aa3bff',
    },
    loadingText: {
        color: '#666',
        fontSize: '13px',
        margin: '24px 0',
        textAlign: 'center',
    },
    errorText: {
        color: '#e74c3c',
        fontSize: '13px',
        margin: '24px 0',
        textAlign: 'center',
    },
    emptyText: {
        color: '#666',
        fontSize: '13px',
        textAlign: 'center',
        margin: '24px 0',
    },
    modalFooter: {
        display: 'flex',
        gap: '8px',
        justifyContent: 'flex-end',
    },
    btnPrimary: {
        padding: '8px 16px',
        background: '#aa3bff',
        border: 'none',
        borderRadius: '6px',
        color: '#fff',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    btnSecondary: {
        padding: '8px 16px',
        background: 'transparent',
        border: '1px solid #2e2e2e',
        borderRadius: '6px',
        color: '#888',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
    },
};