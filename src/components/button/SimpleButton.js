import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { fonts, color } from "../../theme";

class SimpleButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableOpacity
        style={this.props.containerStyle || styles.defaultContainer}
        onPress={() => this.props.buttonPressHandler()}
      >
        <Text style={this.props.textStyle || styles.defaultBtnText}>
          {" "}
          {this.props.text || ""}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  defaultContainer: {
    width: "90%",
    backgroundColor: color.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  defaultBtnText: {
    color: color.light,
    textTransform: "uppercase",
    fontFamily: fonts.primary,
  },
});

export default SimpleButton;
