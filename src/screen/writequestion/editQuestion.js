import * as React from 'react';
import { Container, Content, Text, View, Footer } from 'native-base';
import { StyleSheet, TextInput } from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import { fonts, color } from '../../theme';
import { AuthButton, AuthFields } from '../../components';
import Loader from '../../components/Loader';
import { strings } from '../../translations/service';

class Questions extends React.Component {
	constructor(props) {
		super(props);
		const { questionDetail } = props.route.params;
		this.state = {
			loading: false,
			questionSubject: questionDetail.subject,
			questionTitle: questionDetail.title,
			questionDesc: questionDetail.description
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.fourmErr !== this.props.fourmErr) {
			this.setState({ loading: false });
		}
	}

	handleTextEditorSaveChange = (textValue) => {
		this.setState({ questionDesc: textValue });
		console.log('call save change', textValue);
	};

	loaderHandler = (status) => {
		this.setState({ loading: status });
	};

	handleReadFullView = () => {
		this.props.navigation.navigate('TextEditor', {
			goBackNav: 'editQuestion',
			editorvalue: this.state.questionDesc,
			onSaveHandler: this.handleTextEditorSaveChange,
			loaderHandler: this.loaderHandler,
			instance: this
		});
	};

	handleSubmit = () => {
		const { questionDetail } = this.props.route.params;

		let finalDescription = this.state.questionDesc;

		const forumQuestionDetail = {
			is_locked: 0,
			status: 'open',
			is_answered: 0,
			id: questionDetail.id,
			ask_whom: questionDetail.ask_whom,
			question_category: questionDetail.question_category,
			question_length: questionDetail.question_length,
			time_limit: questionDetail.time_limit,
			price: questionDetail.price,
			question_type: questionDetail.question_type || '',
			subject: this.state.questionSubject,
			title: this.state.questionTitle,
			description: this.state.questionDesc.replace(/"/g, "'")
		};

		// forumQuestionDetail.description = this.state.questionDesc;

		// console.log("question details --->>>", JSON.parse(JSON.parse(json).description));


		this.props.editQuestion(this, forumQuestionDetail);
	};

	render() {
		return (
			<Container style={styles.container}>
				<Content>
					{this.state.loading && <Loader isLoading={true} />}
					<Text style={styles.title}>{strings.question}</Text>

					<View style={styles.authFields}>
						<Text style={styles.label}>{strings.subject}</Text>
						<TextInput
							defaultValue={this.state.questionSubject}
							selectTextOnFocus={true}
							style={styles.textInput}
							onChangeText={(value) => this.setState({ questionSubject: value })}
						/>
					</View>

					<View style={styles.authFields}>
						<Text style={styles.label}>{strings.title}</Text>
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
				</Content>

				<Footer style={{ height: 70, backgroundColor: color.bg }}>
					<View style={{ width: '90%', backgroundColor: color.bg }}>
						<AuthButton marginRightIcon={0.1} title="Edit" onPress={() => this.handleSubmit()} />
					</View>
				</Footer>
				<DropdownAlert ref={(ref) => (this.dropDownAlertRef = ref)} zIndex={11111111} />
			</Container>
		);
	}
}

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { editQuestion } from '../../redux/actions/forum';

const mapStateToProps = (state) => ({
	user: state.auth.user,
	fourmErr: state.forum.fourmErr
});

const mapDispatchToProps = (dispatch) => ({
	editQuestion: bindActionCreators(editQuestion, dispatch)
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
