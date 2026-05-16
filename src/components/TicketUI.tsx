import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { 
  FiX, 
  FiCalendar, 
  FiClock, 
  FiMapPin, 
  FiUser, 
  FiUsers, 
  FiSmartphone,
  FiExternalLink,
  FiCheckCircle,
  FiInfo
} from "react-icons/fi";
import { format } from "date-fns";
import { Logo } from "./Logo";

interface TicketProps {
  ticket: {
    _id: string;
    ticketCode: string;
    status: string;
    registrationDetails: {
      fullName: string;
      email: string;
      teamName?: string;
      teamId?: string;
      phone?: string;
      organization?: string;
    };
    event: {
      title: string;
      category: string;
      date: string;
      location: string;
      teamType: string;
    };
    createdAt: string;
  };
}

export function TicketUI({ ticket }: TicketProps) {
  const [isOpen, setIsOpen] = useState(false);

  const eventDate = new Date(ticket.event.date);

  return (
    <>
      {/* MINIMAL TICKET (Image 3 Style) */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(true)}
        className="relative w-full max-w-[340px] aspect-[4/5] cursor-pointer group"
      >
        <div className="absolute inset-0 bg-blue-600 rounded-[3rem] shadow-2xl overflow-hidden">
          {/* Top White Section */}
          <div className="bg-white h-[45%] rounded-b-[2.5rem] p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                {format(eventDate, "HH:mm")}
              </div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                {format(eventDate, "HH:mm")}
              </div>
            </div>
            <div className="flex justify-between items-end mb-2">
              <div className="text-xl font-black text-foreground tracking-tight">
                {ticket.event.category}
              </div>
              <div className="text-xl font-black text-foreground tracking-tight">
                {ticket.event.title.split(" ")[0]}
              </div>
            </div>
            <div className="relative h-0.5 bg-foreground/10 mb-4">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 border-blue-600 bg-white" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-600" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-2 bg-white text-[8px] font-bold text-muted-foreground uppercase">
                {ticket.event.teamType}
              </div>
            </div>
            <div className="flex gap-2">
              <div className="px-3 py-1 rounded-full bg-foreground/5 text-[8px] font-bold uppercase">
                {ticket.ticketCode}
              </div>
              <div className="px-3 py-1 rounded-full bg-foreground/5 text-[8px] font-bold uppercase">
                {ticket.registrationDetails.teamId || "SOLO"}
              </div>
            </div>
          </div>

          {/* Bottom Blue Section */}
          <div className="h-[55%] flex flex-col items-center justify-center p-6 text-white text-center">
            {/* STYLIZED QR CODE PLACEHOLDER */}
            <div className="w-24 h-24 bg-white rounded-2xl p-2 mb-6 shadow-glow transition-transform group-hover:scale-110 duration-500">
               <svg viewBox="0 0 24 24" className="w-full h-full text-blue-600">
                 <path fill="currentColor" d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v2h-3v-2zm-3 0h2v2h-2v-2zm3 3h3v2h-3v-2zm-3 0h2v2h-2v-2zm3 3h3v2h-3v-2zm-3 0h2v2h-2v-2z" />
               </svg>
            </div>
            <div className="font-bold text-sm mb-1 uppercase tracking-tight">Event Access Ready!</div>
            <div className="text-[10px] opacity-70 mb-6">Tap to view full details</div>
            
            <div className="flex gap-2 w-full">
              <div className="flex-1 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-[9px] font-bold uppercase">
                {ticket.registrationDetails.teamId ? "Team Entry" : "General"}
              </div>
              <div className="flex-1 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-[9px] font-bold uppercase">
                Gate: 5
              </div>
            </div>
          </div>
        </div>

        {/* OVERLAY BUTTON */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600/20 backdrop-blur-[2px] rounded-[3rem]">
          <div className="px-6 py-2 rounded-full bg-white text-blue-600 font-bold text-sm shadow-2xl">
            OPEN
          </div>
        </div>
      </motion.div>

      {/* DETAILED TICKET (Image 2 Style) */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-border"
            >
              {/* TOP HEADER */}
              <div className="p-8 pb-4">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg">
                      <FiSmartphone size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-black text-foreground leading-none">{ticket.event.category} {ticket.ticketCode.slice(0,4)}</div>
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                        Verified Ticket
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-foreground uppercase tracking-tight">
                      {format(eventDate, "EEE, d MMM")}
                    </div>
                    <div className="text-[10px] font-bold text-emerald-500 flex items-center justify-end gap-1 mt-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active
                    </div>
                  </div>
                </div>

                {/* ROUTE / TIMELINE */}
                <div className="flex justify-between items-center mb-8">
                  <div className="flex-1">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Registration</div>
                    <div className="text-xl font-black text-foreground truncate">{ticket.registrationDetails.fullName}</div>
                    <div className="text-3xl font-black text-blue-600 mt-1 leading-none">{format(eventDate, "HH:mm")}</div>
                  </div>
                  <div className="flex-[0.5] flex flex-col items-center px-4">
                    <div className="w-full relative h-px bg-foreground/10 mb-2">
                       <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-2 py-0.5 bg-foreground/5 rounded-full text-[8px] font-bold text-muted-foreground whitespace-nowrap">
                         DURATION: 4H
                       </div>
                    </div>
                    <div className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">Entry Open</div>
                  </div>
                  <div className="flex-1 text-right">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Event Location</div>
                    <div className="text-xl font-black text-foreground truncate">{ticket.event.location.split(",")[0]}</div>
                    <div className="text-3xl font-black text-foreground mt-1 leading-none">---</div>
                  </div>
                </div>

                {/* PASSENGER DETAILS */}
                <div className="grid grid-cols-3 border-t border-dashed border-foreground/10 py-6 mb-2">
                  <div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Participant</div>
                    <div className="text-sm font-black text-foreground">{ticket.registrationDetails.fullName.split(" ")[0]}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Team ID</div>
                    <div className="text-sm font-black text-foreground">{ticket.registrationDetails.teamId || "N/A"}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Team Type</div>
                    <div className="text-sm font-black text-foreground">{ticket.event.teamType}</div>
                  </div>
                </div>
              </div>

              {/* BOTTOM SECTION */}
              <div className="bg-foreground/[0.02] p-8 pt-6 flex justify-between items-end border-t border-border">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 text-blue-600 text-[10px] font-black uppercase mb-4">
                    GATE: {ticket.registrationDetails.teamId ? "A-12" : "G-4"}
                  </div>
                  <div className="text-sm font-black text-foreground">Admission Confirmed!</div>
                  <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                    Starts in <span className="text-blue-600 font-bold">15:13</span>
                  </div>
                </div>
                
                <div className="text-right flex flex-col items-end">
                   <div className="w-20 h-20 bg-white border-2 border-border rounded-xl p-1 mb-2">
                      <svg viewBox="0 0 24 24" className="w-full h-full text-foreground">
                        <path fill="currentColor" d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v2h-3v-2zm-3 0h2v2h-2v-2zm3 3h3v2h-3v-2zm-3 0h2v2h-2v-2zm3 3h3v2h-3v-2zm-3 0h2v2h-2v-2z" />
                      </svg>
                   </div>
                   <div className="text-[8px] font-bold text-muted-foreground uppercase">Tap to scan</div>
                </div>
              </div>

              {/* CLOSE BUTTON */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-foreground/5 text-muted-foreground transition-colors"
              >
                <FiX size={20} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
