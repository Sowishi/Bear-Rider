import { LinearGradient } from "expo-linear-gradient";
import { Image } from "react-native";

const LogoComponent = () => {
  return (
    <LinearGradient
      end={{ x: 1, y: 1 }}
      colors={["#4C3488", "#AFBAF8"]}
      style={{
        flex: 0.8,
        borderBottomLeftRadius: 150,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        style={{ width: 150, height: 150 }}
        source={require("../assets/newLogoNoBG.png")}
      />
    </LinearGradient>
  );
};

export default LogoComponent;
