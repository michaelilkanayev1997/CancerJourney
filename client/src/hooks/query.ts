import { useQuery } from "react-query";

import { ToastNotification } from "@utils/toastConfig";
import catchAsyncError from "src/api/catchError";
import { getClient } from "src/api/client";
import { FoldersLength } from "src/@types/file";
import { ImageType } from "@components/ImageCard";
import { IAppointment, IMedication } from "../../../server/src/models/schedule";
import axios from "axios";
import { UnsplashImage } from "@views/bottomTab/home/Home";
import { getFromAsyncStorage, saveToAsyncStorage } from "@utils/asyncStorage";
import { Post } from "src/@types/post";

const fetchFoldersLength = async (): Promise<FoldersLength> => {
  const client = await getClient();
  const { data: foldersLength } = await client.get("/file/folders-length");

  return foldersLength;
};

export const useFetchFoldersLength = () => {
  return useQuery(["folders-length"], {
    queryFn: () => fetchFoldersLength(),
    staleTime: Infinity, // Data never becomes stale
    onError(err) {
      const errorMessage = catchAsyncError(err);
      ToastNotification({
        type: "Error",
        message: errorMessage,
      });
    },
  });
};

const fetchFolderFiles = async (folderName: string): Promise<ImageType[]> => {
  const client = await getClient();
  const { data } = await client.get(`/file/${folderName}`);

  //console.log("fetching files...");
  return data;
};

export const useFetchFolderFiles = (folderName: string) => {
  return useQuery(["folder-files", folderName], {
    staleTime: 1000 * 60 * 59, // Consider data stale after 59 minutes (3540 seconds)
    cacheTime: 1000 * 60 * 60, // 1 hours cache time

    queryFn: () => fetchFolderFiles(folderName),
    onError(err) {
      const errorMessage = catchAsyncError(err);
      ToastNotification({
        type: "Error",
        message: errorMessage,
      });
    },
  });
};

const fetchSchedules = async (
  scheduleName: string
): Promise<IAppointment[] | IMedication[]> => {
  const client = await getClient();
  const { data } = await client.get(`/schedule/${scheduleName}`);

  //console.log(`fetching ${scheduleName}...`);
  return data;
};

export const useFetchSchedules = (scheduleName: string) => {
  return useQuery(["schedules", scheduleName], {
    staleTime: 1000 * 60 * 59, // Consider data stale after 59 minutes (3540 seconds)
    cacheTime: 1000 * 60 * 60, // 1 hours cache time

    queryFn: () => fetchSchedules(scheduleName),
    onError(err) {
      const errorMessage = catchAsyncError(err);
      ToastNotification({
        type: "Error",
        message: errorMessage,
      });
    },
  });
};

const fetchStudyImages = async (
  UNSPLASH_URL: string
): Promise<UnsplashImage[]> => {
  const { data } = await axios.get(UNSPLASH_URL);

  return data;
};

export const useFetchStudyImages = (UNSPLASH_URL: string) => {
  const ONE_WEEK_IN_MS = 1000 * 60 * 60 * 24 * 7;
  return useQuery(["study-images"], async () => {
    const lastFetch = await getFromAsyncStorage(
      "last-unsplash-fetch-timestamp"
    );
    const currentTime = new Date().getTime();
    const isCacheExpired = lastFetch
      ? currentTime - parseInt(lastFetch) > ONE_WEEK_IN_MS
      : true;

    if (!isCacheExpired) {
      const cachedImages = await getFromAsyncStorage("study-images");
      if (cachedImages) {
        return JSON.parse(cachedImages);
      }
    }

    const data = await fetchStudyImages(UNSPLASH_URL);
    await saveToAsyncStorage("study-images", JSON.stringify(data));
    await saveToAsyncStorage(
      "last-unsplash-fetch-timestamp",
      currentTime.toString()
    );
    return data;
  });
};

export const fetchPosts = async (
  cancerType: string,
  limit = 6,
  pageNo = 0
): Promise<Post[]> => {
  const client = await getClient();
  const { data } = await client.get(
    `/post/get-posts?limit=${limit}&pageNo=${pageNo}&cancerType=${cancerType}`
  );
  return data;
};

export const useFetchPosts = (cancerType: string) => {
  return useQuery(["posts", cancerType], {
    queryFn: () => fetchPosts(cancerType),
    onError(err) {
      const errorMessage = catchAsyncError(err);
      ToastNotification({
        type: "Error",
        message: errorMessage,
      });
    },
  });
};
