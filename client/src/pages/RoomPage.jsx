import { useParams, useNavigate } from "react-router-dom";
import { useRoom } from "../hooks/useRoom";
import { useSocket } from "../context/SocketContext";
import { VideoPlayer } from "../components/VideoPlayer";
import { useRoomSync } from "../hooks/useRoomSync";
import { useRef } from "react";

const PLAYER_DIV_ID = 'yt-player-container';

export default function RoomPage() {
   const { id } = useParams();
   const roomId = Number(id);
   const navigate = useNavigate();

   const { socket, isConnected } = useSocket();
   const { roomState, users, isLoading } = useRoom(roomId);

   //console.log('🔌 RoomPage socket:', socket?.id);
   const playerControlsRef = useRef(null);

   // ─── Placeholder: swap when useRoomSync is ready ─────────────────────────
   const { playback, djQueue, isDJ, joinQueue, leaveQueue,
      emitPlay, emitPause, emitSeek, passDJ, queueVideo,
      loadVideo, localPlaying  // expose these too
   } = useRoomSync({ socket, roomId, userId: socket?.id, playerControls: playerControlsRef });
   // const isDJ = false;
   // const djQueue = [];
   // ─────────────────────────────────────────────────────────────────────────

   if (isLoading) {
      return (
         <div className="flex flex-col items-center justify-center h-full bg-[#0f0f0f] gap-4">
            <div className="w-8 h-8 rounded-full border-[3px] border-[#2e2e2e] border-t-[#aa3bff] animate-spin" />
            <p className="text-[#555] text-sm">Joining room…</p>
         </div>
      );
   }

   if (!roomState) {
      return (
         <div className="flex flex-col items-center justify-center h-full bg-[#0f0f0f] gap-4">
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
      <div className="min-h-screen bg-[#0f0f0f] text-white">

         {/* ── Header ── */}
         <header className="sticky top-0 z-10 flex items-center gap-4 px-6 py-3.5 border-b border-[#1e1e1e] bg-[#0f0f0f]">
            <button
               onClick={() => navigate("/dashboard")}
               className="text-[#888] text-sm border border-[#2e2e2e] rounded-md px-3 py-1.5 bg-transparent cursor-pointer hover:border-[#444] transition-colors"
            >
               ← Back
            </button>
            <span className="flex-1 text-base font-semibold">
               {roomState.room.name}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-[#888]">
               <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-400" : "bg-red-400"}`} />
               {isConnected ? "Connected" : "Disconnected"}
            </span>
         </header>

         {/* ── Main layout ── */}
         <main className="grid grid-cols-[1fr_260px] gap-6 p-6 max-w-[1200px] mx-auto items-start">

            {/* ── Left: Video Player placeholder ── */}
            <div>
               {/* TODO: swap with <VideoPlayer /> once built 
                <div className="w-full aspect-video bg-[#1a1a1a] border border-[#2e2e2e] rounded-xl flex flex-col items-center justify-center gap-3">
                   <span className="text-4xl text-[#2e2e2e]">▶</span>
                   <p className="text-sm font-semibold text-[#444] m-0">Video Player</p>
                   <p className="text-xs text-[#333] m-0">
                      Coming soon — drop in &lt;VideoPlayer /&gt; here
                   </p>
                   {isDJ && (
                       <div className="flex gap-3 mt-3">
                          {["⏮", "⏸", "⏭"].map((icon) => (
                              <button
                                  key={icon}
                                  className="bg-[#2e2e2e] border-none rounded-md text-[#aaa] px-3.5 py-2 text-base cursor-pointer hover:bg-[#3e3e3e] transition-colors"
                              >
                                 {icon}
                              </button>
                          ))}
                       </div>
                   )}
                </div>*/}
               <VideoPlayer
                  isDJ={isDJ}
                  playback={playback}
                  djQueue={djQueue}
                  userId={socket?.id}
                  onPlayerReady={(controls) => { playerControlsRef.current = controls; }}
                  onQueueVideo={queueVideo}
                  onPlay={emitPlay}
                  onPause={emitPause}
                  onSeek={emitSeek}
                  onPassDJ={passDJ}
                  onJoinQueue={joinQueue}
                  onLeaveQueue={leaveQueue}
               />
            </div>

            {/* ── Right: Sidebar ── */}
            <aside className="flex flex-col gap-3">

               {/* Listeners */}
               <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg p-4">
                  <h3 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-[#555] mb-3">
                     Listeners
                     <span className="bg-[#2e2e2e] text-[#aaa] text-[11px] font-medium normal-case tracking-normal rounded-full px-2 py-0.5">
                        {users.length}
                     </span>
                  </h3>
                  {users.length === 0 ? (
                     <p className="text-[#444] text-xs m-0">No one here yet</p>
                  ) : (
                     <div className="flex flex-col gap-1.5">
                        {users.map((u) => {
                           const initials = u.username
                              ? u.username.slice(0, 2).toUpperCase()
                              : String(u.userId).slice(0, 2);
                           const isCurrentDJ = djQueue[0] === String(u.userId);

                           return (
                              <div key={u.userId} className="flex items-center gap-2.5 px-2 py-1.5 bg-[#111] rounded-md">
                                 <span className="w-7 h-7 rounded-full bg-[#aa3bff22] text-[#aa3bff] text-[10px] font-bold flex items-center justify-center shrink-0">
                                    {initials}
                                 </span>
                                 <span className="text-[13px] text-[#ccc] flex-1">
                                    {u.username ?? `User ${u.userId}`}
                                 </span>
                                 {isCurrentDJ && (
                                    <span className="text-[10px] font-bold text-[#aa3bff] bg-[#aa3bff22] px-1.5 py-0.5 rounded">
                                       DJ
                                    </span>
                                 )}
                              </div>
                           );
                        })}
                     </div>
                  )}
               </div>

               {/* DJ Queue */}
               <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg p-4">
                  <h3 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-[#555] mb-3">
                     DJ Queue
                     <span className="bg-[#2e2e2e] text-[#aaa] text-[11px] font-medium normal-case tracking-normal rounded-full px-2 py-0.5">
                        {djQueue.length}
                     </span>
                  </h3>
                  {/* TODO: wire up joinQueue / leaveQueue from useRoomSync */}
                  {/* <p className="text-[#444] text-xs m-0">Queue coming soon</p> */}
                  {djQueue.length === 0 ? (
                     <p className="text-[#444] text-xs m-0">No DJs yet</p>
                  ) : (
                     <ol className="list-none m-0 p-0 flex flex-col gap-1.5">
                        {djQueue.map((userId, i) => (
                           <li key={userId} className="flex items-center gap-2.5 px-2 py-1.5 bg-[#111] rounded-md text-[13px]">
                              <span className="text-[#555] w-5">
                                 {i === 0 ? '🎧' : `${i + 1}.`}
                              </span>
                              <span className="text-[#ccc]">
                                 {userId === socket?.id ? 'You' : `User ${userId.slice(0, 8)}`}
                              </span>
                           </li>
                        ))}
                     </ol>
                  )}
               </div>

            </aside>
         </main>
      </div>
   );
}