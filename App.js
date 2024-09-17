import Toast from "react-native-toast-message";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Login from "./screen/login";
import Home from "./screen/home";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Entypo } from "@expo/vector-icons";
import { MyProvider } from "./utils/appContext";
import User from "./screen/user";
import Notification from "./screen/notification";
import Register from "./screen/register";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Rider from "./screen/rider";

export default function App() {
  const Stack = createStackNavigator();
  const Tab = createDrawerNavigator();

  function MainScreen() {
    return (
      <Tab.Navigator
        drawerContent={(props) => <User {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Tab.Screen
          options={{
            tabBarIcon: () => <Entypo name="home" size={18} color="#001F47" />,
            tabBarShowLabel: false,
          }}
          name="Home"
          component={Home}
        />

        <Tab.Screen
          options={{
            tabBarIcon: () => <Entypo name="user" size={18} color="#001F47" />,
            tabBarShowLabel: false,
          }}
          name="User"
          component={User}
        />
        <Tab.Screen
          options={{
            tabBarIcon: () => <Entypo name="bell" size={18} color="#001F47" />,
            tabBarShowLabel: false,
          }}
          name="Notification"
          component={Notification}
        />
      </Tab.Navigator>
    );
  }

  return (
    <>
      <MyProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" component={Login} />
            <Stack.Screen name="register" component={Register} />

            <Stack.Screen
              name="main"
              options={{ headerShown: true }}
              component={Rider}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </MyProvider>

      <Toast />
    </>
  );
}
