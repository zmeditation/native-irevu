import * as React from "react";
import {
  Container,
  Content,
  Text,
  View,
  Header,
  Left,
  Body,
  Title,
  Right,
  Footer,
} from "native-base";
import { StyleSheet, TouchableOpacity } from "react-native";
import DropdownAlert from "react-native-dropdownalert";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { Card, ActivityIndicator } from "react-native-paper";
import Modal from "react-native-modal";
import { Button } from "react-native-material-ui";
import { Formik } from "formik";
import * as yup from "yup";
import { fonts, color } from "../../theme";
import { Icons, AuthFields, AuthButton } from "../../components";
import Loader from "../../components/Loader";
import { strings, changeLaguage } from '../../translations/service';

const validation = yup.object().shape({
  title: yup.string().required(),
});

class CreateHomework extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      username: "",
      text: "",
      titleValue: "",
      fields: [
        {
          label: strings.title_capital,
          placeHodler: "Homework Title",
          key: "title",
          type: "text",
        },
        {
          label: strings.description_capital,
          placeHodler: "DESCRIPTION",
          key: "description",
          type: "editor",
        },
        // {
        //   label: "COURSE ID",
        //   placeHodler: "COURSE ID",
        //   key: "course",
        //   type: "dropdown",
        //   rightIcon: (
        //     <Icons.AntDesign
        //       name="caretdown"
        //       size={14}
        //       style={{ position: "absolute", right: 10, color: color.primary }}
        //     />
        //   ),
        // },
        {
          label: strings.deadline_date_capital,
          placeHodler: "DEADLINE DATE",
          key: "date",
          type: "date",
          rightIcon: (
            <Icons.AntDesign
              name="calendar"
              size={14}
              style={{ position: "absolute", right: 10, color: color.primary }}
            />
          ),
        },
        {
          label: strings.deadline_time_capital,
          placeHodler: "DEADLINE TIME",
          key: "deadline",
          type: "time",
          rightIcon: (
            <Icons.AntDesign
              name="clockcircleo"
              size={14}
              style={{ position: "absolute", right: 10, color: color.primary }}
            />
          ),
        },
        {
          label: strings.overtime_capital,
          placeHodler: "Overtime",
          key: "overtime",
          type: "time",
          rightIcon: (
            <Icons.AntDesign
              name="clockcircleo"
              size={14}
              style={{ position: "absolute", right: 10, color: color.primary }}
            />
          ),
        },
      ],
      validations: [
        { key: "date", error: "Deadline Date" },
        { key: "deadline", error: "Deadline Time" },
        { key: "overtime", error: "Overtime" },
        { key: "editorvalue", error: "Description" },
        // { key: 'course', error: 'course' }
      ],
      modal: false,
      type: false,
      course: "",
      courseList: [
        { title: "LOREM IPSUM", label: "LOREM IPSUM", value: "LOREM IPSUM" },
        { title: "LOREM IPSUM", label: "LOREM IPSUM", value: "LOREM IPSUM" },
        { title: "LOREM IPSUM", label: "LOREM IPSUM", value: "LOREM IPSUM" },
      ],
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.createdHomework !== this.props.createdHomework) {
      this.setState({ isLoading: false });
      this.props.navigation.navigate("ClassDetailView");
    }

    if (nextProps.homeworkError !== this.props.homeworkError) {
      this.setState({ isLoading: false });
    }
  }

  onChangeQuestion = (text) => {
    console.log("onChangeQuestion TEXT", text);
    this.setState({
      editorvalue: text,
    });
  };

  handleSubmit = (form) => {
    console.log("HANDLE SUBMIT FORM", form);
    console.log("HANDLE SUBMIT FORM", this.state);

    let error = "";

    this.state.validations.map((value, index) => {
      if (!this.state[value.key]) {
        if (error !== "") {
          error += ", ";
        }

        error += value.error;
      }
    });

    if (this.state.deadline > this.state.overtime) {
      alert(strings.overtime_alert);
      return;
    }

    if (error !== "") {
      alert(strings.missing_values_alert + error);
      return;
    }

    if (!this.state.editorvalue) {
      alert(strings.description_missing_alert);
      return;
    }

    if (!this.state.titleValue) {
      alert(strings.title_missing_alert);
      return;
    }

    // this.state.validations.map((value, index) => {
    //   form[value.key] = this.state[value.key];
    // });

    const { clas } = this.props.route.params;

    form = {
      title: this.state.titleValue,
      description: this.state.editorvalue,
      deadline_date: moment(this.state.date).format("DD/MM/YYYY"),
      deadline_time: moment(this.state.deadline).format("hh:mm A"),
      overtime: moment(this.state.overtime).format("hh:mm A"),
      class_id: clas.class_id,
    };

    this.setState({ isLoading: true });
    this.props.createHomework(this, form);
  };

  header = () => {
    const { clas } = this.props.route.params;
    return (
      <Header style={{ backgroundColor: "white" }}>
        <Left>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Icons.Entypo
              name="chevron-left"
              color="black"
              size={30}
              style={{ marginLeft: 0 }}
            />
          </TouchableOpacity>
        </Left>
        <Body style={{ minWidth: "50%" }}>
          <Title style={styles.headerTitle}>{strings.classes}</Title>
          <Text style={styles.subtitle}>{clas.title}</Text>
        </Body>
        <Right style={{ maxWidth: "20%" }}></Right>
      </Header>
    );
  };

  loaderHandler = (status) => {
    this.setState({ isLoading: status });
  };

  theme = {
    colors: {
      text: color.dark,
      placeholder: color.lightblue,
      primary: color.lightblue,
    },
  };

  render() {
    return (
      <>
        <Container style={styles.container}>
          <Modal
            isVisible={this.state.type}
            onBackdropPress={() => this.setState({ type: false })}
          >
            <View style={styles.modalMainCon}>
              <Text style={styles.modalSelect}>{strings.select_your_course}</Text>
              {this.state.courseList.map((item) => {
                return (
                  <Button
                    raised
                    primary
                    text={item.title}
                    style={buttonQ}
                    onPress={() =>
                      this.setState({ course: item.value, type: false })
                    }
                  />
                );
              })}
            </View>
          </Modal>
          <Content padder>
            {false && <Loader isLoading={true} />}
            <Formik
              onSubmit={(form) => {
                this.handleSubmit(form);
              }}
              validationSchema={validation}
              initialValues={{ email: "", password: "" }}
            >
              {({ values, handleChange, handleSubmit, touched, errors }) => (
                <>
                  <Text style={styles.headerTitle}>{strings.create_a_homework}</Text>

                  {this.state.fields.map((field, index) => {
                    if (field.type === "text") {
                      return (
                        <AuthFields
                          onChangeText={(value) => {
                            this.setState({ titleValue: value });
                          }}
                          key={index + "_homework_add"}
                          unique={field.key}
                          keyboardType={"default"}
                          key={field.key}
                          label={field.label}
                          underLineColor={color.light}
                          theme={this.theme}
                          style={{
                            backgroundColor: color.light,
                            fontSize: 12,
                            color: color.primary,
                          }}
                        />
                      );
                    }

                    if (field.type === "dropdown") {
                      return (
                        <>
                          <AuthFields
                            rightIcon={field.rightIcon}
                            type={field.type}
                            value={this.state.course || ""}
                            key={index + "_homework_add"}
                            editorvalue={false}
                            onPress={() =>
                              this.setState({
                                type: true,
                              })
                            }
                            button
                            unique={"sdasdas"}
                            keyboardType={"default"}
                            key={"login"}
                            label={field.label}
                            placeholder={field.placeHodler}
                            style={styles.btnInput}
                          />
                        </>
                      );
                    }

                    if (field.type === "editor") {
                      return (
                        <>
                          {/* {this.state.editorvalue && (
                            <Text style={styles.subtitle}>DESCRIPTION</Text>
                          )} */}
                          <AuthFields
                            key={index + "_homework_add"}
                            // editorvalue={this.state.editorvalue}
                            onPress={() =>
                              this.props.navigation.navigate("TextEditor", {
                                onSaveHandler: this.onChangeQuestion,
                                goBackNav: "CreateHomework",
                                editorvalue: this.state.editorvalue || "",
                                loaderHandler: this.loaderHandler,
                              })
                            }
                            button
                            unique={"sdasdas"}
                            keyboardType={"default"}
                            key={"login"}
                            label={field.label}
                            placeholder={field.placeHodler}
                            style={styles.btnInput}
                          />
                        </>
                      );
                    }

                    if (field.type === "date") {
                      return (
                        <>
                          <AuthFields
                            rightIcon={field.rightIcon}
                            type={field.type}
                            value={this.state[field.key]}
                            key={index + "_homework_add"}
                            editorvalue={false}
                            onPress={() =>
                              this.setState({
                                picker: true,
                                mode: field.type,
                                key: field.key,
                              })
                            }
                            button
                            unique={"sdasdas"}
                            keyboardType={"default"}
                            key={"login"}
                            label={field.label}
                            placeholder={field.placeHodler}
                            style={styles.btnInput}
                          />
                        </>
                      );
                    }

                    if (field.type === "time") {
                      return (
                        <>
                          <AuthFields
                            rightIcon={field.rightIcon}
                            type={field.type}
                            value={this.state[field.key]}
                            key={index + "_homework_add"}
                            editorvalue={false}
                            onPress={() =>
                              this.setState({
                                picker: true,
                                mode: field.type,
                                key: field.key,
                              })
                            }
                            button
                            unique={"sdasdas"}
                            keyboardType={"default"}
                            key={"login"}
                            label={field.label}
                            placeholder={field.placeHodler}
                            style={styles.btnInput}
                          />
                        </>
                      );
                    }
                  })}
                </>
              )}
            </Formik>
          </Content>
          <Footer
            style={{
              backgroundColor: color.bg,
              marginBottom: 20,
              elevation: 0,
              color: color.bg,
            }}
          >
            {this.state.loading ? (
              <View style={[button.container, { justifyContent: "center" }]}>
                <ActivityIndicator size="small" color="white" />
              </View>
            ) : (
              <View style={{ width: "90%", backgroundColor: color.bg }}>
                <AuthButton
                  marginRightIcon={0.1}
                  title={strings.create_a_homework_capital}
                  icon="add"
                  iconSet="MaterialIcons"
                  onPress={() => this.handleSubmit()}
                />
              </View>
              // <Button
              //   onPress={() => handleSubmit()}
              //   icon="add"
              //   iconSet="MaterialIcons"
              //   style={button}
              //   raised
              //   primary
              //   text={"CREATE HOMEWORK"}
              // />
            )}
          </Footer>
          <DateTimePickerModal
            minimumDate={
              this.state.key === "date"
                ? new Date()
                : this.state.date
                  ? this.state.date
                  : new Date()
            }
            date={this.state.date ? this.state.date : new Date()}
            isVisible={this.state.picker}
            mode={this.state.mode}
            onConfirm={this.handleConfirm}
            onCancel={this.hideDatePicker}
          />

          <DropdownAlert
            ref={(ref) => (this.dropDownAlertRef = ref)}
            zIndex={11111111}
          />
        </Container>
      </>
    );
  }

  handleConfirm = (date) => {
    this.state[this.state.key] = date;

    if (this.state.key === "date") {
      if (this.state.deadline) {
        let time = this.state.deadline;
        this.state.deadline = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          time.getHours(),
          time.getMinutes(),
          time.getSeconds()
        );
      }

      if (this.state.deadline) {
        let time = this.state.deadline;
        this.state.deadline = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          time.getHours(),
          time.getMinutes(),
          time.getSeconds()
        );
      }

      if (this.state.overtime) {
        let time = this.state.overtime;
        this.state.overtime = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          time.getHours(),
          time.getMinutes(),
          time.getSeconds()
        );
      }
    }

    this.setState({
      picker: false,
    });
  };

  hideDatePicker = () => {
    this.setState({
      picker: false,
    });
  };
}

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { createHomework } from "../../redux/actions/homework";

