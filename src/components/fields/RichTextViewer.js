import * as React from "react";
import { View } from "native-base";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { fonts, color } from "../../theme";
import CNRichTextEditor from "../../components/community/react-native-cn-richtext-editor";
// import { BlurView, VibrancyView } from "@react-native-community/blur";

export default class RichTextViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      more: false,
    };
  }

  render() {
    const { value } = this.props;

    return (
      <View style={[!this.state.more && { height: 90, overflow: "hidden" }]}>
        <CNRichTextEditor
          ref={(input) => (this.editor = input)}
          value={"asdasdads"}
          style={{
            color: color.dark,
            backgroundColor: "#fff",
            flex: 1,
            width: "100%",
            position: !this.state.more ? "absolute" : "relative",
          }}
          onValueChanged={() => {}}
        />
       
        {!this.state.more ? (
          <TouchableOpacity
            onPress={() => this.setState({ more: !this.state.more })}
            style={{
              width: "100%",
              height: 25,
              position: "absolute",
              bottom: 0,
            }}
          >
            <View
              style={{
                width: "100%",
                height: 25,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(255,255,255,.9)",
              }}
            >
              <Text
                style={{
                  color: color.blue,
                  fontFamily: fonts.semibold,
                  fontSize: 14,
                  marginTop: 5,
                }}
              >
                READ FULL
              </Text>
            </View>
            {/* <BlurView
              style={{
                width: "100%",
                height: 40,
                justifyContent: "center",
                alignItems: "center",
              }}
              blurType="light"
              blurAmount={2}
              reducedTransparencyFallbackColor="white"
            >
              
            </BlurView> */}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => this.setState({ more: !this.state.more })}
            style={{
              width: "100%",
              height: 40,
              bottom: 0,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: color.blue,
                fontFamily: fonts.semibold,
                fontSize: 14,
              }}
            >
              VIEW LESS
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: "100%",
    marginTop: 10,
    color: "#467DFF",
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: "center",
    marginBottom: 20,
  },
  heading: { fontFamily: fonts.semibold, textAlign: "center", opacity: 0.7 },
  semiheading: {
    fontFamily: fonts.semibold,
    textAlign: "center",
    fontSize: 20,
    opacity: 0.8,
  },
});

// export default withTheme(Login);
