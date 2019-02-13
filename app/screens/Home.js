import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Text,
  View,
  StatusBar,
  Platform,
  TouchableOpacity,
  AsyncStorage
} from "react-native";
import { Constants, FileSystem, Asset, SQLite } from "expo";
import * as firebase from "firebase";
import { InputWithButton } from "../components/TextInput";
import { Container } from "../components/Container";
import { Logo } from "../components/Logo";
import { Button } from "../components/Button";
import { connectAlert } from "../components/Alert";
import ApiKey from "../config/ApiKey";

const STATUSBAR_HEIGHT = Platform.OS === "ios" ? 20 : StatusBar.currentHeight;

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadingComplete: false, //not used!!
      userName: null,
      hasUserName: false
    };
    //Initialize firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(ApiKey.FirebaseConfig);
    }
  }

  componentDidMount() {
    this.getUserName();
  }

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
    this.props.navigation.navigate("OnlineWorkouts", {
      title: "Online Workouts"
    });
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

  storeUserName = async userName => {
    try {
      await AsyncStorage.setItem("userName", userName);
      this.setState({ hasUserName: true });
    } catch (error) {
      // Error saving data
    }
  };

  getUserName = async () => {
    try {
      await AsyncStorage.getItem("userName", (err, userName) => {
        this.setState({ userName: userName });
        console.warn("the user name: ", this.state.userName);
        if (userName !== null) {
          this.setState({ hasUserName: true });
        }
      });
    } catch (error) {
      console.warn("fuckit", error);
    }
  };
  handleTextChange = text => {
    this.setState({ userName: text });
  };
  removeUserName = () => {
    AsyncStorage.removeItem("userName");
    this.props.alertWithType(
      "warn",
      "Attention",
      "You deleted your Username!!"
    );
  };
  handleSaveButton = () => {
    this.storeUserName(this.state.userName);
  };

  render() {
    if (this.state.hasUserName) {
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

            <Text style={{ paddingTop: STATUSBAR_HEIGHT }}>
              Welcome Back {this.state.userName}!
            </Text>

            <Logo />

            <Button
              buttonText={"Create Workout"}
              onPress={this.handlePressCreateButton}
            />

            <Button
              buttonText={"Online Workouts"}
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
            onLongPress={this.removeUserName}
          >
            <Text>Download DB!</Text>
          </TouchableOpacity>
        </Container>
      );
    } else {
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
            <InputWithButton
              buttonText={"Save Name"}
              value={null}
              placeholder={"Enter Your Username.."}
              editable={true}
              onPress={this.handleSaveButton}
              onChangeText={text => this.handleTextChange(text)}
              clearTextOnFocus={true}
            />
            <Logo />
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
}

export default connectAlert(Home);
