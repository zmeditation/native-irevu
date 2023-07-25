import * as React from "react";
import { View } from "native-base";
import {
  StyleSheet,
} from "react-native";
import { fonts, color } from "../../theme";
import {
  Icons,
} from "../../components";
import { Card } from "react-native-paper";
import CNRichTextEditor, {
  CNToolbar,
  getInitialObject,
  getDefaultStyles,
} from "../../components/community/react-native-cn-richtext-editor";
import { SketchCanvas } from "@terrylinla/react-native-sketch-canvas";

const defaultStyles = getDefaultStyles();

export default class QuestionEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // value: "",
      selectedTag: "body",
      selectedStyles: [],
      value: [getInitialObject()],
    };
  }

  componentWillMount() {
    const { editorvalue } = this.props.route.params;
    if (editorvalue) {
      this.state.value = editorvalue;
    }
  }

  onStyleKeyPress = (toolType) => {
    this.editor.applyToolbar(toolType);
  };

  onSelectedTagChanged = (tag) => {
    this.setState({
      selectedTag: tag,
    });
  };

  onSelectedStyleChanged = (styles) => {
    this.setState({
      selectedStyles: styles,
    });
  };

  onValueChanged = (value) => {
    // const { onChangeQuestion } = this.props.route.params;
    // this.setState({
    //     value: value
    // });
    if (this.props.route.params) {
      this.props.route.params.onChangeQuestion(value);
    }
    this.state.value = value;
  };

  render() {
    return (
      <>
        <View style={styles.footer}>
          <Card elevation={0} style={styles.footerCard}>
            <CNToolbar
              style={{
                height: 30,
                borderRadius: 0,
                borderWidth: 0,
              }}
              selectedBackgroundColor={color.blue}
              selectedColor={"white"}
              iconSetContainerStyle={
                {
                  // flexGrow: 1,
                  // justifyContent: 'space-evenly',
                  // alignItems: 'center',
                }
              }
              size={20}
              iconSet={[
                {
                  type: "tool",
                  iconArray: [
                    {
                      toolTypeText: "bold",
                      buttonTypes: "style",
                      iconComponent: (
                        <Icons.MaterialIcons name="format-bold" size={5} />
                      ),
                    },
                  ],
                },
                {
                  type: "tool",
                  iconArray: [
                    {
                      toolTypeText: "italic",
                      buttonTypes: "style",
                      iconComponent: (
                        <Icons.MaterialIcons name="format-italic" size={5} />
                      ),
                    },
                  ],
                },
                {
                  type: "tool",
                  iconArray: [
                    {
                      toolTypeText: "underline",
                      buttonTypes: "style",
                      iconComponent: (
                        <Icons.MaterialIcons
                          name="format-underlined"
                          size={5}
                        />
                      ),
                    },
                  ],
                },
                {
                  type: "tool",
                  iconArray: [
                    {
                      toolTypeText: "lineThrough",
                      buttonTypes: "style",
                      iconComponent: (
                        <Icons.FontAwesome5 name="slash" size={5} />
                      ),
                    },
                  ],
                },

                {
                  type: "seperator",
                },
                // {
                //     type: 'tool',
                //     iconArray: [
                //         {
                //             toolTypeText: 'body',
                //             buttonTypes: 'tag',
                //             iconComponent:
                //                 <Text style={styles.toolbarButton}>
                //                     body
                //                     </Text>
                //         },
                //     ]
                // },
                {
                  type: "tool",
                  iconArray: [
                    {
                      toolTypeText: "ul",
                      buttonTypes: "tag",
                      iconComponent: (
                        <Icons.Octicons name="list-unordered" size={5} />
                      ),
                    },
                  ],
                },
                {
                  type: "tool",
                  iconArray: [
                    {
                      toolTypeText: "ol",
                      buttonTypes: "tag",
                      iconComponent: (
                        <Icons.Octicons name="list-ordered" size={5} />
                      ),
                    },
                  ],
                },
                {
                  type: "tool",
                  iconArray: [
                    {
                      toolTypeText: "image",
                      iconComponent: <Icons.Entypo name="image" size={5} />,
                    },
                  ],
                },
              ]}
              selectedTag={this.state.selectedTag}
              selectedStyles={this.state.selectedStyles}
              onStyleKeyPress={this.onStyleKeyPress}
            />
          </Card>
        </View>

        <Card elevation={0} style={{ flex: 1 }}>
          <CNRichTextEditor
            ref={(input) => (this.editor = input)}
            onSelectedTagChanged={this.onSelectedTagChanged}
            onSelectedStyleChanged={this.onSelectedStyleChanged}
            value={this.state.value}
            style={{ backgroundColor: "transparent", flex: 1, width: "100%" }}
            styleList={defaultStyles}
            onValueChanged={this.onValueChanged}
          />

          {this.state.pencil && (
            <SketchCanvas
              style={{ flex: 1, position: "absolute" }}
              touchEnabled={true}
              strokeColor={"red"}
              strokeWidth={7}
            />
          )}
        </Card>
      </>
    );
  }
}

const styles = StyleSheet.create({
  footer: { backgroundColor: "transparent", height: 70, width: "100%" },
  footerCard: {
    backgroundColor: "white",
    width: "100%",
    marginTop: 10,
    height: 50,
    paddingTop: 10,
  },
  divider: {
    width: 100,
    height: 1,
    backgroundColor: "gray",
    alignSelf: "center",
    opacity: 0.3,
    marginBottom: 10,
  },
  dividertransparent: {
    width: 100,
    height: 1,
    backgroundColor: "gray",
    alignSelf: "center",
    opacity: 0,
    marginBottom: 10,
  },

  full_name: {
    fontFamily: fonts.semibold,
    color: "black",
    fontSize: 25,
    opacity: 0.75,
  },
  morning: { fontFamily: fonts.semibold, color: "gray", fontSize: 17 },
  greetingCon: {
    width: "96%",
    backgroundColor: "white",
    alignSelf: "center",
    borderRadius: 10,
    alignItems: "center",
    padding: 20,
  },
  container: {
    backgroundColor: "#F2F6FF",
    // alignItems: "center",
    paddingHorizontal: "1.5%",
  },
  heading: {
    fontSize: 23,
    fontFamily: fonts.medium,
    color: "#467DFF",
    textAlign: "center",
  },
  searchMainCon: {
    width: "95%",
    alignSelf: "center",
    marginVertical: 10,
    height: 50,
    backgroundColor: "white",
    borderRadius: 15,
    flexDirection: "row",
  },
  searchIconCon: {
    flex: 0.35,
    justifyContent: "center",
    alignItems: "center",
  },
  searchTextinputCon: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: "black",
  },
  degree: { opacity: 0.2, fontSize: 12, fontFamily: fonts.regular },
  title: { fontFamily: fonts.regular, fontSize: 18 },
  subText: { fontFamily: fonts.regular, fontSize: 14 },
});
