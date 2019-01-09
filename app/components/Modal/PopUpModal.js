import React from "react";
import PropTypes from "prop-types";
import { Modal, View, Text } from "react-native";

import styles from "./styles";
import { RoundButton, RepSecButton } from "../Button";
import { NumberInput } from "../TextInput";

const PopUpModal = props => {
  const {
    onChangeText,
    onPress,
    onPress2,
    onPress3,
    onCancelPress,
    modalVisible,
    buttonText = "Reps"
  } = props;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        console.log("Modal has been closed.");
      }}
    >
      <View style={styles.modalView}>
        <Text style={styles.modalText}>Enter The Amount Of {buttonText}</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <NumberInput onChangeText={onChangeText} />
          <RepSecButton onPress={onPress2} buttonText={buttonText} />
        </View>
        <View style={{ width: "70%" }}>
          <RoundButton onPress={onPress} buttonText={"Save"} />
        </View>
        <View style={{ padding: 20 }} />
        <RoundButton
          onPress={onCancelPress}
          cancelButton={true}
          buttonText={"X"}
        />
      </View>
    </Modal>
  );
};

PopUpModal.propTypes = {
  onPress: PropTypes.func,
  modalVisible: PropTypes.bool,
  onChangeText: PropTypes.func
};

export default PopUpModal;
