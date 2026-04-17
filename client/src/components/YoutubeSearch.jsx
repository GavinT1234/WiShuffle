import { useState } from 'react';

export function YoutubeSearch({ onSelectVideo }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/youtube/search?q=${encodeURIComponent(query)}&maxResults=8`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) throw new Error('Search failed');

      const data = await response.json();
      setResults(data.results);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
      alert('Failed to search YouTube');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectVideo = (video) => {
    onSelectVideo(video.videoId, video.title);
    setShowResults(false);
    setQuery('');
    setResults([]);
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSearch} style={styles.searchForm}>
        <input
          style={styles.searchInput}
          placeholder="Search YouTube..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button style={styles.searchBtn} type="submit" disabled={loading}>
          {loading ? '🔍...' : '🔍 Search'}
        </button>
      </form>

      {showResults && (
        <div style={styles.resultsContainer}>
          <div style={styles.resultsHeader}>
            <span>Search Results ({results.length})</span>
            <button 
              style={styles.closeBtn} 
              onClick={() => setShowResults(false)}
            >
              ✕
            </button>
          </div>
          
          {results.length === 0 ? (
            <p style={styles.noResults}>No videos found</p>
          ) : (
            <div style={styles.resultsList}>
              {results.map((video) => (
                <div key={video.videoId} style={styles.resultItem}>
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    style={styles.thumbnail}
                  />
                  <div style={styles.videoInfo}>
                    <div style={styles.videoTitle}>{video.title}</div>
                    <div style={styles.videoMeta}>
                      {video.channelTitle} • {video.duration}
                    </div>
                  </div>
                  <button
                    style={styles.addBtn}
                    onClick={() => handleSelectVideo(video)}
                  >
                    + Add
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
  },
  searchForm: {
    display: 'flex',
    gap: '8px',
  },
  searchInput: {
    flex: 1,
    padding: '8px 12px',
    background: '#111',
    border: '1px solid #2e2e2e',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '13px',
    outline: 'none',
  },
  searchBtn: {
    padding: '7px 14px',
    background: '#aa3bff',
    border: 'none',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  resultsContainer: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    left: 0,
    right: 0,
    background: '#1a1a1a',
    border: '1px solid #2e2e2e',
    borderRadius: '8px',
    maxHeight: '400px',
    overflow: 'hidden',
    zIndex: 100,
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  },
  resultsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    borderBottom: '1px solid #2e2e2e',
    fontSize: '13px',
    fontWeight: '600',
    color: '#666',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#666',
    fontSize: '16px',
    cursor: 'pointer',
    padding: '0',
  },
  resultsList: {
    overflowY: 'auto',
    maxHeight: '350px',
  },
  resultItem: {
    display: 'flex',
    gap: '12px',
    padding: '12px 16px',
    borderBottom: '1px solid #2e2e2e',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  thumbnail: {
    width: '80px',
    height: '45px',
    objectFit: 'cover',
    borderRadius: '4px',
    flexShrink: 0,
  },
  videoInfo: {
    flex: 1,
    minWidth: 0,
  },
  videoTitle: {
    fontSize: '13px',
    color: '#ddd',
    marginBottom: '4px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  videoMeta: {
    fontSize: '11px',
    color: '#666',
  },
  addBtn: {
    padding: '6px 12px',
    background: '#aa3bff',
    border: 'none',
    borderRadius: '4px',
    color: '#fff',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    flexShrink: 0,
  },
  noResults: {
    padding: '24px',
    textAlign: 'center',
    color: '#666',
    fontSize: '13px',
  },
};