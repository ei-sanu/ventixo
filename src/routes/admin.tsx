import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiCheck, FiShield, FiUsers, FiX, FiCalendar, FiClock, FiMapPin, FiUser } from "react-icons/fi";
import { toast } from "sonner";
import { useDbUser } from "@/hooks/use-db-user";
import { getAuthToken } from "@/lib/auth";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

interface Event {
  _id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  location: string;
  status: "pending" | "approved" | "rejected";
  organizer: {
    username: string;
    email: string;
  };
}

interface User {
  _id: string;
  username: string;
  email: string;
  userId: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

function AdminPage() {
  const { dbUser, loading: userLoading } = useDbUser();
  const [events, setEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"events" | "users">("events");

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const [eventsRes, usersRes] = await Promise.all([
        fetch("/api/admin/events", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/admin/users", { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (!eventsRes.ok || !usersRes.ok) throw new Error("Failed to fetch data");

      const eventsData = await eventsRes.json();
      const usersData = await usersRes.json();

      setEvents(eventsData.data.events);
      setUsers(usersData.data.users);
    } catch (err) {
      console.error(err);
      toast.error("Error loading admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userLoading && dbUser?.role === "admin") {
      fetchData();
    }
  }, [dbUser, userLoading]);

  const handleAction = async (eventId: string, action: "approve" | "reject") => {
    try {
      const token = getAuthToken();
      const response = await fetch(`/api/admin/events/${eventId}/${action}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error(`Failed to ${action} event`);

      toast.success(`Event ${action}d successfully`);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error(`Error during ${action} action`);
    }
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Admin Control Panel</h1>
            <p className="text-muted-foreground mt-2">Manage the Ventixo platform and approve requests.</p>
          </div>
          <div className="flex glass rounded-2xl p-1 shadow-soft">
            <button
              onClick={() => setActiveTab("events")}
              className={`px-6 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === "events" ? "bg-foreground text-background" : "hover:bg-foreground/5"
              }`}
            >
              Event Requests
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`px-6 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === "users" ? "bg-foreground text-background" : "hover:bg-foreground/5"
              }`}
            >
              User Tracking
            </button>
          </div>
        </div>

        {activeTab === "events" ? (
          <div className="grid gap-6">
            {events.length === 0 ? (
              <div className="text-center py-20 glass rounded-3xl border-border">
                <p className="text-muted-foreground">No event requests found.</p>
              </div>
            ) : (
              events.map((event) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass rounded-3xl p-6 border-border shadow-soft flex flex-col md:flex-row gap-6 justify-between items-center"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        event.status === "approved" ? "bg-green-100 text-green-700" : 
                        event.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                      }`}>
                        {event.status}
                      </span>
                      <h3 className="text-xl font-bold">{event.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{event.description}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <FiCalendar /> {new Date(event.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FiMapPin /> {event.location}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FiUser /> Organized by {event.organizer?.username || "Deleted User"}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {event.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleAction(event._id, "approve")}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-green-500 text-white font-bold hover:bg-green-600 transition shadow-lg"
                        >
                          <FiCheck /> Approve
                        </button>
                        <button
                          onClick={() => handleAction(event._id, "reject")}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-red-500 text-white font-bold hover:bg-red-600 transition shadow-lg"
                        >
                          <FiX /> Reject
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        ) : (
          <div className="glass rounded-3xl border-border shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-foreground/5 text-muted-foreground text-xs uppercase tracking-wider font-bold">
                    <th className="px-8 py-4">User</th>
                    <th className="px-8 py-4">ID</th>
                    <th className="px-8 py-4">Email</th>
                    <th className="px-8 py-4">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((u) => (
                    <tr key={u?._id} className="hover:bg-foreground/5 transition-colors">
                      <td className="px-8 py-4">
                        <div className="font-medium text-foreground">{u?.firstName || ""} {u?.lastName || "User"}</div>
                        <div className="text-[10px] text-muted-foreground">@{u?.username || "deleted"}</div>
                      </td>
                      <td className="px-8 py-4 text-xs font-mono">{u?.userId || "---"}</td>
                      <td className="px-8 py-4 text-sm">{u?.email || "---"}</td>
                      <td className="px-8 py-4 text-xs text-muted-foreground">
                        {u?.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Unknown"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
