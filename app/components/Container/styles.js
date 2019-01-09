import EStyleSheet from "react-native-extended-stylesheet";
import { Dimensions, StyleSheet } from "react-native";

const containerWidth = Dimensions.get("window").width;

export default EStyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "$primaryGreen"
  },
  CWcontainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "$primaryWhite"
  },
  Listcontainer: {
    flex: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "$border",
    paddingHorizontal: 3,
    paddingVertical: 3
  },
  Workoutcontainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "$primaryWhite"
  },
  Searchcontainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "$primaryWhite",
    width: containerWidth,
    alignItems: "center",
    borderColor: "$border",
    borderWidth: StyleSheet.hairlineWidth
  }
});
