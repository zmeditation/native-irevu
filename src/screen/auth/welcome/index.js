import * as React from "react";
import { Container, Content, Text, View } from "native-base";
import { StyleSheet } from "react-native";
import DropdownAlert from "react-native-dropdownalert";
import * as WeChat from "react-native-wechat-lib";
import { Button } from "react-native-material-ui";
import { Image } from "../../../components";
import { logo } from "../../../../assets";
import { color, fonts } from "../../../theme";
import Language from "../../../components/language";
import { strings, changeLaguage } from "../../../translations/service";
class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: [
        {
          label: "email_label",
          placeholder: "email_placeholder",
          keyboardType: "email-address",
        },
        {
          label: "password_label",
          placeholder: "password_placeholder",
          keyboardType: "default",
        },
      ],
    };
  }

  componentWillMount() {
    WeChat.registerApp("wx8b25c6e83f785918", "https://www.irevu.org/");
  }

  wechatLoginExample = () => {
    this.props.signupViaWechat(this);
  };

  render() {
    return (
      <Container style={styles.container}>
        <Content style={{ paddingTop: 100 }}>
          {strings._language == "中⽂" ? (
            <Image
              resizeMode="contain"
              source={require("../../../../assets/logos/logo-c.png")}
              style={styles.logo}
            />
          ) : (
            <Image resizeMode="contain" source={logo} style={styles.logo} />
          )}

          <Text style={styles.heading}>{strings.welcome}</Text>
          <Text style={styles.semiheading}>{strings.login_subheading}</Text>

          <View style={{ marginTop: 30 }}>
            <Button
              onPress={() => this.props.navigation.replace("Login")}
              style={button}
              raised
              primary
              text={strings.login_capital}
            />
            <Button
              onPress={() => this.wechatLoginExample()}
              icon="wechat"
              iconSet="FontAwesome"
              style={button}
              raised
              primary
              text={strings.continue_using_wechat}
            />
          </View>
          <View style={{ marginTop: "5%" }}>
            <Language
              languageOnChangeHandler={(item) => {
                changeLaguage(item);
                this.setState({});
              }}
            />
          </View>
        </Content>
        <DropdownAlert ref={(ref) => (this.dropDownAlertRef = ref)} />
      </Container>
    );
  }
}

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { signupViaWechat } from "../../../redux/actions/auth";

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    tokens: state.auth.tokens,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signupViaWechat: bindActionCreators(signupViaWechat, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Welcome);

const button = {
  container: {
    height: 45,
    marginTop: 10,
    backgroundColor: "#467DFF",
  },
  text: {
    fontSize: 16,
    fontFamily: fonts.bold,
  },
};

const styles = StyleSheet.create({
  newuser: {
    textAlign: "center",
    fontFamily: fonts.semibold,
    // color:"#467DFF",
    marginTop: 10,
  },
  forgot: {
    textAlign: "right",
    fontFamily: fonts.semibold,
    color: "#467DFF",
    marginVertical: 5,
  },
  container: {
    padding: 20,
    backgroundColor: color.bg,
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginBottom: 20,
  },
  heading: { fontFamily: fonts.semibold, textAlign: "center", opacity: 0.7 },
  semiheading: {
    fontFamily: fonts.semibold,
    textAlign: "center",
    fontSize: 20,
    opacity: 0.8,
  },
});
