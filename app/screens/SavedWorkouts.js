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
import { DeleteModal, YesNoModal } from "../components/Modal";
import { HomeHeader, IosHomeHeader } from "../components/Button";
import { ListItem, Separator, placeHolder } from "../components/List";
import { connectAlert } from "../components/Alert";

//ask for platform prefix to have accurate signs
const ICON_PREFIX = Platform.OS === "ios" ? "ios" : "md";
const ICON_COLOR = "#868686";
const ICON_SIZE = 23;

const HEADER = Platform.OS === "ios" ? IosHomeHeader : HomeHeader;

var replacementText = "No Workouts Saved Yet!";

class SavedWorkouts extends Component {
  constructor(props) {
    super(props);
    this.itemsRef = firebase.database().ref("workouts");
    this.state = {
      workoutList: [],
      modalVisible: false,
      YesNoModalVisible: false,
      delete: false,
      workout: "",
      sections: [],
      key: null,
      onlineWorkouts: [],
      userName: null,
      currentDate: ""
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
    AsyncStorage.getItem("userName", (err, userName) => {
      this.setState({ userName: userName });
    });

    this.getAllWorkouts();
    this.getAllOnlineWorkouts(this.itemsRef);
  }

  //get the workout names from firebase
  getAllOnlineWorkouts(itemsRef) {
    itemsRef.on("value", snap => {
      var items = [];
      snap.forEach(child => {
        items.push(child);
      });
      this.setState({ onlineWorkouts: items });
    });
  }

  //get the workout names from async (keys)
  getAllWorkouts = () => {
    AsyncStorage.getAllKeys((err, workouts) => {
      for (let i = 0; i < workouts.length; i++) {
        if (workouts[i] === "userName") {
          workouts.splice(i, 1);
        }
      }
      this.setState({ workoutList: workouts }),
        console.log("stored workouts: " + this.state.workoutList);
    });
  };

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
  setYesNoModalVisible(visible) {
    this.setState({ YesNoModalVisible: visible });
  }

  //delete a workout
  deleteItem = () => {
    const workoutName = this.state.workout;
    AsyncStorage.removeItem(workoutName);
    this.getAllWorkouts();
    console.log("delete em" + workoutName);
  };

  editItem = woTitle => {
    this.props.navigation.navigate("CreateWorkouts", {
      title: woTitle
    });
  };

  checkFirebase = () => {
    let ups = false;
    for (i = 0; i < this.state.onlineWorkouts.length; i++) {
      console.log("online is: ", this.state.onlineWorkouts[i].val());
      if (
        this.state.onlineWorkouts[i].val().workoutname === this.state.workout
      ) {
        ups = true;
        this.setState({ key: this.state.onlineWorkouts[i].key });
      }
    }

    return ups;
  };

  uploadItem = async () => {
    if (this.checkFirebase()) {
      this.setYesNoModalVisible(true);
    } else {
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth() + 1; //January is 0!
      var yyyy = today.getFullYear();

      if (dd < 10) {
        dd = "0" + dd;
      }

      if (mm < 10) {
        mm = "0" + mm;
      }

      today = dd + "." + mm + "." + yyyy;

      await this.setState({
        currentDate: today
      });
      await AsyncStorage.getItem(this.state.workout, (err, section) => {
        this.setState({ sections: JSON.parse(section) });
      });

      await firebase
        .database()
        .ref("workouts")
        .push({
          date: this.state.currentDate,
          user: this.state.userName,
          workoutname: this.state.workout,
          sections: this.state.sections
        });

      this.props.alertWithType(
        "success",
        "Workout Uploaded",
        "You Uploaded: " + this.state.workout
      );
    }
  };

  overwriteWorkout = async () => {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
      dd = "0" + dd;
    }

    if (mm < 10) {
      mm = "0" + mm;
    }

    today = dd + "." + mm + "." + yyyy;

    await this.setState({
      currentDate: today
    });

    await AsyncStorage.getItem(this.state.workout, (err, section) => {
      this.setState({ sections: JSON.parse(section) });
    });

    firebase
      .database()
      .ref("workouts")
      .child(this.state.key)
      .update({
        date: this.state.currentDate,
        user: this.state.userName,
        workoutname: this.state.workout,
        sections: this.state.sections
      });

    this.props.alertWithType(
      "success",
      "Workout Updated",
      "You Updated: " + this.state.workout
    );
  };

  handleLongPress = () => {
    this.setModalVisible(true);
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="default" translucent={false} />
        <DeleteModal // pop up to ask for delete
          modalVisible={this.state.modalVisible}
          edit={true}
          isdelete={true}
          upload={true}
          onUploadPress={() => {
            console.log("you pressed upload!");
            this.setModalVisible(!this.state.modalVisible), this.uploadItem();
          }}
          onDeletePress={() => {
            console.log("you pressed yes!");
            this.setModalVisible(!this.state.modalVisible),
              this.setState({ delete: true }),
              this.deleteItem();
          }}
          onEditPress={() => {
            this.setModalVisible(!this.state.modalVisible),
              this.setState({ delete: false }),
              this.editItem(this.state.workout);
            console.log("you pressed Edit!");
          }}
          onCancelPress={() => {
            this.setModalVisible(!this.state.modalVisible),
              this.setState({ delete: false }),
              console.log("you pressed Cancel!");
          }}
        />
        <YesNoModal // ask for overwriting
          modalVisible={this.state.YesNoModalVisible}
          onYesPress={() => {
            this.setYesNoModalVisible(!this.state.YesNoModalVisible),
              this.overwriteWorkout();
          }}
          onNoPress={() => {
            this.setYesNoModalVisible(!this.state.YesNoModalVisible);
          }}
          onCancelPress={() => {
            this.setYesNoModalVisible(!this.state.YesNoModalVisible);
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

export default connectAlert(SavedWorkouts);
