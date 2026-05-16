import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiCalendar,
  FiCheck,
  FiClock,
  FiInfo,
  FiMapPin,
  FiTag,
  FiUser,
  FiUsers,
  FiAlertCircle,
  FiX,
  FiArrowRight,
} from "react-icons/fi";
import { PageShell } from "@/components/PageShell";
import { toast } from "sonner";
import { format } from "date-fns";
import { useAuthModal } from "@/hooks/use-auth-modal";
import { useDbUser } from "@/hooks/use-db-user";
import { getAuthToken } from "@/lib/auth";

import { z } from "zod";

const eventSearchSchema = z.object({
  register: z.union([z.string(), z.boolean()]).optional(),
});

export const Route = createFileRoute("/events/$id")({
  validateSearch: (search) => eventSearchSchema.parse(search),
  component: EventDetailsPage,
});

interface EventDetail {
  _id: string;
  title: string;
  description: string;
  category: string;
  teamType: string;
  maxParticipants: number;
  participants: Array<{
    _id: string;
    username: string;
    firstName?: string;
    lastName?: string;
  }>;
  organizer: {
    _id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    email: string;
  };
  date: string;
  location: string;
  status: string;
  isPublished: boolean;
  createdAt: string;
}

function EventDetailsPage() {
  const { id } = Route.useParams();
  const searchParams = Route.useSearch() as { register?: string };
  const { dbUser, loading: userLoading, isSignedIn } = useDbUser();
  const { openAuthModal } = useAuthModal();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // FORM STATE
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    socialLink: "",
    message: "",
  });

  useEffect(() => {
    if (dbUser) {
      setFormData((prev) => ({
        ...prev,
        fullName: `${dbUser.firstName || ""} ${dbUser.lastName || ""}`.trim() || dbUser.username || "",
        email: dbUser.email || "",
      }));
    }
  }, [dbUser]);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`/api/events/${id}`);
        if (!response.ok) throw new Error("Event not found");
        const json = await response.json();
        setEvent(json.data.event);
      } catch (err) {
        console.error(err);
        toast.error("Could not load event details");
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  // SEPARATE EFFECT FOR AUTO-REGISTRATION TRIGGER
  useEffect(() => {
    // Determine if we should trigger registration
    const rawRegister = searchParams.register;
    const isRegisterRequested = 
      rawRegister === true || 
      rawRegister === "true" || 
      (typeof rawRegister === "string" && rawRegister.toLowerCase().includes("true"));

    if (!isRegisterRequested) return;

    if (!event || userLoading) return;

    const isOrg = dbUser?.username && event.organizer.username === dbUser.username;
    const isPart = dbUser?.username && event.participants.some((p) => p.username === dbUser.username);
    
    if (!isPart && !isOrg) {
      if (!showConfirm && !showSuccess) {
        if (!isSignedIn) {
          openAuthModal("signin");
          toast.info("Please sign in to complete your registration");
        } else {
          setShowConfirm(true);
        }
      }
    }
  }, [event, userLoading, dbUser?.username, isSignedIn, searchParams.register, showConfirm, showSuccess]);

  const handleJoinEvent = async () => {
    if (!isSignedIn) {
      openAuthModal("signin");
      return;
    }

    setShowConfirm(true);
  };

  const confirmJoin = async () => {
    if (!formData.fullName || !formData.phone || !formData.organization) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsJoining(true);
    try {
      const token = getAuthToken();
      const response = await fetch(`/api/events/${id}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          registrationDetails: formData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to join event");
      }

      setShowConfirm(false);
      setShowSuccess(true);
      toast.success("Registered successfully!");
      
      // Refresh event details
      const updatedResponse = await fetch(`/api/events/${id}`);
      const updatedJson = await updatedResponse.json();
      setEvent(updatedJson.data.event);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to join event");
    } finally {
      setIsJoining(false);
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

  if (!event) {
    return (
      <PageShell>
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold">Event not found</h2>
          <Link to="/events" className="mt-4 text-blue-500 hover:underline">
            Back to events
          </Link>
        </div>
      </PageShell>
    );
  }

  const isOrganizer = dbUser?.username && event.organizer.username === dbUser.username;
  const isParticipant = dbUser?.username && event.participants.some((p) => p.username === dbUser.username);
  const isFull = event.participants.length >= event.maxParticipants;

  return (
    <PageShell>
      <div className="min-h-screen bg-background pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <FiArrowLeft />
            Back to Events
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* LEFT: MAIN CONTENT */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3">
                  <span className="px-4 py-1.5 rounded-full bg-foreground/5 text-foreground text-[10px] font-bold uppercase tracking-widest">
                    {event.category}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">
                    {event.teamType} Event
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{event.title}</h1>

                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <FiCalendar className="text-foreground/60" />
                    <span>{format(new Date(event.date), "PPP")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiClock className="text-foreground/60" />
                    <span>{format(new Date(event.date), "p")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMapPin className="text-foreground/60" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none">
                  <h3 className="text-xl font-bold text-foreground">About the Event</h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {event.description}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="pt-8 border-t border-border"
              >
                <h3 className="text-xl font-bold mb-6">Participants ({event.participants.length} / {event.maxParticipants})</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {event.participants.map((participant) => (
                    <div
                      key={participant._id}
                      className="flex items-center gap-3 p-3 rounded-2xl glass border-border"
                    >
                      <div className="h-8 w-8 rounded-full bg-foreground/5 flex items-center justify-center text-xs font-bold">
                        {participant.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-xs font-medium truncate">
                        {participant.username}
                      </div>
                    </div>
                  ))}
                  {event.participants.length === 0 && (
                    <p className="col-span-full text-sm text-muted-foreground italic">
                      Be the first to join!
                    </p>
                  )}
                </div>
              </motion.div>
            </div>

            {/* RIGHT: REGISTRATION CARD */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="glass rounded-[2.5rem] p-8 border-border shadow-soft sticky top-32"
              >
                <div className="space-y-6">
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-2">
                      Organized by
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-foreground text-background flex items-center justify-center font-bold">
                        {event.organizer.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-bold">{event.organizer.username}</div>
                        <div className="text-[10px] text-muted-foreground">{event.organizer.email}</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border">
                    {isParticipant || showSuccess ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 text-emerald-500">
                          <FiCheck className="shrink-0" />
                          <div className="text-sm font-bold">You are registered!</div>
                        </div>
                        <Link
                          to="/profile"
                          className="w-full block py-4 rounded-2xl glass border-border text-center font-bold hover:bg-foreground/5 transition"
                        >
                          View Ticket
                        </Link>
                      </div>
                    ) : isOrganizer ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 rounded-2xl bg-blue-500/10 text-blue-500">
                          <FiInfo className="shrink-0" />
                          <div className="text-sm font-bold">You are the organizer</div>
                        </div>
                        <Link
                          to="/dashboard"
                          className="w-full block py-4 rounded-2xl glass border-border text-center font-bold hover:bg-foreground/5 transition"
                        >
                          Manage Event
                        </Link>
                      </div>
                    ) : (
                      <button
                        onClick={handleJoinEvent}
                        disabled={isJoining || isFull}
                        className="w-full py-4 rounded-2xl bg-foreground text-background font-bold hover:opacity-90 transition shadow-card disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isJoining ? (
                          <div className="h-5 w-5 mx-auto rounded-full border-2 border-background/20 border-t-background animate-spin" />
                        ) : isFull ? (
                          "Event Full"
                        ) : (
                          "Register for Event"
                        )}
                      </button>
                    )}
                    <p className="mt-4 text-[10px] text-center text-muted-foreground">
                      By registering, you agree to the event terms and conditions.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* REGISTRATION MODAL */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirm(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl glass rounded-[2.5rem] p-8 shadow-2xl border border-border"
            >
              <button
                onClick={() => setShowConfirm(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <FiX size={20} />
              </button>

              <div className="text-center mb-8">
                <div className="h-16 w-16 rounded-full bg-foreground/5 flex items-center justify-center mx-auto mb-4">
                  <FiAlertCircle className="text-foreground" size={32} />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Event Registration</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Complete the form below to register for <strong>{event.title}</strong>.
                </p>
              </div>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full px-5 py-3 rounded-2xl glass border-border focus:ring-2 focus:ring-foreground/10 outline-none transition text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full px-5 py-3 rounded-2xl glass border-border focus:ring-2 focus:ring-foreground/10 outline-none transition text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-5 py-3 rounded-2xl glass border-border focus:ring-2 focus:ring-foreground/10 outline-none transition text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">College / Organization *</label>
                  <input
                    type="text"
                    required
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="University or Company name"
                    className="w-full px-5 py-3 rounded-2xl glass border-border focus:ring-2 focus:ring-foreground/10 outline-none transition text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">GitHub / LinkedIn (Optional)</label>
                  <input
                    type="url"
                    value={formData.socialLink}
                    onChange={(e) => setFormData({ ...formData, socialLink: e.target.value })}
                    placeholder="https://github.com/username"
                    className="w-full px-5 py-3 rounded-2xl glass border-border focus:ring-2 focus:ring-foreground/10 outline-none transition text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Why do you want to join? (Optional)</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Briefly describe your interest..."
                    className="w-full px-5 py-3 rounded-2xl glass border-border focus:ring-2 focus:ring-foreground/10 outline-none transition text-sm min-h-[80px] resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-8">
                <button
                  onClick={() => setShowConfirm(false)}
                  disabled={isJoining}
                  className="w-full py-4 rounded-2xl glass border-border font-bold hover:bg-foreground/5 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmJoin}
                  disabled={isJoining}
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-foreground text-background font-bold hover:opacity-90 transition shadow-card disabled:opacity-50"
                >
                  {isJoining ? (
                    <div className="h-5 w-5 rounded-full border-2 border-background/20 border-t-background animate-spin" />
                  ) : (
                    <>
                      Complete Registration
                      <FiArrowRight />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SUCCESS MODAL */}
      <AnimatePresence>
        {showSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSuccess(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md glass rounded-[2.5rem] p-8 shadow-2xl border border-border text-center"
            >
              <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                <FiCheck className="text-emerald-500" size={40} />
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">You're In!</h2>
              <p className="text-muted-foreground mb-8">
                Your registration for <strong>{event.title}</strong> is confirmed. 
                Your ticket is now available in your profile.
              </p>

              <div className="grid gap-3">
                <button
                  onClick={() => navigate({ to: "/profile" })}
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-foreground text-background font-bold hover:opacity-90 transition shadow-card"
                >
                  View My Tickets
                  <FiArrowRight />
                </button>
                <button
                  onClick={() => setShowSuccess(false)}
                  className="w-full py-4 rounded-2xl glass border-border font-bold hover:bg-foreground/5 transition"
                >
                  Back to Event
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}

