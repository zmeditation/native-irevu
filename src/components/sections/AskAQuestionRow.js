import * as React from "react";
import {
  Dimensions,
  StyleSheet,
  TouchableNativeFeedbackComponent,
  TouchableOpacity,
} from "react-native";
// import { NotificationCard } from "../../";
import { Button } from "react-native-material-ui";
import { strings, changeLaguage } from '../../translations/service';

class AskAQuestion extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <View style={{ width: "94%", alignSelf: "center" }}>
        <Text style={styles.heading}>
          {this.props.text ? this.props.text : strings.ask_a_new_question}
        </Text>

        <Button
          onPress={() =>
            this.props.onPress ? this.props.onPress() : handleSubmit()
          }
          style={button}
          raised
          primary
          text={
            this.props.textButton ? this.props.textButton : strings.ask_a_new_question_capital
          }
        />
      </View>
    );
  }
}

const button = {
  container: {
    marginTop: 10,
    backgroundColor: "#467DFF",
    height: 45,
    borderRadius: 5,
  },
  text: {
    fontSize: 16,
    fontFamily: fonts.bold,
  },
};

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Avatar } from "react-native-elements";
import { View, Text } from "native-base";
import { fonts } from "../../theme";

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(AskAQuestion);

const styles = StyleSheet.create({
  heading: {
    fontSize: 23,
    fontFamily: fonts.medium,
    color: "#467DFF",
    textAlign: "center",
  },
});
