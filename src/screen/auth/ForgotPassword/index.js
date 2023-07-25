import * as React from 'react';
import { Container, Content, Text, View } from 'native-base';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Image, AuthFields, Icons } from '../../../components';
import { logo } from '../../../../assets';
import { color, fonts } from '../../../theme';
import { ActivityIndicator } from 'react-native-paper';
import { Button } from 'react-native-material-ui';
import { Formik } from 'formik';
import * as yup from 'yup';
import DropdownAlert from 'react-native-dropdownalert';
import { strings } from '../../../translations/service';
// import { fonts } from "../../../theme";

const validation = yup.object().shape({
  email: yup.string().required('Email id is a required field')
});

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: [
        {
          label: 'email_label',
          placeholder: 'email_placeholder',
          keyboardType: 'default',
          key: 'email'
        }
      ]
    };
  }

  handleSubmit = async (form) => {
    // await Keyboard.dismiss();
    await this.props.forgotPassword(this, form);
  };

  render() {
    return (
      <Container style={styles.container}>
        <Content style={{ padding: 20 }}>
          <View style={styles.backNavContainer}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
              <View style={styles.backButtonWrapper}>
                <Icons.Entypo name={'chevron-thin-left'} style={styles.backIcon} />
                <Text style={styles.backLabel}>{strings.back}</Text>
              </View>
            </TouchableOpacity>
          </View>
          {strings._language == '中⽂' ? <Image resizeMode="contain" source={require('../../../../assets/logos/logo-c.png')} style={styles.logo} /> :
            <Image resizeMode="contain" source={logo} style={styles.logo} />}

          <Text style={styles.semiheading}>{strings.forgot_subheading}</Text>

          <Formik
            onSubmit={(form) => {
              this.handleSubmit(form);
            }}
            validationSchema={validation}
            initialValues={{ email: '' }}
          >
            {({ values, handleChange, handleSubmit, touched, errors }) => (
              <View style={{ marginTop: 100 }}>
                {this.state.fields &&
                  this.state.fields.map((field, index) => {
                    return (
                      <AuthFields
                        unique={field.key}
                        onChangeText={handleChange(field.key)}
                        keyboardType={field.keyboardType}
                        key={index + 'login'}
                        label={strings.email_label}
                        placeholder={strings.email_placeholder}
                        style={{ backgroundColor: 'white', width: '100%' }}
                        error={errors[field.key] && touched[field.key] && errors[field.key]}
                      />
                    );
                  })}

                {this.state.loading ? (
                  <View style={[button.container, { justifyContent: 'center' }]}>
                    <ActivityIndicator size="small" color="white" />
                  </View>
                ) : (
                  <Button
                    onPress={handleSubmit}
                    style={button}
                    raised
                    primary
                    text={strings.submit}
                  />
                )}
              </View>
            )}
          </Formik>
        </Content>
        <DropdownAlert ref={(ref) => (this.dropDownAlertRef = ref)} />
      </Container>
    );
  }
}

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { forgotPassword } from '../../../redux/actions/auth';

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    tokens: state.auth.tokens
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    forgotPassword: bindActionCreators(forgotPassword, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);

const button = {
  container: {
    marginTop: 10,
    backgroundColor: '#467DFF',
    height: 45
  },
  text: {
    fontSize: 16,
    fontFamily: fonts.bold
  }
};

const styles = StyleSheet.create({
  newuser: {
    textAlign: 'center',
    fontFamily: fonts.semibold,
    // color:"#467DFF",
    marginTop: 10
  },
  forgot: {
    textAlign: 'right',
    fontFamily: fonts.semibold,
    color: '#467DFF',
    marginVertical: 5
  },
  container: {
    backgroundColor: color.bg
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 20
  },
  heading: { fontFamily: fonts.semibold, textAlign: 'center', opacity: 0.7 },
  semiheading: { fontFamily: fonts.semibold, textAlign: 'center', fontSize: 20, opacity: 0.8 },
  backButtonWrapper: { flexDirection: 'row', alignItems: 'center' },
  backIcon: { fontSize: 14, color: '#0000FF' },
  backLabel: { marginLeft: 3, color: '#0000FF' },
  backNavContainer: {}
});
