import { useParams, useNavigate } from "react-router-dom";
import { useRoom } from "../hooks/useRoom";
import { useSocket } from "../context/SocketContext";
import { VideoPlayer } from "../components/VideoPlayer";
import { RoomMessages } from "../components/RoomMessages";
import { useRoomSync } from "../hooks/useRoomSync";
import { useGetUser } from "../hooks/useGetUser";
import { useRef, useState } from "react";

export default function RoomPage() {
   const { id } = useParams();
   const roomId = Number(id);
   const navigate = useNavigate();

   const { socket, isConnected } = useSocket();
   const { roomState, users, isLoading } = useRoom(roomId);
   const { user: currentUser } = useGetUser();

   const playerControlsRef = useRef(null);
   const [showListeners, setShowListeners] = useState(false);

   const { playback, playlist, queueVideo, emitPlay, emitPause, emitSeek, emitNextVideo } =
       useRoomSync({
          socket,
          roomId,
          userId: socket?.id,
          playerControls: playerControlsRef,
       });

   if (isLoading) {
      return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f0f0f] gap-4">
             <div className="w-8 h-8 rounded-full border-[3px] border-[#2e2e2e] border-t-[#aa3bff] animate-spin" />
             <p className="text-[#555] text-sm">Joining room…</p>
          </div>
      );
   }

   if (!roomState) {
      return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f0f0f] gap-4">
             <p className="text-[#555] text-sm">Room not found</p>
             <button
                 onClick={() => navigate("/dashboard")}
                 className="text-[#888] text-sm border border-[#2e2e2e] rounded-md px-3 py-1.5 bg-transparent cursor-pointer hover:border-[#444] transition-colors"
             >
                ← Back to dashboard
             </button>
          </div>
      );
   }

   return (
       <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col">
          <header className="sticky top-0 z-1 flex items-center gap-3 px-4 sm:px-6 py-3 border-b border-[#1e1e1e] bg-[#0f0f0f]">
             <button
                 onClick={() => navigate("/dashboard")}
                 className="text-[#888] text-sm border border-[#2e2e2e] rounded-md px-2.5 py-1.5 bg-transparent cursor-pointer hover:border-[#444] transition-colors shrink-0"
             >
                ←
             </button>

             <span className="flex-1 text-sm font-semibold truncate">
          {roomState.room.name}
        </span>

             <button
                 className="flex items-center gap-1.5 text-xs text-[#888] sm:hidden border border-[#2e2e2e] rounded-md px-2.5 py-1.5 hover:border-[#444] transition-colors"
                 onClick={() => setShowListeners((v) => !v)}
             >
                <span className="w-1.5 h-1.5 rounded-full bg-[#aa3bff]" />
                {users.length}
             </button>

             <span className="hidden sm:flex items-center gap-1.5 text-xs text-[#888] shrink-0">
          <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-[#aa3bff]" : "bg-red-400"}`} />
                {isConnected ? "Connected" : "Disconnected"}
        </span>
          </header>

          {showListeners && (
              <div className="sm:hidden border-b border-[#1e1e1e] bg-[#111] px-4 py-3">
                 <p className="text-[11px] font-semibold uppercase tracking-widest text-[#555] mb-2">
                    Listeners · {users.length}
                 </p>
                 {users.length === 0 ? (
                     <p className="text-[#444] text-xs">No one here yet</p>
                 ) : (
                     <div className="flex flex-wrap gap-2">
                        {users.map((u) => {
                           const initials = u.username
                               ? u.username.slice(0, 2).toUpperCase()
                               : String(u.userId).slice(0, 2);
                           return (
                               <div key={u.userId} className="flex items-center gap-1.5 bg-[#1a1a1a] rounded-full px-2.5 py-1">
                    <span className="w-5 h-5 rounded-full bg-[#aa3bff22] text-[#aa3bff] text-[9px] font-bold flex items-center justify-center shrink-0">
                      {initials}
                    </span>
                                  <span className="text-xs text-[#ccc]">{u.username ?? `User ${u.userId}`}</span>
                               </div>
                           );
                        })}
                     </div>
                 )}
              </div>
          )}

          <main className="flex-1 flex flex-col lg:grid lg:grid-cols-[1fr_260px] gap-0 lg:gap-6 lg:p-6 lg:max-w-[1200px] lg:mx-auto lg:w-full lg:items-start">
             <div className="w-full">
                <VideoPlayer
                    playback={playback}
                    playlist={playlist}
                    userId={socket?.id}
                    onPlayerReady={(controls) => {
                       playerControlsRef.current = controls;
                    }}
                    onQueueVideo={queueVideo}
                    onPlay={emitPlay}
                    onPause={emitPause}
                    onSeek={emitSeek}
                    onNextVideo={emitNextVideo}
                />
             </div>

             <aside className="hidden sm:flex flex-col gap-3 lg:mt-0 px-4 lg:px-0 py-4 lg:py-0">
                <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg p-4">
                   <div className="flex items-center justify-between mb-3">
                      <h3 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-[#555]">
                         Listeners
                      </h3>
                      <span className="bg-[#2e2e2e] text-[#aaa] text-[11px] font-medium rounded-full px-2 py-0.5">
                {users.length}
              </span>
                   </div>

                   <div className="flex items-center gap-1.5 text-xs text-[#666] mb-3 lg:hidden">
                      <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? "bg-[#aa3bff]" : "bg-red-400"}`} />
                      {isConnected ? "Connected" : "Disconnected"}
                   </div>

                   {users.length === 0 ? (
                       <p className="text-[#444] text-xs">No one here yet</p>
                   ) : (
                       <div className="flex flex-col gap-1.5">
                          {users.map((u) => {
                             const initials = u.username
                                 ? u.username.slice(0, 2).toUpperCase()
                                 : String(u.userId).slice(0, 2);
                             return (
                                 <div key={u.userId} className="flex items-center gap-2.5 px-2 py-1.5 bg-[#111] rounded-md">
                      <span className="w-7 h-7 rounded-full bg-[#aa3bff22] text-[#aa3bff] text-[10px] font-bold flex items-center justify-center shrink-0">
                        {initials}
                      </span>
                                    <span className="text-[13px] text-[#ccc] flex-1 truncate">
                        {u.username ?? `User ${u.userId}`}
                      </span>
                                 </div>
                             );
                          })}
                       </div>
                   )}
                </div>

                <RoomMessages 
                   socket={socket} 
                   roomId={roomId} 
                   userId={currentUser?.id}
                />
             </aside>
          </main>
       </div>
   );
}