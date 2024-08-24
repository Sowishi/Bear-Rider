import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  View,
  TextInput,
} from "react-native";
import Button from "../components/button";
import { useState } from "react";
import { auth, database, db } from "../firebase";
import { showToast } from "../components/toast";
import Loader from "../components/loader";
import { Ionicons } from "@expo/vector-icons";
import { onValue, ref } from "firebase/database";
import LineComponent from "../components/line";
import TitleComponent from "../components/titleComponent";
import { useSmokeContext } from "../utils/appContext";
import bear1 from "../assets/bear1.png";

const Login = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { currentUser } = useSmokeContext();

  const handleLogin = () => {
    navigation.navigate("main");
  };

  console.log(currentUser);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar backgroundColor={"#FDC210"} style="light" />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FDC210",
        }}
      >
        <Image
          source={bear1}
          style={{ height: 300, width: 320, objectFit: "contain" }}
        />
      </View>
      <View
        style={{
          flex: 1.2,
          paddingHorizontal: 10,
          backgroundColor: "white",
          paddingTop: 15,
        }}
      >
        <TitleComponent titleColor={"black"} title={"Login"} />
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
          }}
        ></View>
        <View style={{ paddingHorizontal: 20, marginTop: 30 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.8,
              shadowRadius: 2,
              elevation: 3,
              paddingHorizontal: 10,
              backgroundColor: "white",
              borderRadius: 10,
            }}
          >
            <Ionicons name="mail" size={24} color="#999999" />
            <TextInput
              onChangeText={(text) => setEmail(text)}
              placeholder="Email/Username"
              style={{
                flex: 1,
                paddingVertical: 15,
                paddingHorizontal: 10,
              }}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.8,
              shadowRadius: 2,
              elevation: 3,
              paddingHorizontal: 10,
              marginTop: 20,
              backgroundColor: "white",
              borderRadius: 10,
            }}
          >
            <Ionicons name="key" size={24} color="#999999" />
            <TextInput
              secureTextEntry
              onChangeText={(text) => setPassword(text)}
              placeholder="Password"
              style={{
                flex: 1,
                paddingVertical: 15,
                paddingHorizontal: 10,
              }}
            />
          </View>
        </View>
        <View
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 15,
            marginVertical: 20,
          }}
        >
          <Text style={{ fontSize: 13 }}>
            Don't have an account?{" "}
            <Text
              onPress={() => navigation.navigate("register")}
              style={{ color: "#626B7B", fontWeight: "bold" }}
            >
              Signup
            </Text>{" "}
          </Text>
          <Text style={{ fontSize: 13, color: "#626B7B", fontWeight: "bold" }}>
            Forgot Password?
          </Text>
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            icon="login"
            text="Login"
            bgColor={"#B80B00"}
            navigation={navigation}
            event={handleLogin}
          />
        </View>
      </View>
    </View>
  );
};

export default Login;
