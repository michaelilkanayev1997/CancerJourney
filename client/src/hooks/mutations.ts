import { useMutation, useQueryClient } from "react-query";

import { ImageType } from "@components/ImageCard";
import { ToastNotification } from "@utils/toastConfig";
import catchAsyncError from "src/api/catchError";
import { getClient } from "src/api/client";
import { IAppointment, IMedication } from "../../../server/src/models/schedule";

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

interface DeleteScheduleParams {
  scheduleId: string;
  scheduleName: string;
  handleCloseMoreOptionsPress: () => void;
}

interface UpdateScheduleParams {
  scheduleId: string;
  scheduleName: string;
  title?: string;
  location?: string;
  date?: Date;
  notes?: string;
  reminder?: string;
  name?: string;
  frequency?: string;
  timesPerDay?: string;
  specificDays?: string[];
  prescriber?: string;
  handleCloseMoreOptionsPress: () => void;
}

type ScheduleItem = IAppointment | IMedication;

const isAppointment = (item: ScheduleItem): item is IAppointment => {
  return (item as IAppointment).title !== undefined;
};

const isMedication = (item: ScheduleItem): item is IMedication => {
  return (item as IMedication).name !== undefined;
};

export const useScheduleMutations = () => {
  const queryClient = useQueryClient();

  const { isLoading: deleteLoading, mutate: deleteScheduleMutation } =
    useMutation<void, Error, DeleteScheduleParams, unknown>(
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

          ToastNotification({
            message: `${variables?.scheduleName.slice(
              0,
              -1
            )} deleted successfully`,
          });
        },
      }
    );

  const { isLoading: updateLoading, mutate: updateScheduleMutation } =
    useMutation<void, Error, UpdateScheduleParams, unknown>(
      async ({
        scheduleId,
        scheduleName,
        title,
        location,
        date,
        notes,
        reminder,
        name,
        frequency,
        timesPerDay,
        specificDays,
        prescriber,
      }) => {
        const client = await getClient();

        const url = `/schedule/${scheduleName.slice(
          0,
          -1
        )}-update?scheduleId=${scheduleId}&scheduleName=${scheduleName}`;

        const updateData = {
          title,
          location,
          date,
          notes,
          reminder,
          name,
          frequency,
          timesPerDay,
          specificDays,
          prescriber,
        };

        return client.patch(url, updateData);
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
            name,
            frequency,
            timesPerDay,
            specificDays,
            prescriber,
          } = variables;

          // Optimistically update the local cache
          queryClient.setQueryData<ScheduleItem[]>(
            ["schedules", scheduleName],
            (oldData) => {
              if (!oldData) return [];
              return oldData.map((schedule) => {
                if (schedule._id.toString() === scheduleId) {
                  if (isAppointment(schedule)) {
                    return {
                      ...schedule,
                      title: title,
                      location: location,
                      date: date,
                      notes: notes,
                      reminder: reminder,
                    } as IAppointment;
                  } else if (isMedication(schedule)) {
                    return {
                      ...schedule,
                      name: name,
                      frequency: frequency,
                      timesPerDay: timesPerDay,
                      specificDays: specificDays,
                      prescriber: prescriber,
                      notes: notes,
                    } as IMedication;
                  }
                }
                return schedule;
              });
            }
          );
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

          ToastNotification({
            message: `${variables?.scheduleName.slice(
              0,
              -1
            )} updated successfully`,
          });
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
