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
import SavedPlaces from "./screen/saved-places";
import AddSavePlaces from "./screen/add-saved-places";
import ViewAllWallet from "./screen/view-all-wallet";
import BearTransaction from "./screen/bearTransaction";
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
            backgroundColor: "white",
          },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Home") {
              iconName = "home";
            } else if (route.name === "Transaction") {
              iconName = "grid";
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
            marginHorizontal: 30,
            borderRadius: 10,
            paddingVertical: 5,
            backgroundColor: "#7C0000",
          },
        })}
      >
        <Tab.Screen name="Transaction" component={BearTransaction} />
        <Tab.Screen
          name="Home"
          options={{ statusBarStyle: "light" }}
          component={BearHome}
        />
        <Tab.Screen
          name="Wallet"
          options={{ statusBarStyle: "dark" }}
          component={Wallet}
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
            <Stack.Screen name="bearMap" component={BearMap} />
            <Stack.Screen name="searchLocation" component={SearchLocation} />
            <Stack.Screen name="Camera" component={Camera} />
            <Stack.Screen name="RiderPending" component={RiderPending} />

            <Stack.Screen name="drawer" component={DrawerScreen} />
            <Stack.Screen name="main" component={MainScreen} />
            <Stack.Screen
              options={{
                headerShown: true,
                title: "",
                headerBackTitleStyle: {
                  color: "white",
                  backgroundColor: "white",
                },
                headerTintColor: "white",
                headerStyle: {
                  backgroundColor: "#B80B00",
                },
              }}
              name="savedPlaces"
              component={SavedPlaces}
            />
            <Stack.Screen
              options={{
                headerShown: true,
                title: "",
                headerBackTitleStyle: {
                  color: "white",
                  backgroundColor: "white",
                },
                headerTintColor: "white",
                headerStyle: {
                  backgroundColor: "#B80B00",
                },
              }}
              name="addSavedPlaces"
              component={AddSavePlaces}
            />
            <Stack.Screen
              options={{
                headerShown: true,
                title: "",
                headerBackTitleStyle: {
                  color: "white",
                  backgroundColor: "white",
                },
                headerTintColor: "white",
                headerStyle: {
                  backgroundColor: "#B80B00",
                },
              }}
              name="viewAllWallet"
              component={ViewAllWallet}
            />
            <Stack.Screen
              options={{
                title: "",
                headerBackTitleStyle: {
                  color: "white",
                  backgroundColor: "white",
                },
                headerTintColor: "white",
                headerStyle: {
                  backgroundColor: "#B80B00",
                },
              }}
              name="bearUser"
              component={BearUser}
            />
            <Stack.Screen
              options={{
                title: "",
                headerShown: true,
                headerBackTitleStyle: {
                  color: "white",
                  backgroundColor: "white",
                },
                headerTintColor: "white",
                headerStyle: {
                  backgroundColor: "#B80B00",
                },
              }}
              name="Rider"
              component={Rider}
            />
            <Stack.Screen
              options={{
                title: "",
                headerShown: true,
                headerBackTitleStyle: {
                  color: "white",
                  backgroundColor: "white",
                },
                headerTintColor: "white",
                headerStyle: {
                  backgroundColor: "#B80B00",
                },
              }}
              name="Wallet"
              component={Wallet}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </MyProvider>

      <Toast />
    </>
  );
}
