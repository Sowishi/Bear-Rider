import { View } from "react-native";
import BearCamera from "../components/BearCamera";
import { useSmokeContext } from "../utils/appContext";

const Camera = ({ navigation, route }) => {
  const { type } = route.params;

  return (
    <View style={{ flex: 1 }}>
      <BearCamera navigation={navigation} type={type} />
    </View>
  );
};

export default Camera;
