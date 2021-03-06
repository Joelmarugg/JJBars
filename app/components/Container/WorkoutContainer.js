import React from "react";
import PropTypes from "prop-types";
import { View } from "react-native";

import styles from "./styles";

const WorkoutContainer = ({ children }) => (
  <View style={styles.Workoutcontainer}>{children}</View>
);
WorkoutContainer.propTypes = {
  children: PropTypes.any
};

export default WorkoutContainer;
