import * as React from "react";
import { Text, View } from "native-base";
import { StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import { fonts } from "../../theme";
import { Icons } from "..";
class ClassCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { clas, user } = this.props;

    return (
      <Card
        onPress={() => {
          this.props.navigation.navigate("ClassDetailView", { clas: clas });
        }}
        style={styles.container}
      >
        <View style={{ width: "80%", height: 28, justifyContent: "center" }}>
          <Text
            adjustsFontSizeToFit={true}
            allowFontScaling={true}
            numberOfLines={2}
            style={styles.heading}
          >
            {clas.name || ""}{" "}
            <Text style={{ fontSize: 14 }}>({clas.class_id})</Text>
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            adjustsFontSizeToFit={true}
            numberOfLines={1}
            style={styles.text}
          >
            {/* {'Aliquam Lobortis Interdum'} */}
          </Text>
          <View
            style={{
              width: 50,
              justifyContent: "center",
              alignItems: "center",
              top: -15,
            }}
          >
            <Icons.MaterialCommunityIcons
              name="account-group"
              size={25}
              color="rgba(70, 125, 255, 1)"
            />
            <Text
              adjustsFontSizeToFit={true}
              numberOfLines={1}
              style={[
                styles.text,
                {
                  textAlign: "center",
                  color: "rgba(70, 125, 255, 1)",
                  fontSize: 14,
                },
              ]}
            >
              {clas.studentCount ? clas.studentCount : 0}
            </Text>
          </View>
        </View>
      </Card>
    );
  }
}

import { connect } from "react-redux";
const mapStateToProps = (state) => ({
  user: state.auth.user,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ClassCard);

const styles = StyleSheet.create({
  container: {
    height: 90,
    width: "100%",
    marginVertical: 5,
    borderRadius: 10,
    padding: 15,
    justifyContent: "space-between",
  },
  heading: { fontFamily: fonts.medium, fontSize: 18 },
  text: { fontFamily: fonts.regular, fontSize: 14, width: "70%", opacity: 0.8 },
  timeremain: { fontFamily: fonts.semibold, color: "gray", opacity: 0.7 },
});
