import {
  Image,
  ScrollView,
  Text,
  View,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import useCrudNotification from "../hooks/useCrudNotification";
import moment from "moment";
import { useSmokeContext } from "../utils/appContext";
import EmptyList from "./emptyList";
import React, { useState } from "react";

const NotificationContent = () => {
  const { data } = useCrudNotification(); // Assuming refetch is available
  const { currentUser } = useSmokeContext();
  const [refreshing, setRefreshing] = useState(false);

  const filterData = data.filter(
    (user) => user.transaction.currentUser.id === currentUser.id
  );

  const onRefresh = async () => {
    setRefreshing(true);
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#B80B00" style="light" />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filterData.length > 0 ? (
          filterData.map((item) => {
            const timeStamp = item.createdAt.toDate();
            const date = moment(timeStamp).fromNow();

            return (
              <View key={item.id} style={styles.notificationCard}>
                <Image
                  source={{ uri: item.currentUser.selfieUrl }}
                  style={styles.userImage}
                />
                <View style={styles.notificationContent}>
                  <View>
                    <Text style={styles.userName}>
                      {item.currentUser.firstName +
                        " " +
                        item.currentUser.lastName}
                    </Text>
                    <Text style={styles.notificationText}>
                      Just accepted your ride.
                    </Text>
                  </View>
                  <Text style={styles.notificationTime}>{date}</Text>
                </View>
              </View>
            );
          })
        ) : (
          <EmptyList title={"No Notification yet"} />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#B80B00",
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  notificationCard: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "white",
    shadowColor: "red",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  notificationContent: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "space-between",
  },
  userName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  notificationText: {
    fontSize: 12,
    color: "#555",
    marginTop: 3,
  },
  notificationTime: {
    fontSize: 10,
    color: "#777",
    alignSelf: "flex-end",
  },
});

export default NotificationContent;
