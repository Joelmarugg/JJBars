import React, { Component } from "react";
import PropTypes from "prop-types";
import { Text, View, StatusBar, TouchableOpacity } from "react-native";
import { Constants, FileSystem, Asset, SQLite } from "expo";

import { Container } from "../components/Container";
import { Logo } from "../components/Logo";
import { Button } from "../components/Button";
import { connectAlert } from "../components/Alert";

class Home extends Component {
  static propTypes = {
    navigation: PropTypes.object,
    alertWithType: PropTypes.func
  };

  handlePressCreateButton = () => {
    this.props.navigation.navigate("CreateWorkouts", {
      title: "Create Workout"
    });
  };

  handlePressGenerateButton = () => {
    console.log("press generate button");
  };

  handlePressSavedButton = () => {
    this.props.navigation.navigate("SavedWorkouts", {
      title: "Saved Workouts"
    });
  };

  loadDB = async () => {
    const sqliteDirectory = `${FileSystem.documentDirectory}SQLite`;

    const { exists, isDirectory } = await FileSystem.getInfoAsync(
      sqliteDirectory
    );
    console.log("olee ", Expo.FileSystem.getInfoAsync(sqliteDirectory));
    if (!exists) {
      await FileSystem.makeDirectoryAsync(sqliteDirectory);
      console.log("Directory not existing!! ");
    } else if (!isDirectory) {
      throw new Error("SQLite dir is not a directory");
    }

    const pathToDownloadTo = `${sqliteDirectory}/jjbars.db`;
    const uriToDownload =
      "https://github.com/Joelmarugg/dbtest/raw/master/jjbars.db";

    console.log(`Will download ${uriToDownload} to ${pathToDownloadTo}`);

    await FileSystem.downloadAsync(uriToDownload, pathToDownloadTo)
      .then(({ status, uri }) => {
        if (status !== 200) {
          this.props.alertWithType(
            "error",
            "Network Error",
            "Something Went Wrong.."
          );
          console.log("Network failure ", status);
        }
        console.log("Finished downloading to ", uri, "Network Status", status);
      })
      .catch(error => {
        this.props.alertWithType(
          "error",
          "Network Error",
          "Please, check your internet connection."
        );
        Expo.FileSystem.deleteAsync(sqliteDirectory);
        console.log("huiii ", Expo.FileSystem.getInfoAsync(sqliteDirectory));
        console.log("Network failure ", error);
      });
    this.props.alertWithType(
      "success",
      "Database Updated",
      "Latest Version Downloaded!"
    );
    console.log("loading db");
  };

  render() {
    return (
      <Container>
        <View
          style={{
            flex: 1,
            width: "100%",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <StatusBar translucent={false} barStyle="light-content" />
          <Logo />
          <Button
            buttonText={"Create Workout"}
            onPress={this.handlePressCreateButton}
          />
          <Button
            buttonText={"Generate Workout"}
            onPress={this.handlePressGenerateButton}
          />
          <Button
            buttonText={"Saved Workouts"}
            onPress={this.handlePressSavedButton}
          />
        </View>

        <TouchableOpacity
          style={{
            padding: 10,
            alignItems: "center"
          }}
          onPress={this.loadDB}
        >
          <Text>Download DB!</Text>
        </TouchableOpacity>
      </Container>
    );
  }
}

export default connectAlert(Home);
