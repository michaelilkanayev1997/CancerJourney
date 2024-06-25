declare module "@env" {
  export const ANDROID_CLIENT_ID: string;
  export const IOS_CLIENT_ID: string;
  export const CLINICAL_TRIALS_URL: string;
}
declare module "react-native-progress/Bar";

declare module "*.png" {
  const value: any;
  export = value;
}
