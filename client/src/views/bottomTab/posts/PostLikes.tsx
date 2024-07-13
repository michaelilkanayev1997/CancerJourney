import { FC, useCallback, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Text,
  Image,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";

import colors from "@utils/colors";
import { Like, User } from "src/@types/post";
import placeholder from "@assets/user_profile.png";
import PulseAnimationContainer from "@components/PulseAnimationContainer";
import { DrawerParamList } from "src/@types/navigation";
import { useSelector } from "react-redux";
import { getAuthState } from "src/store/auth";
import { useFollowMutations } from "src/hooks/mutations";

type Props = {
  route: any;
};

const dummyData = new Array(10).fill("");

const dummyDataFetch = new Array(3).fill("");

const ITEM_SIZE = 76;

const PostLikes: FC<Props> = ({ route }) => {
  const { likes } = route.params;
  const { profile } = useSelector(getAuthState);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(likes.slice(0, 20));
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const { updateFollowMutation, updateLoading } = useFollowMutations();

  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();

  console.log(likes.length);
  console.log("data length ", data.length);
  // console.log("isFetchingMore ", isFetchingMore);
  // console.log("hasMore ", hasMore);
  // console.log("loading", loading);

  const handleOnEndReached = useCallback(() => {
    if (likes.length <= 20 || isFetchingMore || !hasMore) return;

    setIsFetchingMore(true);

    const newPage = page + 1;
    const newItems = likes.slice(page * 20, newPage * 20);

    if (newItems.length < 20) {
      setHasMore(false);
    }

    setPage(newPage);

    setTimeout(() => {
      setData((prevData: Like[]) => [...prevData, ...newItems]);
      setIsFetchingMore(false);
    }, 1000);
  }, [isFetchingMore, hasMore, page, likes]);

  const handleImageLoad = useCallback(() => {
    if (data.length < 20) {
      setIsFetchingMore(false);
      setLoading(false);
      return;
    }
    setTimeout(() => {
      setLoading(false); // Image loaded successfully
    }, data.length);
  }, []);

  const handleImageError = useCallback(() => {
    setLoading(false); // Image failed to load
  }, []);

  const keyExtractor = useCallback((item: any) => item._id.toString(), []);

  const renderFooter = useCallback(() => {
    return isFetchingMore ? (
      <View>
        {dummyDataFetch.map((_, index) => (
          <PulseAnimationContainer key={index} pulseRate={400}>
            <View
              style={[
                styles.listItem,
                {
                  borderColor: "LIGHT_GRAY",
                  borderWidth: 0.2,
                  elevation: 0,
                  paddingVertical: 4,
                  marginTop: 6,
                },
              ]}
            >
              <View style={[styles.userDetails, { marginLeft: -8 }]}>
                <View style={styles.container}>
                  <View style={styles.loadingAvatarContainer}></View>
                  <Image
                    source={{
                      uri: `https://randomuser.me/api/portraits/thumb/men/10.jpg`,
                    }}
                    style={styles.dummyImage}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                  />
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.dummyUserName}></Text>
                  <Text style={styles.dummyUserType}></Text>
                </View>
              </View>
            </View>
          </PulseAnimationContainer>
        ))}
      </View>
    ) : null;
  }, [isFetchingMore, handleImageLoad, handleImageError]);

  const toggleFollow = useCallback(
    (item: Like) => {
      updateFollowMutation({
        profileId: item.userId._id,
        currentUser: profile,
      });
    },
    [profile]
  );

  const navigateToProfile = useCallback((user: User) => {
    navigation.navigate("PublicProfile", {
      publicUser: user,
      publicProfile: true,
    });
  }, []);

  const renderItem = useCallback(
    ({ item, index }: { item: Like; index: number }) => {
      const isFollowing = profile?.followings.includes(item?.userId?._id);
      console.log("isFollowing", isFollowing);
      const inputRange = [-1, 0, ITEM_SIZE * index, ITEM_SIZE * (index + 2)];

      const opacityInputRange = [
        -1,
        0,
        ITEM_SIZE * index,
        ITEM_SIZE * (index + 0.8),
      ];

      const scale = scrollY.interpolate({
        inputRange,
        outputRange: [1, 1, 1, 0],
      });

      const opacity = scrollY.interpolate({
        inputRange: opacityInputRange,
        outputRange: [1, 1, 1, 0],
      });

      return (
        <Animated.View
          style={[styles.listItem, { opacity, transform: [{ scale }] }]}
        >
          <TouchableOpacity
            style={styles.userDetails}
            onPress={() => navigateToProfile(item.userId)}
          >
            <Image
              source={
                item?.userId?.avatar
                  ? { uri: item.userId.avatar.url }
                  : placeholder
              }
              style={styles.userAvatar}
            />
            <View style={styles.userInfo}>
              <View style={styles.userNameContainer}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.userName}
                >
                  {item?.userId.name && item.userId.name}
                </Text>
              </View>
              <Text style={styles.userUserType}>
                {item?.userId.userType && item.userId.userType}
              </Text>
            </View>
          </TouchableOpacity>

          {item?.userId?._id !== profile?.id && (
            <TouchableOpacity
              style={styles.followButton}
              onPress={() => toggleFollow(item)}
            >
              <Text style={styles.followButtonText}>
                {isFollowing ? "Unfollow" : "Follow"}
              </Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      );
    },
    [handleImageLoad, handleImageError, scrollY, profile]
  );

  const getItemLayout = useCallback(
    (data: any, index: any) => ({
      length: ITEM_SIZE,
      offset: ITEM_SIZE * index,
      index,
    }),
    []
  );

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/2223/2223615.png",
              }}
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Likes</Text>
        </View>

        {loading && (
          <View style={styles.bottomTabBarPadding}>
            {dummyData.map((_, index) => (
              <PulseAnimationContainer key={index}>
                <View
                  style={[
                    styles.listItem,
                    {
                      borderColor: "LIGHT_GRAY",
                      borderWidth: 0.2,
                      elevation: 0,
                      paddingVertical: 4,
                      marginTop: 6,
                    },
                  ]}
                >
                  <View style={styles.userDetails}>
                    <View style={styles.container}>
                      <View style={styles.loadingAvatarContainer}></View>
                      <Image
                        source={{
                          uri: `https://randomuser.me/api/portraits/thumb/men/10.jpg`,
                        }}
                        style={styles.dummyImage}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                      />
                    </View>
                    <View style={styles.userInfo}>
                      <Text style={styles.dummyUserName}></Text>
                      <Text style={styles.dummyUserType}></Text>
                    </View>
                  </View>
                </View>
              </PulseAnimationContainer>
            ))}
          </View>
        )}

        <Animated.FlatList
          removeClippedSubviews={true}
          data={data}
          windowSize={21}
          keyExtractor={keyExtractor}
          onEndReached={handleOnEndReached}
          onEndReachedThreshold={0.5}
          maxToRenderPerBatch={20}
          initialNumToRender={20}
          ListFooterComponent={renderFooter}
          contentContainerStyle={{
            paddingHorizontal: 4,
            paddingTop: 8,
            paddingBottom: 76,
          }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          getItemLayout={getItemLayout}
          renderItem={renderItem}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.PRIMARY,
    padding: 8,
  },
  header: {
    padding: 12,
    paddingTop: 0,
    flexDirection: "row",
    alignItems: "center",
  },
  backIcon: {
    height: 25,
    width: 25,
  },
  headerTitle: {
    paddingLeft: 12,
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  listItem: {
    paddingHorizontal: 8,
    paddingVertical: 12,
    marginBottom: 12,
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255,0.98)",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 3,
    justifyContent: "space-between",
  },
  userDetails: {
    flexDirection: "row",
    paddingHorizontal: 2,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
  userInfo: {
    paddingLeft: 12,
    marginTop: -8,
  },
  userNameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  userName: {
    fontSize: 18,
    color: "#000",
    width: 155,
  },
  verifiedIcon: {
    width: 15,
    height: 15,
    marginLeft: 4,
  },
  userUserType: {
    fontSize: 16,
    color: "#000000ba",
  },
  followButton: {
    borderRadius: 8,
    width: 100,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 35,
    borderWidth: 1,
    borderColor: "#0000004b",
  },
  followButtonText: {
    color: "#000",
  },
  dummyUserName: {
    width: 140,
    backgroundColor: "#e0e0e0",
    marginTop: 10,
    borderRadius: 5,
    marginLeft: 30,
  },
  dummyUserType: {
    width: 80,
    backgroundColor: "#e0e0e0",
    marginTop: 10,
    borderRadius: 5,
    marginLeft: 30,
  },
  loadingAvatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
  },
  dummyImage: {
    borderRadius: 20,
    width: 1,
    height: 1,
    backgroundColor: colors.INACTIVE_CONTRAST,
  },
  bottomTabBarPadding: { paddingBottom: 76 },
});

export default PostLikes;
