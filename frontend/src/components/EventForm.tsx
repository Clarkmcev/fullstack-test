import { useState, ChangeEvent, useEffect, FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { createEventRequest, resetSubmitStatus } from "../store/eventsSlice";
import { EventTypeEnum, Event } from "../types/events";

export default function EventForm() {
  const dispatch = useAppDispatch();
  const { submitStatus, error } = useAppSelector((state) => state.events);

  const [formData, setFormData] = useState<Event>({
    type: null,
    description: "",
    budget: null,
    numberOfPersons: null,
    date: "",
    // payload: "{}",
  });
  const [jsonError, setJsonError] = useState<string>("");

  const eventTypes = Object.values(EventTypeEnum) as EventTypeEnum[];

  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, type: e.target.value as EventTypeEnum });
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, description: e.target.value });
  };

  const handleBudgetChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      budget: e.target.value ? parseFloat(e.target.value) : null,
    });
  };

  const handleNumberOfPersonsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      numberOfPersons: e.target.value ? parseInt(e.target.value) : null,
    });
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, date: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate event type
    if (!formData.type) {
      alert("Event type is required");
      return;
    }

    // Validate description
    if (!formData.description.trim()) {
      alert("Description is required");
      return;
    }

    // Validate budget
    const budget = formData.budget;
    if (budget === null || isNaN(budget) || budget < 0) {
      alert("Please enter a valid budget");
      return;
    }

    // Validate number of persons
    const numberOfPersons = formData.numberOfPersons;
    if (
      numberOfPersons === null ||
      isNaN(numberOfPersons) ||
      numberOfPersons < 1
    ) {
      alert("Please enter a valid number of persons (at least 1)");
      return;
    }

    // Validate date
    if (!formData.date) {
      alert("Date is required");
      return;
    }

    // Dispatch Redux Saga action
    dispatch(
      createEventRequest({
        type: formData.type,
        description: formData.description,
        budget,
        numberOfPersons,
        date: formData.date,
        payload: parsedPayload,
      }),
    );
  };

  // Auto-reset form on successful submission
  useEffect(() => {
    if (submitStatus === "succeeded") {
      setFormData({
        type: null,
        description: "",
        budget: null,
        numberOfPersons: null,
        date: "",
        // payload: "{}",
      });
      const timer = setTimeout(() => {
        dispatch(resetSubmitStatus());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus, dispatch]);

  const isSubmitting = submitStatus === "loading";

  return (
    <div>
      {/* Status message */}
      {(submitStatus === "succeeded" || submitStatus === "failed") && (
        <div
          className={`mb-6 p-4 rounded-md ${
            submitStatus === "succeeded"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {submitStatus === "succeeded"
            ? "Event submitted successfully!"
            : error || "Failed to submit event. Please try again."}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white rounded-lg shadow-lg"
      >
        <div className="mb-6">
          <label
            htmlFor="event-type"
            className="block mb-2 font-semibold text-gray-700 text-sm"
          >
            Event Type <span className="text-red-500">*</span>
          </label>
          <select
            id="event-type"
            value={formData.type as EventTypeEnum}
            onChange={handleTypeChange}
            required
            disabled={isSubmitting}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors bg-white"
          >
            <option value="">Select an event type...</option>
            {eventTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label
            htmlFor="event-description"
            className="block mb-2 font-semibold text-gray-700 text-sm"
          >
            Description <span className="text-red-500">*</span>
          </label>
          <input
            id="event-description"
            type="text"
            value={formData.description}
            onChange={handleDescriptionChange}
            placeholder="Brief description of the event"
            required
            disabled={isSubmitting}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label
              htmlFor="event-budget"
              className="block mb-2 font-semibold text-gray-700 text-sm"
            >
              Budget <span className="text-red-500">*</span>
            </label>
            <input
              id="event-budget"
              type="number"
              step="0.01"
              min="0"
              value={formData.budget}
              onChange={handleBudgetChange}
              placeholder="0.00"
              required
              disabled={isSubmitting}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="event-persons"
              className="block mb-2 font-semibold text-gray-700 text-sm"
            >
              Number of Persons <span className="text-red-500">*</span>
            </label>
            <input
              id="event-persons"
              type="number"
              min="1"
              value={formData.numberOfPersons}
              onChange={handleNumberOfPersonsChange}
              placeholder="1"
              required
              disabled={isSubmitting}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="event-date"
              className="block mb-2 font-semibold text-gray-700 text-sm"
            >
              Date <span className="text-red-500">*</span>
            </label>
            <input
              id="event-date"
              type="date"
              value={formData.date}
              onChange={handleDateChange}
              required
              disabled={isSubmitting}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !!jsonError}
          className="w-full px-4 py-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? "Submitting..." : "Submit Event"}
        </button>
      </form>
    </div>
  );
}
