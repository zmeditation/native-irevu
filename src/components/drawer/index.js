import React from 'react';
import { Container, View, Text, Content } from 'native-base';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { changeLaguage, strings } from '../../translations/service';
import { TouchableRipple } from 'react-native-paper';
import { Avatar } from 'react-native-elements';
import Language from '../language';
import { Icons } from '../';
import { fonts } from '../../theme';
import { dummyImageUrl } from '../../utils/constants';

class Drawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user
    };
  }

  componentWillReceiveProps(props) {
    if (props.profileDetail !== this.props.profileDetail) {
      this.setState({ user: props.profileDetail });
    }
    if (props.user !== this.props.user) {
      this.setState({ user: props.user });
    }
  }

  render() {
    const { user } = this.state;
    return (
      <Container style={{ backgroundColor: '#FFFFFF' }}>
        <View
          style={{
            flex: 0.3,
            backgroundColor: '#467DFF',
            alignItems: 'center',
            flexDirection: 'row',
            paddingTop: 20,
            paddingLeft: 20
          }}
        >
          <Avatar
            source={{
              uri: user.profileImage ? user.profileImage : dummyImageUrl
            }}
            rounded
            size={70}
          />
          <View style={{ marginLeft: 15 }}>
            <Text
              style={{
                color: 'white',
                fontSize: 18,
                fontFamily: fonts.regular
              }}
            >
              {user.first_name + ' ' + (user.last_name ? user.last_name : '')}
            </Text>
            <TouchableOpacity>
              <Text
                style={{
                  color: 'white',
                  fontFamily: fonts.regular,
                  opacity: 0.5,
                  fontSize: 15
                }}
              >
                {strings.view_account}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <Content style={{ flex: 1.2, backgroundColor: '#f2f6ff' }}>
          {/* 1 Dashboard = both */}
          <TouchableRipple
            onPress={() => {
              this.props.navigation.navigate('Dashboard');
              this.props.navigation.closeDrawer();
            }}
            style={{ paddingHorizontal: 25, paddingVertical: 18 }}
          >
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: '10%', marginBottom: 5 }}>{<Icons.Fontisto name="home" size={20} />}</View>
              <Text style={{ fontSize: 17, fontFamily: fonts.regular, marginLeft: 20 }}>
                {strings.home}
              </Text>
            </View>
          </TouchableRipple>

          {/* 2 Forum = both */}
          <TouchableRipple
            onPress={() => {
              this.props.navigation.navigate('Forum');
              this.props.navigation.closeDrawer();
            }}
            style={{ paddingHorizontal: 25, paddingVertical: 18 }}
          >
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: '10%', marginBottom: 5 }}>{<Icons.Fontisto name="question" size={20} />}</View>
              <Text style={{ fontSize: 17, fontFamily: fonts.regular, marginLeft: 20 }}>
                {strings.forums}
              </Text>
            </View>
          </TouchableRipple>

          {/* 3 Notifications = both */}
          <TouchableRipple
            onPress={() => {
              this.props.navigation.navigate('Notifications');
              this.props.navigation.closeDrawer();
            }}
            style={{ paddingHorizontal: 25, paddingVertical: 18 }}
          >
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: '10%', marginBottom: 5 }}>{<Icons.FontAwesome name="bell" size={20} />}</View>
              <Text style={{ fontSize: 17, fontFamily: fonts.regular, marginLeft: 20 }}>
                {strings.notifications}
              </Text>
            </View>
          </TouchableRipple>

          {/* 4 Classes = both*/}
          <TouchableRipple
            onPress={() => {
              this.props.navigation.navigate('Classes');
              this.props.navigation.closeDrawer();
            }}
            style={{ paddingHorizontal: 25, paddingVertical: 18 }}
          >
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: '10%', marginBottom: 5 }}>{<Icons.FontAwesome5 name="school" size={20} />}</View>
              <Text style={{ fontSize: 17, fontFamily: fonts.regular, marginLeft: 20 }}>
                {strings.classes}
              </Text>
            </View>
          </TouchableRipple>

          {/* 5 EarnPoint = teacher */}
          {user.user_type === '1' ? <TouchableRipple
            onPress={() => {
              this.props.navigation.navigate('EarnPoint');
              this.props.navigation.closeDrawer();
            }}
            style={{ paddingHorizontal: 25, paddingVertical: 18 }}
          >
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: '10%', marginBottom: 5 }}>{<Icons.FontAwesome5 name="user-plus" size={20} />}</View>
              <Text style={{ fontSize: 17, fontFamily: fonts.regular, marginLeft: 20 }}>
                {strings.earn_points}
              </Text>
            </View>
          </TouchableRipple> : null}

          {/* 6 LessonPlan = teacher*/}
          {user.user_type === '1' ? <TouchableRipple
            onPress={() => {
              this.props.navigation.navigate('LessonPlan');
              this.props.navigation.closeDrawer();
            }}
            style={{ paddingHorizontal: 25, paddingVertical: 18 }}
          >
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: '10%', marginBottom: 5 }}>{<Icons.FontAwesome5 name="bath" size={20} />}</View>
              <Text style={{ fontSize: 17, fontFamily: fonts.regular, marginLeft: 20 }}>
                {strings.lesson_plans}
              </Text>
            </View>
          </TouchableRipple> : null}

          {/* 7 Resources = student */}
          {user.user_type === '2' ? <TouchableRipple
            onPress={() => {
              this.props.navigation.navigate('Resources');
              this.props.navigation.closeDrawer();
            }}
            style={{ paddingHorizontal: 25, paddingVertical: 18 }}
          >
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: '10%', marginBottom: 5 }}>{<Icons.FontAwesome5 name="scroll" size={20} />}</View>
              <Text style={{ fontSize: 17, fontFamily: fonts.regular, marginLeft: 20 }}>
                {strings.resources}
              </Text>
            </View>
          </TouchableRipple> : null}

          {/* 8 EarnPoint = student */}
          {user.user_type === '2' ? <TouchableRipple
            onPress={() => {
              this.props.navigation.navigate('EarnPoint');
              this.props.navigation.closeDrawer();
            }}
            style={{ paddingHorizontal: 25, paddingVertical: 18 }}
          >
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: '10%', marginBottom: 5 }}>{<Icons.FontAwesome5 name="user-plus" size={20} />}</View>
              <Text style={{ fontSize: 17, fontFamily: fonts.regular, marginLeft: 20 }}>
                {strings.send_referral_link}
              </Text>
            </View>
          </TouchableRipple> : null}

          {/* 9 Results = student */}
          {user.user_type === '2' ? <TouchableRipple
            onPress={() => {
              this.props.navigation.navigate('Results');
              this.props.navigation.closeDrawer();
            }}
            style={{ paddingHorizontal: 25, paddingVertical: 18 }}
          >
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: '10%', marginBottom: 5 }}>{<Icons.FontAwesome5 name="medal" size={20} />}</View>
              <Text style={{ fontSize: 17, fontFamily: fonts.regular, marginLeft: 20 }}>
                {strings.results}
              </Text>
            </View>
          </TouchableRipple> : null}

          {/* 10 Wallet = both */}
          <TouchableRipple
            onPress={() => {
              this.props.navigation.navigate('Wallet');
              this.props.navigation.closeDrawer();
            }}
            style={{ paddingHorizontal: 25, paddingVertical: 18 }}
          >
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: '10%', marginBottom: 5 }}>{<Icons.FontAwesome5 name="wallet" size={20} />}</View>
              <Text style={{ fontSize: 17, fontFamily: fonts.regular, marginLeft: 20 }}>
                {strings.wallet}
              </Text>
            </View>
          </TouchableRipple>

          {/* 11 Subscriptions = teacher */}
          {user.user_type === '1' ? <TouchableRipple
            onPress={() => {
              this.props.navigation.navigate('Subscriptions');
              this.props.navigation.closeDrawer();
            }}
            style={{ paddingHorizontal: 25, paddingVertical: 18 }}
          >
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: '10%', marginBottom: 5 }}>{<Icons.FontAwesome5 name="money-bill-wave" size={20} />}</View>
              <Text style={{ fontSize: 17, fontFamily: fonts.regular, marginLeft: 20 }}>
                {strings.subscriptions}
              </Text>
            </View>
          </TouchableRipple> : null}

          {/* 12 ContactUs = both */}
          <TouchableRipple
            onPress={() => {
              this.props.navigation.navigate('ContactUs');
              this.props.navigation.closeDrawer();
            }}
            style={{ paddingHorizontal: 25, paddingVertical: 18 }}
          >
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: '10%', marginBottom: 5 }}>{<Icons.FontAwesome5 name="headset" size={20} />}</View>
              <Text style={{ fontSize: 17, fontFamily: fonts.regular, marginLeft: 20 }}>
                {strings.contact_us}
              </Text>
            </View>
          </TouchableRipple>

          {/* 13 HelpGuide = both */}
          <TouchableRipple
            onPress={() => {
              this.props.navigation.navigate('HelpGuide');
              this.props.navigation.closeDrawer();
            }}
            style={{ paddingHorizontal: 25, paddingVertical: 18 }}
          >
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: '10%', marginBottom: 5 }}>{<Icons.FontAwesome5 name="question" size={20} />}</View>
              <Text style={{ fontSize: 17, fontFamily: fonts.regular, marginLeft: 20 }}>
                {strings.help_guide}
              </Text>
            </View>
          </TouchableRipple>

        </Content>
        <View
          style={{
            flex: 0.18,
            backgroundColor: 'white',
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center'
          }}
        >
          <TouchableOpacity
            onPress={() => this.props.logout(this.props.user.id.toString(), this)}
            style={{ flexDirection: 'row' }}
          >
            <Icons.SimpleLineIcons
              name="logout"
              color="#467DFF"
              style={{ transform: [{ rotateY: '180deg' }] }}
              size={22}
            />
            <Text
              style={{
                fontSize: 17,
                fontFamily: fonts.regular,
                marginLeft: 10
              }}
            >
              {strings.log_out}
            </Text>
          </TouchableOpacity>
          <Language // RE-ADD After fixing structure
            languageOnChangeHandler={(item) => {
              changeLaguage(item);
              this.setState({});
              this.forceUpdate();
            }}
          />
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({});
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { logout } from '../../redux/actions/auth';

const mapStateToProps = (state) => ({
  user: state.auth.user,
  profileDetail: state.profile.editProfDetails
});

const mapDispatchToProps = (dispatch) => ({
  logout: bindActionCreators(logout, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Drawer);
