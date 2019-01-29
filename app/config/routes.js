import { StatusBar } from "react-native";
import { createStackNavigator } from "react-navigation";

import Home from "../screens/Home";
import CreateWorkouts from "../screens/CreateWorkouts";
import SavedWorkouts from "../screens/SavedWorkouts";
import OnlineWorkouts from "../screens/OnlineWorkouts";
import Workouts from "../screens/Workouts";

export default createStackNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        header: () => null
      }
    },
    CreateWorkouts: {
      screen: CreateWorkouts,
      navigationOptions: ({ navigation }) => ({
        headerTitle: navigation.state.params.title
      })
    },
    SavedWorkouts: {
      screen: SavedWorkouts,
      navigationOptions: ({ navigation }) => ({
        headerTitle: navigation.state.params.title
      })
    },
    OnlineWorkouts: {
      screen: OnlineWorkouts,
      navigationOptions: ({ navigation }) => ({
        headerTitle: navigation.state.params.title
      })
    },
    Workouts: {
      screen: Workouts,
      navigationOptions: ({ navigation }) => ({
        headerTitle: navigation.state.params.title
      })
    }
  },
  {
    mode: "cart",
    cardStyle: { paddingTop: 0 },
    headerMode: "screen",
    headerLayoutPreset: "center"
  }
);
