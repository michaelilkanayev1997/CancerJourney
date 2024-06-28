import colors from "@utils/colors";
import { FC } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface PostProps {
  title: string;
  content: string;
  likes: number;
  onLike: () => void;
  onComment: () => void;
}

const Post: FC<PostProps> = ({ title, content, likes, onLike, onComment }) => {
  return (
    <View style={styles.postContainer}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.content}>{content}</Text>
      <View style={styles.footer}>
        <TouchableOpacity onPress={onLike} style={styles.button}>
          <MaterialCommunityIcons
            name="heart"
            size={20}
            color={colors.primary}
          />
          <Text style={styles.buttonText}> {likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onComment} style={styles.button}>
          <MaterialCommunityIcons
            name="comment"
            size={20}
            color={colors.primary}
          />
          <Text style={styles.buttonText}> Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <MaterialCommunityIcons
            name="share"
            size={20}
            color={colors.primary}
          />
          <Text style={styles.buttonText}> Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    backgroundColor: "white",
    padding: 16,
    margin: 8,
    borderRadius: 8,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    color: colors.placeholder,
    marginBottom: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    marginLeft: 4,
    color: colors.text,
    fontWeight: "bold",
  },
});

export default Post;
