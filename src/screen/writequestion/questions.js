import * as React from 'react';
import { Container, Content, Text, View, Footer } from 'native-base';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';

import DropdownAlert from 'react-native-dropdownalert';
import { fonts, color } from '../../theme';
import CheckBox from 'react-native-check-box';
import { AuthButton, AuthFields, Icons } from '../../components';
import Loader from '../../components/Loader';
import { strings } from '../../translations/service';

class Questions extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			modal: false,
			isChecked: false, // 0 == False && 1 == True
			loading: false,
			questionSubject: '',
			questionTitle: '',
			questionDesc: '',
		};
	}
	componentWillReceiveProps(nextProps) {
		if (this.props.route && this.props.route.params && this.props.route.params.richTextInputValue !== undefined) {
			// this.setState({ questionDesc: this.props.route.params.richTextInputValue })
		}

		if (
			nextProps.fourmAddQuestion !== this.props.fourmAddQuestion
		) {
			this.setState({ loading: false });
		}

		if (nextProps.fourmErr !== this.props.fourmErr) {
			this.setState({ loading: false });
		}
	}

	handleTextEditorSaveChange = (textValue) => {
		this.setState({ questionDesc: textValue });
	};

	loaderHandler = (status) => {
		this.setState({ loading: status });
	};

	handleReadFullView = () => {
		this.props.navigation.navigate('TextEditor', {
			editorvalue: this.state.questionDesc,
			onSaveHandler: this.handleTextEditorSaveChange,
			loaderHandler: this.loaderHandler,
			instance: this
		});
	};

	handleSubmit = () => {
		const { information, pricing } = this.props.route.params;

		const forumQuestionDetail = {
			created_date: moment().format('YYYY-MM-DD HH:mm:ss'),
			ask_whom: information.askSelection,
			question_category: information.question_type,
			question_length: pricing ? pricing.question_length : '',
			time_limit: pricing ? pricing.time_limit : '',
			price: pricing ? pricing.price : '',
			question_type: pricing ? pricing.question_type || '' : '',
			subject: this.state.questionSubject,
			title: this.state.questionTitle,
			description: this.state.questionDesc.replace(/"/g, "'"),
			status: 'open',
			is_answered: 0,
			is_locked: 0,
			use_wallet: this.state.isChecked, // Default "0" // False
		};

		if (Number(pricing.price.replace(' RMB', '')) < Number(this.props.user.balance) == false && this.state.isChecked == true) {
			alert(strings.insufficient_amount_in_wallet_alert)
			this.setState({isChecked: false})
		} else {
			this.props.addQuestion(this, forumQuestionDetail)
		}

		this.setState({ modal: false });
	};

	render() {
		const { pricing } = this.props.route.params;
		let price = Number(pricing.price.replace(' RMB', ''));
		return (
			<Container style={styles.container}>
				<Content>
					{this.state.loading && <Loader isLoading={true} />}
					<Text style={styles.title}>{strings.question}</Text>
					<View style={styles.authFields}>
						<Text style={styles.label}>{strings.subject}</Text>
						<TextInput
							defaultValue=""
							selectTextOnFocus={true}
							style={styles.textInput}
							onChangeText={(value) => this.setState({ questionSubject: value })}
						/>
					</View>
					<View style={styles.authFields}>
						<Text style={styles.label}>Title</Text>
						<TextInput
							defaultValue={this.state.questionTitle}
							selectTextOnFocus={true}
							style={styles.textInput}
							onChangeText={(value) => this.setState({ questionTitle: value })}
						/>
					</View>

					<View style={styles.descAuthField}>
						<AuthFields
							label={strings.description_capital}
							style={styles.btnInput}
							multiline={true}
							button
							numOfLines={5}
							onPress={() => this.handleReadFullView()}
						/>
					</View>
					<Modal isVisible={this.state.modal}>
						<View style={styles.modalMainCon}>
							<View style={styles.modalHeader}>
								<View />
								<Text style={styles.modalHeaderTitle}>{strings.pay}</Text>
								<TouchableOpacity onPress={() => this.setState({ modal: false })}>
									<Icons.FontAwesome5 name="times" size={30} />
								</TouchableOpacity>
							</View>
							<View style={{ width: '100%' }}>
								<View style={{ backgroundColor: '#ecf2ff', padding: 20 }}>
									<View
										style={{
											flexDirection: 'row',
											justifyContent: 'space-between'
										}}
									>
										<Text style={styles.serviceText}>{strings.service}</Text>
										<Text style={styles.serviceText}>{strings.cost}</Text>
									</View>
									<View
										style={{
											flexDirection: 'row',
											justifyContent: 'space-between',
											marginTop: 5
										}}
									>
										<Text
											style={{
												opacity: 0.8,
												fontSize: 14,
												fontFamily: fonts.regular
											}}
										>
											{strings.forums}
										</Text>
										<Text
											style={{
												opacity: 0.8,
												fontSize: 14,
												fontFamily: fonts.popins_semibold,
												textTransform: 'uppercase'
											}}
										>
											{price} {strings.RMB}
										</Text>
									</View>
									<Text
										style={{
											opacity: 0.3,
											fontSize: 14,
											fontFamily: fonts.regular
										}}
									>
										{strings.platform_fee}
									</Text>
								</View>
								<View style={styles.bodyRows}>
									<Text
										style={{
											color: '#467DFF',
											fontSize: 14,
											fontFamily: fonts.medium
										}}
									>
										{strings.total}
									</Text>
									<Text
										style={{
											textTransform: 'uppercase',
											fontSize: 14,
											fontFamily: fonts.semibold
										}}
									>
										{price + price * 10 / 100} {strings.RMB}
									</Text>
								</View>
							</View>
							<View style={{ padding: 20 }}>
								<CheckBox
									leftTextStyle={{
										opacity: 0.3,
										fontFamily: fonts.regular,
										fontSize: 14,
										marginRight: 10
									}}
									style={{ width: '100%', alignSelf: 'center' }}
									onClick={() => {
										this.setState({
											isChecked: !this.state.isChecked
										});
									}}
									isChecked={this.state.isChecked}
									leftText={strings.use_my_wallet_balance}
									checkedCheckBoxColor="#467DFF"
									uncheckedCheckBoxColor="rgba(0,0,0,0.5)"
								/>
								<View style={{ width: '100%', alignSelf: 'center' }}>
									<AuthButton
										title={strings.use_wechat_pay}
										icon="wechat"
										onPress={() => this.handleSubmit()}
									/>
								</View>
							</View>
						</View>
					</Modal>
				</Content>

				<Footer style={{ height: 70, backgroundColor: color.bg }}>
					<View style={{ width: '90%', backgroundColor: color.bg }}>
						<AuthButton
							marginRightIcon={0.1}
							title={strings.post_capital}
							icon="add"
							iconSet="MaterialIcons"
							onPress={() => {
								if (this.state.questionSubject == '' || this.state.questionTitle == '' || this.state.questionDesc == '') {
									alert(strings.please_enter_all_the_fields)
								} else {
									this.setState({ modal: true })
								}
							}
							}
						/>
					</View>
				</Footer>

				<DropdownAlert ref={(ref) => (this.dropDownAlertRef = ref)} zIndex={11111111} />
			</Container>
		);
	}
}

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addQuestion } from '../../redux/actions/forum';
import moment from 'moment'; //s
import { start_wechat_pay } from '../../redux/actions/wechatPay';

