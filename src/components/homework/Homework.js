import * as React from 'react';
import { Text, View } from 'native-base';
import { StyleSheet } from 'react-native';
import { fonts, color } from '../../theme';
import { Card, ActivityIndicator } from 'react-native-paper';
import { BlurView, VibrancyView } from '@react-native-community/blur';

import HomeWorkCard from './Card';
import ResultView from '../../screen/results/resultView';

class Homework extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      resultDetails: []
    };
  }

  getHomeworksDetails = () => {
    const { user, clas } = this.props;
    if (user.user_type === userType.student) {
      this.props.getAllSubmittedHomeWork(clas.id);
    } else if (user.user_type === userType.teacher) {
      this.props.currentHomework(this, this.props.clas);
    }
  };

  componentWillMount() {
    this.getHomeworksDetails();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.allSubmittedHomeworkList !== this.props.allSubmittedHomeworkList) {
      this.setState({ resultDetails: nextProps.allSubmittedHomeworkList });
    }
  }

  render() {
    const { isLoading, homeworks, clas, currrentHomeworkDetails, user } = this.props;
    return (
      <View>
        <Text style={[styles.subtitle]}>
          {!isLoading && (!currrentHomeworkDetails || currrentHomeworkDetails.length === 0) ? (
            'NO HOMEWORKS'
          ) : (
            'Homework'
          )}>
        </Text>

        {user.user_type === userType.student ? (
          <ResultView resultDetails={this.state.resultDetails || ''} isViewIcon={true} {...this.props} />
        ) : isLoading ? (
          <ActivityIndicator size="small" color={color.blue} />
        ) : (
          currrentHomeworkDetails &&
          currrentHomeworkDetails.map((homework, index) => {
            return (
              homework.status === 0 && (
                <View>
                  <Text style={styles.homeDateTime}>
                    {homework.deadline_time} - {homework.deadline_date}
                  </Text>
                  <HomeWorkCard
                    navigation={this.props.navigation}
                    key={homework.id + 'homeworkcard'}
                    currentHomeWork={homework}
                    clas={clas}
                    user={this.props.user}
                  />
                </View>
              )
            );
          })
        )}
      </View>
    );
  }
}

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { currentHomework } from '../../redux/actions/questions';
import { userType } from '../../utils/constants';
import { getAllSubmittedHomeWork } from '../../redux/actions/homework';

const mapStateToProps = (state) => ({
  user: state.auth.user,
  loading: state.homework.loading,
  homeworks: state.homework.homeworks,
  allSubmittedHomeworkList: state.homework.allSubmittedHomeworkList
});

const mapDispatchToProps = (dispatch) => ({
  currentHomework: bindActionCreators(currentHomework, dispatch),
  getAllSubmittedHomeWork: bindActionCreators(getAllSubmittedHomeWork, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Homework);

const styles = StyleSheet.create({
  top: {
    height: 50,
    backgroundColor: color.blue,
    borderTopEndRadius: 5,
    borderTopStartRadius: 5
  },
  subtitle: {
    alignSelf: 'center',
    marginVertical: 12,
    fontSize: 20,
    fontFamily: fonts.medium,
    color: color.primary,
    letterSpacing: 1
  },
  headerTitle: {
    color: 'black',
    alignSelf: 'center',
    fontFamily: fonts.medium,
    fontSize: 20
  },
  container: {
    backgroundColor: '#F2F6FF'
    // alignItems: "center",
    // paddingHorizontal: "2.5%",
  },
  topcard: {
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 20,
    marginTop: 20,
    alignSelf: 'center'
  },
  profile: { justifyContent: 'center', marginLeft: 10 },
  profileName: {
    fontFamily: fonts.regular,
    fontSize: 14,
    top: 5
  },
  degreeName: {
    fontSize: 14,
    fontFamily: fonts.regular,
    opacity: 0.2,
    bottom: 0
  },
  gradesTitle: {
    fontSize: 12,
    fontFamily: fonts.regular,
    textAlign: 'right'
  },
  grades: {
    opacity: 0.8,
    fontFamily: fonts.regular,
    fontSize: 23,
    color: '#467DFF'
  },
  serviceText: {
    color: '#467DFF',
    fontSize: 14,
    fontFamily: fonts.medium
  },
  modalMainCon: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 5
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: '5%'
  },
  modalHeaderTitle: { fontSize: 29, fontFamily: fonts.medium },
  bodyRows: {
    backgroundColor: '#dce7ff',
    width: '100%',
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between'
  },
  homeDateTime: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: fonts.regular,
    letterSpacing: 0.7,
    color: color.darkgray,
    marginVertical: '3%'
  }
});
