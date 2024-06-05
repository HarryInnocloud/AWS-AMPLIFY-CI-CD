import React, { useState, useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View, Button, Image, Animated, ActivityIndicator } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { StatusBar } from 'react-native';
import Colors from './../constants/colors.json';
import Ionicons from '@expo/vector-icons/Ionicons';
import TextInputs from './../constants/texts.json';
import PhotoScreen from './PhotoScreen';
import { useNavigation } from '@react-navigation/native';
import ModalPopUp from './ModalPopUp';
import moment from 'moment';
import ApiService from '../utils/Axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from './../constants/constants.json';
import Loader from '../utils/Loader';

const baseUrl = process.env.EXPO_PUBLIC_ATTENDANCE_PHOTO_API_GATEWAY;

export default function CameraScreen({ route }) {
  const { standard, section, selectedZone, OpenCamera } = route.params;
  const navigation = useNavigation();

  const [cameraPermission, setCameraPermission] = useState(null);
  const [photo, setPhoto] = useState();
  const [photoArray, setPhotoArray] = useState([]);
  const [params, setParams] = useState(section);
  const cameraRef = useRef(null);
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [showPhotoScreen, setShowPhotoScreen] = useState(false);
  const [disableCapture, setDisableCapture] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    permisionFunction();
  });
  const captureButtonScale = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (OpenCamera) {
      setPhotoArray([]);
      handleDeleteImage();
      setShowPhotoScreen(false);
      setErrorMessage('Error comparing images using AI. Please capture again.');
      setShowModal(true);
    }
  }, [OpenCamera]);


  const handleDeleteImage = async (fileName) => {

    const token = await AsyncStorage.getItem(constants.idToken);
    const currentDate = moment();
    const formattedDate = currentDate.format('DD-MM-YYYY');

    const deletePromises = photoArray.map(async (record) => {
      const url = `${baseUrl}?attendance_class=${record.attendance_class}&date=${record.date}&am_pm=${record.am_pm}&fileName=${record.fileName}`;
      return ApiService.delete(url, token);
    });

    try {
      const responses = await Promise.all(deletePromises);
      // Handle successful responses
      console.log('Successfully deleted all records');
    } catch (error) {
      // Handle error
      console.error('Error deleting attendance records:', error);
    }
  };

  const permisionFunction = async () => {
    const cameraPermission = await Camera.requestCameraPermissionsAsync();
    setCameraPermission(cameraPermission.status === 'granted');

    if (cameraPermission.status !== 'granted') {
      alert('Permission for camera access needed.');
    }
  };

  const uploadPhotoToS3 = async (imageData) => {
    setDisableCapture(true);
    setIsLoading(true); // show loader
    const token = await AsyncStorage.getItem(constants.idToken);
    try {
      const request = await ApiService.post(`${baseUrl}`, imageData, token);
      if (request.status !== 200) {
        setErrorMessage(request.status);
        setShowModal(true);
      }
    } catch (error) {
      setErrorMessage(error);
      setShowModal(true);
    } finally {
      setDisableCapture(false);
    }
  };

  const takePicture = async () => {
    if (disableCapture || !cameraRef.current) {
      return;
    }

    Animated.sequence([
      Animated.timing(captureButtonScale, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(captureButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start();

    const length = photoArray.length;
    const existingData = photoArray;
    const options = { quality: 0.4, base64: true };
    const data = await cameraRef.current.takePictureAsync(options);
    const source = data.base64;

    const currentDate = moment();
    const formattedDate = currentDate.format('DD-MM-YYYY');
    const imageNumber = existingData.length + 1;

    let base64Img = `data:image/jpg;base64,${source}`;

    const imageData = {
      attendance_class: `${standard}${section}`,
      date: formattedDate,
      am_pm: selectedZone,
      fileName: `AttendancePhoto-${imageNumber}.jpg`,
      fileContent: base64Img,
    };

    if (length >= 4) {
      setErrorMessage(TextInputs.MaximumPhotoLimit);
      setShowModal(true);
    } else {
      existingData.push(imageData);
      await uploadPhotoToS3(imageData);
      setPhoto(data.uri);
      setPhotoArray(existingData);
    }
    setIsLoading(false); // Hide loader
  };

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }
  const handleBack = () => {
    navigation.navigate('Home');
  }
  const handleNext = async () => {
    const length = photoArray.length;
    if (length < 2) {
      setErrorMessage(TextInputs.MinimumPhotoLimit);
      setShowModal(true);
    } else {
      setShowPhotoScreen(true);
    }
  }
  const isVisible = photoArray.length >= 2;
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.h1} onPress={handleBack}>
          <Ionicons name="arrow-back-outline" size={30} color="white" />
        </Text>
        <Text style={styles.h1}>{standard}-{section}</Text>
        <View style={[styles.timeBorder, styles.selectedTimezone]}>
          <Text style={styles.timezoneAm}>{selectedZone}</Text>
        </View>
      </View>

      {!showPhotoScreen &&
        <View style={styles.cameraContainer}>
          <Camera style={styles.camera} type={type} ref={cameraRef} ></Camera>
        </View>
      }

      {!showPhotoScreen &&
        <View style={styles.camBotCont}>
          <View style={styles.previewImg}>
            {photo && <Image source={{ uri: photo }} style={{ flex: 1 }} />}
          </View>

          <Animated.View style={{ transform: [{ scale: captureButtonScale }] }}>
            <Pressable
              style={[styles.captureButton, disableCapture && styles.disabledButton]}
              onPress={takePicture}
              disabled={disableCapture}
            >
              {isLoading ? (
                <Loader/>
              ) : (
                <View style={styles.innerCircle} />
              )}
            </Pressable>
          </Animated.View>

          <Pressable
            testID='logout-btn'
            style={[styles.button, !isVisible && styles.hidden]}
            onPress={handleNext}
          >
            <Text style={{ color: Colors.white }}>{TextInputs.next}</Text>
          </Pressable>
        </View>
      }
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <Loader/>
        </View>
      )}
      {showPhotoScreen && <PhotoScreen route={route} clickedImages={photoArray} setPhotoArray={setPhotoArray} setShowPhotoScreen={setShowPhotoScreen} />}
      <ModalPopUp data={showModal} onClose={() => setShowModal(false)} message={errorMessage} PromptMessage={TextInputs.Ok} />
    </View>
  );
}
const styles = StyleSheet.create({
  hidden: {
    opacity: 0,
    pointerEvents: 'none',
  },
  timeBorder: {
    borderWidth: 0.1,
    borderRadius: 3,
    borderColor: Colors.white,
    padding: 10,
    marginHorizontal: 20,
    width: 'auto'
  },
  selectedTimezone: {
    backgroundColor: Colors.AccentColor,

  },
  timezoneAm: {
    fontSize: 10,
    color: Colors.white,
  },
  container: {
    paddingTop: StatusBar.currentHeight,
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  h1: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    backgroundColor: '#000',
    padding: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  camera: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: Colors.buttonColor,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 5,
    color: '#fff',
    width: 'auto'
  },
  text: {
    fontSize: 24,
    // fontWeight: 'bold',
    color: 'white',
  },
  camBotCont: {
    paddingVertical: 40,
    height: 'auto',
    backgroundColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20, // Add padding to the sides
    justifyContent: 'space-between'
  },
  previewImg: {
    height: 50,
    width: 50,
    borderRadius: 10,
  },
  captureButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 58,
    height: 58,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#000',
    borderWidth: 1
  },
  allImg: {
    height: 60,
    width: 60,
    borderColor: 'black',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  disabledButton: {
    opacity: 0.5, // Adjust the opacity to visually indicate the button is disabled
    pointerEvents: 'none', // Disable pointer events to prevent clicks
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});


