import * as React from 'react';
import { Container, Content, Text, View } from 'native-base';
import { StyleSheet } from 'react-native';
import { fonts } from '../../theme';
import { Performances, MyClasses, NewQuestions } from '../../components';
import { strings } from '../../translations/service';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user: props.user, openQuestionList: [], classesDetails: [] };
  }
  questionListHandler = () => {
    this.props.getOpenQuestionList(this, 'open');
  };
  componentDidMount() {
    this.props.navigation.addListener('focus', this.questionListHandler);
    this.props.getClassesLists(this);
    this.props.getOtherPerformanceDetail('1');
    this.props.getOtherPerformanceDetail('2');
    this.getHour();
    // this.props.start_wechat_pay()
  }
  componentWillReceiveProps(props) {
    this.questionListHandler();
    if (props.profileDetail !== this.props.profileDetail) {
      this.setState({ user: props.profileDetail });
    }
    if (props.allOpenQuestionList !== this.props.allOpenQuestionList) {
      this.setState({ openQuestionList: props.allOpenQuestionList });
    }
    if (props.classesLists !== this.props.classesLists) {
      this.setState({ classesDetails: props.classesLists });
    }
  }
  getHour = () => {
    const date = new Date();
    const hour = date.getHours();
    this.setState({ hour });
  };

  render() {
    const { hour, user } = this.state;

    return (
      <Container style={styles.container}>
        <DropdownAlert ref={(ref) => (this.dropDownAlertRef = ref)} zIndex={11111111} />
        <Content showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }} padder>
          <View style={styles.greetingCon}>
            <Text style={styles.morning}>{hour < 12 ? `${strings.good_morning}` : `${strings.good_evening}`}</Text>
            <Text numberOfLines={1} adjustsFontSizeToFit={true} style={styles.full_name}>
              {user.first_name + ' ' + (user.last_name ? user.last_name : '')}
            </Text>
          </View>
          <View style={styles.topPerformance}>
            <Text style={{ textAlign: 'center' }}>
              {strings.top_3_performers}
            </Text>
          </View>

          <View style={styles.dividertransparent} />

          <Performances navigation={this.props.navigation} />
          <MyClasses navigation={this.props.navigation} classesDetails={this.state.classesDetails} />

          <View style={styles.dividertransparent} />
          <View style={styles.divider} />

          <NewQuestions navigation={this.props.navigation} openQuestionList={this.state.openQuestionList} />

          <View style={styles.dividertransparent} />
          <View style={styles.divider} />
        </Content>
      </Container>
    );
  }
}

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DropdownAlert from 'react-native-dropdownalert';
import { getOtherPerformanceDetail } from '../../redux/actions/profile';
import { getOpenQuestionList } from '../../redux/actions/forum';
import { getClassesLists } from '../../redux/actions/class';
import { start_wechat_pay } from '../../redux/actions/wechatPay';

const mapStateToProps = (state) => ({
  user: state.auth.user,
  classesLists: state.classes.classesLists,
  profileDetail: state.profile.editProfDetails,
  allOpenQuestionList: state.forum.allOpenQuestionList
});

const mapDispatchToProps = (dispatch) => ({
  start_wechat_pay: bindActionCreators(start_wechat_pay, dispatch),
  getClassesLists: bindActionCreators(getClassesLists, dispatch),
  getOtherPerformanceDetail: bindActionCreators(getOtherPerformanceDetail, dispatch),
  getOpenQuestionList: bindActionCreators(getOpenQuestionList, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);

const styles = StyleSheet.create({
  divider: { width: 100, height: 1, backgroundColor: 'gray', alignSelf: 'center', opacity: 0.3, marginBottom: 10 },
  dividertransparent: {
    width: 100,
    height: 1,
    backgroundColor: 'gray',
    alignSelf: 'center',
    opacity: 0,
    marginBottom: 10
  },

  full_name: { fontFamily: fonts.semibold, color: 'black', fontSize: 25, opacity: 0.75 },
  morning: { fontFamily: fonts.semibold, color: 'gray', fontSize: 17 },
  greetingCon: {
    width: '96%',
    backgroundColor: 'white',
    alignSelf: 'center',
    borderRadius: 10,
    alignItems: 'center',
    padding: 20
  },
  container: {
    backgroundColor: '#F2F6FF'
  },
  topPerformance: {
    width: '90%',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: '5%'
  }
});
