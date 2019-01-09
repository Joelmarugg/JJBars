import React from "react";
import PropTypes from "prop-types";
import { View, Text, TouchableHighlight } from "react-native";

import styles from "./styles";
import Reps from "./Reps";
import CountDown from "../Timer/CountDown";

const ListItem = ({
  text,
  musclegroup,
  onPress,
  onLongPress,
  delayLongPress,
  selected = false,
  countDown = false,
  number,
  repText,
  customIcon = null
}) => (
  <TouchableHighlight
    onPress={onPress}
    onLongPress={onLongPress}
    delayLongPress={delayLongPress}
    style={{ borderRadius: 10 }}
  >
    <View style={styles.row}>
      {selected ? (
        <Text style={styles.text}>{text}</Text>
      ) : (
        <View style={{ flexDirection: "column", paddingVertical: 15 }}>
          <Text style={styles.textUnselected}>{text}</Text>
          {musclegroup == null ? null : (
            <Text style={styles.textmusclegroup}>{musclegroup}</Text>
          )}
        </View>
      )}

      {countDown ? <CountDown timer={number} /> : null}
      {selected && !countDown ? (
        <Reps number={number} repText={repText} />
      ) : null}
      {customIcon}
    </View>
  </TouchableHighlight>
);

ListItem.propTypes = {
  text: PropTypes.string,
  onPress: PropTypes.func,
  selected: PropTypes.bool,
  number: PropTypes.number,
  customIcon: PropTypes.element
};

export default ListItem;
