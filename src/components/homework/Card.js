import * as React from "react";
import { Text, View, Row, Col } from "native-base";
import { StyleSheet, TouchableOpacity } from "react-native";
import moment from "moment";
import { Card } from "react-native-paper";
import { fonts, color } from "../../theme";
import { userType } from "../../utils/constants";
import HtmlViewer from "../../components/HtmlViewer";
import { strings } from "../../translations/service";

class CurrentHomeworkCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      isLoading: false,
    };
  }

  renderViewMore(onPress) {
    return (
      <Text
        style={{ color: color.blue, fontFamily: fonts.semibold, opacity: 0.7 }}
        onPress={onPress}
      >
        {strings.view_more}
      </Text>
    );
  }

  renderViewLess(onPress) {
    return (
      <Text
        style={{ color: color.blue, fontFamily: fonts.semibold, opacity: 0.7 }}
        onPress={onPress}
      >
        {strings.view_less}
      </Text>
    );
  }

  submitMethod = async (homeworkSubmissionStatus) => {
    const { currentHomeWork, clas, user } = this.props;

    const homeworkDetail = {
      class_id: clas.id,
      homework_id: currentHomeWork.id,
      submitted: false,
    };

    if (user.user_type === userType.teacher) {
      this.props.navigation.navigate("HomeworkInformation", {
        homework: currentHomeWork,
        clas: clas,
        homeworkSubmissionStatus: homeworkSubmissionStatus,
      });
    } else {
      this.setState({ isLoading: true });
      this.props.getSavedHomeworkDetails(homeworkDetail).then((homeworkRes) => {
        this.setState({ isLoading: false });
        if (homeworkRes.status === 200) {
          this.props.navigation.navigate("HomeworkSubmission", {
            homework: currentHomeWork,
            clas: clas,
            homeworkSubmissionStatus: homeworkSubmissionStatus,
            savedHomeworkDetail: homeworkRes.data.output.homework_details
              ? homeworkRes.data.output.homework_details.homework_details
              : "",
          });
        } else {
          console.log("ELSE ==>>");
        }
      });
    }
  };

  top = () => {
    const { homework, currentHomeWork, user } = this.props;

    const dayDate = moment();
    const deadlinedate = moment(currentHomeWork.deadline_date, "DD/MM/YYYY");
    // console.log("dead line date", deadlinedate)
    // console.log("today date", deadlinedate)

    const remainingDay = deadlinedate.diff(dayDate, "days");

    // const current = moment(new Date()).format('DD/MM/YYYY');
    // const deadline = moment(currentHomeWork.deadline_date).format('DD/MM/YYYY');

    // const remainingDateLable = remainingDay == 0 ? "Todays" : ""
    // const dateDiff = moment(current).diff(deadline, 'days');
    // console.log({ current }, { deadline }, { dateDiff })
    // var duration = moment.duration(dateDiff);

    // console.log(moment(current).to(moment(deadline)))

    // console.log({ duration });

    // var days = duration.asDays();
    // var hours = duration.hours();
    // var minutes = duration.minutes();

    // console.log({ days }, { hours }, { minutes })

    // const time_left =
    //   days >= 1
    //     ? days + " days left"
    //     : hours >= 1
    //     ? hours + " hours left"
    //     : minutes + +" minutes left";
    // {
    //   submission:{submission_time : ''},
    //   deadline :"",
    //   deadline_date : "",
    //   islate:"2"

    // }
    return (
      <View style={styles.top}>
        <Row>
          {currentHomeWork.status === 1 ? (
            <Col size={2.5} style={styles.heading}>
              <Text style={styles.due}>
                {strings.due_date} {currentHomeWork.deadline_date}
                {/* {moment(currentHomeWork.dueDate).format("MM/DD/YYYY") +
                    " " +
                    moment(homework.deadline).format("hh:mm A")} */}
              </Text>
              <Text style={styles.daysleft}>
                {remainingDay > 0
                  ? remainingDay + strings.days_left
                  : strings.todays}
                {/* {time_left ? time_left : minutes + " minutes left"} */}
                {/* {deadline.fromNow()} */}
              </Text>
            </Col>
          ) : (
            <Col size={2.5} style={styles.closeHeading}>
              <Text style={styles.closeText}>
                {currentHomeWork.status === 1 ? "open" : "close"}
              </Text>
            </Col>
          )}

          {/* {!currentHomeWork.submission && currentHomeWork.islate && (
            <Text
              style={{
                marginTop: 15,
                color: "red",
                fontFamily: fonts.popins_semibold,
              }}
            >
              {" "}
              {currentHomeWork.islate && "LATE"}
            </Text>
          )} */}

          <Col
            style={{
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              paddingRight: 10,
            }}
          >
            {user.user_type === userType.teacher &&
            currentHomeWork.status === 0 ? (
              <TouchableOpacity
                onPress={() => this.submitMethod()}
                style={{ marginLeft: 10 }}
              >
                <Text
                  style={{
                    color: color.light,
                    fontFamily: fonts.regular,
                    opacity: 0.8,
                    fontSize: 12,
                  }}
                >
                  {strings.result_capital}
                </Text>
              </TouchableOpacity>
            ) : (
              user.user_type === userType.student && (
                <Row>
                  <TouchableOpacity
                    onPress={() => this.submitMethod("submit")}
                    style={{ marginLeft: 10 }}
                  >
                    <Text
                      style={{
                        color: color.light,
                        fontFamily: fonts.regular,
                        opacity: 0.8,
                        fontSize: 12,
                      }}
                    >
                      {strings.submit}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => this.submitMethod("view")}
                    style={{ marginLeft: 10 }}
                  >
                    <Text
                      style={{
                        color: color.light,
                        fontFamily: fonts.regular,
                        opacity: 0.8,
                        fontSize: 12,
                      }}
                    >
                      {strings.view_capital}
                    </Text>
                  </TouchableOpacity>
                </Row>
              )
            )}

            {/* {currentHomeWork.submission ? (
              <Icons.Entypo
                name="check"
                size={25}
                color="#65EC2B"
                style={{ position: "absolute", right: 20 }}
              />
            ) : (
                (currentHomeWork.can_submit ||
                  this.props.user._id === this.props.clas.author) && (
                  <>
                    <TouchableOpacity
                      onPress={() => this.submitMethod()}
                      style={{ marginLeft: 10 }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontFamily: fonts.medium,
                          opacity: 0.9,
                        }}
                      >
                        {user.user_type === userType.teacher
                          ? "VIEW"
                          : currentHomeWork.can_submit && "SUBMIT"}
                      </Text>
                    </TouchableOpacity>
                  </>
                )
              )} */}
          </Col>
        </Row>
      </View>
    );
  };

  computeEmbeddedMaxWidth = (availableWidth) => {
    return Math.min(availableWidth, 200);
  };

  render() {
    const { homework, currentHomeWork, user } = this.props;

    return (
      <Card style={{ minHeight: 50, marginBottom: 20, borderRadius: 10 }}>
        {!this.props.viewOnly && this.top()}

        <Card.Content style={{ marginVertical: 8 }}>
          <Text style={[styles.due, { color: "gray" }]}>
            {strings.title_capital}
          </Text>

          <Text
            numberOfLines={2}
            style={[styles.due, { color: "black", opacity: 1 }]}
          >
            {currentHomeWork.title}
          </Text>
        </Card.Content>

        {/* {currentHomeWork.submission && currentHomeWork.submission.late && (
          <Text
            style={{
              marginTop: 10,
              color: "red",
              fontFamily: fonts.popins_semibold,
              position: "absolute",
              right: 10,
              top: 45,
              fontSize: 10,
            }}
          >
            {currentHomeWork.islate && "MARKED LATE"}
          </Text>
        )} */}

        <Card.Content style={{ marginVertical: 3, marginBottom: "3%" }}>
          <View style={{ maxHeight: 148 }}>
            <Text style={[styles.due, { color: "gray" }]}>
              {strings.description_capital}
            </Text>

            <HtmlViewer
              htmlContent={currentHomeWork.description || ""}
              navigation={this.props.navigation}
            />
          </View>
        </Card.Content>

        {user.user_type === userType.teacher && (
          <Card.Content style={styles.bottomContent}>
            <Text style={[styles.due, { color: "gray", marginTop: 10 }]}>
              {currentHomeWork.total_submitted} /{" "}
              {currentHomeWork.total_submission} {strings.Submissions} -{" "}
              {currentHomeWork.status === 1 ? "Open" : "Close"}
            </Text>

            <TouchableOpacity
              onPress={() => this.submitMethod()}
              style={{ marginLeft: 10 }}
            >
              <Text style={styles.smallButton}>
                {user.user_type === userType.teacher && "VIEW"}
              </Text>
            </TouchableOpacity>
          </Card.Content>
        )}
      </Card>
    );
  }
}

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getSavedHomeworkDetails } from "../../redux/actions/homework";

const mapStateToProps = (state) => ({
  user: state.auth.user,
  loading: state.homework.loading,
  homeworks: state.homework.homeworks,
});

const mapDispatchToProps = (dispatch) => ({
  getSavedHomeworkDetails: bindActionCreators(
    getSavedHomeworkDetails,
    dispatch
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CurrentHomeworkCard);

const styles = StyleSheet.create({
  bottomContent: {
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  smallButton: {
    color: color.blue,
    fontFamily: fonts.regular,
    opacity: 0.9,
    marginTop: 10,
    fontSize: 12,
  },
  daysleft: { color: "white", fontFamily: fonts.regular, fontSize: 13 },
  heading: { padding: 6, paddingHorizontal: 15 },
  closeHeading: {
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: 15,
  },
  top: {
    height: 50,
    backgroundColor: color.blue,
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
  },
  due: {
    color: color.light,
    opacity: 0.6,
    fontFamily: fonts.regular,
    fontSize: 14,
  },
  descriptionView: {
    color: color.dark,
    opacity: 0.6,
    fontFamily: fonts.regular,
    fontSize: 14,
  },
  closeText: {
    color: color.light,
    fontFamily: fonts.regular,
    fontSize: 13,
  },
});
