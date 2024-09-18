import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Button from "../components/button";

export default function BearCamera({ navigation }) {
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
        style={{ height: "100%" }}
        facing="back"
      ></CameraView>

      <View
        style={{
          position: "absolute",
          bottom: 0,
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Button
          event={async () => {
            if (cameraRef) {
              const photo = await cameraRef.takePictureAsync();
              navigation.navigate("Rider");
              console.log("Photo taken:", photo.uri);
              // Handle the photo URI, e.g., display it or upload it
            }
          }}
          text="Proceed"
          bgColor={"#003082"}
        ></Button>
      </View>
    </View>
  );
}
