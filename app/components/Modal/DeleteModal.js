import React from "react";
import PropTypes from "prop-types";
import { Modal, View, TouchableHighlight } from "react-native";

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
      onRequestClose={onCancelPress}
    >
      <TouchableHighlight onPress={onCancelPress}>
        <View style={styles.modalView}>
          <TouchableHighlight>
            <View style={styles.container}>
              {edit ? (
                <RoundButton onPress={onEditPress} buttonText={"  Edit  "} />
              ) : null}
              <View style={{ padding: 20 }} />
              <RoundButton onPress={onDeletePress} buttonText={"Delete"} />
              <View style={{ padding: 20 }} />
              <RoundButton
                onPress={onCancelPress}
                cancelButton={true}
                buttonText={"X"}
              />
            </View>
          </TouchableHighlight>
        </View>
      </TouchableHighlight>
    </Modal>
  );
};

DeleteModal.propTypes = {
  onPress: PropTypes.func,
  modalVisible: PropTypes.bool
};

export default DeleteModal;
