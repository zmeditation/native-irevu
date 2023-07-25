import * as React from "react";
import {
  Text,
  View,
} from "native-base";
import {
  StyleSheet,
  TouchableNativeFeedbackComponent,
  TouchableOpacity,
  TextInput,
  InteractionManager,
} from "react-native";
import { fonts, color } from "../../theme";
import { Card, ActivityIndicator } from "react-native-paper";
import { userType, dummyImageUrl } from "../../utils/constants";
import FacePile from "../../components/community/react-native-face-pile";
import { strings, changeLaguage } from '../../translations/service';

let FACES = [];

class ClassFacePiles extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",

    };
  }

  componentWillMount() {
    const { class_id } = this.props;
    // InteractionManager.runAfterInteractions().then(() => {
    //   this.props.getClassStudents(class_id);
    // });
  }



  render() {
    // console.log("FACE PILE CLASS STUDENTS", this.props);
    const { students, clas, studentsList, user, enrollStudentHandler } = this.props;
    console.log(`render - studentsList`, studentsList)

    FACES = [];
    if (studentsList) {
      if (studentsList.length > 0) {
        studentsList.map((s, i) => {
          FACES.push({
            id: s.id,
            imageUrl: s.profile_image
              ? s.profile_image
              : dummyImageUrl,
          });
        });
      }
    }
    console.log("loading", this.props.loading);
    return (


      <>
        <Card style={styles.topcard}>
          <Text
            style={[
              styles.subtitle,
              { fontSize: 16, fontFamily: fonts.medium },
            ]}
          >
            {strings.students}
          </Text>
          <Text
            style={styles.headerTitle}

          >
            {strings.currently_enrolled}
          </Text>

          {studentsList.length < 0 ? (
            <View style={{ height: 46 }}>
              <ActivityIndicator size="small" color={color.blue} />
            </View>
          ) : (
            <>
              {studentsList && studentsList.length > 0 ? (
                <View>
                  <FacePile
                    clas={clas}
                    user={this.props.user}
                    circleSize={23}
                    numFaces={6}
                    faces={FACES}
                    isAddNew={
                      user.user_type === userType.teacher ? true : false
                    }
                    enrollStudentHandler={enrollStudentHandler}
                  />
                  {/* <TouchableOpacity>
                      <Text style={styles.viewAll}>View all</Text>
                    </TouchableOpacity> */}
                </View>
              ) : (
                <>
                  {user.user_type === userType.teacher && (<View>
                    <FacePile
                      clas={clas}
                      user={this.props.user}
                      circleSize={23}
                      numFaces={6}
                      faces={FACES}
                      isAddNew={
                        user.user_type === userType.teacher ? true : false
                      }
                      enrollStudentHandler={enrollStudentHandler}
                    />
                  </View>)}

                  <View style={{ height: 46 }}>
                    <Text
                      style={[
                        styles.subtitle,
                        { fontSize: 16, fontFamily: fonts.medium },
                      ]}
                    >
                      {strings.no_students_currently_enrolled}
                  </Text>
                  </View>
                </>
              )}
            </>
          )}
        </Card>
      </>
    );
  }
}

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getClassStudents } from "../../redux/actions/class";
import { Avatar } from "react-native-elements";
const mapStateToProps = (state) => ({
  user: state.auth.user,
  loading: state.classes.students_loading,
  students: state.classes.class_students,
});

const mapDispatchToProps = (dispatch) => ({
  getClassStudents: bindActionCreators(getClassStudents, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClassFacePiles);

const styles = StyleSheet.create({
  subtitle: {
    opacity: 0.4,
    color: color.dark,
    alignSelf: "center",
    fontFamily: fonts.medium,
    fontSize: 12,
    letterSpacing: 0.6,
    marginTop: 14,
  },
  headerTitle: {
    color: color.dark,
    opacity: 0.8,
    letterSpacing: 0.9,
    alignSelf: "center",
    fontFamily: fonts.medium,
    fontSize: 18,
    marginVertical: 3,
    marginBottom: 20,
  },
  container: {
    backgroundColor: "#F2F6FF",
    // alignItems: "center",
    // paddingHorizontal: "2.5%",
  },
  viewAll: {
    alignSelf: "center",
    textTransform: "uppercase",
    fontFamily: fonts.regular,
    color: color.primary,
    letterSpacing: 0.84,
    fontSize: 12,
    marginTop: 19,
    marginBottom: 14,
  },
  topcard: {
    width: "100%",
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 20,
    marginTop: 5,
    alignSelf: "center",
    height: 170,
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

});
