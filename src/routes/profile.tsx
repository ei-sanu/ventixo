import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FiActivity,
  FiArrowLeft,
  FiCalendar,
  FiCheck,
  FiExternalLink,
  FiHash,
  FiLogOut,
  FiMapPin,
  FiSettings,
  FiUser,
  FiX,
  FiPlus,
  FiShield,
  FiMail,
  FiAward,
  FiBriefcase,
  FiUsers,
  FiBell,
  FiCheckCircle,
  FiInfo
} from "react-icons/fi";
import { format } from "date-fns";
import { toast } from "sonner";
import { PageShell } from "@/components/PageShell";
import { useDbUser } from "@/hooks/use-db-user";
import { getAuthToken } from "@/lib/auth";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your Profile — Ventixo" },
      { name: "description", content: "Manage your Ventixo account." },
    ],
  }),
  component: ProfilePage,
});

interface Ticket {
  _id: string;
  ticketCode: string;
  status: string;
  event: {
    _id: string;
    title: string;
    date: string;
    location: string;
    category: string;
  };
}

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
}

interface UserData {
  _id: string;
  username: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdEvents: any[];
  joinedEvents: any[];
  notifications: Notification[];
  createdAt: string;
}

function ProfilePage() {
  const { dbUser, loading: userLoading, logout, refreshDbUser } = useDbUser();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"tickets" | "notifications">("tickets");
  const [isEditingName, setIsEditingName] = useState(false);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    if (!dbUser) return;
    try {
      const token = getAuthToken();
      const ticketsRes = await fetch("/api/tickets/my-tickets", { 
        headers: { Authorization: `Bearer ${token}` } 
      });

      if (!ticketsRes.ok) throw new Error("Failed to fetch tickets");

      const ticketsJson = await ticketsRes.json();

      setTickets(ticketsJson.data.tickets);
      setEditFirstName(dbUser.firstName || "");
      setEditLastName(dbUser.lastName || "");
    } catch (err) {
      console.error(err);
      toast.error("Could not load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [dbUser, userLoading]);

  const markNotificationsRead = async () => {
    if (!dbUser?.notifications.some(n => !n.read)) return;
    
    try {
      const token = getAuthToken();
      await fetch("/api/users/notifications/read", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      await refreshDbUser();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeTab === "notifications") {
      markNotificationsRead();
    }
  }, [activeTab]);

  const handleSaveName = async () => {
    if (!dbUser || !editFirstName.trim()) {
      toast.error("First name is required");
      return;
    }

    setIsSaving(true);
    try {
      const token = getAuthToken();
      const response = await fetch("/api/users/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: editFirstName.trim(),
          lastName: editLastName.trim(),
        }),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      await refreshDbUser();
      setIsEditingName(false);
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    toast.success("Signed out successfully");
    navigate({ to: "/" });
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
      </div>
    );
  }

  const displayName = dbUser?.firstName
    ? `${dbUser.firstName}${dbUser.lastName ? ` ${dbUser.lastName}` : ""}`
    : dbUser?.username;

  return (
    <PageShell>
      <div className="min-h-screen bg-background pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* TOP HEADER */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4 mb-4"
              >
                <div className="h-20 w-20 rounded-3xl bg-foreground/5 flex items-center justify-center border-2 border-border overflow-hidden shadow-soft">
                  <FiUser size={32} className="text-muted-foreground" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">{displayName}</h1>
                  <p className="text-muted-foreground flex items-center gap-2 text-sm">
                    <FiMail size={14} />
                    {dbUser?.email}
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/create-event"
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-foreground text-background font-bold hover:scale-[1.02] transition shadow-card"
              >
                <FiPlus />
                Create Event
              </Link>
              <button
                onClick={() => setIsEditingName(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl glass border-border font-bold hover:bg-foreground/5 transition"
              >
                <FiSettings />
                Settings
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-rose-500/10 text-rose-500 font-bold hover:bg-rose-500/20 transition"
              >
                <FiLogOut />
                Logout
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* SIDEBAR */}
            <div className="lg:col-span-1 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-[2rem] p-8 border-border shadow-soft space-y-8"
              >
                <div>
                  <h3 className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-4">Account Stats</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-sm font-medium">
                        <FiAward className="text-blue-500" />
                        Host Rank
                      </div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 uppercase">
                        Silver
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-sm font-medium">
                        <FiBriefcase className="text-emerald-500" />
                        Role
                      </div>
                      <span className="text-xs font-bold text-foreground capitalize">
                        {dbUser?.role}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-border">
                  <h3 className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-4">Identification</h3>
                  <div className="p-4 rounded-2xl bg-foreground/5 space-y-2">
                    <div className="text-[10px] text-muted-foreground font-bold flex items-center gap-1.5">
                      <FiHash /> UNIQUE USER ID
                    </div>
                    <div className="font-mono text-xs break-all text-foreground">
                      {dbUser?.userId}
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-border space-y-3">
                  {dbUser?.role === "admin" && (
                    <Link
                      to="/analytics"
                      className="flex items-center gap-3 w-full p-4 rounded-2xl bg-blue-500 text-white font-bold hover:opacity-90 transition shadow-lg shadow-blue-500/20 text-sm"
                    >
                      <FiShield />
                      Admin Panel
                    </Link>
                  )}
                  {dbUser?.createdEvents && dbUser.createdEvents.length > 0 && (
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 w-full p-4 rounded-2xl glass border-border font-bold hover:bg-foreground/5 transition text-sm"
                    >
                      <FiActivity />
                      Organizer Dashboard
                    </Link>
                  )}
                </div>
              </motion.div>
            </div>

            {/* MAIN CONTENT */}
            <div className="lg:col-span-3 space-y-8">
              {/* TABS */}
              <div className="flex items-center gap-8 border-b border-border">
                <button
                  onClick={() => setActiveTab("tickets")}
                  className={`pb-4 text-sm font-bold tracking-wider uppercase transition-colors relative ${
                    activeTab === "tickets" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  My Tickets
                  {activeTab === "tickets" && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground"
                    />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("notifications")}
                  className={`pb-4 text-sm font-bold tracking-wider uppercase transition-colors relative flex items-center gap-2 ${
                    activeTab === "notifications" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Notifications
                  {(dbUser?.notifications.filter(n => !n.read).length || 0) > 0 && (
                    <span className="h-5 w-5 rounded-full bg-rose-500 text-[10px] text-white flex items-center justify-center">
                      {dbUser?.notifications.filter(n => !n.read).length}
                    </span>
                  )}
                  {activeTab === "notifications" && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground"
                    />
                  )}
                </button>
              </div>

              {activeTab === "tickets" ? (
                <div className="space-y-8">
                  {/* EDITING MODAL OVERLAY */}
                  <AnimatePresence>
                    {isEditingName && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-sm"
                      >
                        <motion.div
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.95, opacity: 0 }}
                          className="glass rounded-[2.5rem] p-8 border-border shadow-2xl w-full max-w-md"
                        >
                          <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold">Update Profile</h2>
                            <button onClick={() => setIsEditingName(false)} className="p-2 hover:bg-foreground/5 rounded-full transition">
                              <FiX size={24} />
                            </button>
                          </div>

                          <div className="space-y-6">
                            <div className="space-y-2">
                              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">First Name</label>
                              <input
                                type="text"
                                value={editFirstName}
                                onChange={(e) => setEditFirstName(e.target.value)}
                                className="w-full px-5 py-4 rounded-2xl glass border-border focus:ring-2 focus:ring-foreground/10 outline-none transition"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Last Name</label>
                              <input
                                type="text"
                                value={editLastName}
                                onChange={(e) => setEditLastName(e.target.value)}
                                className="w-full px-5 py-4 rounded-2xl glass border-border focus:ring-2 focus:ring-foreground/10 outline-none transition"
                              />
                            </div>
                            <button
                              onClick={handleSaveName}
                              disabled={isSaving}
                              className="w-full py-4 rounded-2xl bg-foreground text-background font-bold hover:opacity-90 transition shadow-card disabled:opacity-50"
                            >
                              {isSaving ? "Saving..." : "Save Changes"}
                            </button>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* STATS ROW */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 }}
                      className="glass rounded-[2rem] p-8 border-border shadow-soft flex items-center gap-6"
                    >
                      <div className="h-14 w-14 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                        <FiCalendar size={28} />
                      </div>
                      <div>
                        <div className="text-3xl font-bold">{dbUser?.createdEvents?.length || 0}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold mt-1">Events Hosted</div>
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="glass rounded-[2rem] p-8 border-border shadow-soft flex items-center gap-6"
                    >
                      <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                        <FiUsers size={28} />
                      </div>
                      <div>
                        <div className="text-3xl font-bold">{tickets.length}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold mt-1">Tickets Booked</div>
                      </div>
                    </motion.div>
                  </div>

                  {/* REGISTERED EVENTS / TICKETS */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass rounded-[2.5rem] border-border overflow-hidden shadow-soft"
                  >
                    <div className="p-8 border-b border-border bg-foreground/[0.02] flex items-center justify-between">
                      <h3 className="text-xl font-bold flex items-center gap-3">
                        <FiAward className="text-emerald-500" />
                        My Digital Tickets
                      </h3>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                        Showing {tickets.length} Active Tickets
                      </div>
                    </div>

                    <div className="p-8">
                      {tickets.length === 0 ? (
                        <div className="text-center py-20">
                          <div className="h-20 w-20 rounded-full bg-foreground/5 flex items-center justify-center mx-auto mb-6">
                            <FiCalendar size={32} className="text-muted-foreground" />
                          </div>
                          <h4 className="text-lg font-bold mb-2">No tickets found</h4>
                          <p className="text-sm text-muted-foreground mb-8">You haven't registered for any events yet. Discover exciting experiences today!</p>
                          <Link
                            to="/events"
                            className="px-8 py-3 rounded-2xl bg-foreground text-background font-bold hover:opacity-90 transition shadow-card inline-block"
                          >
                            Explore Events
                          </Link>
                        </div>
                      ) : (
                        <div className="grid gap-6">
                          {tickets.map((ticket, i) => (
                            <motion.div
                              key={ticket._id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.4 + i * 0.1 }}
                              className="group relative overflow-hidden glass rounded-3xl border-border flex flex-col md:flex-row shadow-sm hover:shadow-soft transition-all"
                            >
                              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                              <div className="p-6 md:p-8 flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-foreground/5 font-bold uppercase tracking-tighter">
                                    {ticket.event.category}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest flex items-center gap-1.5">
                                    <FiCalendar />
                                    {format(new Date(ticket.event.date), "PPP")}
                                  </span>
                                </div>
                                <h4 className="text-2xl font-bold mb-2 group-hover:text-emerald-500 transition-colors">
                                  {ticket.event.title}
                                </h4>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <FiMapPin />
                                  {ticket.event.location}
                                </div>
                              </div>
                              <div className="p-6 md:p-8 md:w-64 border-t md:border-t-0 md:border-l border-border bg-foreground/[0.01] flex flex-col justify-center items-center md:items-end">
                                <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1 text-center md:text-right">
                                  Ticket Code
                                </div>
                                <div className="font-mono text-xl font-black tracking-tighter text-foreground mb-4">
                                  {ticket.ticketCode}
                                </div>
                                <Link
                                  to="/events/$id"
                                  params={{ id: ticket.event._id }}
                                  className="flex items-center gap-2 text-xs font-bold text-blue-500 hover:underline"
                                >
                                  <FiExternalLink />
                                  View Event Details
                                </Link>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              ) : (
                <div className="space-y-4">
                  {dbUser?.notifications.length === 0 ? (
                    <div className="py-20 text-center glass rounded-[2.5rem] border-border">
                      <FiBell size={40} className="mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No notifications yet.</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {[...(dbUser?.notifications || [])].reverse().map((n) => (
                        <div
                          key={n._id}
                          className={`p-6 rounded-[2rem] glass border-border shadow-soft relative overflow-hidden ${
                            !n.read ? "bg-foreground/[0.02]" : ""
                          }`}
                        >
                          {!n.read && (
                            <div className="absolute top-6 left-0 w-1 h-8 bg-blue-500 rounded-r-full" />
                          )}
                          <div className="flex items-start gap-4">
                            <div className={`mt-1 h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                              n.type === "success" ? "bg-emerald-500/10 text-emerald-500" :
                              n.type === "warning" ? "bg-amber-500/10 text-amber-500" :
                              n.type === "error" ? "bg-rose-500/10 text-rose-500" : "bg-blue-500/10 text-blue-500"
                            }`}>
                              {n.type === "success" ? <FiCheckCircle /> : <FiInfo />}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold">{n.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                                {n.message}
                              </p>
                              <div className="text-[10px] text-muted-foreground font-medium mt-3 uppercase tracking-widest">
                                {format(new Date(n.createdAt), "PPp")}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
