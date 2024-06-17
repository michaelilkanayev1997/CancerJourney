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
