import { View } from "react-native";
import BearCamera from "../components/BearCamera";

const Camera = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <BearCamera navigation={navigation} />
    </View>
  );
};

export default Camera;
