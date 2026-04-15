import React from "react";
import { useCreateRoom } from "../hooks/useCreateRoom";
import { useState } from "react";
import LoadingRing from "../components/LoadingRing";

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

const GenreSelect = ({ selected, onChange }) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filtered = GENRES.filter((g) =>
    g.toLowerCase().includes(query.toLowerCase())
  );

  const toggleGenre = (genre) => {
    const updated = selected.includes(genre)
      ? selected.filter((g) => g !== genre)
      : [...selected, genre];
    onChange(updated);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        className="input w-full"
        placeholder="Search genres..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
      />
      <div className="flex flex-wrap gap-1 mt-2">
        {selected.map((g) => (
          <span
            key={g}
            className="badge badge-sm rounded-full text-xs px-2 py-0.5 text-base-content/60 gap-1"
          >
            #{g.toLowerCase()}
            <button type="button" onClick={() => toggleGenre(g)}>
              ×
            </button>
          </span>
        ))}
      </div>
      {isOpen && (
        <ul className="absolute z-50 bg-base-200 border border-base-300 rounded-box w-full max-h-48 overflow-y-auto mt-1 shadow-lg">
          {filtered.map((g) => (
            <li
              key={g}
              className={`px-4 py-2 cursor-pointer hover:bg-base-300 ${
                selected.includes(g) ? "text-secondary font-semibold" : ""
              }`}
              onMouseDown={() => toggleGenre(g)}
            >
              #{g.toLowerCase()}
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="px-4 py-2 text-base-content/50">No results</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default GenreSelect;
