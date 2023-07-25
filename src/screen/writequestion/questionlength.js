import * as React from 'react';
import { Container, Content, Text, View, Footer } from 'native-base';
import { StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { fonts, color } from '../../theme';
import { Icons, AuthButton } from '../../components';
import Modal from 'react-native-modal';
import { Button } from 'react-native-material-ui';
import { strings } from '../../translations/service';

class QuestionLength extends React.Component {
	constructor(props) {
		super(props);
		this.autoKeyboard = null;
		this.state = {
			username: '',
			student: false,
			normal: true,
			price: '',
			selected: '',
			question_length: 'long',
			modal: false,
			remainingQuestion: 0,
			timeLimit: {
				shortQuestion: '15',
				longQuestion: '1'
			},
			typelist: [
				{ title: 'ielts', minPrice: '50', price: '50', key: 'ielts' },
				{ title: 'toefl', minPrice: '50', price: '50', key: 'toefl' },
				{ title: 'cet 4', minPrice: '25', price: '25', key: 'cet4' },
				{ title: 'cet 6', minPrice: '35', price: '35', key: 'cet6' },
				{ title: 'tem 4', minPrice: '25', price: '25', key: 'tem4' },
				{ title: 'tem 8', minPrice: '35', price: '35', key: 'tem8' },
				{ title: 'ket', minPrice: '17.50', price: '17.50', key: 'ket' },
				{ title: 'pet', minPrice: '17.50', price: '17.50', key: 'pet' }
			],
			list: [
				{
					title: strings.for_students_questions,
					subtext: [ 'Small Question = 0.5 - 3 rmb', 'Long questions = 3-15 rmb' ]
				},
				{
					title: strings.for_teachers_questions,
					subtext: [ 'Small Question = 5-25 rmb', 'Long questions = 20 -75 rmb' ]
				},
				{
					title: 'Academic English',
					subtext: [
						'KET and PET = 17.50 rmb',
						'CET 4 and TEM 4 = 25 rmb',
						'CET 6 and TEM 8 = 35 rmb',
						'IELTS and TOEFEL = 50 rmb'
					]
				}
			],
			askwho: [
				{
					title: 'Any',
					icon: <Icons.MaterialIcons name="people" size={30} color="#7BBEE8" />,
					key: 'any'
				},
				{
					title: 'Student',
					icon: <Icons.FontAwesome5 name="user-graduate" size={28} color="#7BBEE8" />,
					key: 'student'
				},
				{
					title: 'Teacher',
					icon: <Icons.FontAwesome5 name="user-tie" size={28} color="#7BBEE8" />,
					key: 'teacher'
				}
			]
		};
	}

	getRemainingQuesCount = () => {
		this.props.getRemainigQuestionCount();
	};

	componentWillReceiveProps(nextProps) {
		if (nextProps.remainingQuestionCount !== this.props.remainingQuestionCount) {
			this.setState({ remainingQuestion: nextProps.remainingQuestionCount });
		}
	}

	componentDidMount() {
		setTimeout(() => {
			this.autoKeyboard.focus();
		}, 0.1);
		this.getRemainingQuesCount();
		this.getHour();
	}

	componentWillMount() {
		const { information } = this.props.route.params;

		if (information.question_type === 'academic_english') {
			this.state.time = this.state.timeLimit.longQuestion;
			this.state.time_unit = 'hour';
			this.state.selected = {
				title: 'ielts',
				minPrice: '50',
				price: '50',
				key: 'ielts'
			};
			this.state.price = '50';
		} else {
			if (information.askSelection === 'student') {
				this.state.time = this.state.timeLimit.longQuestion;
				this.state.time_unit = 'hour';
				this.state.range = 3;
			} else {
				this.state.time = this.state.timeLimit.longQuestion;
				this.state.time_unit = 'hour';
				this.state.range = 5;
			}

			// this.state.recommended = 10;
		}
	}

	getHour = () => {
		const date = new Date();
		const hour = date.getHours();
		this.setState({ hour });
	};

	handleSubmit = () => {
		const { information } = this.props.route.params;
		// if (information.question_type !== "academic_english") {
		//   if (this.state.biderror || !this.state.recommended) {
		//     alert("You can't put Bid less than recommonded amount.");
		//     return;
		//   }
		// }
		if (information.question_type === 'academic_english') {
			let selPrice = Number.parseInt(this.state.price, 10);
			let orginalMinPrice = Number.parseInt(this.state.selected.minPrice, 10);

			if (selPrice < orginalMinPrice) {
				Alert.alert(
					strings.you_cant_put_bid_less_than_recommended_amount,
					'',
					[ { text: 'Cancel' }, { text: 'OK' } ],
					{ cancelable: false }
				);
				return false;
			}
			if (this.state.price == '') {
				this.autoKeyboard.focus();
				return false;
			}
		}

		if (information.question_type === 'normal') {
			let selPrice = Number.parseFloat(this.state.price, 10);
			let orginalMinPrice = Number.parseFloat(this.state.range, 10);

			if (selPrice < orginalMinPrice) {
				Alert.alert(
					strings.you_cant_put_bid_less_than_recommended_amount,
					'',
					[ { text: 'Cancel' }, { text: 'OK' } ],
					{ cancelable: false }
				);
				return false;
			}
			if (this.state.price == '') {
				this.autoKeyboard.focus();
				return false;
			}
		}

		// if (information.question_type !== "academic_english") {
		//   this.state.price = this.state.recommended;
		// }

		let pricing = this.state;

		// this.props.navigation.navigate('PostQuestion', {
		// 	information: information,
		// 	pricing: pricing
		// });

		const questionPrice = {
			time_limit: this.state.time + ' ' + this.state.time_unit,
			price: this.state.price + ' RMB',
			question_type: this.state.selected.key,
			question_length: this.state.question_length
		};
		this.props.navigation.navigate('Questions', {
			information: information,
			pricing: questionPrice
		});
	};

	render() {
		const { hour, username } = this.state;
		const { user } = this.props;
		const { information } = this.props.route.params;

		return (
			<Container style={styles.container}>
				<Modal isVisible={this.state.modal} onBackdropPress={() => this.setState({ modal: false })}>
					<View style={styles.modalMainCon}>
						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'space-between',
								width: '100%'
							}}
						>
							<View />
							<Text style={styles.modalSelect}>{strings.price_list}</Text>
							<TouchableOpacity onPress={() => this.setState({ modal: false })}>
								<Icons.FontAwesome5 name="times" size={25} />
							</TouchableOpacity>
						</View>
						{this.state.list.map((a, index) => {
							return (
								<View key={index} style={{ borderWidth: 0, alignSelf: 'center', width: '80%' }}>
									<Text
										style={{
											color: '#467DFF',
											fontSize: 14,
											fontFamily: fonts.medium,
											textAlign: 'center',
											marginTop: 15,
											marginBottom: 5,
											letterSpacing: 0.7
										}}
									>
										{a.title}
									</Text>
									<View>
										{a.subtext.map((text) => {
											return (
												<Text
													style={{
														fontSize: 14,
														textAlign: 'center',
														opacity: 0.8,
														fontFamily: fonts.regular,
														lineHeight: 20
													}}
												>
													{text}
												</Text>
											);
										})}
									</View>
								</View>
							);
						})}
						<Text
							style={{
								textAlign: 'center',
								color: '#467DFF',
								opacity: 0.3,
								fontFamily: fonts.regular,
								fontSize: 14,
								marginTop: 15
							}}
						>
							{strings.platform_fee}
						</Text>
					</View>
				</Modal>
				<Modal isVisible={this.state.type} onBackdropPress={() => this.setState({ type: false })}>
					<View style={styles.modalMainCon}>
						<Text style={styles.modalSelect}>{strings.question_type}</Text>
						{this.state.typelist.map((a) => {
							return (
								<Button
									raised
									primary
									text={a.title}
									style={buttonQ}
									onPress={() => {
										this.setState({ selected: a, type: false, price: a.price });
									}}
								/>
							);
						})}
					</View>
				</Modal>
				<Content>
					{information.question_type !== 'academic_english' && (
						<View>
							<Text style={styles.title}>Length</Text>
							{information.askSelection === 'student' && this.state.question_length === 'short' ? (
								<View>
									<Text style={styles.freeQuesTitle}>
										{strings.your_remaining_free_question_is} {this.state.remainingQuestion}
									</Text>
									<Text style={styles.freeQuesDesc}>
										{strings.we_cannot_guarantee_these_questions_will_be_answered}
									</Text>
								</View>
							) : (
								<View />
							)}

							<View style={styles.modeSelection}>
								<View style={styles.modeSelectionCon}>
									<TouchableOpacity
										onPress={() => {
											//               this.state.time = 2;
											// this.state.time_unit = "hour";
											// this.state.price = "25-75";
											// this.state.range = 25;
											if (information.askSelection === 'student') {
												this.setState({
													student: true,
													time: this.state.timeLimit.shortQuestion,
													time_unit: 'min',
													range: 0.5,
													question_length: 'short'
												});
											} else {
												this.setState({
													student: true,
													time: this.state.timeLimit.shortQuestion,
													time_unit: 'min',
													range: 1,
													question_length: 'short'
												});
											}
										}}
										style={[
											styles.studentSelect,
											{
												backgroundColor: this.state.student ? '#dbecf8' : '#f2f8fd'
											}
										]}
									>
										<Icons.Foundation name="graph-horizontal" size={28} color="#7BBEE8" />
										<Text style={styles.studentTextSytle}>{strings.short_question}</Text>
									</TouchableOpacity>
									<View style={styles.borderSelection} />
									<TouchableOpacity
										onPress={() => {
											if (information.askSelection === 'student') {
												this.setState({
													student: false,
													time: this.state.timeLimit.longQuestion,
													time_unit: 'hour',
													range: 3,
													question_length: 'long'
												});
											} else {
												this.setState({
													student: false,
													time: this.state.timeLimit.longQuestion,
													time_unit: 'hour',
													range: 5,
													question_length: 'long'
												});
											}
										}}
										style={[
											styles.studentSelect,
											{
												backgroundColor: !this.state.student ? '#dbecf8' : '#f2f8fd'
											}
										]}
									>
										<Icons.Foundation name="graph-horizontal" size={28} color="#7BBEE8" />
										<Text style={styles.studentTextSytle}>{strings.long_question}</Text>
									</TouchableOpacity>
								</View>
							</View>
						</View>
					)}

					<View style={styles.studentCard}>
						<View style={styles.timelimitCon}>
							<Text style={styles.timeLimit}>{strings.time_limit}</Text>
							<Text style={styles.timeLimitSubText}>
								{this.state.time && this.state.time + ' ' + this.state.time_unit}
							</Text>
						</View>
						<View
							style={{
								flex: 1,
								paddingLeft: 27,
								justifyContent: 'center'
							}}
						>
							<Text style={styles.timeLimit}>{strings.price}</Text>
							<View
								style={{
									flexDirection: 'row',
									justifyContent: 'flex-start',
									alignItems: 'center'
								}}
							>
								<TextInput
									ref={(ref) => (this.autoKeyboard = ref)}
									keyboardType="number-pad"
									value={this.state.price}
									placeholder={
										information.question_type !== 'academic_english' ? (
											this.state.range.toString()
										) : (
											''
										)
									}
									editable={information.question_type !== 'academic_english'}
									onChangeText={(value) => this.setState({ price: value })}
									style={{
										color: '#000',
										backgroundColor: color.light,
										width: '15%',
										height: '60%',
										padding: 0,
										margin: 0
									}}
								/>
								<Text style={{ fontSize: 12 }}> {strings.RMB}</Text>
							</View>
							{/* <TextInput style={styles.timeLimitSubText}>
								{this.state.price + " " + "RMB"}
							</TextInput> */}
							<TouchableOpacity
								onPress={() => this.setState({ modal: true })}
								style={{ position: 'absolute', right: 0 }}
							>
								<Icons.FontAwesome
									name="question-circle"
									size={20}
									color="#2B65EC"
									style={{ opacity: 0.5 }}
								/>
							</TouchableOpacity>
						</View>
					</View>

					{/* {this.state.range > 0 && (
            <>
              <View style={styles.studentCard}>
                <View
                  style={[
                    {
                      flex: 1,
                      paddingLeft: 10,
                      justifyContent: "center",
                    },
                    this.state.biderror && {
                      borderWidth: 1,
                      borderColor: "red",
                    },
                  ]}
                >
                  <Text style={styles.timeLimit}>
                    Recommended Bid?{" "}
                    {this.state.biderror && (
                      <Text style={{ color: "red", fontSize: 10 }}>
                        Bid cannot be less than range.
                      </Text>
                    )}
                  </Text>

                  <TextInput
                    ref={(ref) => (this.Input = ref)}
                    value={this.state.recommended}
                    style={[styles.timeLimitSubText]}
                    keyboardType={"number-pad"}
                    onBlur={() => {
                      if (this.state.recommended < this.state.range) {
                        // alert("You Cannot set Bid less than range.");
                        // alert("You Cannot set Bid less than range.");
                        this.setState(
                          {
                            recommended: parseFloat(this.state.range),
                            biderror: true,
                          },
                          () => {
                            this.forceUpdate();
                          }
                        );
                      } else {
                        this.setState({
                          biderror: false,
                        });
                      }
                    }}
                    onChangeText={(text) => {
                      this.state.recommended = parseFloat(text);
                    }}
                  ></TextInput>
                  <TouchableOpacity
                    onPress={() => this.setState({ modal: true })}
                    style={{ position: "absolute", right: 0 }}
                  >
                    <Icons.FontAwesome
                      name="question-circle"
                      size={20}
                      color="#2B65EC"
                      style={{ opacity: 0.5 }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <Text
                style={{
                  color: "gray",
                  width: "70%",
                  textAlign: "center",
                  alignSelf: "center",
                  marginTop: 10,
                }}
              >
                Price in recommended will be final bid price for the question.
              </Text>
            </>
          )} */}

					{/* {information.question_type === "academic_english" && ( */}

					{(information.askSelection === 'student' &&
						information.selected === 'Ask a question' &&
						information.question_type === 'normal') ||
					(information.askSelection === 'teacher' &&
						information.selected === 'Ask a question' &&
						information.question_type === 'normal') ? (
						<View />
					) : (
						<TouchableOpacity onPress={() => this.setState({ type: true })} style={styles.selectButton}>
							<Text style={styles.questionTypeText}>
								{(this.state.selected && this.state.selected.title) || `Question Type`}
							</Text>
							<Icons.MaterialIcons
								name="arrow-drop-down"
								size={25}
								color="#2B65EC"
								style={{ position: 'absolute', right: 10, opacity: 0.5 }}
							/>
						</TouchableOpacity>
					)}

					{/* )} */}
				</Content>
				<Footer style={{ height: 70, borderTopWidth: 0, backgroundColor: '#F2F6FF' }}>
					<View style={{ width: '90%' }}>
						<AuthButton
							marginRightIcon={0.1}
							title="Next"
							icon="keyboard-arrow-right"
							iconSet="MaterialIcons"
							onPress={() => this.handleSubmit()}
						/>
					</View>
				</Footer>
			</Container>
		);
	}
}

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getRemainigQuestionCount } from '../../redux/actions/forum';

