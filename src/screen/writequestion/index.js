import * as React from 'react';
import { Container, Content, Text, View, Footer } from 'native-base';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { fonts } from '../../theme';
import {
	Icons,
	AuthButton
} from '../../components';
import { strings } from '../../translations/service';

class Forum extends React.Component {
	// static navigationOptions={
	//     headerTitle: 'All products',
	//     // headerRight : (
	//     //   <HeaderButtons headerButtonCompoenent={HeaderButton}>
	//     //     <Item title='Cart' iconName={'ios-search'} onPress={()=>{}}/>
	//     // </HeaderButtons>
	//     // )
	// }

	constructor(props) {
		super(props);

		this.state = {
			question_type: 'normal',
			askSelection: 'student',
			username: '',
			student: false,
			normal: true,
			selected: 'Ask a question',
			modal: false,
			askwho: [
				// {
				//   title: "Any",
				//   icon: <Icons.MaterialIcons name="people" size={30} color="#7BBEE8" />,
				//   key: "any",
				// },
				{
					title: strings.student,
					icon: <Icons.FontAwesome5 name="user-graduate" size={28} color="#7BBEE8" />,
					key: 'student'
				},
				{
					title: strings.teacher,
					icon: <Icons.FontAwesome5 name="user-tie" size={28} color="#7BBEE8" />,
					key: 'teacher'
				}
			],
			question_types: {
				teacher: [
					{
						title: strings.normal_question,
						category: 'normal'
					},
					{
						title: strings.academic_english,
						category: 'academic_english'
					}
				],
				student: [
					{
						title: strings.normal_question,
						category: 'normal'
					}
				],
				any: [
					{
						title: strings.normal_question,
						category: 'normal'
					}
				]
			}
		};
	}

	componentDidMount() {
		this.getHour();
	}

	getHour = () => {
		const date = new Date();
		const hour = date.getHours();
		this.setState({
			hour
		});
	};

	handleSubmit = () => {
		// console.log("ASK A QUESTION STATE", this.state);
		// console.log('ASK A QUESTION STATE', this.state.askSelection);
		// console.log('ASK A QUESTION type STATE', this.state.question_type);
		// console.log('ASK A QUESTION selected  STATE', this.state.selected);

		const forumQuestion = {
			askSelection: this.state.askSelection,
			question_type: this.state.question_type,
			selected: this.state.selected
		};

		this.props.navigation.navigate('QuestionLength', {
			information: forumQuestion
		});

		// if (
		//   this.state.askSelection === "teacher" &&
		//   this.state.question_type === "normal" &&
		//   this.state.selected === "Ask a question"
		// ) {
		//   this.props.navigation.navigate("Questions", {
		//     information: forumQuestion,
		//   });
		// } else {
		//   this.props.navigation.navigate("QuestionLength", {
		//     information: forumQuestion,
		//   });
		// }
	};

	render() {
		const { hour, username } = this.state;
		const { user } = this.props;

		return (
			<Container style={styles.container}>
				<Content>
					<Text style={styles.title}>{strings.category}</Text>
					<View style={styles.modeSelection}>
						<Text style={styles.askTextStyle}>{strings.ask_who}</Text>
						<View style={styles.modeSelectionCon}>
							{this.state.askwho &&
								this.state.askwho.map((ask, index) => {
									return (
										<View key={ask.key} style={styles.studentSelect}>
											<TouchableOpacity
												onPress={() =>
													this.setState({
														askSelection: ask.key,
														question_type: this.state.question_types[
															this.state.askSelection
														][0].category
													})}
												style={[
													styles.studentSelect,
													{
														backgroundColor:
															this.state.askSelection === ask.key ? '#dbecf8' : '#f2f8fd',
														width: '100%'
													}
												]}
											>
												{ask.icon}
												<Text style={styles.studentTextSytle}>{ask.title}</Text>
											</TouchableOpacity>
											{index !== this.state.askwho.length - 1 && (
												<View style={styles.borderSelection} />
											)}
										</View>
									);
								})}
						</View>
					</View>

					{!this.state.student ? (
						<View style={styles.studentCard}>
							<Text style={styles.askTextStyle}>{strings.type_of_question}</Text>
							<View style={styles.questionMainCon}>
								{this.state.question_types &&
									this.state.question_types[this.state.askSelection].map((selection, index) => {
										return (
											<View key={selection.title + index} style={styles.questionselect}>
												<TouchableOpacity
													onPress={() =>
														this.setState({
															question_type: selection.category
														})}
													style={[
														styles.questionselect,
														{
															backgroundColor:
																this.state.question_type === selection.category
																	? '#dbecf8'
																	: '#f2f8fd',
															width: '100%',
															height: '100%'
														}
													]}
												>
													<Text style={styles.questionselectOptions}>{selection.title}</Text>
												</TouchableOpacity>
												{index !==
													this.state.question_types[this.state.askSelection].length - 1 && (
													<View style={styles.borderSelection} />
												)}
											</View>
										);
									})}
							</View>
						</View>
					) : (
						<View style={[ styles.studentCard, { borderWidth: 0 } ]}>
							<Text style={styles.askTextStyle}>Type of question</Text>
							<TouchableOpacity style={styles.typesQuestion}>
								<Text style={[ styles.studentTextSytle, { marginTop: 0 } ]}>{strings.normal_question}</Text>
							</TouchableOpacity>
						</View>
					)}
				</Content>
				<Footer style={{ height: 60, borderTopWidth: 0, backgroundColor: '#F2F6FF' }}>
					<View style={{ width: '90%' }}>
						<AuthButton
							marginRightIcon={0.1}
							title="Next"
							icon="keyboard-arrow-right"
							iconSet="MaterialIcons"
							onPress={() => this.handleSubmit()}
							style={{ container: { flexDirection: 'row-reverse' } }}
						/>
					</View>
				</Footer>
			</Container>
		);
	}
}

import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
	user: state.auth.user
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Forum);

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
		marginBottom: 20
	},
	modeSelection: {
		width: '90%',
		alignSelf: 'center',
		backgroundColor: 'white',
		height: 150,
		borderRadius: 10,
		borderBottomStartRadius: 25,
		borderBottomEndRadius: 25,
		paddingBottom: '3%'
	},
	askTextStyle: {
		textAlign: 'center',
		opacity: 0.4,
		fontFamily: fonts.regular,
		fontSize: 14,
		marginVertical: 5,
		letterSpacing: 0.7,
		paddingVertical: 5
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
		fontFamily: fonts.regular,
		marginTop: 10
	},
	borderSelection: {
		borderColor: '#707070',
		opacity: 0.2,
		borderWidth: 1.5,
		position: 'absolute',
		height: '40%',
		zIndex: 10,
		right: 0
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
	studentCard: {
		width: '90%',
		alignSelf: 'center',
		backgroundColor: 'white',
		height: 100,
		borderRadius: 10,
		borderBottomStartRadius: 25,
		borderBottomEndRadius: 25,
		paddingBottom: '3%',
		marginTop: 20
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
		letterSpacing: 1,
		marginBottom: 10,
		marginTop: 10
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
		height: 70,
		marginTop: 20,
		borderRadius: 15,
		padding: 15,
		justifyContent: 'center'
	},
	select: {
		textTransform: 'uppercase',
		color: '#467DFF',
		fontSize: 10,
		fontFamily: fonts.medium
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
		letterSpacing: 1.12
	}
};
