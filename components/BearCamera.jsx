import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Button from "../components/button";
import { useSmokeContext } from "../utils/appContext";
import * as ImageManipulator from "expo-image-manipulator";

export default function BearCamera({ navigation, type }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraRef, setCameraRef] = useState(null);
  const { setLicense } = useSmokeContext();

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
              const resizedImage = await ImageManipulator.manipulateAsync(
                photo.uri,
                [{ resize: { width: 500 } }],
                { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
              );
              setLicense(resizedImage.uri);
              navigation.navigate("Rider");
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
