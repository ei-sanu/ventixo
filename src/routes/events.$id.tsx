import { useAuth, useUser } from "@clerk/clerk-react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
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
} from "react-icons/fi";
import { PageShell } from "@/components/PageShell";
import { toast } from "sonner";
import { format } from "date-fns";

export const Route = createFileRoute("/events/$id")({
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
  const { isLoaded, user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);

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

  const handleJoinEvent = async () => {
    if (!user) {
      toast.error("Please sign in to join events");
      return;
    }

    setIsJoining(true);
    try {
      const token = await getToken();
      const response = await fetch(`/api/events/${id}/join`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to join event");
      }

      toast.success("Joined event successfully!");
      // Refresh event details to show new participant
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

  if (loading) {
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

  const isOrganizer = user?.id && event.organizer.username === user.username;
  const isParticipant = user?.id && event.participants.some((p) => p.username === user.username);
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
                    {isParticipant ? (
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
                          "Join Event Now"
                        )}
                      </button>
                    )}
                    <p className="mt-4 text-[10px] text-center text-muted-foreground">
                      By joining, you agree to the event terms and conditions.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
