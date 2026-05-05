import { useAuth, useUser } from "@clerk/clerk-react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { FiArrowLeft, FiCalendar, FiCheck, FiInfo, FiMapPin, FiTag, FiUsers } from "react-icons/fi";
import { toast } from "sonner";

export const Route = createFileRoute("/create-event")({
  component: CreateEventPage,
});

const CATEGORIES = ["Tech", "Cultural", "Other"];
const TEAM_TYPES = ["Solo", "Duo", "Trio", "Quadra"];

function CreateEventPage() {
  const { isLoaded, user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Tech",
    teamType: "Solo",
    maxParticipants: 10,
    date: "",
    location: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const token = await getToken();
      const response = await fetch("/api/events/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create event");
      }

      toast.success("Event submitted for approval!");
      navigate({ to: "/profile" });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 md:mb-8"
        >
          <FiArrowLeft />
          Back to Profile
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-6 md:p-8 border-border shadow-soft"
        >
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Create New Event</h1>
            <p className="text-muted-foreground mt-2 text-sm md:text-base">
              Fill out the details below to host your event. All events are reviewed before being
              published.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs md:text-sm font-medium flex items-center gap-2 mb-2">
                  <FiTag className="text-muted-foreground" />
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hackathon 2024"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl glass border-border focus:ring-2 focus:ring-foreground/10 outline-none transition text-sm"
                />
              </div>

              <div>
                <label className="text-xs md:text-sm font-medium flex items-center gap-2 mb-2">
                  <FiInfo className="text-muted-foreground" />
                  Description
                </label>
                <textarea
                  required
                  placeholder="Tell us about your event..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl glass border-border focus:ring-2 focus:ring-foreground/10 outline-none transition text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs md:text-sm font-medium flex items-center gap-2 mb-2">
                    <FiTag className="text-muted-foreground" />
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl glass border-border focus:ring-2 focus:ring-foreground/10 outline-none transition text-sm appearance-none bg-transparent"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs md:text-sm font-medium flex items-center gap-2 mb-2">
                    <FiUsers className="text-muted-foreground" />
                    Team Type
                  </label>
                  <select
                    value={formData.teamType}
                    onChange={(e) => setFormData({ ...formData, teamType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl glass border-border focus:ring-2 focus:ring-foreground/10 outline-none transition text-sm appearance-none bg-transparent"
                  >
                    {TEAM_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs md:text-sm font-medium flex items-center gap-2 mb-2">
                    <FiUsers className="text-muted-foreground" />
                    Max Participants
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.maxParticipants}
                    onChange={(e) =>
                      setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })
                    }
                    className="w-full px-4 py-3 rounded-xl glass border-border focus:ring-2 focus:ring-foreground/10 outline-none transition text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs md:text-sm font-medium flex items-center gap-2 mb-2">
                    <FiCalendar className="text-muted-foreground" />
                    Date
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl glass border-border focus:ring-2 focus:ring-foreground/10 outline-none transition text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs md:text-sm font-medium flex items-center gap-2 mb-2">
                  <FiMapPin className="text-muted-foreground" />
                  Location
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Auditorium, Main Building"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl glass border-border focus:ring-2 focus:ring-foreground/10 outline-none transition text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 md:py-4 rounded-2xl bg-foreground text-background font-bold text-base md:text-lg hover:opacity-90 transition shadow-card disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {isSubmitting ? (
                <div className="h-5 w-5 rounded-full border-2 border-background/20 border-t-background animate-spin" />
              ) : (
                <>
                  <FiCheck />
                  Create Event
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
