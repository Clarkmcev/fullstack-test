import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EventFormData } from "../components/EventForm";

export interface Event {
  id: number;
  type: string;
  description: string;
  budget: number;
  numberOfPersons: number;
  date: string;
  payload: object;
  createdAt?: string;
}

export enum EventTypeEnum {
  Wedding = "Wedding",
  Birthday = "Birthday",
  Conference = "Conference",
  Concert = "Concert",
  Festival = "Festival",
  Workshop = "Workshop",
  Seminar = "Seminar",
  Meetup = "Meetup",
  Fundraiser = "Fundraiser",
  Exhibition = "Exhibition",
}

interface EventsState {
  events: Event[];
  loading: boolean;
  error: string | null;
  submitStatus: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: EventsState = {
  events: [],
  loading: false,
  error: null,
  submitStatus: "idle",
};

// Slice
const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    // Fetch events actions
    fetchEventsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchEventsSuccess: (state, action: PayloadAction<Event[]>) => {
      state.loading = false;
      state.events = action.payload;
      state.error = null;
    },
    fetchEventsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Create event actions
    createEventRequest: (state, _: PayloadAction<EventFormData>) => {
      state.submitStatus = "loading";
      state.error = null;
    },
    createEventSuccess: (state, action: PayloadAction<Event>) => {
      state.submitStatus = "succeeded";
      state.events.unshift(action.payload);
      state.error = null;
    },
    createEventFailure: (state, action: PayloadAction<string>) => {
      state.submitStatus = "failed";
      state.error = action.payload;
    },

    // Other actions
    setEvents: (state, action: PayloadAction<Event[]>) => {
      state.events = action.payload;
    },
    addEvent: (state, action: PayloadAction<Event>) => {
      state.events.unshift(action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
    resetSubmitStatus: (state) => {
      state.submitStatus = "idle";
    },
  },
});

export const {
  fetchEventsRequest,
  fetchEventsSuccess,
  fetchEventsFailure,
  createEventRequest,
  createEventSuccess,
  createEventFailure,
  setEvents,
  addEvent,
  clearError,
  resetSubmitStatus,
} = eventsSlice.actions;

export default eventsSlice.reducer;
