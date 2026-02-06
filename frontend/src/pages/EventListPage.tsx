import { useEffect, useState, useMemo } from "react";
import Layout from "../components/Layout";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchEventsRequest } from "../store/eventsSlice";
import Loader from "../components/Loader";
import EventCard from "../components/EventCard";
import Header from "../components/Header";

export default function EventListPage() {
  const dispatch = useAppDispatch();
  const { events, loading, error } = useAppSelector((state) => state.events);

  // Search/filter state
  const [searchType, setSearchType] = useState<string>("");
  const [searchDate, setSearchDate] = useState<string>("");

  useEffect(() => {
    dispatch(fetchEventsRequest());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchEventsRequest());
  };

  const handleClearFilters = () => {
    setSearchType("");
    setSearchDate("");
  };

  // Filter events based on search criteria
  const filteredEvents = useMemo(() => {
    let filtered = [...events];

    // Filter by type
    if (searchType.trim()) {
      filtered = filtered.filter((event) =>
        event.type.toLowerCase().includes(searchType.toLowerCase()),
      );
    }

    // Filter by date
    if (searchDate) {
      filtered = filtered.filter((event) => event.date === searchDate);
    }

    return filtered;
  }, [events, searchType, searchDate]);

  // Get unique event types for filter dropdown
  const eventTypes = useMemo(() => {
    const types = new Set(events.map((event) => event.type));
    return Array.from(types).sort();
  }, [events]);

  if (loading) {
    return <Loader label="Loading events..." />;
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center">
          <Header title="Events" description="Browse and manage your events" />
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Refresh
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Filter Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="filter-type"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Event Type
              </label>
              <select
                id="filter-type"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-white"
              >
                <option value="">All Types</option>
                {eventTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="filter-date"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Date
              </label>
              <input
                id="filter-date"
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleClearFilters}
                disabled={!searchType && !searchDate}
                className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-md">
            {error}
          </div>
        )}

        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 text-lg">
              {events.length === 0
                ? "No events found. Create your first event!"
                : "No events match your search criteria."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredEvents.map((event, id) => (
              <EventCard key={`${event.id}-${id}`} event={event} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
