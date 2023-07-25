import * as React from 'react';
import { Container, Content, Text, View, Footer } from 'native-base';
import { StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import { Icons, AuthButton } from '../../components';
import { color, fonts } from '../../theme';
import { strings } from '../../translations/service';
import { Avatar } from 'react-native-elements';
import { dummyImageUrl } from '../../utils/constants';
import Loader from '../../components/Loader';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: [
        { key: 'fullName', label: strings.full_name, data: props.user.fullName },
        { key: 'email', label: strings.email, data: props.user.email },
        { key: 'username', label: strings.username, data: props.user.username },
        { key: 'password', label: strings.password, data: props.user.password },
        { key: 'education', label: strings.education, data: props.user.education },
        {
          key: 'university',
          label: strings.university,
          data: props.user.university
        },
        { key: 'course', label: strings.course, data: props.user.course }
      ],
      user: props.user,
      isLoading: true
    };
  }

  componentDidMount() {
    this.setState({ isLoading: false });
    this.props.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => logout(this)}>
          <Icons.AntDesign name="logout" color="black" size={30} style={{ marginRight: 10 }} />
        </TouchableOpacity>
      )
    });
  }
  componentWillReceiveProps(props) {
    this.setState({ isLoading: false });
    if (props.profileDetail != this.props.profileDetail) {
      this.setState({ user: props.profileDetail });
      this.state.fields.map((profile, index) => {
        return (this.state.fields[index].data = props.profileDetail[profile.key]);
      });
    }
  }

  render() {
    const { user } = this.state;
    return (
      <Container style={styles.container}>
        {this.state.isLoading && <Loader isLoading={this.state.isLoading} />}
        <Content showsVerticalScrollIndicator={false} >
          <View style={styles.profilePicCard}>
            <View style={styles.profilePicMainCon}>
              <Text style={styles.profilePicTextStyle}>{strings.profile_picture}</Text>
              <View style={{ flexDirection: 'row' }} />
            </View>
            <Avatar
              rounded
              source={{
                uri: user.profileImage || dummyImageUrl
              }}
              avatarStyle={{ borderWidth: 0 }}
              size={110}
              containerStyle={styles.avatarStyle}
            />
          </View>
          {this.state.fields.map((a) => {
            return (
              <View style={styles.authFields}>
                <Text style={styles.label}>{a.label}</Text>
                <TextInput
                  keyboardType="default"
                  editable={false}
                  multiline={a.secure ? false : true}
                  secureTextEntry={a.secure ? true : false}
                  defaultValue={a.data}
                  style={styles.textInput}
                />
                {a.secure && (
                  <TouchableOpacity
                    style={{
                      position: 'absolute',
                      right: '5%'
                    }}
                  >
                    <Icons.MaterialCommunityIcons
                      name="eye"
                      color="#2B65EC"
                      size={20}
                      style={{ opacity: 0.5 }}
                    />
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </Content>
        <Footer style={{ backgroundColor: 'transparent',  }}>
          <View style={{ width: '100%', backgroundColor: 'transparent' }}>
            <AuthButton
              title={strings.edit_capital}
              onPress={() =>
                this.props.navigation.navigate('ProfileEdit', {
                  profileDetail: user
                })}
            />
          </View>
        </Footer>
        <DropdownAlert ref={(ref) => (this.dropDownAlertRef = ref)} zIndex={11111111} />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E9EFFD',
    paddingHorizontal: '5%'
  },
  profilePicCard: {
    height: 80,
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'white',
    marginTop: 60,
    paddingHorizontal: '5%',
    borderRadius: 5
  },
  profilePicMainCon: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderWidth: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  profilePicTextStyle: {
    color: '#2B65EC',
    fontSize: 10,
    fontFamily: fonts.regular,
    textTransform: 'uppercase'
  },
  avatarStyle: {
    position: 'absolute',
    top: -50,
    zIndex: 1,
    elevation: 2,
    padding: 8,
    backgroundColor: '#E9EFFD'
  },
  textInput: {
    width: '100%',
    fontFamily: fonts.regular,
    fontSize: 14
  },
  label: {
    padding: 0,
    margin: 0,
    textTransform: 'uppercase',
    color: '#2B65EC',
    fontSize: 11,
    fontFamily: fonts.regularxs
  },
  authFields: {
    width: '100%',
    backgroundColor: 'white',
    minHeight: 67,
    maxHeight: 75,
    marginTop: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 5,
    justifyContent: 'center'
  }
});

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { logout } from '../../redux/actions/auth';

const mapStateToProps = (state) => ({
  user: state.auth.user,
  profileDetail: state.profile.profileDetail
});

const mapDispatchToProps = (dispatch) => ({
  logout: bindActionCreators(logout, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
