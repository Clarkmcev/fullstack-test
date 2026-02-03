import { all, fork } from "redux-saga/effects";
import eventsSaga from "./eventsSaga";

// Root saga
export default function* rootSaga() {
  yield all([fork(eventsSaga)]);
}
