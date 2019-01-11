import EStyleSheet from "react-native-extended-stylesheet";
import { Dimensions, StyleSheet } from "react-native";

const containerWidth = Dimensions.get("window").width / 2;

const BUTTON_HEIGHT = 48;
const BORDER_RADIUS = 4;

export default EStyleSheet.create({
  $buttonBackgroundColorBase: "$secondaryGreen",
  $buttonBackgroundColorModifier: 0.1,
  $cancelbuttonBackgroundColorBase: "$cancelRed",
  $cancelbuttonBackgroundColorModifier: 0.2,

  container: {
    backgroundColor: "$secondaryGreen",
    width: "90%",
    height: BUTTON_HEIGHT,
    borderRadius: BORDER_RADIUS,
    alignItems: "center",
    marginVertical: 11,
    borderColor: "$border",
    borderWidth: StyleSheet.hairlineWidth
  },
  CDcontainer: {
    backgroundColor: "$secondaryGreen",
    width: 35,
    height: 35,
    borderRadius: 20,
    alignItems: "center",
    marginRight: 0,
    borderColor: "$border",
    borderWidth: StyleSheet.hairlineWidth
  },

  button: {
    height: BUTTON_HEIGHT,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    borderRadius: BORDER_RADIUS
  },
  CountDownButton: {
    height: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    borderRadius: 20
  },

  buttonText: {
    fontFamily: "$primaryFont",
    fontWeight: "400",
    fontSize: 18,
    color: "$darkText"
  },

  RoundButtonContainer: {
    backgroundColor: "$lightGreen",
    height: 40,
    borderRadius: 25,
    alignItems: "center",
    marginHorizontal: 30,

    borderColor: "$border",
    borderWidth: StyleSheet.hairlineWidth
  },
  CancelRoundButtonContainer: {
    backgroundColor: "$cancelRed",
    height: 40,
    width: 42,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 30,

    borderColor: "$cancelRed",
    borderWidth: StyleSheet.hairlineWidth
  },
  RoundButton: {
    height: 40,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    borderRadius: 25,
    paddingHorizontal: 15
  },
  RoundButtonText: {
    fontFamily: "$primaryFont",
    fontWeight: "400",
    fontSize: 16,
    color: "$darkText"
  },
  CancelRoundButtonText: {
    fontWeight: "800",
    fontSize: 16,
    color: "$primaryWhite"
  },
  RepSecButtonContainer: {
    backgroundColor: "$lightGreen",
    height: 48,
    borderRadius: 5,
    marginLeft: 10,
    alignItems: "center",
    borderColor: "$border",
    borderWidth: StyleSheet.hairlineWidth
  },
  RepSecButton: {
    height: 40,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    borderRadius: 5,
    paddingHorizontal: 15
  },
  HomeHeader: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    height: 55,
    width: 55
  }
});
