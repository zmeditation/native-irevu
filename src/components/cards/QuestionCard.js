import * as React from "react";
import { Text, View } from "native-base";
import { StyleSheet } from "react-native";
import { color, fonts } from "../../theme";
import { Card } from "react-native-paper";
import moment from "moment";
import { strings } from "../../translations/service";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { questionDetail } = this.props;
    const dateTime =
      moment(questionDetail.created_date).format("YYYY-MM-DD") +
      " " +
      questionDetail.remaining_time;
    return (
      <Card
        onPress={
          () =>
            this.props.navigation.navigate("FeedbackChat", {
              id: questionDetail.id,
              questionDetail,
            })
        }
        style={styles.container}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={styles.heading}>
            {(questionDetail && questionDetail.title) || ""}
          </Text>
          <Text style={styles.openBtn}>
            {(questionDetail && questionDetail.price) || ""}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text numberOfLines={3} style={styles.text}>
            {(questionDetail && questionDetail.subject) || ""}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingRight: 3,
            marginTop: 10,
          }}
        >
          <Text style={styles.timeremain}>
            {strings.time_remaining} : {dateTime}
          </Text>
          <Text style={styles.openBtn}>
            {(questionDetail && questionDetail.status) || ""}
          </Text>
        </View>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 21,
    justifyContent: "space-between",
  },
  heading: { fontFamily: fonts.medium, fontSize: 18, letterSpacing: 0.9 },
  text: {
    fontFamily: fonts.regular,
    fontSize: 14,
    opacity: 0.8,
    letterSpacing: 0.7,
    lineHeight: 18,
    textAlign: "left",
    marginTop: 3,
  },
  timeremain: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: "gray",
    opacity: 0.4,
    letterSpacing: 0.6,
    lineHeight: 18,
  },
  openBtn: {
    fontFamily: fonts.regular,
    fontSize: 12,
    letterSpacing: 0.84,
    color: color.primary,
  },
});
