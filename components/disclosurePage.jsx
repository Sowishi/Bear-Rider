import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import riderNeeds from "../assets/Group 39399.png";
import Button from "./button";
import TermsAndConditions from "./TermsAndConditions";
import { AntDesign } from "@expo/vector-icons";

const DisclosurePage = ({ setDisclosure, disclosure, accept, setAccept }) => {
  if (disclosure == "needs") {
    return (
      <View style={{ flex: 1, backgroundColor: "white", paddingVertical: 10 }}>
        <View
          style={{
            flex: 1,
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Text
            style={{ fontSize: 27, fontWeight: "bold", textAlign: "center" }}
          >
            What you need
          </Text>
          <Image
            style={{ objectFit: "contain", width: 400, height: 400 }}
            source={riderNeeds}
          />
          <View style={{ flexDirection: "row" }}>
            <Button
              width={100}
              event={() => setDisclosure("terms")}
              text={"Next"}
              bgColor={"#003082"}
            />
          </View>
        </View>
      </View>
    );
  }
  if (disclosure == "terms") {
    return (
      <View style={{ flex: 1, backgroundColor: "white", paddingVertical: 10 }}>
        <View
          style={{
            flex: 1,
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Text
            style={{ fontSize: 27, fontWeight: "bold", textAlign: "center" }}
          >
            Terms and Conditions
          </Text>
          <ScrollView
            style={{
              borderWidth: 2,
              margin: 10,
              marginVertical: 30,
              borderRadius: 10,
              borderColor: "#1C2873",
            }}
          >
            <TermsAndConditions />
          </ScrollView>
          <View
            style={{
              padding: 10,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text>Agree and continue</Text>
            <TouchableOpacity
              onPress={() => setAccept(!accept)}
              style={{
                marginLeft: 10,
                paddingHorizontal: 8,
                paddingVertical: 3,
                borderRadius: 5,
                backgroundColor: accept ? "green" : "grey",
              }}
            >
              <Text style={{ color: "white" }}>
                Agree{" "}
                {accept && (
                  <AntDesign name="checkcircle" size={15} color="white" />
                )}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Button
              width={100}
              event={() => setDisclosure("needs")}
              text={"Back"}
              bgColor={"#B80B00"}
            />
            <Button
              isDisable={!accept}
              width={100}
              event={() => setDisclosure(false)}
              text={"Next"}
              bgColor={"#003082"}
            />
          </View>
        </View>
      </View>
    );
  }
};

export default DisclosurePage;
