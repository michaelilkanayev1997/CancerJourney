import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Avatar from "@ui/Avatar";
import colors from "@utils/colors";
import { UserTypeKey, userTypes } from "@utils/enums";
import { FC, useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { DrawerParamList } from "src/@types/navigation";

import { User } from "src/@types/post";
import { useFollowMutations } from "src/hooks/mutations";
import { useFetchFollowers, useFetchFollowings } from "src/hooks/query";
import {
  getFollowings,
  updateFollow,
  updateFollowings,
  UserProfile,
} from "src/store/auth";

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
  const dispatch = useDispatch();

  const navigation =
    useNavigation<NativeStackNavigationProp<DrawerParamList>>();

  const followingsState = useSelector(getFollowings);

  const { data: followers, isLoading: followersLoading } = useFetchFollowers(
    profile._id
  );
  const { data: followings, isLoading: followingsLoading } = useFetchFollowings(
    profile._id
  );

  const { updateFollowMutation, updateLoading } = useFollowMutations();

  const toggleFollow = useCallback(() => {
    updateFollowMutation({
      profileId: profile._id,
      currentUser,
    });
    dispatch(updateFollow(profile._id));
  }, [currentUser, profile._id, updateFollowMutation]);

  const isFollowing = followingsState.includes(profile._id);

  // console.log("followers--->", followers);
  // console.log("followings--->", followings);

  const navigateToPostLikesPage = useCallback(
    (followersOrFollowings: string) => {
      navigation.navigate("PostLikes", {
        likes: followersOrFollowings === "Followers" ? followers : followings,
        followersOrFollowings,
      });
    },
    [followers, followings, followingsState]
  );

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
            <TouchableOpacity
              onPress={() => navigateToPostLikesPage("Followers")}
            >
              <Text style={styles.followerText}>
                Followers {followers?.length}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigateToPostLikesPage("Followings")}
            >
              <Text style={styles.followerText}>
                Followings {followings?.length}
              </Text>
            </TouchableOpacity>
          </View>
          {publicProfile && currentUser?.id !== profile._id && (
            <TouchableOpacity
              style={styles.flexRow}
              onPress={toggleFollow}
              disabled={updateLoading || followersLoading || followingsLoading}
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
    justifyContent: "space-evenly",
    paddingHorizontal: 10,
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
    paddingLeft: 20,
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
    color: colors.INFO,
    paddingVertical: 2,
    marginTop: 5,
    borderRadius: 5,
    textDecorationLine: "underline",
  },
  userTypeText: {
    color: colors.LIGHT_BLUE,
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
