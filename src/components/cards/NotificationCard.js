import * as React from "react";
import { Text, View } from "native-base";
import { StyleSheet } from "react-native";
import { fonts } from "../../theme";
import { Card } from "react-native-paper";
import { Avatar } from "react-native-material-ui";
import moment from "moment";

export default class NotificationCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { noti } = this.props;
    return (
      <Card onPress={() => {}} style={styles.container}>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <Avatar style={{ width: 100, height: 100 }} />
          <View style={styles.body}>
            <Text
              numberOfLines={1}
              style={[styles.timeremain, { fontSize: 13 }]}
            >
              {noti.label}
            </Text>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit={true}
              style={[styles.timeremain, { color: "rgba(70, 125, 255, 1)" }]}
            >
              {noti.username}
            </Text>

            <Text style={[styles.timeremain, { color: "black", fontSize: 16 }]}>
              {noti.description}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingRight: 3,
            alignItems: "flex-end",
            marginTop: 10,
          }}
        >
          <Text style={[styles.timeremain, { fontSize: 16 }]}>
            {moment(noti.createdAt).format("hh:mm A - DD/MM/YYYY")}
          </Text>
        </View>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    flex: 20,
    // flexDirection: "row",
    // borderWidth: 1,
    width: "100%",
  },
  container: {
    // height: 130,
    width: "100%",
    marginVertical: 5,
    borderRadius: 10,
    padding: 10,
    flexDirection: "row",
  },
  heading: { fontFamily: fonts.medium, fontSize: 21 },
  text: { fontFamily: fonts.semibold, fontSize: 15, opacity: 0.5 },
  timeremain: {
    fontFamily: fonts.regular,
    fontSize: 22,
    color: "gray",
    opacity: 0.7,
  },
});
