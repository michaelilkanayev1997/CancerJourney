import { useQuery } from "react-query";

import { ToastNotification } from "@utils/toastConfig";
import catchAsyncError from "src/api/catchError";
import { getClient } from "src/api/client";
import { FoldersLength } from "src/@types/file";
import { ImageType } from "@components/ImageCard";
import { IAppointment } from "../../../server/src/models/Schedule";

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

  console.log("fetching files...");
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

const fetchAppointments = async (): Promise<IAppointment[]> => {
  const client = await getClient();
  const { data } = await client.get(`/schedule/appointments`);

  console.log("fetching appointments...");
  return data;
};

export const useFetchAppointments = () => {
  return useQuery(["appointments"], {
    staleTime: 1000 * 60 * 59, // Consider data stale after 59 minutes (3540 seconds)
    cacheTime: 1000 * 60 * 60, // 1 hours cache time

    queryFn: () => fetchAppointments(),
    onError(err) {
      const errorMessage = catchAsyncError(err);
      ToastNotification({
        type: "Error",
        message: errorMessage,
      });
    },
  });
};
