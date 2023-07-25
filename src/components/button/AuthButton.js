import * as React from "react";
import { Button } from "react-native-material-ui";
import { fonts } from "../../theme";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Button
        style={{
          ...button,
          text: {
            ...button.text,
            marginRight: this.props.marginRightIcon
              ? this.props.marginRightIcon
              : 10,
          },
        }}
        raised
        primary
        onPress={() => (this.props.onPress ? this.props.onPress() : {})}
        icon={this.props.icon ? this.props.icon : null}
        iconSet={this.props.iconSet ? this.props.iconSet : "FontAwesome"}
        text={this.props.title ? this.props.title : "LOGIN"}
      />
    );
  }
}

const button = {
  container: {
    marginTop: 10,
    backgroundColor: "#467DFF",
    height: 45,
    borderRadius: 5,
    flexDirection: "row-reverse",
  },
  text: {
    fontSize: 18,
    fontFamily: fonts.regular,
    marginRight: 10,
    letterSpacing: 1.16,
  },
};
