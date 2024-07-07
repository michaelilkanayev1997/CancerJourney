import Avatar from "@ui/Avatar";
import colors from "@utils/colors";
import { FC } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
  // profile?: PublicProfile;
}

const PublicProfileContainer: FC<Props> = ({ profile }) => {
  // const followingMutation = useMutation({
  //   mutationFn: async id => toggleFollowing(id),
  //   onMutate: (id: string) => {
  //     queryClient.setQueryData<boolean>(
  //       ['is-following', id],
  //       oldData => !oldData,
  //     );
  //   },
  // });

  // const toggleFollowing = async (id: string) => {
  //   try {
  //     if (!id) return;

  //     const client = await getClient();
  //     const {data} = await client.post('/profile/update-follower/' + id);
  //     queryClient.invalidateQueries({queryKey: ['profile', id]}); // Refresh Followerts Count

  //     if (data.status === 'added') {
  //       dispatch(
  //         updateProfile({
  //           ...(user as UserProfile),
  //           followings: (user?.followings || 0) + 1,
  //         }),
  //       );
  //     } else {
  //       dispatch(
  //         updateProfile({
  //           ...(user as UserProfile),
  //           followings: (user?.followings || 0) - 1,
  //         }),
  //       );
  //     }
  //   } catch (error) {
  //     const errorMessage = catchAsyncError(error);
  //     dispatch(updateNotification({message: errorMessage, type: 'error'}));
  //   }
  // };

  if (!profile) return null;

  return (
    <View style={styles.container}>
      <Avatar
        uri={profile?.avatar.url || ""}
        style={{ width: 80, height: 80 }}
      />

      <View style={styles.profileInfoContainer}>
        <Text style={styles.profileName}>{profile.name}</Text>

        <Text style={styles.followerText}>{profile.followers} Followers</Text>
        <Text style={styles.followerText}>{profile.followers} Followings</Text>

        <Pressable onPress={() => console.log("follow")} style={styles.flexRow}>
          <Text style={styles.profileActionLink}>
            {false ? "Unfollow" : "Follow"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  profileInfoContainer: {
    paddingLeft: 10,
  },
  profileName: {
    color: colors.CONTRAST,
    fontSize: 18,
    fontWeight: "700",
  },
  email: {
    color: colors.CONTRAST,
    marginRight: 5,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileActionLink: {
    backgroundColor: colors.INFO,
    color: colors.INACTIVE_CONTRAST,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginTop: 5,
    borderRadius: 5,
  },
  followerText: {
    color: colors.CONTRAST,
    paddingVertical: 2,
    marginTop: 5,
    borderRadius: 5,
  },
  settingsBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignContent: "center",
  },
});

export default PublicProfileContainer;
