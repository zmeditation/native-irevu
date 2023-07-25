import * as React from "react";
import { Container, Content, Text, View } from "native-base";
import {
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Modal from "react-native-modal";
import DropdownAlert from "react-native-dropdownalert";
import { Button } from "react-native-material-ui";
import * as yup from "yup";
import { userType } from "../../utils/constants";
import { fonts, color } from "../../theme";
import Loader from "../../components/Loader";
import { MyClasses, Icons, AuthFields } from "../../components";
import ScanQrCode from "../../components/QrCodeScanner";
import { strings } from '../../translations/service';

const validation = yup.object().shape({
  title: yup.string().min(10),
});

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      className: "",
      enrollClassId: "",
      classesDetails: [],
      showModal: false,
      isLoading: true,
      isScan: false,
    };
  }

  getClassLists = () => {
    this.props.getClassesLists(this);
  };

  componentDidMount() {
    this.props.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => this.setState({ showModal: true, isScan: false })}
        >
          <Icons.Entypo
            name="plus"
            color="black"
            size={30}
            style={{ marginRight: 10 }}
          />
        </TouchableOpacity>
      ),
    });

    this.getClassLists();
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.newClassDetails !== this.props.newClassDetails &&
      Object.keys(nextProps.newClassDetails).length > 0
    ) {
      this.setState({
        classesDetails: this.state.classesDetails.concat(
          nextProps.newClassDetails
        ),
        isLoading: false,
      });

      this.scannerStatusHandler(false);
    }

    if (nextProps.classesLists !== this.props.classesLists) {
      this.setState({
        classesDetails: nextProps.classesLists,
        isLoading: false,
      });

      this.scannerStatusHandler(false);
    }

    if (nextProps.classError !== this.props.classError) {
      this.setState({ isLoading: false });

      this.scannerStatusHandler(false);
    }
  }

  handleCreateClass = () => {
    if (this.state.className !== "") {
      this.props.createClass(this, this.state.className);
      this.setState({ showModal: false, isLoading: true, className: "" });
    }
  };

  handleEnrollClass = () => {
    if (this.state.enrollClassId !== "") {
      this.props.enrollClassByClassId(this, this.state.enrollClassId);
      this.setState({ showModal: false, isLoading: true, enrollClassId: "" });
      this.scannerStatusHandler(false);
    }
  };

  handleClassSubmit = () => {
    const { user } = this.props;

    if (user.user_type === userType.student) {
      this.handleEnrollClass();
    } else {
      this.handleCreateClass();
    }
  };

  scannerStatusHandler = (status) => {
    this.setState({ isScan: status, showModal: false });
  };

  scannerHandler = (evt) => {
    this.setState({ enrollClassId: evt.data });

    this.handleClassSubmit();
  };

  addButton = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.setState({ showModal: true, isScan: false });
        }}
        style={{
          height: 40,
          width: 180,
          borderRadius: 50,
          alignSelf: "center",
          marginTop: 10,
          marginBottom: "20%",
          backgroundColor: color.primary,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "white", fontFamily: fonts.semibold }}>
          {" "}
          {strings.add_class_capital}
        </Text>
        <Icons.Entypo
          name="plus"
          color="white"
          size={25}
          style={{ position: "absolute", left: 25 }}
        />
      </TouchableOpacity>
    );
  };

  render() {
    const { hour, username } = this.state;
    const { user } = this.props;

    return (
      <Container style={styles.container}>
        <Content showsVerticalScrollIndicator={false} padder>
          {this.state.isLoading && <Loader isLoading={true} />}
          {!this.state.isScan && this.state.classesDetails && (
            <MyClasses
              navigation={this.props.navigation}
              classesDetails={this.state.classesDetails}
            />
          )}

          {this.state.isScan && (
            <ScanQrCode
              scannerStatusHandler={this.scannerStatusHandler}
              scannerHandler={this.scannerHandler}
            />
          )}
        </Content>

        <View style={{ backgroundColor: "white", paddingBottom: "2%" }}>
          {this.addButton()}
        </View>
        {this.state.showModal && (
          <Modal isVisible={this.state.showModal}>
            {user.user_type === userType.student ? (
              <View
                key={"DialogComponent joinClass"}
                style={styles.mainContainer}
              >
                {/* <Text
                  style={{
                    textAlign: "center",
                    fontSize: 20,
                    fontFamily: fonts.semibold,
                  }}
                >
                  Enroll in a Class
                </Text> */}

                <View style={styles.headingContainer}>
                  <Text style={[styles.modalTitle, { marginRight: "5%" }]}>
                    {strings.enroll_in_a_class}
                  </Text>
                  <TouchableOpacity
                    style={{ marginBottom: "1%" }}
                    onPress={() => this.setState({ showModal: false })}
                  >
                    <Icons.FontAwesome
                      name="close"
                      style={styles.closeIcon}
                    ></Icons.FontAwesome>
                  </TouchableOpacity>
                </View>

                <>
                  <AuthFields
                    autoFocus
                    keyboardType={"default"}
                    key={0 + "name"}
                    inputValue={this.state.enrollClassId || ""}
                    label={"ENTER CLASS ID"}
                    isEditable={true}
                    backgroundColor="#E9EFFD"
                    style={{
                      backgroundColor: color.bg,
                      width: "90%",
                      marginBottom: "5%",
                      alignSelf: "center",
                      textTransform: "uppercase",
                    }}
                    onChangeText={(value) =>
                      this.setState({ enrollClassId: value })
                    }
                  />
                </>
                <View style={styles.horizontalHrContainer}>
                  <View style={styles.leftHr} />
                  <View>
                    <Text style={styles.middleHrText}>{strings.or}</Text>
                  </View>
                  <View style={styles.rightHr} />
                </View>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 20,
                    fontFamily: fonts.regular,
                    opacity: 0.6,
                  }}
                >
                  {strings.scan_a_qr_code_capital}
                </Text>

                <Button
                  style={buttonNormal}
                  icon="camera"
                  iconSet="font-awesome"
                  raised
                  primary
                  text={"SCAN"}
                  onPress={() => this.scannerStatusHandler(true)}
                />
              </View>
            ) : (
              <View
                key={"DialogComponent CreateClass"}
                style={styles.mainContainer}
              >
                <View style={styles.headingContainer}>
                  <Text style={styles.modalTitle}>{strings.create_a_class}</Text>
                  <TouchableOpacity
                    style={{ marginBottom: "1%" }}
                    onPress={() => this.setState({ showModal: false })}
                  >
                    <Icons.FontAwesome
                      name="close"
                      style={styles.closeIcon}
                    ></Icons.FontAwesome>
                  </TouchableOpacity>
                </View>

                {this.state.showModal && (
                  <>
                    <AuthFields
                      autoFocus
                      keyboardType={"default"}
                      key={0 + "name"}
                      inputValue={this.state.className || ""}
                      label={"NAME OF CLASS"}
                      isEditable={true}
                      backgroundColor="#E9EFFD"
                      style={{
                        backgroundColor: color.bg,
                        width: "90%",
                        marginBottom: "5%",
                        alignSelf: "center",
                      }}
                      onChangeText={(value) =>
                        this.setState({ className: value })
                      }
                    />
                  </>
                )}
              </View>
            )}
            <Button
              onPress={() => this.handleClassSubmit()}
              style={button}
              icon="add"
              raised
              primary
              text={
                user.user_type === userType.student
                  ? "ENROLL CLASS"
                  : "CREATE CLASS"
              }
            />
          </Modal>
        )}

        <DropdownAlert
          ref={(ref) => (this.dropDownAlertRef = ref)}
          zIndex={11111111}
        />
      </Container>
    );
  }
}

