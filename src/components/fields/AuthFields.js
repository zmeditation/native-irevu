import * as React from "react";
import { Container, Content, Text, View } from "native-base";
import { StyleSheet, TouchableWithoutFeedback } from "react-native";

import { color, fonts } from "../../theme";
import { TextInput, Card } from "react-native-paper";
import moment from "moment";
import RichTextViewer from "./RichTextViewer";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: [
        {
          title: "USERNAME OR EMAIL ID",
          placeholder: "AndrewSabastian123@hotmail.com",
        },
        {
          title: "ENTER PASSWORD",
          placeholder: "ENTER PASSWORD",
        },
      ],
    };
  }

  render() {
    const { onChangeText, unique, editorvalue } = this.props;

    let show = true;

    if (editorvalue) {
      if (editorvalue.length === 0) {
        if (editorvalue[0].content.length === 0) {
          if (editorvalue[0].content[0].len === 0) {
            show = false;
          }
          // show = false
        }
      }
    }

    if (this.props.button) {
      const styleEditor = [
        {
          marginTop: 8,
          paddingHorizontal: editorvalue ? 3 : 13,
          paddingTop: editorvalue ? 0 : 22.5,
        },
        (!editorvalue || !show) && { height: 60 },
        editorvalue && { marginTop: 5 },
      ];
      return (
        <Card
          onPress={() => this.props.onPress && this.props.onPress()}
          elevation={0}
          style={styleEditor}
        >
          {!editorvalue || !show ? (
            <>
              <Text style={[{ opacity: 0.456 }, this.props.style]}>
                {this.props.value ? (
                  <>
                    {this.props.label + ": "}
                    <Text
                      style={{ color: color.blue, fontFamily: fonts.semibold }}
                    >
                      {moment(this.props.value).format(
                        this.props.type === "time" ? "hh:mm:ss A" : "DD/MM/YYYY"
                      )}
                    </Text>{" "}
                  </>
                ) : (
                  this.props.label
                )}
              </Text>
              {this.props.rightIcon && this.props.rightIcon}
            </>
          ) : (
            <RichTextViewer value={editorvalue} />
          )}
        </Card>
      );
    }

    if (this.props.uploadBtn) {
      const styleEditor = [
        {
          marginTop: 8,
          borderRadius: 10,
          paddingHorizontal: editorvalue ? 3 : 15,
          paddingTop: editorvalue ? 0 : 22.5,
        },
        (!editorvalue || !show) && { height: 60 },
        editorvalue && { marginTop: 5 },
      ];

      return (
        <Card
          onPress={() => this.props.onPress && this.props.onPress()}
          style={[this.props.style, styleEditor]}
        >
          <View style={styles.uploadBtnContainer}>
            <Text style={styles.uploadBtnText}>{this.props.value}</Text>
            <View style={styles.uploadBtnTextWrapper}>
              <Text style={styles.subText}>{this.props.subText}</Text>
              {this.props.rightIcon}
            </View>
          </View>
        </Card>
      );
    }

    return (
      <>
        <TextInput
          disabled={this.props.isDisabled || false}
          autoFocus={this.props.autoFocus}
          onChangeText={this.props.onChangeText || ""}
          defaultValue={this.props.defaultInputValue || ""}
          value={this.props.inputValue}
          style={[
            styles.container,
            {
              backgroundColor: this.props.backgroundColor
                ? this.props.backgroundColor
                : "white",
            },
            this.props.style,
          ]}
          autoCapitalize={"none"}
          maxLength={this.props.maxLength ? this.props.maxLength : 255}
          multiline={this.props.multiline}
          keyboardType={this.props.keyboardType}
          underlineColor={this.props.underLineColor || "#467DFF"}
          selectionColor={this.props.underLineColor || "#467DFF"}
          label={this.props.label}
          placeholderTextColor={"#467DFF"}
          placeholder={this.props.placeholder}
          theme={this.props.theme}
          render={this.props.render}
          editable={this.props.isEditable}
          numberOfLines={this.props.numOfLines || 1}
          right={
            <TextInput.Icon
              name={this.props.rightIcon}
              color={this.props.iconColor}
            />
          }
        />
        {this.props.error && (
          <Text style={styles.errorMessage}>{this.props.error}</Text>
        )}
      </>
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
  uploadBtnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  uploadBtnTextWrapper: {
    flexDirection: "row",
  },
  subText: {
    fontSize: 10,
    letterSpacing: 0.7,
    opacity: 0.2,
    marginRight: 10,
  },
  uploadBtnText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    letterSpacing: 0.7,
    color: color.primary,
    textTransform: "uppercase",
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
  errorMessage: {
    color: "#FF0000",
  },
});