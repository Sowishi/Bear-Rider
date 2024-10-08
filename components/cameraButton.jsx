import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

const CameraButton = ({ navigation, type, removeEvent }) => {
  return (
    <View
      style={{
        backgroundColor: "#FFFEF7",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 3,
        width: "100%",
        paddingVertical: 8,
        flexDirection: "row",
      }}
    >
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Camera", {
              type,
              facing: false,
            });
          }}
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <AntDesign name="camera" size={20} color="black" />
          <Text
            style={{
              color: "#003082",
              fontWeight: "bold",
              fontSize: 13,
            }}
          >
            Camera
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginRight: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Camera", {
                type,
                facing: false,
              });
            }}
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MaterialCommunityIcons
              name="camera-retake"
              size={20}
              color="black"
            />
            <Text
              style={{
                color: "#003082",
                fontWeight: "bold",
                fontSize: 13,
              }}
            >
              Retake
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              removeEvent(null);
            }}
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={20}
              color="red"
            />
            <Text
              style={{
                color: "#003082",
                fontWeight: "bold",
                fontSize: 13,
              }}
            >
              Remove
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CameraButton;
