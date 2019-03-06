import React, { Component } from "react";

import { Text, View, Platform, Vibration } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";
import { Audio } from "expo";

import Reps from "../List/Reps";
import CountDownButton from "../Button/CounDownButton";

const ICON_PREFIX = Platform.OS === "ios" ? "ios" : "md";
const ICON_COLOR = "#868686";
const ICON_SIZE = 20;

class CountDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: props.timer,
      icon: "-play",
      preTimer: false,
      preTime: 3
    };
  }

  componentDidMount() {
    Expo.Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
      playsInSilentModeIOS: false,
      shouldDuckAndroid: false,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
      playThroughEarpieceAndroid: false
    });
  }

  startTimer = () => {
    if (this.state.icon === "-refresh") {
      this.setState({ timer: this.props.timer });
      this.setState({ preTime: 3 });
      this.setState({ icon: "-play" });
    } else if (this.state.icon === "-play") {
      this.setState({ icon: "-pause" });
      this.setState({ preTimer: true });
      this.timeout1 = setTimeout(() => {
        this.setState({ preTimer: false });
        this.clockCall = setInterval(() => {
          this.decrementClock();
        }, 1000);
      }, 3000);
      this.clockCall2 = setInterval(() => {
        this.setState(prevstate => ({ preTime: prevstate.preTime - 1 }));
        if (this.state.preTime === 0) {
          clearInterval(this.clockCall2);
          this.makeSound("start");
        }
      }, 1000);
    } else {
      this.setState({ preTime: 3 });
      clearInterval(this.clockCall);
      this.setState(prevstate => ({ timer: prevstate.timer }));
      this.setState({ icon: "-play" });
    }
  };

  decrementClock = async () => {
    if (this.state.timer === 0) {
      clearInterval(this.clockCall);
      this.setState({ icon: "-refresh" });

      await setTimeout(() => {
        this.makeSound("finish");
        Vibration.vibrate(250);
      }, 500);
      await this.makeSound("finish");
      Vibration.vibrate(250);
    } else {
      this.setState(prevstate => ({ timer: prevstate.timer - 1 }));
    }
  };

  makeSound = async sound => {
    try {
      if (sound === "start") {
        const soundObject = new Expo.Audio.Sound();
        await soundObject.loadAsync(require("../../../assets/sounds/Beep.mp3"));
        await soundObject.playAsync();

        await setTimeout(() => {
          soundObject.stopAsync();
        }, 1000);
      } else if (sound === "finish") {
        const soundObject = new Expo.Audio.Sound();

        await soundObject.loadAsync(require("../../../assets/sounds/Beep.mp3"));

        await soundObject.playAsync();

        await setTimeout(() => {
          soundObject.stopAsync();
        }, 1000);
      }

      // Your sound is playing!
    } catch (error) {
      console.warn(error);
    }
  };

  _onPlaybackStatusUpdate = playbackStatus => {
    if (playbackStatus.didJustFinish) {
      console.warn("sound off");
    }
  };

  componentWillUnmount() {
    clearInterval(this.clockCall);
    clearInterval(this.clockCall2);
    clearTimeout(this.timeout1);
  }

  render() {
    let ele;

    if (this.state.timer === 0) {
      ele = <Reps repText={"Time's Up!"} />;
    } else {
      ele = <Reps number={this.state.timer} repText={"Secs"} />;
    }

    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "30%"
        }}
      >
        <CountDownButton
          onPress={this.startTimer}
          disabled={this.state.preTimer}
          customIcon={
            <Ionicons
              name={`${ICON_PREFIX}${this.state.icon}`}
              color={ICON_COLOR}
              size={ICON_SIZE}
            />
          }
        />

        {this.state.preTimer ? (
          <Text style={styles.pretext}>{"Gooo in " + this.state.preTime}</Text>
        ) : (
          ele
        )}
      </View>
    );
  }
}

export default CountDown;
