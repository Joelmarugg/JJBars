import { StyleSheet, Dimensions } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";

const styles = EStyleSheet.create({
  modalView: {
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    backgroundColor: "rgba(52, 52, 52, 0.8)",
    alignItems: "center",
    justifyContent: "center"
  },
  modalText: {
    fontFamily: "$primaryFont",
    fontSize: 18,
    fontWeight: "300",
    color: "$primaryWhite"
  }
});

export default styles;
