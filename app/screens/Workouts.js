import React, { Component } from "react";
import { View, SectionList, StatusBar, AsyncStorage } from "react-native";
import * as firebase from "firebase";

import {
  ListItem,
  Separator,
  placeHolder,
  SectionHeader
} from "../components/List";

class Workouts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sections: []
    };
  }

  componentWillMount() {
    this.updateList();
  }

  //insert the exercises of the workout
  //gets the workouts only from firebase when not existing on phone.
  async updateList() {
    try {
      const workoutName = this.props.navigation.getParam("title");
      await AsyncStorage.getItem(workoutName, (err, section) => {
        if (section !== null) {
          this.setState({ sections: JSON.parse(section) });
        } else {
          firebase
            .database()
            .ref("workouts")
            .on("value", snap => {
              snap.forEach(child => {
                if (child.val().workoutname === workoutName) {
                  this.setState({ sections: child.val().sections });
                }
              });
            });
        }
      });
    } catch (err) {
      console.warn("uuups ", err);
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="default" translucent={false} />
        <SectionList // right list
          sections={this.state.sections}
          //data={this.state.ownExerciseList}
          renderItem={({ item }) => (
            <ListItem
              text={item.title}
              selected={true}
              bigText={true}
              number={item.reps}
              repText={item.repText}
              countDown={item.repText === "Secs" ? true : false}
            />
          )}
          renderSectionHeader={({ section }) => (
            <SectionHeader
              text={section.title}
              selected={true}
              number={section.times}
              repText={"Times"}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={Separator}
          ref="sectionList"
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={true}
          ListEmptyComponent={placeHolder("This workout has no exercises!")}
        />
      </View>
    );
  }
}

export default Workouts;
