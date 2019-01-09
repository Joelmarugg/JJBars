import React, { Component } from "react";
import { View, SectionList, StatusBar, AsyncStorage } from "react-native";

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
  updateList = () => {
    const workoutName = this.props.navigation.getParam("title");
    AsyncStorage.getItem(workoutName, (err, section) => {
      this.setState({ sections: JSON.parse(section) });
    });
  };

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
