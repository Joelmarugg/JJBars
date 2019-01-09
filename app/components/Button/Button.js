import React from "react";
import PropTypes from "prop-types";
import { View, Text, TouchableHighlight } from "react-native";
import color from "color";

import styles from "./styles";

const Button = props => {
  const { onPress, buttonText } = props;

  const underlayColor = color(styles.$buttonBackgroundColorBase).lighten(
    styles.$buttonBackgroundColorModifier
  );

  return (
    <View style={styles.container}>
      <TouchableHighlight
        underlayColor={underlayColor}
        style={styles.button}
        onPress={onPress}
      >
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableHighlight>
    </View>
  );
};

Button.propTypes = {
  onPress: PropTypes.func,
  buttonText: PropTypes.string
};

export default Button;
