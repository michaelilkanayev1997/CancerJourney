import { useQuery } from "react-query";

import { ToastNotification } from "@utils/toastConfig";
import catchAsyncError from "src/api/catchError";
import { getClient } from "src/api/client";
import { FoldersLength } from "src/@types/file";

const fetchFoldersLength = async (): Promise<FoldersLength> => {
  const client = await getClient();
  const { data: foldersLength } = await client.get("/file/folders-length");
  return foldersLength;
};

export const useFetchFoldersLength = () => {
  return useQuery(["folders-length"], {
    queryFn: () => fetchFoldersLength(),
    onError(err) {
      const errorMessage = catchAsyncError(err);
      ToastNotification({
        type: "Error",
        message: errorMessage,
      });
    },
  });
};
