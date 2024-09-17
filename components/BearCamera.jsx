import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Button from "../components/button";

export default function BearCamera() {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraRef, setCameraRef] = useState(null);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <View>
      <CameraView
        ref={(ref) => setCameraRef(ref)}
        style={{ width: 500, height: 500 }}
        facing="back"
      ></CameraView>
      <Button
        event={async () => {
          if (cameraRef) {
            const photo = await cameraRef.takePictureAsync();
            console.log("Photo taken:", photo.uri);
            // Handle the photo URI, e.g., display it or upload it
          }
        }}
        text="Proceed"
        bgColor={"#003082"}
      ></Button>
    </View>
  );
}
