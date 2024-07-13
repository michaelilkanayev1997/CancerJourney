import Avatar from "@ui/Avatar";
import colors from "@utils/colors";
import { UserTypeKey, userTypes } from "@utils/enums";
import { FC } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { User } from "src/@types/post";
import { useFollowMutations } from "src/hooks/mutations";
import { useFetchFollowers, useFetchFollowings } from "src/hooks/query";
import { UserProfile } from "src/store/auth";

interface Props {
  profile?: User;
  publicProfile: boolean;
  currentUser: UserProfile | null;
}

const PublicProfileContainer: FC<Props> = ({
  profile,
  publicProfile,
  currentUser,
}) => {
  if (!profile) return null;

  const { data: followers, isLoading: followersLoading } = useFetchFollowers(
    profile._id
  );
  const { data: followings, isLoading: followingsLoading } = useFetchFollowings(
    profile._id
  );

  const { updateFollowMutation, updateLoading } = useFollowMutations();

  const toggleFollow = () => {
    updateFollowMutation({
      profileId: profile._id,
      currentUser,
    });
  };

  const isFollowing = currentUser?.followings.includes(profile._id);

  return (
    <View style={styles.container}>
      <Avatar uri={profile?.avatar?.url} style={{ width: 80, height: 80 }} />

      <View style={styles.profileInfoContainer}>
        <View style={styles.nameAndTypeContainer}>
          <Text style={styles.profileName}>{profile?.name}</Text>
          <Text style={styles.userTypeText}>
            {userTypes[profile?.userType as UserTypeKey]}
          </Text>
        </View>

        <View style={styles.rowContainer}>
          <View>
            <Text style={styles.followerText}>
              Followers {followers?.length}
            </Text>
            <Text style={styles.followerText}>
              Followings {followings?.length}
            </Text>
          </View>

          {publicProfile && currentUser?.id !== profile._id && (
            <TouchableOpacity
              style={styles.flexRow}
              onPress={toggleFollow}
              disabled={updateLoading}
            >
              <Text
                style={[
                  styles.profileActionLink,
                  isFollowing ? styles.unfollow : styles.follow,
                ]}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
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
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  profileInfoContainer: {
    paddingLeft: 10,
  },
  profileName: {
    color: colors.CONTRAST,
    fontSize: 18,
    fontWeight: "700",
    textDecorationLine: "underline",
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
    color: colors.INACTIVE_CONTRAST,
    paddingHorizontal: 5,
    paddingVertical: 4,
    marginTop: 5,
    borderRadius: 5,
    width: 70,
    height: 30,
    textAlign: "center",
    fontWeight: "400",
  },
  unfollow: { backgroundColor: colors.GREEN },
  follow: { backgroundColor: colors.INFO },
  followerText: {
    color: colors.CONTRAST,
    paddingVertical: 2,
    marginTop: 5,
    borderRadius: 5,
  },
  userTypeText: {
    color: colors.INFO,
    fontSize: 13,
    marginTop: 5,
    paddingLeft: "6%",
  },
  nameAndTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default PublicProfileContainer;