const mapStateToProps = (state) => ({
  user: state.auth.user,
  createdHomework: state.homework.createdHomework,
  homeworkError: state.homework.homeworkError,
});

const mapDispatchToProps = (dispatch) => ({
  createHomework: bindActionCreators(createHomework, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateHomework);

const button = {
  container: {
    backgroundColor: color.primary,
    height: 50,
    width: "100%",
    marginTop: 30,
    borderRadius: 5,
  },
  text: {
    fontSize: 16,
    fontFamily: fonts.regular,
  },
};

const styles = StyleSheet.create({
  divider: {
    width: 100,
    height: 1,
    backgroundColor: "gray",
    alignSelf: "center",
    opacity: 0.3,
    marginVertical: 15,
  },

  subtitle: {
    opacity: 0.5,
    color: "black",
    fontFamily: fonts.regular,
    fontSize: 12,
    marginTop: 10,
  },
  headerTitle: {
    color: color.blue,
    alignSelf: "center",
    fontFamily: fonts.medium,
    fontSize: 25,
  },
  container: {
    backgroundColor: "#F2F6FF",
    // alignItems: "center",
    paddingHorizontal: "1.5%",
  },
  topcard: {
    width: "100%",
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 20,
    marginTop: 20,
    alignSelf: "center",
  },
  profile: { justifyContent: "center", marginLeft: 10 },
  profileName: {
    fontFamily: fonts.regular,
    fontSize: 14,
    top: 5,
  },
  degreeName: {
    fontSize: 14,
    fontFamily: fonts.regular,
    opacity: 0.2,
    bottom: 0,
  },
  gradesTitle: {
    fontSize: 12,
    fontFamily: fonts.regular,
    textAlign: "right",
  },
  grades: {
    opacity: 0.8,
    fontFamily: fonts.regular,
    fontSize: 23,
    color: "#467DFF",
  },
  serviceText: {
    color: "#467DFF",
    fontSize: 14,
    fontFamily: fonts.medium,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: "5%",
  },
  modalHeaderTitle: { fontSize: 29, fontFamily: fonts.medium },
  bodyRows: {
    backgroundColor: "#dce7ff",
    width: "100%",
    flexDirection: "row",
    padding: 20,
    justifyContent: "space-between",
  },
  btnInput: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: color.primary,
    opacity: 1,
  },
  modalSelect: {
    textAlign: "center",
    fontSize: 20,
    fontFamily: fonts.medium,
    marginBottom: 10,
    letterSpacing: 1,
  },
  modalMainCon: {
    backgroundColor: "white",
    alignItems: "center",
    padding: 20,
    paddingBottom: 30,
    borderRadius: 5,
  },
});

const buttonQ = {
  container: {
    marginTop: 10,
    borderColor: "#467DFF",
    height: 45,
    flexDirection: "row-reverse",
    backgroundColor: "white",
    borderWidth: 1,
    width: "100%",
    borderRadius: 5,
  },
  text: {
    fontSize: 14,
    fontFamily: fonts.medium,
    // marginRight: 10,
    textAlign: "center",
    color: "#467DFF",
    textTransform: "uppercase",
  },
};
