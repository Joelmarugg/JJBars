import React from "react";
import EStyleSheet from "react-native-extended-stylesheet";
import { Platform } from "react-native";

import Navigator from "./config/routes";
import { AlertProvider } from "./components/Alert";

const font = Platform.OS === "ios" ? "Hoefler Text" : "serif"; //Palatino or Hoefler Text or Baskerville-SemiBold

EStyleSheet.build({
  $primaryGreen: "#a7bba7",
  $secondaryGreen: "#b5c6b5",
  $lightGreen: "#f4f7f4",
  $primaryWhite: "#ffffff",
  $primaryBlack: "#000100",
  $border: "#dee6de",
  $darkText: "#2b382b",
  $inputText: "#7b997b",
  $primaryFont: font
});

export default () => (
  <AlertProvider>
    <Navigator />
  </AlertProvider>
);
