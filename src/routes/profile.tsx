import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useUser, useClerk, useAuth } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  FiArrowLeft,
  FiUser,
  FiMail,
  FiHash,
  FiCalendar,
  FiLogOut,
  FiSettings,
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
  username: string;
  userId: string;
  email: string;
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
      } catch (err) {
        console.error(err);
        toast.error("Could not load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isLoaded, user, getToken]);

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
                  {dbUser?.username || user?.username}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {dbUser?.email || user?.primaryEmailAddress?.emailAddress}
                </p>

                <div className="mt-6 w-full space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-foreground/5 text-sm">
                    <FiHash className="text-muted-foreground" />
                    <span className="font-mono text-xs">{dbUser?.userId}</span>
                  </div>
                  <button className="flex items-center justify-center gap-2 w-full p-3 rounded-2xl glass text-sm font-medium hover:bg-foreground/5 transition">
                    <FiSettings size={16} />
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: CONTENT */}
          <div className="lg:col-span-2 space-y-8">
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