const buttonNormal = {
  container: {
    marginTop: 10,
    backgroundColor: "#467DFF",
    height: 45,
    width: "90%",
    marginBottom: "5%",
    alignSelf: "center",
  },
  text: {
    fontSize: 16,
    fontFamily: fonts.bold,
  },
};

const button = {
  container: {
    marginTop: "3%",
    backgroundColor: "#467DFF",
    height: 45,
  },
  text: {
    fontSize: 16,
    fontFamily: fonts.medium,
  },
};

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  createClass,
  getUserClasses,
  getClassesLists,
  enrollClassByClassId,
} from "../../redux/actions/class";

const mapStateToProps = (state) => ({
  user: state.auth.user,
  classes: state.classes.classes,
  classesLists: state.classes.classesLists,
  newClassDetails: state.classes.newClassDetails,
  classError: state.classes.classError,
});

const mapDispatchToProps = (dispatch) => ({
  createClass: bindActionCreators(createClass, dispatch),
  getUserClasses: bindActionCreators(getUserClasses, dispatch),
  getClassesLists: bindActionCreators(getClassesLists, dispatch),
  enrollClassByClassId: bindActionCreators(enrollClassByClassId, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);

const styles = StyleSheet.create({
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
  mainContainer: { backgroundColor: color.light, padding: 0, borderRadius: 5 },
  container: {
    backgroundColor: "#F2F6FF",
  },
  headingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: "5%",
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: fonts.medium,
    color: color.dark,
    letterSpacing: 1,
    width: "80%",
    paddingLeft: "18%",
  },
  closeIcon: {
    fontSize: 20,
    color: color.dark,
    fontFamily: fonts.regular,
  },

  horizontalHrContainer: {
    flexDirection: "row",
    justifyContent: "center",

    alignItems: "center",
    width: "72%",
    marginLeft: "14%",
    marginBottom: "4%",
  },
  leftHr: {
    flex: 1,
    height: 1,
    backgroundColor: color.lightGray,
  },
  middleHrText: { width: 50, textAlign: "center", color: color.dark },
  rightHr: { flex: 1, height: 1, backgroundColor: color.lightGray },
});
