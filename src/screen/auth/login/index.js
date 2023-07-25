import * as React from "react";
import { Container, Content, Text, View } from "native-base";
import { StyleSheet, TouchableOpacity } from "react-native";
import { color, fonts } from "../../../theme";
import { ActivityIndicator } from "react-native-paper";
import { Button } from "react-native-material-ui";
import { Formik } from "formik";
import * as yup from "yup";
import DropdownAlert from "react-native-dropdownalert";
import axios from "axios";
import * as WeChat from "react-native-wechat-lib";
import { logo } from "../../../../assets";
import Language from "../../../components/language";
import { Image, AuthFields, Icons } from "../../../components";
import { strings, changeLaguage } from "../../../translations/service";
// import { fonts } from "../../../theme";

const validation = yup.object().shape({
  email: yup.string().required("Email or username is a required field"),
  password: yup
    .string()
    .required("Password is a required field")
    .min(6, "Password must be at least 6 characters"),
});

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: [
        {
          label: "username_or_email_label",
          placeholder: "email_placeholder",
          keyboardType: "default",
          key: "email",
        },
        {
          label: "password_label",
          placeholder: "password_placeholder",
          keyboardType: "default",
          key: "password",
        },
      ],
    };
    this.wechatLoginExample();
  }

  // componentWillMount() {
  // WeChat.registerApp('AppID：wx8b25c6e83f785918', 'https://www.irevu.org/').catch((e) => {
  // 	console.log(`componentWillMount - e`, e);
  // });
  // }

  wechatLoginExample = () => {
    const scope = "snsapi_userinfo";
    let state = "_" + new Date();
    WeChat.isWXAppInstalled().then((isInstalled) => {
      // if (isInstalled) {
      WeChat.sendAuthRequest(scope, state).then((responseCode) => {
        console.log(
          responseCode,
          "responsecode received FOR LOGIN",
          responseCode.code
        );
        // alert(responseCode.code) // CODE
        const app_id = "wx8b25c6e83f785918";
        const secret_key = "ea20bc1d163f9cd196097a12a70c81e0";
        // https://api.weixin.qq.com/sns/oauth2/access_token?appid=wx8b25c6e83f785918&secret=ea20bc1d163f9cd196097a12a70c81e0&code=011Zi0000G6j0M1Uix200Xi5jD4Zi00H&grant_type=authorization_code
        axios
          .get(
            `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${app_id}&secret=${secret_key}&code=${responseCode.code}&grant_type=authorization_code`
          )
          .then((resp) => {
            if (resp.status === 200) {
              console.log("I GOT THE AUTHORIZATION", resp);
              // `https://api.weixin.qq.com/cgi-bin/user/info?access_token=${resp.data.access_token}&openid=${resp.data.openid}&lang=zh_CN`
              axios
                .get(
                  `https://api.weixin.qq.com/sns/userinfo?access_token=${resp.data.access_token}&openid=${resp.data.openid}`
                )
                .then((user_info) => {
                  console.log("I GOT THE AUTHORIZATION", user_info);
                })
                .catch((err) => {
                  console.log("I GOT THE AUTHORIZATION ERROR", err);
                });
            }
          })
          .catch((err) => {
            console.log("I GOT THE AUTHORIZATION ERROR", err.response);
          });
      });
      // }
    });
  };

  handleSubmit = async (form) => {
    await this.props.login(this, form);
  };

  render() {
    return (
      <Container style={styles.container}>
        <Content style={{ padding: 20 }} showsVerticalScrollIndicator={false}>
          <View style={styles.backNavContainer}>
            {/* <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Welcome")}
            >
              <View style={styles.backButtonWrapper}>
                <Icons.Entypo
                  name={"chevron-thin-left"}
                  style={styles.backIcon}
                />
                <Text style={styles.backLabel}>{strings.back}</Text>
              </View>
            </TouchableOpacity> */}
          </View>
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

          <Formik
            onSubmit={this.handleSubmit}
            validationSchema={validation}
            initialValues={{ email: "", password: "" }}
          >
            {({ values, handleChange, handleSubmit, touched, errors }) => (
              <View style={{ marginTop: 30 }}>
                {this.state.fields &&
                  this.state.fields.map((field, index) => {
                    return (
                      <AuthFields
                        unique={field.key}
                        onChangeText={handleChange(field.key)}
                        keyboardType={field.keyboardType}
                        key={index + "login"}
                        label={strings[field.label]}
                        placeholder={strings[field.placeholder]}
                        style={{ backgroundColor: "white", width: "100%" }}
                        error={
                          errors[field.key] &&
                          touched[field.key] &&
                          errors[field.key]
                        }
                      />
                    );
                  })}

                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("ForgotPassword")
                  }
                >
                  <Text style={styles.forgot}>{strings.forgot_password}</Text>
                </TouchableOpacity>

                {this.state.loading ? (
                  <View
                    style={[button.container, { justifyContent: "center" }]}
                  >
                    <ActivityIndicator size="small" color="white" />
                  </View>
                ) : (
                  <Button
                    onPress={handleSubmit}
                    style={button}
                    raised
                    primary
                    text={strings.login_capital}
                  />
                )}

                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate("Signup")}
                >
                  <Text style={styles.newuser}>
                    {strings.new_user}{" "}
                    <Text style={[styles.newuser, { color: "#467DFF" }]}>
                      {strings.register_here}
                    </Text>
                  </Text>
                </TouchableOpacity>
                <View style={{ marginTop: "5%" }}>
                  <Language
                    languageOnChangeHandler={(item) => {
                      changeLaguage(item);
                      this.setState({});
                    }}
                  />
                </View>
              </View>
            )}
          </Formik>
        </Content>

        <DropdownAlert ref={(ref) => (this.dropDownAlertRef = ref)} />
      </Container>
    );
  }
}

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { login } from "../../../redux/actions/auth";

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    tokens: state.auth.tokens,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: bindActionCreators(login, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);

const button = {
  container: {
    marginTop: 10,
    backgroundColor: "#467DFF",
    height: 45,
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
  backButtonWrapper: { flexDirection: "row", alignItems: "center" },
  backIcon: { fontSize: 14, color: "#0000FF" },
  backLabel: { marginLeft: 3, color: "#0000FF" },
  backNavContainer: {},
});

// export default withTheme(Login);
