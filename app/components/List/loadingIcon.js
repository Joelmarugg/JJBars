import React from "react";

import { View, Text } from "react-native";
import { SocialIcon } from "react-native-elements";

import styles from "./styles";

const loadingIcon = () => (
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <SocialIcon
      iconColor={styles.$iconColor}
      loading={true}
      raised={false}
      iconSize={20}
    />
    <Text style={styles.loadingIconText}>
      Loading Exercises..
    </Text>
  </View>
);

export default loadingIcon;
