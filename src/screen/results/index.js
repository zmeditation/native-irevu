import * as React from "react";
import { Container, Content, Text, View } from "native-base";
import { StyleSheet, TouchableOpacity } from "react-native";
import { fonts, color } from "../../theme";
import { Card } from "react-native-paper";
import { Icons } from "../../components";
import ResultView from "./resultView";
import Loader from "../../components/Loader";
import { strings } from '../../translations/service';

class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resultDetails: [],
      isLoading: false,
    };
  }

  resultViewHandler = ({ item }) => {
    return (
      <View style={styles.resultMainContainer}>
        <View style={styles.dateTimeContainer}>
          <Text style={styles.dateTime}>
            {item.time} - {item.date}
          </Text>
        </View>

        <Card>
          <View style={styles.headerTitleContainer}>
            <Text style={[styles.cardHeaderText, styles.headerClassName]}>
              {strings.class_name}
            </Text>

            <Text style={[styles.cardHeaderText, styles.headerClassResult]}>
              {strings.result_small}
            </Text>
          </View>

          <View style={styles.titleContainer}>
            <Text style={styles.lblTitle}>{strings.title}</Text>
            <Text style={styles.description} numberOfLines={2}>
              {item.title}{" "}
            </Text>
          </View>

          <View style={styles.titleContainer}>
            <Text style={styles.lblTitle}>{strings.submissions}</Text>
            <View style={styles.submissionMainContainer}>
              <View style={styles.fileContainer}>
                <Icons.FontAwesome5
                  name="file"
                  style={styles.fileIcon}
                ></Icons.FontAwesome5>
              </View>

              <View style={styles.fileDescContainer}>
                <Text style={styles.fileName}>{item.fileName}</Text>
                <Text style={styles.fileStatus}>{item.status}</Text>
              </View>

              <View style={styles.btnViewContainer}>
                <TouchableOpacity style={styles.btnView}>
                  <Text style={styles.btnViewText}>{strings.view}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.gradeContainer}>
            <Text style={styles.gradeTxt}>{strings.grade}</Text>
            {item.grade === "" ? (
              <Text style={styles.gradePendingTxt}>{strings.yet_to_be_graded}</Text>
            ) : (
              <Text style={styles.gradePrTxt}>{item.grade}</Text>
            )}
          </View>
        </Card>
      </View>
    );
  };

  getResultInfo = () => {
    this.loaderHandler(true);
    this.props.getResultList(this);
  };

  componentDidMount() {
    this.getResultInfo();
  }

  loaderHandler = (status) => {
    this.setState({ isLoading: status });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.resultDetails !== this.props.resultDetails) {
      this.setState({ resultDetails: nextProps.resultDetails });
      this.loaderHandler(false);
    }
  }

  render() {
    const { hour, username } = this.state;
    const { user } = this.props;

    return (
      <Container style={styles.container}>
        {this.state.isLoading && <Loader isLoading={this.state.isLoading} />}
        <Content
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
        >
          <View style={styles.cardContainer}>
            {/* <FlatList
              data={this.state.resultDetails}
              renderItem={(item) => this.resultViewHandler(item)}
            /> */}

            {this.state.resultDetails.length ? (
              <ResultView
                resultDetails={this.state.resultDetails}
                {...this.props}
              />
            ) : !this.state.isLoading && (
              <Text style={styles.gradePrTxt}>{strings.no_results}</Text>
            )}
          </View>
        </Content>
      </Container>
    );
  }
}

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getResultList } from "../../redux/actions/homework";

const mapStateToProps = (state) => ({
  user: state.auth.user,
  resultDetails: state.homework.resultDetails,
});

const mapDispatchToProps = (dispatch) => ({
  getResultList: bindActionCreators(getResultList, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Results);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.lightbg,
  },
  resultMainContainer: {
    backgroundColor: color.lightbg,
  },
  cardContainer: {
    width: "90%",
    marginVertical: 8,
    borderRadius: 10,
    marginHorizontal: "5%",
  },
  heading: {
    fontFamily: fonts.medium,
    fontSize: 10,
    textTransform: "uppercase",
    color: color.lightblue,
  },
  dateTime: {
    fontSize: 14,
    textTransform: "uppercase",
    fontFamily: fonts.regular,
    color: color.darkgray,
    letterSpacing: 0.7,
  },
  dateTimeContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: "5%",
  },
  resultContainer: {
    backgroundColor: color.bg,
  },
  cardHeaderText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: color.light,
    marginHorizontal: "5%",
  },
  headerClassResult: {
    textTransform: "uppercase",
  },
  headerTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    backgroundColor: color.primary,
    padding: "4%",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  titleContainer: {
    width: "100%",
    marginHorizontal: "5%",
    marginTop: "3%",
  },
  dateTime: {
    fontSize: 14,
    textTransform: "uppercase",
    fontFamily: fonts.regular,
    color: color.darkgray,
    letterSpacing: 0.7,
  },
  lblTitle: {
    fontSize: 10,
    textTransform: "uppercase",
    fontFamily: fonts.regular,
    color: color.darkgray,
    letterSpacing: 0.7,
  },
  description: {
    fontFamily: fonts.regular,
    fontSize: 14,
    maxWidth: "93%",
  },
  submissionMainContainer: {
    flexDirection: "row",
    marginRight: "8%",
  },
  fileContainer: {
    width: "12%",
    backgroundColor: color.lightbg,
    paddingVertical: 10,
    paddingHorizontal: 5,
    alignItems: "center",
    borderRadius: 5,
  },
  fileIcon: {
    fontSize: 24,
    color: color.light,
  },
  fileDescContainer: {
    flexDirection: "column",
    width: "60%",
    justifyContent: "center",
    marginHorizontal: "3%",
  },
  fileName: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: color.dark,
  },
  fileStatus: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: color.primary,
    textTransform: "uppercase",
  },
  btnViewContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  btnView: {
    width: "100%",
    backgroundColor: color.primary,
    borderRadius: 5,
    paddingHorizontal: 18,
    paddingVertical: 6,
  },
  btnViewText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: color.light,
  },
  gradeTxt: {
    color: color.dark,
    fontFamily: fonts.regular,
    fontSize: 14,
  },
  gradeContainer: {
    marginLeft: "5%",
    marginTop: "3%",
    marginBottom: "2%",
  },
  gradePrTxt: {
    color: color.primary,
    fontFamily: fonts.regular,
    fontSize: 25,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginTop: '70%'
  },
  gradePendingTxt: {
    color: color.bg,
    fontFamily: fonts.regular,
    fontSize: 25,
  },
});
