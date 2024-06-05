import React, { useState, useEffect } from 'react';
import { Modal, StyleSheet, Text, Pressable, View, Image } from 'react-native';
import Colors from './../constants/colors.json';
import { useNavigation } from '@react-navigation/native';
import handleSignOut from './Aws-cognito/SignOutFuntion';

const ModalPopUp = ({ data, onClose, message, PromptMessage, redirect, page }) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(data);
  useEffect(() => {
    setModalVisible(data);
  }, [data]);

  return (
    <Modal
      testID="modal-popup"
      accessibilityLabel="privacy-policy-modal"
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
        onClose && onClose();
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {page == 'AttendanceReviewScreen' && <Image source={require('./../../assets/icons/verify.png')} style={{ alignSelf: 'center', bottom: 10 }} />}
          <Text testID="modal-error"
            style={styles.modalText}>{message}</Text>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={async () => {
              setModalVisible(false);
              onClose && onClose();
              if (redirect === 'Login') {
                await handleSignOut({ navigation });
              } else {
                navigation.navigate(redirect);
              }
            }}>
            <Text style={styles.textStyle}>{PromptMessage}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: Colors.grey,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#3F4349',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: Colors.AccentColor,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    width: 'auto',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: Colors.white,
  },
});

export default ModalPopUp;
