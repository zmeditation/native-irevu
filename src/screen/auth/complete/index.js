import * as React from 'react';
import { Container, Content, Text, View } from 'native-base';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { AuthFields } from '../../../components';
import { color, fonts } from '../../../theme';
import { ActivityIndicator } from 'react-native-paper';
import { Button } from 'react-native-material-ui';
import DropDownPicker from 'react-native-dropdown-picker';
import { CheckBox, Avatar } from 'react-native-elements';
import { Formik } from 'formik';
import * as yup from 'yup';
import DropdownAlert from 'react-native-dropdownalert';
import { universityData, courseData } from '../../../utils/constants';
import * as _ from 'lodash';
import { strings } from '../../../translations/service';

const validation = yup.object().shape({
	full_name: yup.string(),
	email: yup.string().email(),
	password: yup.string().required().min(6),
	std_id: yup.string()
});

class Signup extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			universityInitData: universityData,
			courseInitData: courseData,
			checked: 'student',
			fields: [
				// {
				//     label:"enter_full_name",
				//     placeholder:"enter_full_name",
				//     keyboardType:"default",
				//     key:"full_name"
				// },
				// {
				//     label:"enter_username",
				//     placeholder:"enter_username",
				//     keyboardType:"default",
				//     key:"username"
				// },
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
			]
		};
	}

	setChecked = (value) => {
		this.setState({
			checked: value
		});
	};

	handleSubmit = (form) => {
		if (!this.state['university'] || !this.state['course']) {
			alert(strings.please_select_university_and_course);
			return;
		}

		form.email = form.email.trim().toLowerCase();
		const { user } = this.props;

		form = {
			...form,
			university: this.state['university'],
			course: this.state['course'],
			type: this.state.checked,
			full_name: user.full_name
		};

		this.props.updateUser(this, form);

		console.log('FORM POSTED FOR SIGNUP', form);
	};

	render() {
		const { user } = this.props;
		return (
			<Container style={styles.container}>
				<Content
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ padding: 20, paddingTop: 30, paddingBottom: 50 }}
				>
					<View style={styles.logo_con}>
						<Avatar
							size={60}
							containerStyle={{ marginRight: 15 }}
							rounded
							resizeMode="contain"
							source={{ uri: user.headimgurl }}
						/>
						<View>
							<Text style={styles.heading}>{`Welcome ${user.full_name}`}</Text>
							<Text style={styles.semiheading}>{"Let's Complete Your Profile"}</Text>
						</View>
					</View>

					<Formik
						onSubmit={(form) => {
							this.handleSubmit(form);
						}}
						validationSchema={validation}
						initialValues={{
							full_name: '',
							email: '',
							password: '',
							std_id: '',
							full_name: user.full_name
						}}
					>
						{({ values, handleChange, handleSubmit, touched, errors }) => (
							<View style={{ marginTop: 5 }}>
								{console.log('ERRORS IN FORM', errors)}
								<View style={styles.youare}>
									<Text style={styles.youtext}>YOU ARE A</Text>
									<View style={styles.checkboxCon}>
										<CheckBox
											checkedColor="#467DFF"
											iconRight
											uncheckedColor={'lightgray'}
											center
											title="Student"
											checkedIcon="dot-circle-o"
											uncheckedIcon="circle-o"
											checked={this.state.checked === 'student'}
											size={25}
											containerStyle={{ backgroundColor: 'white', borderWidth: 0, width: 120 }}
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
											title="Teacher"
											checkedIcon="dot-circle-o"
											uncheckedIcon="circle-o"
											checked={this.state.checked === 'teacher'}
											containerStyle={{ backgroundColor: 'white', borderWidth: 0, width: 120 }}
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

								{this.state.fields &&
									this.state.fields.map((field, index) => {
										if (field.key === 'std_id' && this.state.checked === 'teacher') {
											return null;
										}

										if (field.type !== 'dropdown') {
											return (
												<AuthFields
													unique={field.key}
													onChangeText={handleChange(field.key)}
													keyboardType={field.keyboardType}
													key={index + 'login'}
													label={field.label}
													placeholder={field.placeholder}
													style={{ backgroundColor: 'white', width: '100%' }}
												/>
											);
										} else if (field.type === 'dropdown') {
											return (
												<DropDownPicker
													searchable
													items={
														field.key === 'university' ? (
															_.chain(this.state.universityInitData)
																.take(50)
																.map((value) => ({ label: value, value: value }))
																.value()
														) : (
															_.chain(this.state.courseInitData)
																.take(50)
																.map((value) => ({ label: value, value: value }))
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
																					.indexOf(i.toLowerCase()) > -1
																		)
																	})
																: this.setState({
																		courseInitData: _.filter(
																			courseData,
																			(universityValue) =>
																				universityValue
																					.toLowerCase()
																					.indexOf(i.toLowerCase()) > -1
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
													dropDownStyle={{ backgroundColor: '#fafafa', elevation: 2 }}
													onChangeItem={(item) =>
														this.setState({
															[field.key]: item.value
														})}
												/>
											);
										}
									})}

								<Text style={styles.termsHeading}>By clicking Register, you agree to our</Text>

								<TouchableOpacity>
									<Text style={styles.terms}>Terms Data Policy</Text>
								</TouchableOpacity>

								{this.state.loading ? (
									<View style={[ button.container, { justifyContent: 'center' } ]}>
										<ActivityIndicator size="small" color="white" />
									</View>
								) : (
									<Button
										onPress={() => handleSubmit()}
										style={button}
										raised
										primary
										text={strings.signup_capital}
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
import { updateUser } from '../../../redux/actions/auth';

const mapStateToProps = (state) => {
	return {
		user: state.auth.user,
		tokens: state.auth.tokens
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		updateUser: bindActionCreators(updateUser, dispatch)
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
	termsHeading: { textAlign: 'center', marginVertical: 10, fontFamily: fonts.popins_semibold },
	checkboxCon: { width: '100%', flex: 1, flexDirection: 'row' },
	youtext: { fontFamily: fonts.semibold, color: '#467DFF' },
	youare: { height: 100, backgroundColor: 'white', borderRadius: 5, padding: 10 },
	logo_con: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', paddingLeft: 10, marginBottom: 10 },
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
		width: 100,
		height: 100,
		alignSelf: 'center',
		marginBottom: 20
	},
	heading: { fontFamily: fonts.semibold, textAlign: 'left', opacity: 0.7, fontSize: 14 },
	semiheading: { fontFamily: fonts.semibold, textAlign: 'left', fontSize: 17, opacity: 0.8 }
});
