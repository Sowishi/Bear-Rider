import Toast from "react-native-toast-message";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Login from "./screen/login";
import Home from "./screen/home";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Entypo } from "@expo/vector-icons";
import { MyProvider, useSmokeContext } from "./utils/appContext";
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

import SearchLocation from "./screen/serachLocation";
import NotificationContent from "./components/notificationContent";
import BearUser from "./screen/bearUser";
import SavedPlaces from "./screen/saved-places";
import AddSavePlaces from "./screen/add-saved-places";
import ViewAllWallet from "./screen/view-all-wallet";
import BearTransaction from "./screen/bearTransaction";
import ViewTransaction from "./screen/viewTransacation";
import BearOnBoarding from "./screen/onboarding";
import ViewBearAsset from "./screen/viewBearAsset";

import {
  TransitionSpecs,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import ConfirmTransaction from "./screen/confirmTransaction";
import LiveTransaction from "./screen/liveTransaction";
import OrderNotes from "./components/orderNotes";
import TransactionDetails from "./screen/transactionDetails";
import LiveTracking from "./screen/liveTracking";
import Message from "./components/message";
import SelectPaymentMethod from "./screen/selectPaymentMethod";
import Paymongo from "./screen/paymongo";
import { useEffect } from "react";
import { Linking } from "react-native";
import BearScanner from "./components/barcodeScanner";
import Receipts from "./screen/receipts";
import BearCamera from "./components/BearCamera";
import BlockedUser from "./screen/blockedUser";
import BearRiderTransaction from "./screen/BearRiderTransaction";
import RiderEarning from "./screen/riderEarning";
import RejectedUser from "./screen/rejectedUser";

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
    const { currentUser } = useSmokeContext();

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
            backgroundColor: currentUser?.role == null ? "#B80B00" : "#003082",
          },
        })}
      >
        <Tab.Screen
          name="Transaction"
          component={
            currentUser?.role == "Rider"
              ? BearRiderTransaction
              : BearTransaction
          }
        />
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

  function StackScreen() {
    const { currentUser } = useSmokeContext();

    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {currentUser == null && (
          <>
            <Stack.Screen name="onboarding" component={BearOnBoarding} />
            <Stack.Screen name="login" component={Login} />
            <Stack.Screen name="register" component={Register} />
          </>
        )}
        {currentUser && (
          <>
            <Stack.Screen name="main" component={MainScreen} />
            <Stack.Screen
              name="bearMap"
              options={{
                animationEnabled: true,
                transitionSpec: {
                  open: TransitionSpecs.TransitionIOSSpec,
                  close: TransitionSpecs.TransitionIOSSpec,
                },
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              }}
              component={BearMap}
            />
            <Stack.Screen
              name="LiveTracking"
              options={{
                animationEnabled: true,
                transitionSpec: {
                  open: TransitionSpecs.TransitionIOSSpec,
                  close: TransitionSpecs.TransitionIOSSpec,
                },
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              }}
              component={LiveTracking}
            />

            <Stack.Screen name="searchLocation" component={SearchLocation} />
            <Stack.Screen name="Camera" component={Camera} />
            <Stack.Screen name="RiderPending" component={RiderPending} />
            <Stack.Screen name="BlockedUser" component={BlockedUser} />

            <Stack.Screen name="drawer" component={DrawerScreen} />
            <Stack.Screen name="viewBearAsset" component={ViewBearAsset} />
            <Stack.Screen name="LiveTransaction" component={LiveTransaction} />
            <Stack.Screen name="Paymongo" component={Paymongo} />
            <Stack.Screen name="Scanner" component={BearScanner} />

            <Stack.Screen
              options={{
                headerShown: true,
                title: "Saved Places",
                headerBackTitleStyle: {
                  color: "white",
                  backgroundColor: "white",
                },
                headerTintColor: "white",
                headerStyle: {
                  backgroundColor: !currentUser.role ? "#B80B00" : "#003082",
                },
                animationEnabled: true,
                transitionSpec: {
                  open: TransitionSpecs.TransitionIOSSpec,
                  close: TransitionSpecs.TransitionIOSSpec,
                },
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              }}
              name="savedPlaces"
              component={SavedPlaces}
            />
            <Stack.Screen
              options={{
                headerShown: true,
                title: "Add Place",
                headerBackTitleStyle: {
                  color: "white",
                  backgroundColor: "white",
                },
                headerTintColor: "white",
                headerStyle: {
                  backgroundColor: !currentUser.role ? "#B80B00" : "#003082",
                },
                animationEnabled: true,
                transitionSpec: {
                  open: TransitionSpecs.TransitionIOSSpec,
                  close: TransitionSpecs.TransitionIOSSpec,
                },
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              }}
              name="addSavedPlaces"
              component={AddSavePlaces}
            />
            <Stack.Screen
              options={{
                headerShown: true,
                title: "All Transaction",
                headerBackTitleStyle: {
                  color: "white",
                  backgroundColor: "white",
                },
                headerTintColor: "white",
                headerStyle: {
                  backgroundColor: !currentUser.role ? "#B80B00" : "#003082",
                },
                animationEnabled: true,
                transitionSpec: {
                  open: TransitionSpecs.TransitionIOSSpec,
                  close: TransitionSpecs.TransitionIOSSpec,
                },
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
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
                  backgroundColor: !currentUser.role ? "#B80B00" : "#003082",
                },
              }}
              name="bearUser"
              component={BearUser}
            />
            <Stack.Screen
              options={{
                title: "Become a Rider",
                headerShown: true,
                headerBackTitleStyle: {
                  color: "white",
                  backgroundColor: "white",
                },
                headerTintColor: "white",
                headerStyle: {
                  backgroundColor: !currentUser.role ? "#B80B00" : "#003082",
                },
              }}
              name="Rider"
              component={Rider}
            />
            <Stack.Screen
              options={{
                title: "Wallet",
                headerShown: true,
                headerBackTitleStyle: {
                  color: "white",
                  backgroundColor: "white",
                },
                headerTintColor: "white",
                headerStyle: {
                  backgroundColor: !currentUser.role ? "#B80B00" : "#003082",
                },
                animationEnabled: true,
                transitionSpec: {
                  open: TransitionSpecs.TransitionIOSSpec,
                  close: TransitionSpecs.TransitionIOSSpec,
                },
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              }}
              name="Wallet"
              component={Wallet}
            />
            <Stack.Screen
              options={{
                title: "Notification",
                headerShown: true,
                headerBackTitleStyle: {
                  color: "white",
                  backgroundColor: "white",
                },
                headerTintColor: "white",
                headerStyle: {
                  backgroundColor: !currentUser.role ? "#B80B00" : "#003082",
                },
              }}
              name="Notification"
              component={NotificationContent}
            />
            <Stack.Screen
              options={{
                title: "Transaction Details",
                headerShown: true,
                headerBackTitleStyle: {
                  color: "white",
                  backgroundColor: "white",
                },
                headerTintColor: "white",
                headerStyle: {
                  backgroundColor: !currentUser.role ? "#B80B00" : "#003082",
                },
              }}
              name="ViewTransaction"
              component={ViewTransaction}
            />
            <Stack.Screen
              options={{
                title: "Confirm Transaction",
                headerShown: true,
                headerBackTitleStyle: {
                  color: "white",
                  backgroundColor: "white",
                },
                headerTintColor: "white",
                headerStyle: {
                  backgroundColor: !currentUser.role ? "#B80B00" : "#003082",
                },
              }}
              name="ConfirmTransaction"
              component={ConfirmTransaction}
            />
            <Stack.Screen
              options={{
                title: "Transaction Details",
                headerShown: true,
                headerBackTitleStyle: {
                  color: "white",
                  backgroundColor: "white",
                },
                headerTintColor: "white",
                headerStyle: {
                  backgroundColor: !currentUser.role ? "#B80B00" : "#003082",
                },
              }}
              name="TransactionDetails"
              component={TransactionDetails}
            />
            <Stack.Screen
              options={{
                title: "Transaction Details",
                headerShown: true,
                headerBackTitleStyle: {
                  color: "white",
                  backgroundColor: "white",
                },
                headerTintColor: "white",
                headerStyle: {
                  backgroundColor: !currentUser.role ? "#B80B00" : "#003082",
                },
              }}
              name="RiderTransactionDetails"
              component={TransactionDetails}
            />
            <Stack.Screen
              options={{
                title: "Transaction Details",
                headerShown: false,
                headerBackTitleStyle: {
                  color: "white",
                  backgroundColor: "white",
                },
                headerTintColor: "white",
                headerStyle: {
                  backgroundColor: !currentUser.role ? "#B80B00" : "#003082",
                },
              }}
              name="Message"
              component={Message}
            />
            <Stack.Screen
              options={{
                title: "Select Payment Method",
                headerShown: true,
                headerBackTitleStyle: {
                  color: "white",
                  backgroundColor: "white",
                },
                headerTintColor: "white",
                headerStyle: {
                  backgroundColor: !currentUser.role ? "#B80B00" : "#003082",
                },
              }}
              name="SelectPaymentMethod"
              component={SelectPaymentMethod}
            />
            <Stack.Screen
              options={{
                title: "Delivery Receipts",
                headerShown: true,
                headerBackTitleStyle: {
                  color: "white",
                  backgroundColor: "white",
                },
                headerTintColor: "white",
                headerStyle: {
                  backgroundColor: !currentUser.role ? "#B80B00" : "#003082",
                },
              }}
              name="Receipts"
              component={Receipts}
            />
            <Stack.Screen
              options={{
                title: "Capture",
                headerShown: false,
                headerBackTitleStyle: {
                  color: "white",
                  backgroundColor: "white",
                },
                headerTintColor: "white",
                headerStyle: {
                  backgroundColor: !currentUser.role ? "#B80B00" : "#003082",
                },
              }}
              name="BearCamera"
              component={BearCamera}
            />
            <Stack.Screen
              options={{
                title: "Rider Earning",
                headerShown: true,
                headerBackTitleStyle: {
                  color: "white",
                  backgroundColor: "white",
                },
                headerTintColor: "white",
                headerStyle: {
                  backgroundColor: !currentUser.role ? "#B80B00" : "#003082",
                },
              }}
              name="RiderEarning"
              component={RiderEarning}
            />
            <Stack.Screen
              options={{
                title: "Rider Earning",
                headerShown: true,
                headerBackTitleStyle: {
                  color: "white",
                  backgroundColor: "white",
                },
                headerTintColor: "white",
                headerStyle: {
                  backgroundColor: !currentUser.role ? "#B80B00" : "#003082",
                },
              }}
              name="RejectedUser"
              component={RejectedUser}
            />
          </>
        )}
      </Stack.Navigator>
    );
  }

  return (
    <>
      <MyProvider>
        <NavigationContainer>
          <StackScreen />
        </NavigationContainer>
      </MyProvider>

      <Toast />
    </>
  );
}
