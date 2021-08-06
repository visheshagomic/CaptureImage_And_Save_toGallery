'use strict';
import React, {useState, useRef, useEffect} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  PermissionsAndroid,Alert
} from 'react-native';
import {RNCamera} from 'react-native-camera';
// import {CameraRoll} from '@react-native-community/cameraroll';
import RNFetchBlob from 'rn-fetch-blob';

let {height, width} = Dimensions.get('window');
let orientation = height > width ? 'Portrait' : 'Landscape';

function App() {
  // const [barcode, setBarcode] = useState(null);
  // let [type, setType] = useState('back');
  // let [flash, setFlash] = useState('off');
  let cameraRef = useRef(null);
  let [permission, setPermission] = useState(false);

  function CheckAndGrantPermission(params) {
    PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ).then(res => {
      if (res == true) {
        setPermission(true);
      } else {
        PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            message: 'Please Give Access to save Image',
            title: 'Storage Permission',
          },
        ).then(res => {
          setPermission(true);
        });
      }
    });
  }

  const takePicture = async () => {
    const options = {quality: 0.5, base64: true};
    const data = await cameraRef.current.takePictureAsync(options);
    console.log(data.uri);
    const splittedArray = data.uri.split('/');
    const fileName = splittedArray[splittedArray.length - 1];
    console.log(`fileName`, fileName);
    saveImage(fileName);
  };

  function saveImage(data) {
    const folderPath = '/storage/emulated/0/DocSutra/Images';
    const filePath = folderPath + '/' + data;
    //console.log(fileName)
    RNFetchBlob.fs.isDir(folderPath).then(res => {
      console.log(`isDir`, res);
      if (res == 'true') {
        console.log(`True`);

        addImage(filePath);
      } else {
        console.log(`False`);

        RNFetchBlob.fs.mkdir(folderPath).then(() => {
          addImage(filePath);
        });
      }
    });
  }

  function addImage(params) {
    RNFetchBlob.fs.createFile(params, 'base64').then(() => {
      console.log('File Saved');
      Alert("Image Saved")
    });
  }

  useEffect(() => {
    CheckAndGrantPermission();
    // Permissions.check('photo').then(response => {
    //   CONS;
    //   // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
    //   setPermission(response);
    // });
  }, []);

  return (
    <View style={styles.container}>
      <RNCamera
        ref={cameraRef}
        captureAudio={false}
        style={styles.preview}
        //  type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.on}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        androidRecordAudioPermissionOptions={{
          title: 'Permission to use audio recording',
          message: 'We need your permission to use your audio',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        // onGoogleVisionBarcodesDetected={({ barcodes }) => {
        //   console.log(barcodes);
        // }}
      />
      <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center'}}>
        <TouchableOpacity
          onPress={() => {
            takePicture();
          }}
          style={styles.capture}>
          <Text style={{fontSize: 14}}> SNAP </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});

export default App;
