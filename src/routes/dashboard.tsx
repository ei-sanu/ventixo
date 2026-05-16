import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FiActivity,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiExternalLink,
  FiLayout,
  FiMoreVertical,
  FiPlus,
  FiSettings,
  FiUser,
  FiUsers,
  FiXCircle,
  FiSearch,
  FiMail,
} from "react-icons/fi";
import { PageShell } from "@/components/PageShell";
import { toast } from "sonner";
import { format } from "date-fns";
import { useDbUser } from "@/hooks/use-db-user";
import { getAuthToken } from "@/lib/auth";

export const Route = createFileRoute("/dashboard")({
  component: OrganizerDashboard,
});

interface EventSummary {
  _id: string;
  title: string;
  category: string;
  teamType: string;
  status: "pending" | "approved" | "rejected";
  date: string;
  participants: string[];
  maxParticipants: number;
  createdAt: string;
}

interface ParticipantDetail {
  _id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  email: string;
  userId: string;
  registrationDetails?: {
    fullName: string;
    email: string;
    phone: string;
    organization: string;
    socialLink: string;
    message: string;
  };
}

function OrganizerDashboard() {
  const { dbUser, loading: userLoading } = useDbUser();
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [participants, setParticipants] = useState<ParticipantDetail[]>([]);
  const [selectedParticipant, setSelectedParticipant] = useState<ParticipantDetail | null>(null);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchMyEvents = async (silent = false) => {
    if (!dbUser) return;
    if (!silent) setLoading(true);
    else setIsRefreshing(true);
    
    try {
      const token = getAuthToken();
      const response = await fetch("/api/events/my-events", {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache"
        },
      });
      if (!response.ok) throw new Error("Failed to fetch events");
      const json = await response.json();
      setEvents(json.data.events);
    } catch (err) {
      console.error(err);
      toast.error("Could not load your events");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleSyncProfile = async () => {
    setIsRefreshing(true);
    try {
      const token = getAuthToken();
      const response = await fetch("/api/users/sync-events", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to sync profile");
      toast.success("Profile re-synced successfully");
      await fetchMyEvents(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to re-sync profile");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, [dbUser?.userId]);

  const fetchParticipants = async (eventId: string) => {
    setSelectedEventId(eventId);
    setSelectedParticipant(null);
    setLoadingParticipants(true);
    try {
      const token = getAuthToken();
      const response = await fetch(`/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch participants");
      const json = await response.json();
      
      // Combine participant user info with their ticket registration details
      const tickets = json.data.tickets || [];
      const participantsWithDetails = json.data.event.participants.map((p: any) => {
        const ticket = tickets.find((t: any) => t.user?._id === p._id || t.user === p._id);
        return {
          ...p,
          registrationDetails: ticket?.registrationDetails
        };
      });
      
      setParticipants(participantsWithDetails);
    } catch (err) {
      console.error(err);
      toast.error("Could not load participants");
    } finally {
      setLoadingParticipants(false);
    }
  };

  if (loading || userLoading) {
    return (
      <PageShell>
        <div className="min-h-screen flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
        </div>
      </PageShell>
    );
  }

  const stats = {
    total: events.length,
    approved: events.filter((e) => e.status === "approved").length,
    pending: events.filter((e) => e.status === "pending").length,
    totalParticipants: events.reduce((acc, e) => acc + e.participants.length, 0),
  };

  return (
    <PageShell>
      <div className="min-h-screen bg-background pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Organizer Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Manage your events, track registrations, and analyze engagement.
              </p>
              <div className="mt-4 flex items-center gap-2 text-[10px] bg-foreground/5 w-fit px-3 py-1.5 rounded-full border border-border">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Logged in as <span className="font-bold text-foreground">{dbUser?.email}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleSyncProfile}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl glass border-border font-bold hover:bg-foreground/5 transition disabled:opacity-50"
                title="Use this if your events are missing"
              >
                <FiActivity className={isRefreshing ? "animate-spin" : ""} />
                {isRefreshing ? "Syncing..." : "Re-sync Profile"}
              </button>
              <button
                onClick={() => fetchMyEvents(true)}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl glass border-border font-bold hover:bg-foreground/5 transition disabled:opacity-50"
              >
                <FiClock className={isRefreshing ? "animate-spin" : ""} />
                Refresh
              </button>
              <Link
                to="/create-event"
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-foreground text-background font-bold hover:scale-[1.02] transition shadow-card"
              >
                <FiPlus />
                Create New Event
              </Link>
              <Link
                to="/profile"
                className="flex items-center gap-2 px-6 py-3 rounded-2xl glass border-border font-bold hover:bg-foreground/5 transition"
              >
                <FiUser />
                View Profile
              </Link>
            </div>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {[
              { label: "Total Events", value: stats.total, icon: FiLayout, color: "blue" },
              { label: "Approved", value: stats.approved, icon: FiCheckCircle, color: "emerald" },
              { label: "Pending", value: stats.pending, icon: FiClock, color: "amber" },
              { label: "Total Reach", value: stats.totalParticipants, icon: FiUsers, color: "indigo" },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-3xl p-6 border-border shadow-soft"
              >
                <div className={`h-10 w-10 rounded-xl bg-${s.color}-500/10 text-${s.color}-500 flex items-center justify-center mb-4`}>
                  <s.icon size={20} />
                </div>
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mt-1">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* EVENTS LIST */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-xl font-bold px-2 flex items-center gap-2">
                <FiActivity className="text-muted-foreground" />
                Your Hosted Events
              </h3>
              
              {events.length === 0 ? (
                <div className="text-center py-20 glass rounded-[2.5rem] border-border">
                  <FiCalendar size={40} className="mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">You haven't created any events yet.</p>
                  <Link to="/create-event" className="text-blue-500 hover:underline mt-4 inline-block text-sm font-medium">
                    Create your first event
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4">
                  {events.map((event) => (
                    <motion.div
                      key={event._id}
                      layoutId={event._id}
                      onClick={() => fetchParticipants(event._id)}
                      className={`group cursor-pointer glass rounded-[2rem] p-6 border-border hover:shadow-soft transition-all ${
                        selectedEventId === event._id ? "ring-2 ring-foreground/20" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            event.status === "approved" ? "bg-emerald-500/10 text-emerald-500" :
                            event.status === "rejected" ? "bg-rose-500/10 text-rose-500" : "bg-blue-500/10 text-blue-500"
                          }`}>
                            {event.status}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                            {event.category}
                          </span>
                        </div>
                        <FiMoreVertical className="text-muted-foreground opacity-0 group-hover:opacity-100 transition" />
                      </div>
                      
                      <h4 className="text-xl font-bold mb-2">{event.title}</h4>
                      
                      <div className="flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <FiCalendar />
                          <span>{format(new Date(event.date), "MMM d, yyyy")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiUsers />
                          <span>{event.participants.length} / {event.maxParticipants} Registered</span>
                        </div>
                        <Link
                          to="/events/$id"
                          params={{ id: event._id }}
                          className="flex items-center gap-1.5 text-blue-500 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FiExternalLink />
                          Public Page
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* PARTICIPANTS PANEL */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 space-y-6">
                <h3 className="text-xl font-bold px-2 flex items-center gap-2">
                  <FiUsers className="text-muted-foreground" />
                  Registrations
                </h3>

                <div className="glass rounded-[2.5rem] border-border overflow-hidden min-h-[400px]">
                  {!selectedEventId ? (
                    <div className="p-8 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
                      <div className="h-16 w-16 rounded-full bg-foreground/5 flex items-center justify-center mb-4">
                        <FiSearch size={24} className="text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Select an event to view the participant list and details.
                      </p>
                    </div>
                  ) : (
                    <div className="p-0">
                      <div className="p-6 border-b border-border bg-foreground/[0.02]">
                        <h4 className="font-bold truncate">
                          {events.find(e => e._id === selectedEventId)?.title}
                        </h4>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-1">
                          {participants.length} Registered Participants
                        </p>
                      </div>
                      
                      <div className="max-h-[500px] overflow-y-auto">
                        {loadingParticipants ? (
                          <div className="p-12 text-center">
                            <div className="h-6 w-6 mx-auto rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
                          </div>
                        ) : participants.length === 0 ? (
                          <div className="p-12 text-center italic text-sm text-muted-foreground">
                            No registrations yet.
                          </div>
                        ) : (
                          <div className="divide-y divide-border">
                            {participants.map((p) => (
                              <div 
                                key={p._id} 
                                className={`p-4 hover:bg-foreground/[0.04] transition cursor-pointer ${selectedParticipant?._id === p._id ? "bg-foreground/[0.03]" : ""}`}
                                onClick={() => setSelectedParticipant(p)}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 rounded-full bg-foreground/5 flex items-center justify-center text-[10px] font-bold">
                                    {p.username.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-xs font-bold truncate">
                                      {p.registrationDetails?.fullName || (p.firstName ? `${p.firstName} ${p.lastName}` : p.username)}
                                    </div>
                                    <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                      <FiMail size={10} />
                                      <span className="truncate">{p.registrationDetails?.email || p.email}</span>
                                    </div>
                                  </div>
                                  {p.registrationDetails && (
                                    <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" title="Form details available" />
                                  )}
                                </div>

                                <AnimatePresence>
                                  {selectedParticipant?._id === p._id && p.registrationDetails && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="pt-4 mt-4 border-t border-border space-y-3">
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <div className="text-[8px] text-muted-foreground uppercase font-bold">Phone</div>
                                            <div className="text-[10px] font-medium">{p.registrationDetails.phone}</div>
                                          </div>
                                          <div>
                                            <div className="text-[8px] text-muted-foreground uppercase font-bold">Organization</div>
                                            <div className="text-[10px] font-medium">{p.registrationDetails.organization}</div>
                                          </div>
                                        </div>
                                        {p.registrationDetails.socialLink && (
                                          <div>
                                            <div className="text-[8px] text-muted-foreground uppercase font-bold">Social Link</div>
                                            <a 
                                              href={p.registrationDetails.socialLink} 
                                              target="_blank" 
                                              rel="noreferrer"
                                              className="text-[10px] text-blue-500 hover:underline truncate block"
                                              onClick={(e) => e.stopPropagation()}
                                            >
                                              {p.registrationDetails.socialLink}
                                            </a>
                                          </div>
                                        )}
                                        {p.registrationDetails.message && (
                                          <div>
                                            <div className="text-[8px] text-muted-foreground uppercase font-bold">Message</div>
                                            <div className="text-[10px] text-muted-foreground italic leading-relaxed">
                                              "{p.registrationDetails.message}"
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {participants.length > 0 && (
                        <div className="p-6 border-t border-border bg-foreground/[0.02]">
                          <button
                            onClick={() => {
                              const csvContent = "data:text/csv;charset=utf-8," 
                                + "Name,Email,Phone,Organization,Social Link,Message,Username,User ID\n"
                                + participants.map(p => {
                                  const name = p.registrationDetails?.fullName || `${p.firstName || ""} ${p.lastName || ""}`;
                                  const email = p.registrationDetails?.email || p.email;
                                  const phone = p.registrationDetails?.phone || "";
                                  const org = p.registrationDetails?.organization || "";
                                  const social = p.registrationDetails?.socialLink || "";
                                  const msg = (p.registrationDetails?.message || "").replace(/,/g, " ");
                                  return `${name},${email},${phone},${org},${social},${msg},${p.username},${p.userId}`;
                                }).join("\n");
                              const encodedUri = encodeURI(csvContent);
                              const link = document.createElement("a");
                              link.setAttribute("href", encodedUri);
                              link.setAttribute("download", `participants_${selectedEventId}.csv`);
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                            className="w-full py-3 rounded-xl glass border-border text-xs font-bold flex items-center justify-center gap-2 hover:bg-foreground/5 transition"
                          >
                            <FiActivity size={14} />
                            Export Full CSV List
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
