import React from "react";
import PropTypes from "prop-types";
import { Modal, View, Text } from "react-native";

import styles from "./styles";
import { RoundButton } from "../Button";

const DeleteModal = props => {
  const {
    onEditPress,
    edit,
    onDeletePress,
    onCancelPress,
    modalVisible
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
        <View style={{ padding: 10 }}>
          {edit ? (
            <RoundButton onPress={onEditPress} buttonText={"Edit"} />
          ) : null}
          <View style={{ padding: 20 }} />
          <RoundButton onPress={onDeletePress} buttonText={"Delete"} />
          <View style={{ padding: 20 }} />
        </View>
        <RoundButton
          onPress={onCancelPress}
          cancelButton={true}
          buttonText={"X"}
        />
      </View>
    </Modal>
  );
};

DeleteModal.propTypes = {
  onPress: PropTypes.func,
  modalVisible: PropTypes.bool
};

export default DeleteModal;
