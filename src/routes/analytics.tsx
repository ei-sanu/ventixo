import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { 
  FiUsers, 
  FiCalendar, 
  FiCheckCircle, 
  FiXCircle, 
  FiClock, 
  FiActivity,
  FiSearch,
  FiArrowLeft,
  FiMail,
  FiHash,
  FiShield,
  FiUser,
  FiMapPin
} from "react-icons/fi";
import { toast } from "sonner";
import { format } from "date-fns";
import { useDbUser } from "@/hooks/use-db-user";
import { getAuthToken } from "@/lib/auth";

export const Route = createFileRoute("/analytics")({
  component: AdminPanel,
});

interface Event {
  _id: string;
  title: string;
  category: string;
  status: "pending" | "approved" | "rejected";
  date: string;
  location: string;
  organizer: {
    username: string;
    email: string;
  };
  participants: any[];
}

interface User {
  _id: string;
  username: string;
  userId: string;
  email: string;
  role: string;
  createdAt: string;
  createdCount: number;
  joinedCount: number;
}

function AdminPanel() {
  const { dbUser, loading: userLoading } = useDbUser();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"events" | "users">("events");
  const [events, setEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!userLoading && dbUser?.role !== "admin") {
      toast.error("Unauthorized access");
      navigate({ to: "/" });
    }
  }, [dbUser, userLoading, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const endpoint = tab === "events" ? "/api/admin/events" : "/api/admin/users";
      const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await response.json();
      if (tab === "events") {
        setEvents(json.data.events);
      } else {
        setUsers(json.data.users);
      }
    } catch (err) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dbUser?.role === "admin") {
      fetchData();
    }
  }, [tab, dbUser]);

  const handleAction = async (eventId: string, action: "approve" | "reject") => {
    try {
      const token = getAuthToken();
      const response = await fetch(`/api/admin/events/${eventId}/${action}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        toast.success(`Event ${action}d successfully`);
        fetchData();
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error(`Failed to ${action} event`);
    }
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
      </div>
    );
  }

  const filteredEvents = events.filter(e => 
    e?.title?.toLowerCase().includes(search.toLowerCase()) || 
    e?.organizer?.username?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredUsers = users.filter(u => 
    u?.username?.toLowerCase().includes(search.toLowerCase()) || 
    u?.email?.toLowerCase().includes(search.toLowerCase()) ||
    u?.userId?.includes(search)
  );

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
              <FiShield className="text-blue-500" />
              Admin Control Panel
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage platform activities, verify events, and track users.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start md:self-center">
            <Link
              to="/profile"
              className="flex items-center gap-2 px-6 py-3 rounded-2xl glass border-border font-bold hover:bg-foreground/5 transition"
            >
              <FiUser />
              Profile
            </Link>
            <div className="flex bg-foreground/5 p-1 rounded-2xl">
              <button
                onClick={() => setTab("events")}
                className={`px-6 py-2.5 rounded-xl text-sm font-medium transition ${
                  tab === "events" ? "bg-background shadow-soft text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Event Requests
              </button>
              <button
                onClick={() => setTab("users")}
                className={`px-6 py-2.5 rounded-xl text-sm font-medium transition ${
                  tab === "users" ? "bg-background shadow-soft text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                User Directory
              </button>
            </div>
          </div>
        </div>

        <div className="mb-8 relative max-w-md">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder={`Search ${tab}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl glass border-border outline-none focus:ring-2 focus:ring-foreground/5 transition"
          />
        </div>

        <AnimatePresence mode="wait">
          {tab === "events" ? (
            <motion.div
              key="events"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid gap-4"
            >
              {filteredEvents.length === 0 ? (
                <div className="text-center py-20 glass rounded-[2rem] border-dashed border-2 border-border">
                  <FiClock size={40} className="mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No event requests found.</p>
                </div>
              ) : (
                filteredEvents.map((event) => (
                  <div key={event._id} className="glass rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-border hover:shadow-soft transition-all">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          event.status === "approved" ? "bg-emerald-500/10 text-emerald-500" :
                          event.status === "rejected" ? "bg-rose-500/10 text-rose-500" : "bg-blue-500/10 text-blue-500"
                        }`}>
                          {event.status}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium">{event.category}</span>
                      </div>
                      <h3 className="text-xl font-bold">{event.title}</h3>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <FiUser className="shrink-0" />
                          <span>{event.organizer?.username || "Deleted User"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiCalendar className="shrink-0" />
                          <span>{format(new Date(event.date), "PPP")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiUsers className="shrink-0" />
                          <span>{event.participants?.length || 0} joined</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiMapPin className="shrink-0" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] bg-foreground/5 px-2 py-0.5 rounded-full">
                          <FiMail className="shrink-0" />
                          <span>{event.organizer?.email || "---"}</span>
                        </div>
                      </div>
                    </div>

                    {event.status === "pending" && (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleAction(event._id, "approve")}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition shadow-lg shadow-emerald-500/20"
                        >
                          <FiCheckCircle />
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(event._id, "reject")}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500 text-white font-medium hover:bg-rose-600 transition shadow-lg shadow-rose-500/20"
                        >
                          <FiXCircle />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </motion.div>
          ) : (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass rounded-[2rem] border-border overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-foreground/5 text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
                      <th className="px-8 py-5">User</th>
                      <th className="px-8 py-5">ID</th>
                      <th className="px-8 py-5">Activity</th>
                      <th className="px-8 py-5">Role</th>
                      <th className="px-8 py-5 text-right">Joined At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredUsers.map((user) => (
                      <tr key={user?._id} className="hover:bg-foreground/5 transition-colors group">
                        <td className="px-8 py-5">
                          <div>
                            <div className="font-bold text-foreground">{user?.username || "Deleted User"}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                              <FiMail className="shrink-0" />
                              {user?.email || "---"}
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5 font-mono text-xs">{user?.userId || "---"}</td>
                        <td className="px-8 py-5">
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">
                              {user?.createdCount || 0} Created
                            </span>
                            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">
                              {user?.joinedCount || 0} Joined
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            user?.role === "admin" ? "bg-blue-500/10 text-blue-500" : "bg-foreground/5 text-muted-foreground"
                          }`}>
                            {user?.role || "user"}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right text-xs text-muted-foreground">
                          {user?.createdAt ? format(new Date(user.createdAt), "MMM d, yyyy") : "---"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
