import React from "react";

import { View, Text } from "react-native";
import { SocialIcon } from "react-native-elements";

import styles from "./styles";

const LoadingIcon = props => {
  const {
    loadingText = "Loading Exercises..",

    iconColor = styles.$iconColor
  } = props;

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <SocialIcon
        iconColor={iconColor}
        loading={true}
        raised={false}
        iconSize={20}
      />
      <Text style={styles.loadingText}>{loadingText}</Text>
    </View>
  );
};

export default LoadingIcon;
