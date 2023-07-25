import React, { Component } from 'react';
import { Container, Content, Text, View } from "native-base";
import {
  StyleSheet,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fonts, color } from "../../theme";
import { AuthButton, AuthFields } from '../../components';
import axios from 'axios';
import { strings } from '../../translations/service';

class ContactUs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullname: '',
      email: '',
      message: '',
    };
    this.sendMail = this.sendMail.bind(this);
  }

  theme = { colors: { text: color.dark, placeholder: color.lightblue, primary: color.lightblue } };

  sendMail = () => {
    const emailValidation = /\S+@\S+\.\S+/;
    const { fullname, email, message } = this.state
    if (fullname.length > 1 && email.length > 1 && message.length > 1) {
      var config = {
        method: 'post',
        url: 'http://api.irevu.org/contactus?name=' + `${fullname}` + '&email=' + `${email}` + '&message=' + `${message}`,
        headers: {
          'Authorization': AsyncStorage.getItem('token')
        }
      };

      axios(config)
        .then(function (response) {
          console.log(response)
          if (response.data.status == 200) {
            alert(strings.message_sent_successfully);
          } else {
            alert(strings.error_string, response.data.status);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      this.setState({ fullname: '', email: '', message: '' })
    } else {
      alert(strings.please_enter_all_the_fields)
    }
  }

  render() {
    const { hour, username } = this.state;
    const { user } = this.props;
    return (
      <Container style={styles.container}>
        <Content
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10, paddingHorizontal: 20, height: '100%' }}
          padder
        >
          <AuthFields
            label={strings.name_capital}
            onChangeText={(text) => this.setState({ fullname: text })}
            style={styles.textInput}
            theme={this.theme}
          />

          <AuthFields
            label={strings.email_capital}
            onChangeText={(text) => this.setState({ email: text })}
            style={styles.textInput}
            theme={this.theme}
          />

          <AuthFields
            label={strings.message_capital}
            onChangeText={(text) => this.setState({ message: text })}
            style={styles.textInput}
            theme={this.theme}
          />

          <Text style={styles.messageText}>
            {strings.send_us_an_email_message_text}
          </Text>

          <View style={styles.buttonContainer}>
            <AuthButton
              onPress={() => this.sendMail()}
              title={strings.send_message}></AuthButton>
          </View>
        </Content>
      </Container>
    );
  }
}

import { connect } from "react-redux";

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ContactUs);

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.lightbg,
    height: '100%',
  },
  textInput: {
    backgroundColor: color.light,
    marginVertical: "2%",
    textTransform: "uppercase",
    fontFamily: fonts.regular,
    fontSize: 12,
    letterSpacing: 0.5
  },
  messageText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    letterSpacing: 0.7,
    color: color.dark,
    opacity: 0.4,
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 20,
  },
  buttonContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 10,
    alignSelf: 'center',
  },
});
