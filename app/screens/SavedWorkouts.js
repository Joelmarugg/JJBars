import React, { Component } from "react";
import PropTypes from "prop-types";

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

//ask for platform prefix to have accurate signs
const ICON_PREFIX = Platform.OS === "ios" ? "ios" : "md";
const ICON_COLOR = "#868686";
const ICON_SIZE = 23;

const HEADER = Platform.OS === "ios" ? IosHomeHeader : HomeHeader;

var replacementText = "No Workouts Saved Yet!";

class SavedWorkouts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      workoutList: [],
      modalVisible: false,
      delete: false,
      workout: "",
      sections: null
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
    this.getAllWorkouts();
  }
  //get the workout names from async (keys)
  getAllWorkouts = () => {
    AsyncStorage.getAllKeys((err, workouts) => {
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
        <FlatList
          data={this.state.workoutList}
          renderItem={({ item }) => (
            <ListItem
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

export default SavedWorkouts;
