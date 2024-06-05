import React, { useState, useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View, Button, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { StatusBar } from 'react-native';
import Colors from './../constants/colors.json';
import Ionicons from '@expo/vector-icons/Ionicons';
import TextInputs from './../constants/texts.json';
import { useNavigation } from '@react-navigation/native';
import ModalPopUp from './ModalPopUp';
import ApiService from './../utils/Axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from './../constants/constants.json'
import moment from 'moment';
import Loader from '../utils/Loader';
import SkeletonLoader from '../utils/SkeletonLoader';

const baseUrl = process.env.EXPO_PUBLIC_ATTENDANCE_CHECK_API_GATEWAY;
const baseUrl_result = process.env.EXPO_PUBLIC_ATTENDANCE_RESULT_API_GATEWAY;

export default function AttendanceReviewScreen({ route }) {

  const { standard, section, selectedZone } = route.params;
  const navigation = useNavigation();

  const [cameraPermission, setCameraPermission] = useState(null);
  const [photo, setPhoto] = useState();
  const [photoArray, setPhotoArray] = useState([]);
  const cameraRef = useRef(null);
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [attendanceListData, setAttendanceListData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showAbsenteesList, setShowAbsenteesList] = useState(false);
  const [lastPress, setLastPress] = useState(0);
  const [username, setUsername] = useState(null);
  const [studentsList, setStudentsList] = useState(null);
  const [dataFetched, setDataFetched] = useState(false);
  const [noAbsentees, setNoAbsentees] = useState(false);

  useEffect(() => {
    getUser();
  });

  useEffect(() => {
    if (username) {
      getAttendanceCheckData();
    }
  }, [username])

  const getUser = async () => {
    const data = await AsyncStorage.getItem(constants.signInDetails);
    const parsedData = JSON.parse(data);
    setUsername(parsedData.loginId);
  }


  const getAttendanceCheckData = async () => {
    const getteacherDetails = await AsyncStorage.getItem(constants.teacherDetails);
    const teacherDetails = JSON.parse(getteacherDetails)

    const currentDate = moment();
    // Format the date as "DD-MM-YYYY"
    const formattedDate = currentDate.format('DD-MM-YYYY');

    const token = await AsyncStorage.getItem(constants.idToken);
    const response = await ApiService.get(`${baseUrl}?teacher_employee_number=${teacherDetails.staffNumber}&teacher_email=${teacherDetails.staffEmail}&attendance_class=${standard}${section}&date=${formattedDate}&am_pm=${selectedZone}`, token);
    if (response.status == 200) {
      setStudentsList(response.data.students);
      setAttendanceListData(response.data);
      setDataFetched(true);
    }

    if (response.status == 500) {
      setDataFetched(true);

      if (response.data.message === "Error comparing images using AI.") {

        const data = {
          selectedZone: selectedZone,
          standard: standard,
          section: section,
          OpenCamera: true
        }
        navigation.navigate('CameraScreen', data);
      }
    }

  };



  const handleCheckAbsentee = async () => {
    setShowAbsenteesList(true);
    const filteredData = studentsList.filter(item => item.present === false);
    if(filteredData.length === 0){
      setNoAbsentees(true);
    }else{
      setNoAbsentees(false);
    }
    setStudentsList(filteredData);
  };

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }
  handleBack = () => {
    navigation.navigate('Home')
  }
  handleNext = async () => {
    const length = photoArray.length;
    if (length < 2) {
      setErrorMessage(TextInputs.MinimumPhotoLimit);
      setShowModal(true);
    }
    else {
      setShowPhotoScreen(true);
    }
  }
  const handlePress = (index) => {

    const currentTime = new Date().getTime();
    const doubleClickDelay = 300;
    // Removed the double click functionality 
    // if (currentTime - lastPress < doubleClickDelay) {
    const newData = [...studentsList];
    newData[index].present = !newData[index].present;
    setStudentsList(newData);
    // }
    // setLastPress(currentTime);

  };

  const handleSubmit = async () => {
    setNoAbsentees(false);
    setDataFetched(false);
    const token = await AsyncStorage.getItem(constants.idToken);
    const request = await ApiService.post(`${baseUrl_result}`, attendanceListData, token);
    if (request.status === 200 || request.status === 201) {
      setDataFetched(true);
      setErrorMessage(TextInputs.AttendanceSubmittedSucessfully)
      setShowModal(true);
    }
  }
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.h1} onPress={() => handleBack()}> <Ionicons name="arrow-back-outline" size={30} color="white" /></Text>
        <Text style={styles.h1}>{standard}-{section}</Text>
        <View style={[styles.timeBorder, styles.selectedTimezone]}>
          <Text style={styles.timezoneAm} >{selectedZone}</Text>
        </View>
      </View>
      {Array.isArray(studentsList) && studentsList.length > 0 &&
        studentsList.map((button, index) => (
          <View style={styles.attendanceButtonContainer} key={index}>
            <View style={styles.buttonLeft}>
              <Pressable style={styles.profileBorder} onPress={() => OpenCamera()}>
                <Ionicons name="person-outline" size={20} color={Colors.white} />
              </Pressable>
              <Text style={[styles.buttonText, { fontSize: 15 }]}>{button.studentFirstName} {button.studentLastName}</Text>
            </View>
            <Pressable style={styles.buttonLeft} onPress={() => handlePress(index)}>

              <Text style={[styles.buttonText, { color: button.present ? Colors.green : Colors.red, fontSize: 10 }]}>
                {button.present ? 'Present' : 'Absent'}
              </Text>
              <Pressable onPress={() => handlePress(index)} style={[styles.attendanceStatus, { backgroundColor: button.present ? Colors.green : Colors.red, borderRadius: 25 }]}>
                <Ionicons name={button.present ? 'checkmark-outline' : 'close-outline'} size={15} color={Colors.black} />
              </Pressable>
            </Pressable>

          </View>

        ))

      }
      {!dataFetched && <SkeletonLoader />}
      {noAbsentees && <View style={styles.attendanceButtonContainer}>
        <Text style={styles.messageText}>{TextInputs.Allpresent}</Text>
      </View>}
      {dataFetched && <View style={styles.buttonContainer}>
        {!showAbsenteesList ? <Pressable><Text testID='check-btn' style={styles.button} onPress={() => handleCheckAbsentee()}>{TextInputs.checkAbsentee}</Text></Pressable> :

          <Pressable><Text testID='submit-btn' style={styles.button} onPress={() => handleSubmit()}>{TextInputs.SubmitAttendance}</Text></Pressable>}
      </View>}
      <ModalPopUp data={showModal} onClose={() => setShowModal(false)} message={errorMessage} PromptMessage={TextInputs.Home} redirect={'Home'} page={'AttendanceReviewScreen'} />


    </ScrollView  >

  );
}
const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.buttonColor,
    borderRadius: 12,
    padding: 10,
    width: '100%',
    textAlign: 'center',
    color: Colors.white,
    paddingLeft: 50,
    paddingRight: 50
  },
  profileBorder: {
    width: 'auto',
    padding: 10,
    borderColor: Colors.white,
    borderWidth: 0.1,
    borderRadius: 5,
  },
  attendanceStatus: {
    width: 'auto',
    padding: 5,
    borderRadius: 5,
    left: 5
  },
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    flexDirection: 'column',
    // alignItems: 'center',
    // justifyContent: 'center',
    position: 'relative',
    backgroundColor: '#000',
  },

  timeBorder: {
    borderWidth: 0.1,
    borderRadius: 3,
    borderColor: Colors.white,
    padding: 10,
    marginHorizontal: 20,
    width: 'auto',
    justifyContent: 'center'
  },
  selectedTimezone: {
    backgroundColor: Colors.AccentColor,

  },
  timezoneAm: {
    fontSize: 10,
    color: Colors.white,
  },

  attendanceButtonContainer: {
    flexDirection: 'row',
    width: '90%',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: Colors.grey,
    borderRadius: 10,
    marginTop: 15,
    alignItems: 'center',
    alignSelf: 'center', // Add this line to center the container horizontally
    justifyContent: 'space-between',

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
    position: 'relative',
    marginBottom: 50,
    // top:10,
    marginTop: 30,
    width: '90%', // Match the width of the attendance button containers
    alignSelf: 'center', // Add this line to center the container horizontally
  },
  buttonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    marginLeft: 10,
    color: Colors.white,
  },
  messageText: {
    color: Colors.white ,
    alignItems: 'center',
    justifyContent:'center'
  }
});


