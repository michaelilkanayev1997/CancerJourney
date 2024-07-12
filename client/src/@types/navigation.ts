import { NavigatorScreenParams } from "@react-navigation/native";

import { IAppointment, IMedication } from "./schedule";
import { Study } from "@components/StudyCard";
import { User } from "./post";

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

export type HomeStackParamList = {
  Home: undefined;
  StudyDetails: {
    study: Study;
    imageUrl: string;
  };
  Settings: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
  Settings: undefined;
};

export type UploadStackParamList = {
  FolderGrid?: undefined;
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

export type DrawerParamList = {
  SocialTabs: undefined;
  PostLikes: {
    likes: {
      _id: string;
      userId: {
        _id: number;
        name: string;
        avatar: {
          url: string;
          publicId: string;
        };
        userType: string;
      };
      createdAt: string;
    }[];
  };
  PublicProfile: { publicUser: User };
  "New Post": {
    description: string;
    image: {
      public_id: string;
      url: string;
    } | null;
    forumType: string;
    owner: User;
    postId: string;
    update: boolean;
  };
  PostReport: { postId: string };
  PostPages: NavigatorScreenParams<{
    PostLikes: { likes: any[] };
    PublicProfile: { user: User };
    PostReport: { postId: string };
  }>;
};

export type SocialStackParamList = {
  SocialTabs: NavigatorScreenParams<{
    Forum: undefined;
    "New Post": undefined;
    "Social Profile": undefined;
  }>;
  PostPages: undefined;
};

export type BottomTabParamList = {
  HomeScreen: NavigatorScreenParams<HomeStackParamList>;
  ProfileScreen: NavigatorScreenParams<ProfileStackParamList>;
  PostScreen: NavigatorScreenParams<SocialStackParamList>;
  UploadScreen: NavigatorScreenParams<UploadStackParamList>;
  Schedule: NavigatorScreenParams<ScheduleStackParamList>;
  SocialTabs: NavigatorScreenParams<{
    Forum: undefined;
    "New Post": undefined;
    "Social Profile": undefined;
  }>;
};
