import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";

type notificationType = "error" | "success" | "info";

interface Notification {
  message: string;
  type: notificationType;
}

const initialState: Notification = {
  message: "",
  type: "error",
};

const slice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    updateNotification(
      notificationState,
      { payload }: PayloadAction<Notification>
    ) {
      notificationState.message = payload.message;
      notificationState.type = payload.type;
    },
  },
});

export const getNotificationState = createSelector(
  (state: RootState) => state,
  ({ notification }) => notification
);

export const { updateNotification } = slice.actions;

export default slice.reducer;
