import { NavigatorScreenParams } from "@react-navigation/native";
import { IAppointment, IMedication } from "./schedule";

interface NewUserResponse {
  id: string;
  name: string;
  email: string;
}

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  LostPassword: undefined;
  Verification: { userInfo: NewUserResponse; password: string };
  OnBoarding: undefined;
  Welcome: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
  Settings: undefined;
};

export type UploadStackParamList = {
  FolderGrid: undefined;
  FolderDetails: {
    folderName: string;
    toggleLayout?: boolean;
  };
  FilePreview: {
    fileUri: string;
    fileType: string;
    folderName: string;
  };
};

export type ScheduleStackParamList = {
  Appointments: {
    appointment?: IAppointment;
  };
  Medications: {
    medication?: IMedication;
  };
};

export type SocialStackParamList = {
  Main: undefined;
  Posts: undefined;
  Favorites: undefined;
};

export type BottomTabParamList = {
  HomeScreen: undefined;
  ProfileScreen: NavigatorScreenParams<ProfileStackParamList>;
  PostScreen: NavigatorScreenParams<SocialStackParamList>;
  UploadScreen: undefined;
  Schedule: NavigatorScreenParams<ScheduleStackParamList>;
};