const mapStateToProps = (state) => ({
	user: state.auth.user,
	fourmAddQuestion: state.forum.fourmAddQuestion,
	fourmErr: state.forum.fourmErr
});

const mapDispatchToProps = (dispatch) => ({
	addQuestion: bindActionCreators(addQuestion, dispatch),
	start_wechat_pay: bindActionCreators(start_wechat_pay, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Questions);

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#F2F6FF'
	},
	title: {
		textAlign: 'center',
		color: '#467DFF',
		fontSize: 20,
		fontFamily: fonts.medium,
		marginTop: 20,
		marginBottom: 10
	},
	label: {
		textTransform: 'uppercase',
		color: '#2B65EC',
		fontSize: 11,
		fontFamily: fonts.regularxs
	},
	readContianer: {
		zIndex: 111111,
		justifyContent: 'center',
		alignSelf: 'center',
		position: 'absolute',
		top: '85%'
	},
	txtEditorContainer: {},
	readText: {
		textTransform: 'uppercase',
		color: '#7BBEE8',
		fontSize: 12,
		fontFamily: fonts.regularxs
	},
	authFields: {
		zIndex: 11,
		width: '90%',
		backgroundColor: 'white',
		minHeight: 60,
		paddingHorizontal: 18,
		paddingTop: 10,
		borderRadius: 10,
		justifyContent: 'center',
		alignSelf: 'center',
		marginBottom: 15
	},
	richTextInput: {
		minHeight: 100
	},
	textInput: {
		zIndex: 111,
		width: '100%',
		fontFamily: fonts.regular,
		fontSize: 14
	},
	btnInput: {
		fontSize: 12,
		fontFamily: fonts.regular,
		color: color.primary,
		opacity: 1
	},
	descAuthField: {
		zIndex: 11,
		width: '90%',
		backgroundColor: 'white',
		paddingHorizontal: 5,
		borderRadius: 10,
		justifyContent: 'center',
		alignSelf: 'center'
	},
	modalMainCon: {
		width: '100%',
		alignSelf: 'center',
		backgroundColor: color.light,
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
	purchasePaper: {
		width: '90%',
		backgroundColor: color.primary,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 10,
		padding: 12,
		marginVertical: 10
	},
	btnTxt: {
		color: color.light,
		textTransform: 'uppercase',
		fontFamily: fonts.primary
	}
});

const buttonQ = {
	container: {
		marginTop: 10,
		borderColor: '#467DFF',
		height: 45,
		flexDirection: 'row-reverse',
		backgroundColor: 'white',
		borderWidth: 1,
		width: '100%'
	},
	text: {
		fontSize: 14,
		fontFamily: fonts.medium,
		// marginRight: 10,
		textAlign: 'center',
		color: '#467DFF'
	}
};
