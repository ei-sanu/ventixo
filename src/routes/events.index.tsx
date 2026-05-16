import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiCalendar, FiMapPin, FiSearch, FiTag, FiUsers } from "react-icons/fi";
import { PageShell } from "@/components/PageShell";
import { toast } from "sonner";

export const Route = createFileRoute("/events/")({
  component: EventsPage,
});

interface PublicEvent {
  _id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  location: string;
  teamType: string;
  maxParticipants: number;
  participants: string[];
  organizer: {
    username: string;
    firstName?: string;
    lastName?: string;
  };
}

function EventsPage() {
  const [events, setEvents] = useState<PublicEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events/public");
        if (!response.ok) throw new Error("Failed to fetch events");
        const json = await response.json();
        setEvents(json.data.events);
      } catch (err) {
        console.error(err);
        toast.error("Could not load events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <PageShell>
        <div className="min-h-screen flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="min-h-screen bg-background pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Explore Events</h1>
              <p className="text-muted-foreground mt-4 text-lg">
                Discover and join the latest tech, cultural, and community events.
              </p>
            </div>
            <div className="relative w-full md:w-96">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search events or categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl glass border-border focus:ring-2 focus:ring-foreground/10 outline-none transition"
              />
            </div>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="text-center py-20 glass rounded-[2.5rem] border-border">
              <p className="text-muted-foreground">No events found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event, i) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group glass rounded-[2.5rem] p-8 border-border shadow-soft hover:shadow-glow transition-all duration-500 flex flex-col"
                >
                  <div className="flex items-center justify-between mb-6">
                    <span className="px-4 py-1.5 rounded-full bg-foreground/5 text-foreground text-[10px] font-bold uppercase tracking-widest">
                      {event.category}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <FiUsers /> {event.participants.length} / {event.maxParticipants}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-600 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-8 flex-1">
                    {event.description}
                  </p>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <FiCalendar className="text-foreground/60" />
                      {new Date(event.date).toLocaleDateString(undefined, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <FiMapPin className="text-foreground/60" />
                      {event.location}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Link
                      to="/events/$id"
                      params={{ id: event._id }}
                      className="flex-1 py-4 rounded-2xl glass border-border font-bold text-center hover:bg-foreground/5 transition"
                    >
                      Details
                    </Link>
                    <Link
                      to="/events/$id"
                      params={{ id: event._id }}
                      search={{ register: true }}
                      className="flex-[2] py-4 rounded-2xl bg-foreground text-background font-bold text-center hover:opacity-90 transition shadow-card"
                    >
                      Register Now
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
