import { Dimensions } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";

const imageWidth = Dimensions.get("window").width / 2;

export default EStyleSheet.create({
  container: {
    alignItems: "center"
  },
  containerImage: {
    alignItems: "center",
    justifyContent: "center",
    width: imageWidth,
    height: imageWidth + 12,
    marginBottom: 50
  },
  text: {
    fontWeight: "700",
    fontSize: 40,
    letterSpacing: -0.5,
    fontFamily: "$primaryFont",
    textDecorationLine: "underline",
    marginBottom: 12,
    marginTop: 40,
    color: "$primaryBlack"
  }
});
