import {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from "react-native-reanimated";

// Custom hook for FadeInDown animated entry
export const useFadeInDown = (delay: number) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(25);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  // Function to start animation
  const startAnimation = () => {
    opacity.value = 0;
    translateY.value = 25;

    opacity.value = withDelay(delay, withSpring(1));
    translateY.value = withDelay(
      delay,
      withSpring(0, {
        damping: 7,
        stiffness: 50,
        mass: 1,
      })
    );
  };
  return { animatedStyle, startAnimation };
};

// Custom hook for FadeInLeft animated entry
export const useFadeInLeft = (delay: number) => {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(-25);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateX: translateX.value }],
    };
  });

  // Function to start animation
  const startAnimation = () => {
    opacity.value = 0;
    translateX.value = -25;

    opacity.value = withDelay(delay, withSpring(1));
    translateX.value = withDelay(
      delay,
      withSpring(0, {
        damping: 7,
        stiffness: 50,
        mass: 1,
      })
    );
  };
  return { animatedStyle, startAnimation };
};

// Custom hook for FadeInRight animated entry
export const useFadeInRight = (delay: number) => {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(40);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateX: translateX.value }],
    };
  });

  // Function to start animation
  const startAnimation = () => {
    opacity.value = 0;
    translateX.value = 40;

    opacity.value = withDelay(delay, withSpring(1));
    translateX.value = withDelay(
      delay,
      withSpring(0, {
        damping: 7,
        stiffness: 30,
        mass: 1,
      })
    );
  };
  return { animatedStyle, startAnimation };
};

// Custom hook for FadeInUp animated entry
export const useFadeInUp = (delay: number, damping: number) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-25);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  // Function to start animation
  const startAnimation = () => {
    opacity.value = 0;
    translateY.value = -25;

    opacity.value = withDelay(delay, withSpring(1));
    translateY.value = withDelay(
      delay,
      withSpring(0, {
        damping,
        stiffness: 58,
        mass: 1,
      })
    );
  };
  return { animatedStyle, startAnimation };
};
