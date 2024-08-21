import { Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

const Button = ({ text, icon, bgColor, event, isDisable, style, width }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        event();
        Haptics.selectionAsync();
      }}
      style={{
        ...style,
        backgroundColor: isDisable ? bgColor + "99" : bgColor,
        width: width ? width : 200,
        paddingVertical: 10,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        marginHorizontal: 10,
        marginVertical: 10,
      }}
      disabled={isDisable}
    >
      {isDisable ? (
        <Text style={{ fontSize: 18, color: "white", marginRight: 5 }}>
          Disabled
        </Text>
      ) : (
        <Text style={{ fontSize: 18, color: "white", marginRight: 5 }}>
          {text}
        </Text>
      )}
      <MaterialCommunityIcons name={icon} size={20} color="white" />
    </TouchableOpacity>
  );
};

export default Button;
