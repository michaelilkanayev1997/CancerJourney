import { useMutation, useQueryClient } from "react-query";

import { ImageType } from "@components/ImageCard";
import { ToastNotification } from "@utils/toastConfig";
import catchAsyncError from "src/api/catchError";
import { getClient } from "src/api/client";
import { IAppointment } from "../../../server/src/models/Schedule";

interface DeleteFileParams {
  fileId: string;
  folderName: string;
  handleCloseMoreOptionsPress: () => void;
}

interface UpdateFileParams {
  fileId: string;
  folderName: string;
  title: string;
  description: string;
  handleCloseMoreOptionsPress: () => void;
}

export const useFileMutations = () => {
  const queryClient = useQueryClient();

  const { isLoading: deleteLoading, mutate: deleteFileMutation } = useMutation<
    void,
    Error,
    DeleteFileParams,
    unknown
  >(
    async ({ fileId, folderName }) => {
      // Construct the URL with query parameters
      const url = `/file/file-delete?fileId=${fileId}&folderName=${folderName}`;
      const client = await getClient();
      await client.delete(url);
    },
    {
      onMutate: async (variables) => {
        return { ...variables };
      },
      // Invalidate related queries on success to refresh the UI
      onSuccess: (data, variables) => {
        const { fileId, folderName } = variables;

        queryClient.setQueryData(
          ["folder-files", folderName],
          (oldData: ImageType[] | undefined) => {
            if (!oldData) {
              return [];
            }
            // Filter out the deleted file
            return oldData?.filter((file) => file._id !== fileId) ?? [];
          }
        );

        queryClient.invalidateQueries(["folders-length"]);
        ToastNotification({
          message: "File deleted successfully",
        });
      },
      onError: (error) => {
        const errorMessage = catchAsyncError(error);
        ToastNotification({
          type: "Error",
          message: errorMessage,
        });
      },
      onSettled: (data, error, variables) => {
        variables?.handleCloseMoreOptionsPress();
      },
    }
  );

  const { isLoading: updateLoading, mutate: updateFileMutation } = useMutation<
    void,
    Error,
    UpdateFileParams,
    unknown
  >(
    async ({ fileId, title, description, folderName }) => {
      const client = await getClient();
      const url = `/file/file-update?fileId=${fileId}&folderName=${folderName}`;
      return client.patch(url, { title: title, description });
    },
    {
      onSuccess: (data, variables) => {
        const { fileId, folderName, description, title } = variables;
        // Optimistically update the local cache
        queryClient.setQueryData(
          ["folder-files", folderName],
          (oldData: ImageType[] | undefined) => {
            if (!oldData) {
              return [];
            }
            return oldData.map((file) => {
              if (file._id === fileId) {
                return { ...file, title, description };
              }
              return file;
            });
          }
        );
        ToastNotification({ message: "File updated successfully" });
      },
      onError: (error) => {
        const errorMessage = catchAsyncError(error);
        ToastNotification({
          type: "Error",
          message: errorMessage,
        });
      },
      onSettled: (data, error, variables) => {
        variables?.handleCloseMoreOptionsPress();
      },
    }
  );

  return {
    deleteFileMutation,
    deleteLoading,
    updateFileMutation,
    updateLoading,
  };
};

interface DeleteAppointmentParams {
  scheduleId: string;
  scheduleName: string;
  handleCloseMoreOptionsPress: () => void;
}

interface UpdateAppointmentParams {
  scheduleId: string;
  scheduleName: string;
  title: string;
  location: string;
  date: Date;
  notes?: string;
  reminder: string;
  handleCloseMoreOptionsPress: () => void;
}

export const useScheduleMutations = () => {
  const queryClient = useQueryClient();

  const { isLoading: deleteLoading, mutate: deleteScheduleMutation } =
    useMutation<void, Error, DeleteAppointmentParams, unknown>(
      async ({ scheduleId, scheduleName }) => {
        // Construct the URL with query parameters
        const url = `/schedule/schedule-delete?scheduleId=${scheduleId}&scheduleName=${scheduleName}`;
        const client = await getClient();
        await client.delete(url);
      },
      {
        onMutate: async (variables) => {
          return { ...variables };
        },
        // Invalidate related queries on success to refresh the UI
        onSuccess: (data, variables) => {
          const { scheduleId, scheduleName } = variables;

          queryClient.setQueryData(
            ["schedules", scheduleName],
            (oldData: IAppointment[] | undefined) => {
              if (!oldData) {
                return [];
              }

              // Filter out the deleted schedule
              return (
                oldData?.filter(
                  (schedule) => schedule._id.toString() !== scheduleId
                ) ?? []
              );
            }
          );

          ToastNotification({
            message: `${scheduleName.slice(0, -1)} deleted successfully`,
          });
        },
        onError: (error) => {
          const errorMessage = catchAsyncError(error);
          ToastNotification({
            type: "Error",
            message: errorMessage,
          });
        },
        onSettled: (data, error, variables) => {
          variables?.handleCloseMoreOptionsPress();
        },
      }
    );

  const { isLoading: updateLoading, mutate: updateScheduleMutation } =
    useMutation<void, Error, UpdateAppointmentParams, unknown>(
      async ({
        scheduleId,
        scheduleName,
        title,
        location,
        date,
        notes,
        reminder,
      }) => {
        const client = await getClient();

        const url = `/schedule/${scheduleName.slice(
          0,
          -1
        )}-update?scheduleId=${scheduleId}&scheduleName=${scheduleName}`;

        return client.patch(url, { title, location, date, notes, reminder });
      },
      {
        onSuccess: (data, variables) => {
          const {
            scheduleId,
            scheduleName,
            title,
            location,
            date,
            notes,
            reminder,
          } = variables;

          // Optimistically update the local cache
          queryClient.setQueryData<IAppointment[]>(
            ["schedules", scheduleName],
            (oldData) => {
              if (!oldData) return [];
              return oldData.map((schedule) => {
                if (schedule._id.toString() === scheduleId) {
                  return {
                    ...schedule,
                    title,
                    location,
                    date,
                    notes,
                    reminder,
                  } as IAppointment;
                }
                return schedule;
              });
            }
          );

          ToastNotification({
            message: `${scheduleName.slice(0, -1)} updated successfully`,
          });
        },
        onError: (error) => {
          const errorMessage = catchAsyncError(error);
          ToastNotification({
            type: "Error",
            message: errorMessage,
          });
        },
        onSettled: (data, error, variables) => {
          variables?.handleCloseMoreOptionsPress();
        },
      }
    );

  return {
    deleteScheduleMutation,
    deleteLoading,
    updateScheduleMutation,
    updateLoading,
  };
};
