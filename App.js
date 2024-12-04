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
import Camera from "./screen/camera";
import RiderPending from "./screen/riderPending";
import Wallet from "./screen/wallet";
import "react-native-get-random-values";
import BearHome from "./screen/bear-home";
import BearMap from "./screen/bear-maps";
import Message from "./components/message";
import ConversationList from "./components/conversation";
import HistoryContent from "./components/historyContent";
import SearchLocation from "./screen/serachLocation";
import NotificationContent from "./components/notificationContent";
import BearUser from "./screen/bearUser";
export default function App() {
  const Stack = createStackNavigator();
  const Drawer = createDrawerNavigator();
  const Tab = createMaterialTopTabNavigator();
  function DrawerScreen() {
    return (
      <Drawer.Navigator
        drawerContent={(props) => <User {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Drawer.Screen
          options={{
            tabBarIcon: () => <Entypo name="home" size={18} color="#001F47" />,
            tabBarShowLabel: false,
          }}
          name="Home"
          component={Home}
        />
        <Drawer.Screen
          options={{
            tabBarIcon: () => <Entypo name="user" size={18} color="#001F47" />,
            tabBarShowLabel: false,
          }}
          name="User"
          component={User}
        />
        <Drawer.Screen
          options={{
            tabBarIcon: () => <Entypo name="bell" size={18} color="#001F47" />,
            tabBarShowLabel: false,
          }}
          name="Notification"
          component={Notification}
        />
        <Drawer.Screen
          options={{
            tabBarIcon: () => <Entypo name="bell" size={18} color="#001F47" />,
            tabBarShowLabel: false,
            headerShown: true,
            title: "Rider Registration",
          }}
          name="Rider"
          component={Rider}
        />
        <Drawer.Screen
          options={{
            tabBarIcon: () => <Entypo name="bell" size={18} color="#001F47" />,
            tabBarShowLabel: false,
            headerShown: true,
            title: "Rider Registration",
          }}
          name="Wallet"
          component={Wallet}
        />
        <Drawer.Screen
          options={{
            tabBarIcon: () => <Entypo name="bell" size={18} color="#001F47" />,
            tabBarShowLabel: false,
          }}
          name="Camera"
          component={Camera}
        />
        <Drawer.Screen
          options={{
            tabBarIcon: () => <Entypo name="bell" size={18} color="#001F47" />,
            tabBarShowLabel: false,
          }}
          name="RiderPending"
          component={RiderPending}
        />
      </Drawer.Navigator>
    );
  }

  function MainScreen() {
    return (
      <Tab.Navigator
        initialRouteName="Home"
        tabBarPosition="bottom"
        screenOptions={({ route }) => ({
          tabBarIndicatorStyle: {
            backgroundColor: "yellow",
          },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Home") {
              iconName = "home";
            } else if (route.name === "Message") {
              iconName = "chat";
            } else if (route.name === "Wallet") {
              iconName = "wallet";
            } else if (route.name === "Notification") {
              iconName = "bell";
            } else if (route.name === "User") {
              iconName = "user";
            }

            return (
              <Entypo name={iconName} size={focused ? 25 : 20} color={color} />
            );
          },
          tabBarShowLabel: false, // Hide tab labels
          tabBarActiveTintColor: "white", // Active tab color
          tabBarInactiveTintColor: "gray", // Inactive tab color
          tabBarStyle: {
            marginBottom: 20,
            marginHorizontal: 10,
            borderRadius: 10,
            paddingVertical: 5,
            backgroundColor: "#7C0000",
          },
        })}
      >
        <Tab.Screen name="Notification" component={NotificationContent} />
        <Tab.Screen name="Message" component={ConversationList} />
        <Tab.Screen name="Home" component={BearHome} />
        <Tab.Screen name="Wallet" component={Wallet} />
        <Tab.Screen name="User" component={BearUser} />
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
            <Stack.Screen name="bearMap" component={BearMap} />
            <Stack.Screen name="searchLocation" component={SearchLocation} />

            <Stack.Screen name="drawer" component={DrawerScreen} />
            <Stack.Screen name="main" component={MainScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </MyProvider>

      <Toast />
    </>
  );
}
