import { Text } from "react-native";

const TitleComponent = ({ title, titleColor, noBG }) => {
  return (
    <Text
      style={{
        color: titleColor ? titleColor : "white",
        textAlign: "center",
        fontSize: 30,
        fontWeight: "bold",
        backgroundColor: noBG ? "transparent" : "white",
      }}
    >
      {title}
    </Text>
  );
};

export default TitleComponent;
