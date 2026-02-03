import { call, put, takeLatest } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import {
  fetchEventsRequest,
  fetchEventsSuccess,
  fetchEventsFailure,
  createEventRequest,
  createEventSuccess,
  createEventFailure,
  Event,
} from "../eventsSlice";

const API_URL = "http://localhost:8080";

// API call functions
function* fetchEventsApi() {
  const response: Response = yield call(fetch, `${API_URL}/events`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data: { events: Event[] } = yield response.json();
  return data.events || [];
}

function* createEventApi(eventData: {
  type: string;
  description: string;
  budget: number;
  numberOfPersons: number;
  date: string;
  payload: object;
}) {
  const response: Response = yield call(fetch, `${API_URL}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(eventData),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: Event = yield response.json();
  return data;
}

// Worker sagas
function* fetchEventsSaga() {
  try {
    const events: Event[] = yield call(fetchEventsApi);
    yield put(fetchEventsSuccess(events));
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch events";
    yield put(fetchEventsFailure(errorMessage));
  }
}

function* createEventSaga(
  action: PayloadAction<{
    type: string;
    description: string;
    budget: number;
    numberOfPersons: number;
    date: string;
    payload: object;
  }>
) {
  try {
    const event: Event = yield call(createEventApi, action.payload);
    yield put(createEventSuccess(event));
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create event";
    yield put(createEventFailure(errorMessage));
  }
}

// Watcher saga
export default function* eventsSaga() {
  yield takeLatest(fetchEventsRequest.type, fetchEventsSaga);
  yield takeLatest(createEventRequest.type, createEventSaga);
}
