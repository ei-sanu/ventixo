import { useAuth, useClerk, useUser } from "@clerk/clerk-react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiCalendar,
  FiCheck,
  FiHash,
  FiLogOut,
  FiSettings,
  FiUser,
  FiX,
} from "react-icons/fi";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your Profile — Ventixo" },
      { name: "description", content: "Manage your Ventixo account." },
    ],
  }),
  component: ProfilePage,
});

interface UserData {
  _id: string;
  username: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  createdEvents: unknown[];
  joinedEvents: unknown[];
  createdAt: string;
}

function ProfilePage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const { getToken } = useAuth();
  const [dbUser, setDbUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isLoaded || !user) return;
      try {
        const token = await getToken();
        const response = await fetch("/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch user data");
        const json = await response.json();
        setDbUser(json.data.user);
        setEditFirstName(json.data.user.firstName || "");
        setEditLastName(json.data.user.lastName || "");
      } catch (err) {
        console.error(err);
        toast.error("Could not load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isLoaded, user, getToken]);

  const handleSaveName = async () => {
    if (!dbUser || !editFirstName.trim()) {
      toast.error("First name is required");
      return;
    }

    setIsSaving(true);
    try {
      const token = await getToken();
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

      const json = await response.json();
      setDbUser(json.data.user);
      setIsEditingName(false);
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate({ to: "/" });
  };

  const displayName = dbUser?.firstName
    ? `${dbUser.firstName}${dbUser.lastName ? ` ${dbUser.lastName}` : ""}`
    : dbUser?.username;

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <FiArrowLeft />
            Back to Home
          </Link>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 text-sm text-destructive hover:opacity-80 transition"
          >
            <FiLogOut />
            Sign Out
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT: PROFILE CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            <div className="glass rounded-3xl p-8 shadow-soft border-border sticky top-28">
              <div className="flex flex-col items-center text-center">
                <div className="h-24 w-24 rounded-full bg-foreground/5 flex items-center justify-center mb-4 border-2 border-border">
                  {user?.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt="Profile"
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <FiUser size={40} className="text-muted-foreground" />
                  )}
                </div>
                <h2 className="text-xl font-bold tracking-tight">
                  {displayName || user?.username}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {dbUser?.email || user?.primaryEmailAddress?.emailAddress}
                </p>

                <div className="mt-6 w-full space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-foreground/5 text-sm">
                    <FiHash className="text-muted-foreground" />
                    <span className="font-mono text-xs">{dbUser?.userId}</span>
                  </div>
                  <button
                    onClick={() => setIsEditingName(!isEditingName)}
                    className="flex items-center justify-center gap-2 w-full p-3 rounded-2xl glass text-sm font-medium hover:bg-foreground/5 transition"
                  >
                    <FiSettings size={16} />
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: CONTENT */}
          <div className="lg:col-span-2 space-y-8">
            {/* EDIT NAME FORM */}
            {isEditingName && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-3xl p-6 border-border"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">Update Name</h3>
                  <button
                    onClick={() => {
                      setIsEditingName(false);
                      setEditFirstName(dbUser?.firstName || "");
                      setEditLastName(dbUser?.lastName || "");
                    }}
                    className="p-1 hover:bg-foreground/10 rounded-lg transition"
                  >
                    <FiX size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground ml-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={editFirstName}
                      onChange={(e) => setEditFirstName(e.target.value)}
                      placeholder="Enter your first name"
                      disabled={isSaving}
                      className="w-full mt-2 px-4 py-3 rounded-xl glass border-border focus:ring-2 focus:ring-foreground/10 outline-none transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground ml-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={editLastName}
                      onChange={(e) => setEditLastName(e.target.value)}
                      placeholder="Enter your last name (optional)"
                      disabled={isSaving}
                      className="w-full mt-2 px-4 py-3 rounded-xl glass border-border focus:ring-2 focus:ring-foreground/10 outline-none transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveName}
                      disabled={isSaving}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-foreground text-background font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiCheck size={16} />
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingName(false);
                        setEditFirstName(dbUser?.firstName || "");
                        setEditLastName(dbUser?.lastName || "");
                      }}
                      disabled={isSaving}
                      className="flex-1 py-3 rounded-xl glass text-sm font-medium hover:bg-foreground/5 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STATS */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="glass rounded-3xl p-6 border-border"
              >
                <div className="text-2xl font-bold">{dbUser?.createdEvents?.length || 0}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                  Hosted Events
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="glass rounded-3xl p-6 border-border"
              >
                <div className="text-2xl font-bold">{dbUser?.joinedEvents?.length || 0}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                  Joined Events
                </div>
              </motion.div>
            </div>

            {/* EVENTS LIST */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-3xl border-border overflow-hidden"
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h3 className="font-bold flex items-center gap-2">
                  <FiCalendar className="text-muted-foreground" />
                  Your Events
                </h3>
              </div>
              <div className="p-6">
                {!dbUser?.createdEvents?.length && !dbUser?.joinedEvents?.length ? (
                  <div className="text-center py-12">
                    <p className="text-sm text-muted-foreground">
                      No events found. Start exploring!
                    </p>
                    <Link
                      to="/"
                      className="text-xs text-foreground font-medium mt-4 inline-block hover:underline"
                    >
                      Find events
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Render events here if needed */}
                    <p className="text-xs text-muted-foreground italic">
                      List of events will appear here.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
