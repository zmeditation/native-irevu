import * as React from 'react';
import { Container, Content, Text, View } from 'native-base';
import { StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Image, AuthFields, Icons } from '../../../components';
import { logo } from '../../../../assets';
import { color, fonts } from '../../../theme';
import { ActivityIndicator } from 'react-native-paper';
import * as RNIap from 'react-native-iap';
import { Button } from 'react-native-material-ui';
import DropDownPicker from 'react-native-dropdown-picker';
import { CheckBox } from 'react-native-elements';
import { Formik } from 'formik';
import * as yup from 'yup';
import DropdownAlert from 'react-native-dropdownalert';
import { universityData, courseData, educationTypeData } from '../../../utils/constants';
import Language from '../../../components/language';
import { strings, changeLaguage } from '../../../translations/service';
import * as _ from 'lodash';
import Loader from '../../../components/Loader';

const itemSkus = Platform.select({
  ios: ['TeacherSubs']
});

const validation = yup.object().shape({
  full_name: yup.string().required('Full name is a required field'),
  username: yup.string().required('Username is a required field'),
  email: yup.string().email('Email must be a valid email').required('Email is a required field'),
  password: yup.string().required('Password is a required field').min(6, 'Password must be at least 6 characters'),
  std_id: yup.string()
});

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.controller;
    this.state = {
      termsChecked: false,
      showTermsWebView: false,
      universityInitData: [],
      courseInitData: [],
      checked: 'student',
      education: 'university',
      refferral_code: '',
      fields: [
        {
          label: strings.enter_full_name,
          placeholder: strings.enter_full_name,
          keyboardType: 'default',
          key: 'full_name'
        },
        {
          label: strings.enter_username,
          placeholder: strings.enter_username,
          keyboardType: 'default',
          key: 'username'
        },
        {
          label: strings.email_label,
          placeholder: strings.email_placeholder,
          keyboardType: 'email-address',
          key: 'email'
        },
        {
          label: strings.select_university,
          placeholder: strings.select_university,
          keyboardType: 'default',
          type: 'dropdown',
          key: 'university'
        },
        {
          label: strings.password_label,
          placeholder: strings.password_placeholder,
          keyboardType: 'default',
          key: 'password'
        },
        {
          label: strings.enter_std,
          placeholder: strings.enter_std,
          keyboardType: 'default',
          key: 'std_id'
        },
        {
          label: strings.select_course,
          placeholder: strings.enter_std,
          keyboardType: 'default',
          type: 'dropdown',
          key: 'course'
        }
        // {
        // 	label: 'refferral_code_label',
        // 	placeholder: 'enter_referral_code',
        // 	keyboardType: 'default',
        // 	key: 'refferral_code'
        // }
      ]
    };
  }

  getUniversities = () => {
    this.props.getUniversityList();
  };

  getCourses = () => {
    this.props.getCourceList();
  };

  requestSubscription = async (sku) => {
    try {
      RNIap.requestSubscription(sku).then((res) => {
        console.log(res);
      });
    } catch (err) {
      console.warn(err.code, err.message);
    }
  };

  async componentDidMount() {
    if (Platform.OS == 'ios') {
      RNIap.initConnection().then(() => {
        try {
          RNIap.getProducts(itemSkus)
            .then((products) => {
              console.log(products);
            })
            .catch((err) => {
              console.log(err);
            });
        } catch (err) {
          console.log(err);
        }
      });
    }

    this.loaderHanlder(true);
    this.getUniversities();
    this.getCourses();
    let prop = this.props.route.params;
    if (prop != undefined) {
      await this.setChecked(prop.data.split('-')[0]);
      await this.setState({ refferral_code: prop.data.split('-')[1] });
      this.loaderHanlder(false);
    } else {
      this.loaderHanlder(false);
    }
  }

  loaderHanlder = (status) => {
    this.setState({ isLoading: status });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.universityList !== this.props.universityList) {
      this.setState({ universityInitData: nextProps.universityList });
    }

    if (nextProps.courseList !== this.props.courseList) {
      this.setState({ courseInitData: nextProps.courseList });
    }

    if (nextProps.errorInfo !== this.props.errorInfo) {
      console.log('wiil recive props error', nextProps.errorInfo);
    }
  }

  setChecked = (value) => {
    this.setState({ checked: value });
  };

  handleSubmit = (form) => {
    console.log(`form`, form, this.state);
    if (this.state.education === 'university' && (!this.state['university'] || !this.state['course'])) {
      alert('Please Select University and Course.');
      return;
    }
    console.log(this.props.route.params, 11111);
    this.userInfo = this.props.route.params;

    form.email = form.email.trim().toLowerCase();
    form.education = this.state.education;
    form = {
      ...form,
      university: this.state['university'],
      course: this.state['course'],
      type: this.state.checked,
      // openid: this.userInfo.openid || '',
      profile_image: ''
    };

    this.props.signup(this, form);
  };

  render() {
    return (
      <Container style={styles.container}>
        <DropdownAlert ref={(ref) => (this.dropDownAlertRef = ref)} />
        {this.state.isLoading && <Loader isLoading={true} />}
        <Content showsVerticalScrollIndicator={false} style={{ padding: 20 }}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
            <View style={styles.backButtonWrapper}>
              <Icons.Entypo name={'chevron-thin-left'} style={styles.backIcon} />
              <Text style={styles.backLabel}>{strings.back}</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.logo_con}>
            {strings._language == '中⽂' ? (
              <Image
                resizeMode="contain"
                source={require('../../../../assets/logos/logo-c.png')}
                style={styles.logo}
              />
            ) : (
              <Image resizeMode="contain" source={logo} style={styles.logo} />
            )}
            <View>
              <Text style={styles.heading}>{strings.welcome}</Text>
              <Text style={styles.semiheading}>{strings.register_subheading}</Text>
            </View>
          </View>
          <Formik
            initialValues={{
              full_name: '',
              username: '',
              email: '',
              university: '',
              password: '',
              std_id: '',
              course: '',
              refferral_code: this.state.refferral_code
            }}
            enableReinitialize
            validationSchema={validation}
            onSubmit={this.handleSubmit}
          >
            {({ values, handleChange, handleSubmit, touched, errors }) => {
              return (
                <View style={{ marginTop: 5 }}>
                  <View style={styles.youare}>
                    <Text style={styles.youtext}>{strings.you_are_a}</Text>
                    <View style={styles.checkboxCon}>
                      <CheckBox
                        checkedColor="#467DFF"
                        iconRight
                        uncheckedColor={'lightgray'}
                        center
                        title={strings.student}
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                        checked={this.state.checked === 'student'}
                        size={25}
                        containerStyle={{
                          backgroundColor: 'white',
                          borderWidth: 0,
                          width: 120
                        }}
                        textStyle={{
                          fontFamily: fonts.regular,
                          fontSize: 18
                        }}
                        onPress={() => this.setChecked('student')}
                      />
                      <CheckBox
                        checkedColor="#467DFF"
                        iconRight
                        uncheckedColor={'lightgray'}
                        center
                        title={strings.teacher}
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                        checked={this.state.checked === 'teacher'}
                        containerStyle={{
                          backgroundColor: 'white',
                          borderWidth: 0,
                          width: 120
                        }}
                        textStyle={{
                          fontFamily: fonts.regular,
                          // color:"#467DFF",
                          fontSize: 18
                        }}
                        size={25}
                        onPress={() => this.setChecked('teacher')}
                      />
                    </View>
                  </View>
                  <View style={styles.educationWrapper}>
                    <Text style={styles.youtext}>
                      {strings.you_are_a} {this.state.checked.toUpperCase()} {strings.at}:
                    </Text>
                    <View style={styles.checkboxEducation}>
                      {educationTypeData.map((edu) => {
                        return (
                          <CheckBox
                            checkedColor="#467DFF"
                            uncheckedColor={'lightgray'}
                            title={edu.label}
                            checkedIcon="dot-circle-o"
                            uncheckedIcon="circle-o"
                            checked={this.state.education === edu.value}
                            size={25}
                            containerStyle={styles.educationCheckBoxContainer}
                            textStyle={{
                              fontFamily: fonts.regular,
                              fontSize: 15
                            }}
                            onPress={() => this.setState({ education: edu.value })}
                          />
                        );
                      })}
                    </View>
                  </View>

                  {this.state.fields &&
                    this.state.fields.map((field, index) => {
                      if (field.type !== 'dropdown') {
                        if (this.state.education !== 'university' && field.key === 'std_id') {
                          return <View />;
                        } else if (this.state.checked === 'teacher' && field.key === 'std_id') {
                          return <View />;
                        } else {
                          return (
                            <AuthFields
                              unique={field.key}
                              inputValue={values[field.key]}
                              onChangeText={handleChange(field.key)}
                              keyboardType={field.keyboardType}
                              key={index + 'login'}
                              label={field.label}
                              placeholder={field.placeholder}
                              style={{ backgroundColor: 'white', width: '100%' }}
                              error={
                                errors[field.key] &&
                                touched[field.key] &&
                                errors[field.key]
                              }
                            />
                          );
                        }
                      } else if (field.type === 'dropdown') {
                        if (this.state.education === 'university') {
                          return (
                            <View
                              style={{
                                ...(Platform.OS !== 'android' && {
                                  zIndex: 10
                                })
                              }}
                            >
                              <DropDownPicker
                                searchable
                                controller={(instance) => (this.controller = instance)}
                                items={
                                  field.key === 'university' ? (
                                    _.chain(this.state.universityInitData)
                                      .take(50)
                                      .map((value) => ({
                                        label: value.value,
                                        value: value.id
                                      }))
                                      .value()
                                  ) : (
                                    _.chain(this.state.courseInitData)
                                      .take(50)
                                      .map((value) => ({
                                        label: value.value,
                                        value: value.id
                                      }))
                                      .value()
                                  )
                                }
                                searchTextInputProps={{
                                  onChangeText: (i) => {
                                    field.key === 'university'
                                      ? this.setState({
                                        universityInitData: _.filter(
                                          universityData,
                                          (universityValue) =>
                                            universityValue
                                              .toLowerCase()
                                              .indexOf(
                                                i.toLowerCase()
                                              ) > -1
                                        )
                                      })
                                      : this.setState({
                                        courseInitData: _.filter(
                                          courseData,
                                          (universityValue) =>
                                            universityValue
                                              .toLowerCase()
                                              .indexOf(
                                                i.toLowerCase()
                                              ) > -1
                                        )
                                      });
                                  }
                                }}
                                defaultValue={
                                  field.key === 'university' ? (
                                    this.state.university
                                  ) : (
                                    this.state.courses
                                  )
                                }
                                containerStyle={{ height: 55, marginTop: 10 }}
                                placeholder={field.label}
                                placeholderStyle={{
                                  color: '#467DFF',
                                  fontFamily: fonts.semibold
                                }}
                                labelStyle={{
                                  color: '#467DFF',
                                  fontFamily: fonts.semibold
                                }}
                                style={{ backgroundColor: 'white', zIndex: 10 }}
                                itemStyle={{
                                  justifyContent: 'flex-start',
                                  color: '#467DFF'
                                }}
                                dropDownStyle={{
                                  backgroundColor: '#fafafa',
                                  elevation: 2
                                }}
                                onChangeItem={(item) =>
                                  this.setState({
                                    [field.key]: item.value
                                  })}
                              />
                            </View>
                          );
                        }
                      }
                    })}
                  <View style={{ flexDirection: 'row', right:15 }} >
                    <CheckBox
                      checked={this.state.termsChecked}
                      onIconPress={() => this.setState({ termsChecked: !this.state.termsChecked })}
                    />
                    <Text style={styles.termsHeading}>{strings.by_clicking_register}</Text>
                  </View>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('Policy')}>
                    <Text style={styles.terms}>{strings.terms_data_policy}</Text>
                  </TouchableOpacity>

                  {this.state.loading ? (
                    <View style={[button.container, { justifyContent: 'center' }]}>
                      <ActivityIndicator size="small" color="white" />
                    </View>
                  ) : (
                    <Button
                      onPress={() => this.state.termsChecked === true ? handleSubmit() : alert('Please accept terms and conditions & fill all the required fields.')}
                      style={button}
                      raised
                      primary
                      text={strings.signup_capital}
                    />
                  )}
                  <View style={{ marginTop: '5%' }}>
                    <Language
                      languageOnChangeHandler={(item) => {
                        changeLaguage(item);
                        this.setState({});
                      }}
                    />
                  </View>
                </View>
              );
            }}
          </Formik>
          <View style={{ height: 50 }} />
        </Content>
      </Container>
    );
  }
}

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { signup, getUniversityList, getCourceList } from '../../../redux/actions/auth';

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    tokens: state.auth.tokens,
    universityList: state.auth.universityList,
    courseList: state.auth.courseList,
    errorInfo: state.auth.errorInfo
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signup: bindActionCreators(signup, dispatch),
    getUniversityList: bindActionCreators(getUniversityList, dispatch),
    getCourceList: bindActionCreators(getCourceList, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup);

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
  terms: {
    textAlign: 'center',
    color: '#467DFF',
    fontFamily: fonts.medium,
    fontSize: 15,
    marginBottom: 6
  },
  backButtonWrapper: { flexDirection: 'row', alignItems: 'center' },
  backIcon: { fontSize: 14, color: '#0000FF' },
  backLabel: { marginLeft: 3, color: '#0000FF' },
  termsHeading: { textAlign: 'center', marginVertical: 14, fontFamily: fonts.popins_semibold, fontSize: 14 },
  checkboxCon: { width: '100%', flex: 1, flexDirection: 'row' },
  checkboxEducation: { width: '100%', flex: 1, flexDirection: 'column' },
  youtext: { fontFamily: fonts.semibold, color: '#467DFF' },
  youare: { height: 100, backgroundColor: 'white', borderRadius: 5, padding: 10 },
  educationWrapper: { backgroundColor: 'white', borderRadius: 5, padding: 10, marginTop: 10 },
  logo_con: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', paddingLeft: 10 },
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
  educationCheckBoxContainer: {
    backgroundColor: 'white',
    borderWidth: 0,
    padding: 0
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20
  },
  heading: { fontFamily: fonts.semibold, textAlign: 'left', opacity: 0.7, fontSize: 14 },
  semiheading: { fontFamily: fonts.semibold, textAlign: 'left', fontSize: 17, opacity: 0.8 }
});