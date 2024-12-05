import { Image, ScrollView, Text, View } from "react-native";
import cod from "../assets/cash-on-delivery.png";
import useCrudNotification from "../hooks/useCrudNotification";
import moment from "moment";
import { useSmokeContext } from "../utils/appContext";
import EmptyList from "./emptyList";
import { StatusBar } from "expo-status-bar";

const NotificationContent = () => {
  const { data } = useCrudNotification();
  const { currentUser } = useSmokeContext();

  const filterData = data.filter((user) => {
    if (user.transaction.currentUser.id == currentUser.id) {
      return user;
    }
  });
  return (
    <View style={{ flex: 1, paddingVertical: 70 }}>
      <StatusBar backgroundColor="#B80B00" style="light" />
      <Text style={{ fontWeight: "bold", fontSize: 20, textAlign: "center" }}>
        Notification
      </Text>
      <ScrollView style={{ marginTop: 20, flex: 1, width: "100%" }}>
        {filterData?.map((item) => {
          const timeStamp = item.createdAt.toDate();
          const date = moment(timeStamp).fromNow();

          return (
            <View
              key={item.id}
              style={{
                width: "100%",
                flexDirection: "row",
                marginVertical: 10,
              }}
            >
              <Image
                source={{ uri: item.currentUser.selfieUrl }}
                style={{ width: 50, height: 50, borderRadius: 100 }}
              />
              <View
                style={{
                  flex: 1,
                  paddingLeft: 10,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View>
                  <Text style={{ fontWeight: "bold", fontSize: 12 }}>
                    {item.currentUser.fullName}
                  </Text>
                  <Text style={{ fontSize: 12 }}>Just accepted your ride.</Text>
                </View>
                <Text style={{ fontSize: 10 }}>{date}</Text>
              </View>
            </View>
          );
        })}
        {filterData.length <= 0 && <EmptyList title={"No Notification yet"} />}
      </ScrollView>
    </View>
  );
};

export default NotificationContent;
