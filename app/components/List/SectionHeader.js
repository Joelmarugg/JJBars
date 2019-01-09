import React from "react";
import PropTypes from "prop-types";
import { View, Text, TouchableHighlight } from "react-native";

import styles from "./styles";
import Reps from "./Reps";

const SectionHeader = ({
  text,
  onPress,
  onLongPress,
  delayLongPress,
  selected = false,
  number = 3,
  repText = "reps"
}) => (
  <TouchableHighlight
    onPress={onPress}
    onLongPress={onLongPress}
    delayLongPress={delayLongPress}
    style={{ borderRadius: 10 }}
  >
    <View style={styles.round}>
      <Text style={styles.roundText}>{text}</Text>

      {selected ? <Reps number={number} repText={repText} /> : null}
    </View>
  </TouchableHighlight>
);

SectionHeader.propTypes = {
  text: PropTypes.string,
  onPress: PropTypes.func,
  selected: PropTypes.bool,
  number: PropTypes.number
};

export default SectionHeader;
