import React from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  TouchableNativeFeedback,
  Animated,
  PanResponder,
  Platform
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";
import Reps from "./Reps";
import CountDown from "../Timer/CountDown";

const ICON_PREFIX = Platform.OS === "ios" ? "ios" : "md";
const ICON_COLOR = "#868686";
const ICON_SIZE = 23;

export default class ListItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pan: new Animated.ValueXY(),
      scale: new Animated.Value(1)
    };
  }

  componentWillMount() {
    // Add a listener for the delta value change
    this._val = { x: 0, y: 0 };
    this.state.pan.addListener(value => (this._val = value));

    // Initialize PanResponder with move handling
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gesture) => true,

      onPanResponderMove: Animated.event([null, { dy: this.state.pan.y }]),

      onPanResponderGrant: (e, gesture) => {
        Animated.spring(this.state.scale, {
          toValue: 1.1,
          friction: 6
        }).start();
      },

      onPanResponderRelease: (e, gesture) => {
        Animated.spring(this.state.scale, { toValue: 1, friction: 6 }).start();
        if (this.isDropArea() === "smaller") {
          Animated.spring(this.state.pan, {
            toValue: { x: 0, y: +50 }
          }).start(this.props.onDown);

          setTimeout(() => {
            Animated.spring(this.state.pan, {
              toValue: { x: 0, y: 0 },
              friction: 8,
              tension: 2
            }).start();
          }, 300);
        } else if (this.isDropArea() === "bigger") {
          Animated.spring(this.state.pan, {
            toValue: { x: 0, y: -50 }
          }).start(this.props.onUp);

          setTimeout(() => {
            Animated.spring(this.state.pan, {
              toValue: { x: 0, y: 0 },
              friction: 8,
              tension: 2
            }).start();
          }, 300);
        } else {
          Animated.spring(this.state.pan, {
            toValue: { x: 0, y: 0 },
            tension: 80
          }).start();
        }
      }
    });
  }

  isDropArea() {
    if (this._val.y > 50) {
      return "smaller";
    } else if (this._val.y < -50) {
      return "bigger";
    }
  }

  render() {
    if (this.props.draggable) {
      let { pan } = this.state;

      // Calculate the x and y transform from the pan value
      let [translateX, translateY] = [pan.x, pan.y];
      let scale = this.state.scale;

      let rotate = "0deg";

      let imageStyle = {
        transform: [{ translateX }, { translateY }, { rotate }, { scale }]
      };

      const panStyle = {
        transform: this.state.pan.getTranslateTransform()
      };

      return (
        <Animated.View
          {...this.panResponder.panHandlers}
          style={[imageStyle, styles.animView]}
        >
          <TouchableNativeFeedback
            onPress={this.props.onPress}
            onLongPress={this.props.onLongPress}
            delayLongPress={this.props.delayLongPress}
            useForeground={true}
          >
            <View style={{ borderRadius: 10, width: "80%" }}>
              <View style={styles.row}>
                {this.props.bigText ? (
                  <Text style={styles.bigtext}>{this.props.text}</Text>
                ) : this.props.selected ? (
                  <Text style={styles.text}>{this.props.text}</Text>
                ) : (
                  <View
                    style={{ flexDirection: "column", paddingVertical: 15 }}
                  >
                    <Text style={styles.textUnselected}>{text}</Text>
                    {this.props.musclegroup == null ? null : (
                      <Text style={styles.textmusclegroup}>
                        {this.props.musclegroup}
                      </Text>
                    )}
                  </View>
                )}

                {this.props.countDown ? <CountDown timer={number} /> : null}
                {this.props.selected && !this.props.countDown ? (
                  <Reps
                    number={this.props.number}
                    repText={this.props.repText}
                  />
                ) : null}
                {this.props.customIcon}
              </View>
            </View>
          </TouchableNativeFeedback>
          <View style={{ paddingLeft: 10, flexDirection: "column" }}>
            <Ionicons
              name={`${ICON_PREFIX}-arrow-dropup`}
              color={ICON_COLOR}
              size={ICON_SIZE}
            />
            <Ionicons
              name={`${ICON_PREFIX}-arrow-dropdown`}
              color={ICON_COLOR}
              size={ICON_SIZE}
            />
          </View>
        </Animated.View>
      );
    } else {
      return (
        <TouchableNativeFeedback
          onPress={this.props.onPress}
          onLongPress={this.props.onLongPress}
          delayLongPress={this.props.delayLongPress}
          style={{ borderRadius: 10 }}
        >
          <View style={styles.row}>
            {this.props.bigText ? (
              <View>
                {this.props.online ? (
                  <View style={{ flexDirection: "column" }}>
                    <Text style={styles.bigtextWithInfo}>
                      {this.props.text}
                    </Text>
                    <Text style={styles.info}>
                      Uploaded by: {this.props.userName} on {this.props.date}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.bigtext}>{this.props.text}</Text>
                )}
              </View>
            ) : this.props.selected ? (
              <Text style={styles.text}>{this.props.text}</Text>
            ) : (
              <View style={{ flexDirection: "column", paddingVertical: 15 }}>
                <Text style={styles.textUnselected}>{this.props.text}</Text>
                {this.props.musclegroup == null ? null : (
                  <Text style={styles.textmusclegroup}>
                    {this.props.musclegroup}
                  </Text>
                )}
              </View>
            )}

            {this.props.countDown ? (
              <CountDown timer={this.props.number} />
            ) : null}
            {this.props.selected && !this.props.countDown ? (
              <Reps number={this.props.number} repText={this.props.repText} />
            ) : null}
            {this.props.customIcon}
          </View>
        </TouchableNativeFeedback>
      );
    }
  }
}

ListItem.propTypes = {
  text: PropTypes.string,
  onPress: PropTypes.func,
  selected: PropTypes.bool,
  number: PropTypes.number,
  customIcon: PropTypes.element
};
