import { useEffect, useState } from "react";
import { getTags } from "../api/room.js";

const XSmall = () => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
);

const GenreSelect = ({ selected, onChange }) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    getTags().then(setGenres).catch(console.error);
  }, []);

  const filtered = genres.filter((g) =>
      g.toLowerCase().includes(query.toLowerCase())
  );

  const toggle = (genre) => {
    onChange(
        selected.includes(genre)
            ? selected.filter((g) => g !== genre)
            : [...selected, genre]
    );
  };

  return (
      <div className="flex flex-col gap-2 w-full">
        <div className="relative">
          <input
              type="text"
              className="input input-sm w-full"
              placeholder="Search genres..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsOpen(true)}
              onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          />
          {isOpen && filtered.length > 0 && (
              <ul className="absolute z-50 top-full mt-1 w-full bg-base-100 border border-base-300 rounded-xl shadow-md max-h-44 overflow-y-auto">
                {filtered.map((g) => (
                    <li
                        key={g}
                        onMouseDown={() => toggle(g)}
                        className={`px-3 py-2 text-sm cursor-pointer transition-colors hover:bg-base-200 ${
                            selected.includes(g)
                                ? "text-primary font-medium"
                                : "text-base-content/70"
                        }`}
                    >
                      {g.toLowerCase()}
                    </li>
                ))}
              </ul>
          )}
        </div>

        {selected.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {selected.map((g) => (
                  <span
                      key={g}
                      className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
                  >
              {g.toLowerCase()}
                    <button
                        type="button"
                        onClick={() => toggle(g)}
                        className="opacity-50 hover:opacity-100 transition-opacity"
                    >
                <XSmall />
              </button>
            </span>
              ))}
            </div>
        )}
      </div>
  );
};

export default GenreSelect;