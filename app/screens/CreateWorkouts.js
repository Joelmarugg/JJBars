import React, { Component } from "react";
import { Constants, FileSystem, Asset, SQLite } from "expo";
import PropTypes, { number } from "prop-types";
import {
  FlatList,
  Button,
  View,
  StatusBar,
  SectionList,
  AsyncStorage
} from "react-native";
import { SearchBar, List } from "react-native-elements";

import {
  ListItem,
  SectionHeader,
  Separator,
  placeHolder,
  LoadingIcon
} from "../components/List";
import { InputWithButton } from "../components/TextInput";
import { styles } from "../components/TextInput";
import { RoundButton } from "../components/Button";
import { PopUpModal, DeleteModal } from "../components/Modal";
//import exercises from "../data/exercises";
import {
  CWContainer,
  ListContainer,
  WorkoutContainer,
  SearchContainer
} from "../components/Container";
import { connectAlert } from "../components/Alert";

var replacementText = "Choose Your Exercises";
//const exdb = SQLite.openDatabase("exercises.db");

class CreateWorkouts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      exerciseList: [],
      exTitle: "",
      numberOfReps: 10,
      repText: "Reps",
      buttonText: "Reps",
      ownExerciseList: [],
      modalVisible: false,
      deleteModalVisible: false,
      itemTitle: "",
      id: 0,
      leftList: true,
      workoutTitle: "",
      workoutTitleList: [],
      numberOfRounds: 3,
      roundReps: false,
      edit: false,
      RoundEdit: false,
      editSection: null,
      draggable: false,
      isSection: false,
      sections: [
        {
          title: "Round 1",
          times: 3,
          data: []
        }
      ]
    };
  }

  static propTypes = {
    navigation: PropTypes.object,
    alertWithType: PropTypes.func
  };

  componentDidMount() {
    this.downloadDatabase();

    console.log(
      "hlgkidhfödjyahnsdöfd",
      this.props.navigation.getParam("title")
    );
    if (this.props.navigation.getParam("title") !== "Create Workout") {
      const woTitle = this.props.navigation.getParam("title");
      this.setState({
        edit: true,
        workoutTitle: this.props.navigation.getParam("title")
      });
      AsyncStorage.getItem(woTitle, (err, section) => {
        this.setState({ sections: JSON.parse(section) });
      });
      setTimeout(() => {
        let leng = this.state.sections.length - 1;
        this.setState({ ownExerciseList: this.state.sections[leng].data });
      }, 50);
    }

    /* // Create exercises table
    exdb.transaction(tx => {
      //tx.executeSql("drop table exercises;");
      tx.executeSql(
        "create table if not exists exercises (id integer primary key not null, title text);"
      );
    });

    // check if the exercises are already in the db, if no insert them from data
    exdb.transaction(tx => {
      tx.executeSql("select * from exercises;", [], (_, { rows }) => {
        console.log(rows.length);
        if (rows.length === 0) {
          let temp = "";
          console.log("there are " + exercises.length + " exercises");
          for (let i = 0; i < exercises.length; i++) {
            temp = exercises[i];
            this.saveItem(temp);
          }
          console.log("exercises will be added");
        } else {
          console.log("exercises already there");
        }
        this.updateList();
      });
    });*/

    AsyncStorage.getAllKeys((err, workouts) => {
      this.setState({ workoutTitleList: workouts });
    });
  }

  downloadDatabase = async () => {
    const sqliteDirectory = `${FileSystem.documentDirectory}SQLite`;

    // First, ensure that the SQLite directory is indeed a directory
    // For that we will first get information about the filesystem node
    // and handle non-existent scenario.
    const { exists, isDirectory } = await FileSystem.getInfoAsync(
      sqliteDirectory
    );
    console.log("olee ", Expo.FileSystem.getInfoAsync(sqliteDirectory));
    if (!exists) {
      await FileSystem.makeDirectoryAsync(sqliteDirectory);
      console.log("Directory not existing!! ");

      const pathToDownloadTo = `${sqliteDirectory}/jjbars.db`;
      const uriToDownload =
        "https://github.com/Joelmarugg/dbtest/raw/master/jjbars.db";

      console.log(`Will download ${uriToDownload} to ${pathToDownloadTo}`);

      // Let's download the file! We could have used something like
      // https://github.com/expo/native-component-list/blob/3f03acb7e11a1b0cc0c33036743465aaae5c2cf1/screens/FileSystemScreen.js#L27-L44
      // i. e. some progress indicator, but hey, that's just a demo!

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
          console.log(
            "Finished downloading to ",
            uri,
            "Network Status",
            status
          );
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
    } else if (!isDirectory) {
      throw new Error("SQLite dir is not a directory");
    }

    Expo.FileSystem.getInfoAsync(sqliteDirectory).then(({ exists }) => {
      console.log("ggggo ", Expo.FileSystem.getInfoAsync(sqliteDirectory));
      console.log(exists);
      if (exists) {
        this.db = SQLite.openDatabase("jjbars.db");
        // Once we've opened the database and saved the instance to `this`, we can enable the open button.
        this.setState({ downloaded: true });

        this.updateList();
      }
    });
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

  /* // insert the exercises in the db
  saveItem = temp => {
    exdb.transaction(
      tx => {
        tx.executeSql("insert into exercises (title) values  (?)", [temp]);
      },
      null,
      null
    );
  };*/

  // fill the left list with all exercises
  updateList = () => {
    this.db.transaction(tx => {
      tx.executeSql(
        "SELECT exercises.exercise_name, category.muscle_group, exercises.difficulty FROM exercises JOIN ex_cat ON exercises.exercise_name = ex_cat.exercise_name JOIN category ON category.muscle_group = ex_cat.muscle_group",
        [],
        (_, { rows }) => this.setState({ exerciseList: rows._array }),
        console.log("list updated")
      );
      tx.executeSql(
        "SELECT exercises.exercise_name, category.muscle_group, exercises.difficulty FROM exercises JOIN ex_cat ON exercises.exercise_name = ex_cat.exercise_name JOIN category ON category.muscle_group = ex_cat.muscle_group",
        [],
        (_, { rows }) => console.log("Show the LIST: " + JSON.stringify(rows))
      );
    });
  };

  // fill the left list with the requested exercises
  filterList = query => {
    console.log("lets filter for" + query);
    this.db.transaction(tx => {
      tx.executeSql(
        "SELECT exercises.exercise_name, category.muscle_group, exercises.difficulty FROM exercises JOIN ex_cat ON exercises.exercise_name = ex_cat.exercise_name JOIN category ON category.muscle_group = ex_cat.muscle_group WHERE exercises.exercise_name LIKE" +
          '"%' +
          query +
          '%"' +
          "OR difficulty LIKE" +
          '"%' +
          query +
          '%"' +
          "OR category.muscle_group LIKE" +
          '"%' +
          query +
          '%"' +
          " GROUP BY exercises.exercise_name;",

        [],
        (_, { rows }) => this.setState({ exerciseList: rows._array }),
        console.log("list filtered")
      );
      tx.executeSql(
        "SELECT exercises.exercise_name, category.muscle_group, exercises.difficulty FROM exercises JOIN ex_cat ON exercises.exercise_name = ex_cat.exercise_name JOIN category ON category.muscle_group = ex_cat.muscle_group WHERE exercises.exercise_name LIKE" +
          '"%' +
          query +
          '%"' +
          "OR difficulty LIKE" +
          '"%' +
          query +
          '%"' +
          "OR category.muscle_group LIKE" +
          '"%' +
          query +
          '%"' +
          " GROUP BY exercises.exercise_name;",
        [],
        (_, { rows }) => console.log("Show the LIST: " + JSON.stringify(rows))
      );
    });
  };

  // pop up the window to insert the reps number
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  setDeleteModalVisible(visible, section) {
    this.setState({ deleteModalVisible: visible });
    if (section === "section") {
      this.setState({ isSection: true });
    }
  }

  upDateReps = item => {
    if (this.state.roundReps) {
      item.times = this.state.numberOfRounds;
      this.setState({ roundReps: false });
    } else {
      console.log(
        "you pressed an item on the right list " + "reps= " + item.reps
      );
      item.reps = this.state.numberOfReps;
      item.repText = this.state.repText;
      console.log(
        "old amound: " +
          item.reps +
          " ////new amount of reps: " +
          this.state.numberOfReps
      );
    }
  };

  // update the numberOfReps
  onNumberChanged(text) {
    if (this.state.roundReps) {
      var num = parseInt(text);
      if (isNaN(num)) {
        this.setModalVisible(!this.state.modalVisible);
        this.props.alertWithType(
          "error",
          "Input Failed",
          "Input not a number!"
        );
      } else {
        this.setState({ numberOfRounds: num });
      }
    } else {
      var num = parseInt(text);
      if (isNaN(num)) {
        this.setModalVisible(!this.state.modalVisible);
        this.props.alertWithType(
          "error",
          "Input Failed",
          "Input not a number!"
        );
      } else {
        this.setState({ numberOfReps: num });
      }
    }
  }

  deleteItem = item => {
    if (this.state.isSection) {
      if (this.state.RoundEdit) {
        this.setState({ RoundEdit: false });
      }
      if (this.state.sections.length === 1) {
        var lastarray = this.state.sections.slice(); // make a separate copy of the array
        lastarray[0].data = [];
        this.setState({ sections: lastarray, ownExerciseList: [] });
      } else {
        var sectionarray = this.state.sections.slice(); // make a separate copy of the array
        var sectionindex = sectionarray.indexOf(item);

        sectionarray.splice(sectionindex, 1);
        this.setState({ sections: sectionarray });

        if (sectionindex === this.state.sections.length - 1) {
          console.log(
            "sectionindex: ",
            this.state.sections[sectionindex - 1].data
          );
          this.setState({
            ownExerciseList: this.state.sections[sectionindex - 1].data
          });
        }

        for (let i = sectionindex; i < sectionarray.length; i++) {
          console.log("title: ", sectionarray[i].title);
          console.log("i: ", i);
          console.log("array: ", sectionarray);
          sectionarray[i].title = "Round " + (i + 1);
        }

        this.setState({ sections: sectionarray });
      }
    } else {
      for (let i = 0; i < this.state.sections.length; i++) {
        for (let y = 0; y < this.state.sections[i].data.length; y++) {
          if (item === this.state.sections[i].data[y]) {
            console.log(item);
            console.log("id= ", this.state.sections[i].data[y].id);
            var array = this.state.sections.slice(); // make a separate copy of the array
            var innerArray = array[i].data.slice();
            var index = innerArray.indexOf(item);
            innerArray.splice(index, 1);

            array[i].data = innerArray;

            this.setState({ sections: array });
            console.log("i= ", i);
            console.log("lngth= ", this.state.sections.length);
            if (i === this.state.sections.length - 1) {
              var ownarray = this.state.ownExerciseList.slice(); // make a separate copy of the array

              var index = ownarray.indexOf(item);
              ownarray.splice(index, 1);
              console.log(ownarray);
              console.log(this.state.ownExerciseList);

              this.setState({ ownExerciseList: ownarray });
            }
          }
        }
      }
    }
  };

  // add the chosen exercise and numberOfReps to the right section of the list
  addExerciseToList = item => {
    if (this.state.leftList) {
      this.setState({ id: this.state.id + 1 });

      this.setState({
        ownExerciseList: [
          ...this.state.ownExerciseList,
          {
            id: this.state.id,
            title: item.exercise_name,
            reps: this.state.numberOfReps,
            repText: this.state.repText
          }
        ]
      });
      setTimeout(() => {
        this.inList();
      }, 10);
    } else {
      this.upDateReps(item);
    }
  };

  setRoundEditable = section => {
    if (this.state.isSection) {
      //console.warn(section);
      if (this.state.RoundEdit) {
        console.log("editSection ", this.state.editSection);
        var newSect = this.state.editSection;
        newSect.edit = false;
      }

      section.edit = true;

      this.setState({
        RoundEdit: true,
        editSection: section,
        ownExerciseList: section.data
      });
    }
  };

  setItemsEditable = () => {
    if (!this.state.isSection && !this.state.draggable) {
      this.setState({ draggable: true });
    } else if (!this.state.isSection && this.state.draggable) {
      this.setState({ draggable: false });
    }
  };

  //update the section
  inList() {
    if (this.state.RoundEdit) {
      var name = this.state.editSection.title;
      var array = name.match(/\d+/g).map(Number);
      var number = parseInt(array);

      const newSect = this.state.sections.slice();
      newSect[number - 1].data = this.state.ownExerciseList;
      this.setState({ section: newSect });
      this.scrollToEnd(true, number);
    } else {
      let leng = this.state.sections.length - 1;
      const newSect = this.state.sections.slice();
      newSect[leng].data = this.state.ownExerciseList;
      this.setState({ section: newSect });

      this.scrollToEnd(true);
      console.log("scroll ex");
    }
  }

  scrollToEnd(animated, sectIndex) {
    var len = this.state.sections.length;
    if (sectIndex !== undefined) {
      len = sectIndex;
    }
    setTimeout(() => {
      this.refs.sectionList.scrollToLocation({
        animated: animated,
        sectionIndex: len - 1,
        itemIndex: this.state.sections[len - 1].data.length - 1,
        viewPosition: 1
      });
    }, 400);
  }

  //save the workout, add workoutTitle, go to savedWorkouts screen
  handlePressSaveButton = () => {
    let ups = false;
    for (let i = 0; i < this.state.workoutTitleList.length; i++) {
      if (
        this.state.workoutTitle === this.state.workoutTitleList[i] &&
        !this.state.edit
      ) {
        ups = true;
      }
    }
    this.setState({ edit: false });

    if (this.state.workoutTitle === "") {
      this.props.alertWithType("error", "Save Workout Failed", "No Title");
    } else if (ups) {
      this.props.alertWithType(
        "warn",
        "Save Workout Failed",
        this.state.workoutTitle + " Already Exists"
      );
    } else {
      var newSect = this.state.editSection;
      if (newSect !== null) {
        newSect.edit = false;
      }

      this.storeWorkout(this.state.workoutTitle);
      console.log("saved this workout: " + this.state.workoutTitle);
      this.props.navigation.popToTop();
    }
  };

  // set workoutTitle
  handleTextChange = text => {
    this.setState({ workoutTitle: text });
  };

  changeRepSecs = () => {
    if (this.state.repText !== "Times") {
      const reSe = this.state.repText === "Reps" ? "Secs" : "Reps";
      this.setState({ repText: reSe });
    }
  };

  // add rounds to the workout
  handlePressAddButton = () => {
    if (this.state.RoundEdit) {
      var newSect = this.state.editSection;
      newSect.edit = false;
    }
    this.setState({ count: this.state.sections.length + 1, RoundEdit: false });
    console.log(this.state.count);

    setTimeout(() => {
      this.setState({
        ownExerciseList: []
      });
      this.setState({
        sections: [
          ...this.state.sections,
          {
            title: "Round " + this.state.count,
            times: this.state.numberOfRounds,
            data: [],
            edit: false
          }
        ]
      });

      this.scrollToEnd(true);
      console.log("scroll round");
    }, 5);
  };

  //////ANIMATION//////////////////////////////////////////////////////////////////////////////////////////
  goDown = item => {
    for (let i = 0; i < this.state.sections.length; i++) {
      for (let y = 0; y < this.state.sections[i].data.length; y++) {
        if (item === this.state.sections[i].data[y]) {
          var array = this.state.sections.slice(); // make a separate copy of the array
          var innerArray = array[i].data.slice();
          var index = innerArray.indexOf(item);

          if (index + 1 >= this.state.sections[i].data.length) {
            console.warn("not going there!");
          } else {
            innerArray.splice(index, 1);
            innerArray.splice(index + 1, 0, item);

            array[i].data = innerArray;

            this.setState({ sections: array, ownExerciseList: innerArray });
          }
          break;
        }
      }
    }
  };

  goUp = item => {
    for (let i = 0; i < this.state.sections.length; i++) {
      for (let y = 0; y < this.state.sections[i].data.length; y++) {
        if (item === this.state.sections[i].data[y]) {
          var array = this.state.sections.slice(); // make a separate copy of the array
          var innerArray = array[i].data.slice();
          var index = innerArray.indexOf(item);

          if (index - 1 < 0) {
            console.warn("not going there!");
          } else {
            innerArray.splice(index, 1);
            innerArray.splice(index - 1, 0, item);

            array[i].data = innerArray;

            this.setState({ sections: array, ownExerciseList: innerArray });
          }
          break;
        }
      }
    }
  };

  goUpHeader = section => {
    for (let i = 0; i < this.state.sections.length; i++) {
      if (section === this.state.sections[i]) {
        var array = this.state.sections.slice(); // make a separate copy of the array
        var index = array.indexOf(section);
        if (index - 1 < 0) {
          console.warn("not going there!");
        } else {
          array[index].title = "Round " + index;
          array[index - 1].title = "Round " + (index + 1);
          array.splice(index, 1);
          array.splice(index - 1, 0, section);

          this.setState({ sections: array });
        }
        break;
      }
    }
  };
  goDownHeader = section => {
    for (let i = 0; i < this.state.sections.length; i++) {
      if (section === this.state.sections[i]) {
        var array = this.state.sections.slice(); // make a separate copy of the array
        var index = array.indexOf(section);
        if (index + 1 >= this.state.sections.length) {
        } else {
          array[index].title = "Round " + (index + 2);
          array[index + 1].title = "Round " + (index + 1);
          array.splice(index, 1);
          array.splice(index + 1, 0, section);

          this.setState({ sections: array });
        }
        break;
      }
    }
  };

  render() {
    return (
      <CWContainer>
        <StatusBar barStyle="default" translucent={false} />
        <WorkoutContainer>
          <InputWithButton
            buttonText={"Save Workout"}
            value={this.state.edit ? this.state.workoutTitle : null}
            editable={this.state.edit ? false : true}
            placeholder={"Workout Name"}
            onPress={this.handlePressSaveButton}
            onChangeText={text => this.handleTextChange(text)}
            clearTextOnFocus={true}
          />
        </WorkoutContainer>
        <SearchContainer>
          <SearchBar
            lightTheme
            round
            inputContainerStyle={styles.inputBarContainer}
            containerStyle={styles.inputBarContainer}
            inputStyle={styles.inputBar}
            underlineColorAndroid="transparent"
            cancelIcon={{ type: "font-awesome", name: "chevron-left" }}
            searchIcon={{ size: 24 }}
            placeholder="Search"
            onChangeText={text => this.filterList(text)}
          />
          <RoundButton
            buttonText={"Add Round"}
            onPress={this.handlePressAddButton}
          />
        </SearchContainer>
        <ListContainer>
          <View style={{ flex: 1, backgroundColor: "white", borderRadius: 10 }}>
            <FlatList // left list
              data={this.state.exerciseList}
              renderItem={({ item }) => (
                <ListItem
                  text={item.exercise_name}
                  musclegroup={item.muscle_group + " / " + item.difficulty}
                  selected={false}
                  onPress={() => {
                    this.setState({ leftList: true }),
                      this.setState({ repText: "Reps" });
                    this.setModalVisible(true),
                      this.setState({ itemTitle: item });
                  }}
                />
              )}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={Separator}
              ListEmptyComponent={LoadingIcon}
            />
          </View>
          <View style={{ width: 3 }} />
          <View style={{ flex: 1, backgroundColor: "white", borderRadius: 10 }}>
            <PopUpModal // pop up to set numberOfReps
              onChangeText={text => this.onNumberChanged(text)}
              modalVisible={this.state.modalVisible}
              onPress={() => {
                this.setModalVisible(!this.state.modalVisible),
                  this.addExerciseToList(this.state.itemTitle);
              }}
              onPress2={() => this.changeRepSecs()}
              onCancelPress={() => {
                this.setModalVisible(!this.state.modalVisible),
                  console.log("You pressed cancel!");
              }}
              buttonText={this.state.repText}
            />
            <DeleteModal // pop up to ask for delete
              modalVisible={this.state.deleteModalVisible}
              edit={true} //this.state.isSection
              isdelete={true}
              onEditPress={() => {
                this.setDeleteModalVisible(!this.state.deleteModalVisible),
                  this.setRoundEditable(this.state.itemTitle);
                this.setItemsEditable();
              }}
              onDeletePress={() => {
                console.log("you pressed delete!");
                this.setDeleteModalVisible(!this.state.deleteModalVisible),
                  this.deleteItem(this.state.itemTitle);
              }}
              onCancelPress={() => {
                this.setDeleteModalVisible(!this.state.deleteModalVisible),
                  console.log("you pressed Cancel!");
              }}
            />
            <SectionList // right list
              sections={this.state.sections}
              //data={this.state.ownExerciseList}
              renderItem={({ item }) => (
                <ListItem
                  text={item.title}
                  selected={true}
                  draggable={this.state.draggable}
                  onDown={() => {
                    this.goDown(item);
                  }}
                  onUp={() => {
                    this.goUp(item);
                  }}
                  onPress={() => {
                    this.setState({ leftList: false });
                    this.setState({ repText: "Reps" });
                    this.setModalVisible(true);
                    this.setState({ itemTitle: item });
                  }}
                  onLongPress={() => {
                    this.setState({ itemTitle: item });
                    this.setState({ isSection: false });
                    this.setDeleteModalVisible(true);
                  }}
                  number={item.reps}
                  repText={item.repText}
                />
              )}
              renderSectionHeader={({ section }) => (
                <SectionHeader
                  text={section.title}
                  selected={true}
                  editing={section.edit}
                  number={section.times}
                  repText={"Times"}
                  draggable={this.state.draggable}
                  onDown={() => {
                    this.goDownHeader(section);
                  }}
                  onUp={() => {
                    this.goUpHeader(section);
                  }}
                  onPress={() => {
                    this.setState({ leftList: false });
                    this.setState({ repText: "Times" });
                    this.setState({ roundReps: true });
                    this.setModalVisible(true);
                    this.setState({ itemTitle: section });
                  }}
                  onLongPress={() => {
                    console.log("whats in there? ", section);
                    this.setState({ isSection: true });
                    this.setState({ itemTitle: section });
                    this.setDeleteModalVisible(true);
                  }}
                />
              )}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={Separator}
              ref="sectionList"
              getItemLayout={this.getItemLayout}
              showsVerticalScrollIndicator={false}
              stickySectionHeadersEnabled={true}
              ListEmptyComponent={placeHolder(replacementText)}
            />
          </View>
        </ListContainer>
      </CWContainer>
    );
  }
}

export default connectAlert(CreateWorkouts);
