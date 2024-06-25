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
  createdAt: Date;

  userType: string;
  diagnosisDate: Date | null;
  cancerType: string;
  stage: string;
  gender: string;
  birthDate: Date | null;
  country: { cca2: string; name: string; flag: string };

  expoPushToken: string;
}

interface AuthState {
  profile: UserProfile | null;
  loggedIn: boolean;
  busy: boolean;
  viewedOnBoarding: boolean;
}

const initialState: AuthState = {
  profile: null,
  loggedIn: false,
  busy: false,
  viewedOnBoarding: false,
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
    updateViewedOnBoardingState(
      authState,
      { payload }: PayloadAction<boolean>
    ) {
      authState.viewedOnBoarding = payload;
    },
  },
});

export const {
  updateProfile,
  updateLoggedInState,
  updateBusyState,
  updateViewedOnBoardingState,
} = slice.actions;

export const getAuthState = createSelector(
  (state: RootState) => state,
  ({ auth }) => auth
);

export default slice.reducer;
