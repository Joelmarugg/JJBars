import React from "react";
import PropTypes from "prop-types";
import { View, TouchableHighlight } from "react-native";
import color from "color";

import styles from "./styles";

const CountDownButton = props => {
  const { onPress, customIcon = null, disabled } = props;

  const underlayColor = color(styles.$buttonBackgroundColorBase).lighten(
    styles.$buttonBackgroundColorModifier
  );

  return (
    <View style={styles.CDcontainer}>
      <TouchableHighlight
        underlayColor={underlayColor}
        style={styles.CountDownButton}
        onPress={onPress}
        disabled={disabled}
      >
        {customIcon}
      </TouchableHighlight>
    </View>
  );
};

CountDownButton.propTypes = {
  onPress: PropTypes.func,
  customIcon: PropTypes.element
};

export default CountDownButton;
