import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from ".";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  verified: boolean;
  avatar?: string;
  followers: string[];
  followings: string[];
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
  followings: string[];
}

const initialState: AuthState = {
  profile: null,
  loggedIn: false,
  busy: false,
  viewedOnBoarding: false,
  followings: [],
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateProfile(authState, { payload }: PayloadAction<UserProfile | null>) {
      authState.profile = payload;
    },
    updateFollowings(authState, { payload }: PayloadAction<string[]>) {
      authState.followings = payload;
    },
    updateFollow(authState, { payload }: PayloadAction<string>) {
      const profileId = payload;

      if (authState.followings.includes(profileId)) {
        authState.followings = authState.followings.filter(
          (id) => id !== profileId
        );
      } else {
        authState.followings = [...authState.followings, profileId];
      }
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
  updateFollowings,
  updateFollow,
  updateLoggedInState,
  updateBusyState,
  updateViewedOnBoardingState,
} = slice.actions;

export const getAuthState = createSelector(
  (state: RootState) => state,
  ({ auth }) => auth
);

export const getProfile = createSelector(
  (state: RootState) => state.auth,
  (auth) => auth.profile
);

export const getFollowings = createSelector(
  (state: RootState) => state.auth,
  (auth) => auth.followings
);

export default slice.reducer;
