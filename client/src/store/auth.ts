import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from ".";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  verified: boolean;
  avatar?: string;
  followers: number;
  followings: number;
}

interface AuthState {
  profile: UserProfile | null;
  loggedIn: boolean;
  busy: boolean;
}

const initialState: AuthState = {
  profile: null,
  loggedIn: false,
  busy: false,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateProfile(authState, { payload }: PayloadAction<UserProfile | null>) {
      authState.profile = payload;
    },
    updateLoggedInState(authState, { payload }: PayloadAction<boolean>) {
      authState.loggedIn = payload;
    },
    updateBusyState(authState, { payload }: PayloadAction<boolean>) {
      authState.busy = payload;
    },
  },
});

export const { updateProfile, updateLoggedInState, updateBusyState } =
  slice.actions;

export const getAuthState = createSelector(
  (state: RootState) => state,
  ({ auth }) => auth
);

export default slice.reducer;