const mapStateToProps = (state) => ({
	user: state.auth.user,
	remainingQuestionCount: state.forum.remainingQuestionCount
});

const mapDispatchToProps = (dispatch) => ({
	getRemainigQuestionCount: bindActionCreators(getRemainigQuestionCount, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(QuestionLength);

const styles = StyleSheet.create({
	studentSelectWho: {
		flex: 1,
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center'
	},
	modeSelectionConWrite: {
		width: '95%',
		alignSelf: 'center',
		flex: 1,
		flexDirection: 'row',
		overflow: 'hidden',
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center'
	},
	container: {
		backgroundColor: '#F2F6FF'
	},
	title: {
		textAlign: 'center',
		color: '#467DFF',
		fontSize: 20,
		fontFamily: fonts.medium,
		marginTop: 20,
		marginBottom: 20
	},
	freeQuesTitle: {
		textAlign: 'center',
		color: color.primary,
		fontSize: 14,
		fontFamily: fonts.medium
	},
	freeQuesDesc: {
		textAlign: 'center',
		color: color.darkSky,
		fontSize: 12,
		fontFamily: fonts.medium,
		marginBottom: 5
	},
	modeSelection: {
		width: '90%',
		alignSelf: 'center',
		backgroundColor: 'white',
		height: 100,
		borderBottomStartRadius: 25,
		borderBottomEndRadius: 25,
		paddingBottom: '3%',
		paddingTop: '3%'
	},
	askTextStyle: {
		textAlign: 'center',
		opacity: 0.4,
		fontFamily: fonts.regular,
		fontSize: 14,
		marginVertical: 5
	},
	modeSelectionCon: {
		width: '95%',
		alignSelf: 'center',
		flex: 1,
		flexDirection: 'row',
		overflow: 'hidden',
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center'
	},
	studentSelect: {
		flex: 1,
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center'
	},
	studentTextSytle: {
		color: '#7BBEE8',
		fontSize: 14,
		fontFamily: fonts.regular
		// marginTop: 10,
	},
	borderSelection: {
		borderColor: '#707070',
		opacity: 0.2,
		borderWidth: 1.5,
		position: 'absolute',
		height: '40%',
		zIndex: 10
	},
	questionMainCon: {
		flex: 1,
		width: '95%',
		alignSelf: 'center',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 15,
		overflow: 'hidden'
	},
	questionselect: {
		flex: 1,
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center'
	},
	questionselectOptions: {
		color: '#7BBEE8',
		fontSize: 14,
		fontFamily: fonts.regular
	},
	questionTypeText: {
		fontFamily: fonts.medium,
		color: '#467DFF',
		fontSize: 12,
		textTransform: 'uppercase'
	},
	studentCard: {
		width: '90%',
		alignSelf: 'center',
		backgroundColor: 'white',
		height: 60,
		borderRadius: 15,
		// paddingBottom: "3%",
		marginTop: 20,
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 10
	},
	typesQuestion: {
		flex: 1,
		width: '95%',
		alignSelf: 'center',
		borderRadius: 15,
		backgroundColor: '#f2f8fd',
		justifyContent: 'center',
		alignItems: 'center'
	},
	modalSelect: {
		textAlign: 'center',
		fontSize: 20,
		fontFamily: fonts.medium,
		marginBottom: 10,
		letterSpacing: 1
	},
	modalMainCon: {
		backgroundColor: 'white',
		alignItems: 'center',
		padding: 20,
		paddingBottom: 30,
		borderRadius: 5
	},
	selectButton: {
		backgroundColor: 'white',
		alignSelf: 'center',
		width: '90%',
		height: 50,
		marginTop: 20,
		borderRadius: 10,
		padding: 15,
		justifyContent: 'center'
	},
	select: {
		textTransform: 'uppercase',
		color: '#467DFF',
		fontSize: 10,
		fontFamily: fonts.medium
	},
	timeLimit: {
		color: '#467DFF',
		fontFamily: fonts.medium,
		fontSize: 10
	},
	timeLimitSubText: { fontFamily: fonts.regular, fontSize: 14 },
	timelimitCon: {
		height: '100%',
		width: '26%',
		borderRightWidth: 1,
		justifyContent: 'center',
		borderColor: 'rgba(0,0,0,0.2)',
		paddingLeft: 10
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
		width: '100%',
		borderRadius: 5
	},
	text: {
		fontSize: 14,
		fontFamily: fonts.medium,
		// marginRight: 10,
		textAlign: 'center',
		color: '#467DFF',
		textTransform: 'uppercase'
	}
};
