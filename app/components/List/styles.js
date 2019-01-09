import { StyleSheet } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";

const styles = EStyleSheet.create({
  $iconColor: "$secondaryGreen",

  row: {
    paddingVertical: 15,
    paddingLeft: 20,
    paddingRight: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "$primaryWhite",
    borderRadius: 10,
    borderBottomColor: "$border",
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  textUnselected: {
    fontSize: 16,
    color: "$darkText"
  },
  textmusclegroup: {
    fontSize: 10,
    paddingTop: 10,
    color: "$primaryGreen"
  },
  text: {
    paddingVertical: 20,
    fontSize: 14,
    color: "$darkText",
    width: "60%"
  },
  separator: {
    marginLeft: 20,
    backgroundColor: "$border",
    flex: 1,
    height: StyleSheet.hairlineWidth
  },
  listEnd: {
    marginLeft: 0,
    backgroundColor: "$border",
    flex: 1,
    height: 2
  },
  numberStyle: {
    paddingVertical: 3,
    paddingHorizontal: 4,
    borderColor: "$border",
    backgroundColor: "$lightGreen",
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center"
  },

  placeHolderText: {
    marginTop: 11,
    margin: 7,
    padding: 5,
    borderRadius: 5,
    borderColor: "$border",
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: "$lightGreen",
    color: "$primaryBlack",
    fontSize: 14,
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "$primaryFont"
  },

  round: {
    paddingVertical: 10,
    paddingLeft: 20,
    paddingRight: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "$lightGreen",
    borderRadius: 10,
    borderBottomColor: "$border",
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  roundText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "$darkText"
  },
  loadingIconText: {
    fontSize: 12,
    fontFamily: "$primaryFont"
  }
});

export default styles;
