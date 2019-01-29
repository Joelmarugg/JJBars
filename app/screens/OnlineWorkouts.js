import React, { Component } from "react";
import PropTypes from "prop-types";
import * as firebase from "firebase";

import {
  FlatList,
  View,
  StatusBar,
  Platform,
  AsyncStorage
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DeleteModal } from "../components/Modal";
import { HomeHeader, IosHomeHeader } from "../components/Button";
import { ListItem, Separator, placeHolder } from "../components/List";
import { connectAlert } from "../components/Alert";

//ask for platform prefix to have accurate signs
const ICON_PREFIX = Platform.OS === "ios" ? "ios" : "md";
const ICON_COLOR = "#868686";
const ICON_SIZE = 23;

const HEADER = Platform.OS === "ios" ? IosHomeHeader : HomeHeader;

var replacementText = "No Workouts Saved Yet!";

class OnlineWorkouts extends Component {
  constructor(props) {
    super(props);
    //realtime listener for firebase
    this.itemsRef = firebase.database().ref("workouts");
    this.state = {
      workoutList: [],
      modalVisible: false,
      downloaded: false,
      workout: "",
      sections: null,
      workoutTitleList: ""
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: "Create Shit",
      headerLeft: <HEADER onPress={() => navigation.navigate("Home")} />
    };
  };

  static propTypes = {
    navigation: PropTypes.object
  };

  componentDidMount() {
    this.getAllWorkouts(this.itemsRef);
  }

  //get the workout names from async (keys)
  getAllWorkouts(itemsRef) {
    itemsRef.on("value", snap => {
      var items = [];
      snap.forEach(child => {
        items.push(child.val().workoutname);
      });
      this.setState({ workoutList: items });
    });
  }

  // go to workout
  handlePress = woTitle => {
    this.props.navigation.navigate("Workouts", {
      title: woTitle
    });
  };

  //open Modal
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  //download the workout
  downloadItem = async () => {
    await AsyncStorage.getAllKeys((err, workouts) => {
      this.setState({ workoutTitleList: workouts });
    });

    let ups = false;
    for (let i = 0; i < this.state.workoutTitleList.length; i++) {
      if (this.state.workout === this.state.workoutTitleList[i]) {
        ups = true;
      }
    }
    if (ups) {
      this.props.alertWithType(
        "warn",
        "Download Workout Failed",
        this.state.workout + " Already Exists"
      );
    } else {
      firebase
        .database()
        .ref("workouts")
        .on("value", snap => {
          snap.forEach(child => {
            if (child.val().workoutname === this.state.workout) {
              this.setState({ sections: child.val().sections });
            }
          });
        });

      this.storeWorkout(this.state.workout);
      this.props.alertWithType(
        "success",
        "Workout Downloaded",
        "You Downloaded: " + this.state.workout
      );
    }
  };

  storeWorkout = async woTitle => {
    try {
      await AsyncStorage.setItem(
        woTitle,
        JSON.stringify(this.state.sections),
        console.log(this.state.sections)
      );
    } catch (error) {
      // Error saving data
    }
  };

  handleLongPress = () => {
    this.setModalVisible(true);
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="default" translucent={false} />
        <DeleteModal // pop up to ask for download
          modalVisible={this.state.modalVisible}
          download={true}
          onDownloadPress={() => {
            console.log("you pressed download!");
            this.setModalVisible(!this.state.modalVisible),
              this.setState({ downloaded: true }),
              this.downloadItem();
          }}
          onCancelPress={() => {
            this.setModalVisible(!this.state.modalVisible),
              console.log("you pressed Cancel!");
          }}
        />
        <FlatList
          data={this.state.workoutList}
          renderItem={({ item }) => (
            <ListItem
              bigText={true}
              text={item}
              selected={false}
              onPress={() => this.handlePress(item)}
              onLongPress={() => {
                this.handleLongPress(), this.setState({ workout: item });
              }}
              delayLongPress={500}
              customIcon={
                <Ionicons
                  name={`${ICON_PREFIX}-arrow-forward`}
                  color={ICON_COLOR}
                  size={ICON_SIZE}
                />
              }
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={Separator}
          ListEmptyComponent={placeHolder(replacementText)}
        />
      </View>
    );
  }
}

export default connectAlert(OnlineWorkouts);
