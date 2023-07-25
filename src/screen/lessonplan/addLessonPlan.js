import * as React from 'react';
import { Container, Content, Text, View } from 'native-base';
import { StyleSheet, TouchableOpacity } from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import { Button } from 'react-native-material-ui';
import { fonts, color } from '../../theme';
import Modal from 'react-native-modal';
import { AuthButton, AuthFields, Icons } from '../../components';
import { FileUploadPicker } from '../../components/FileUploadPicker';
import TextEditorModal from '../../components/TextEditorModal';
import Loader from '../../components/Loader';
import { strings } from '../../translations/service';

class AddLessonPlan extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selected: 'EDUCATION LEVEL',
			modal: false,
			type: false,
			pagePaper: '',
			editorvalue: '',
			isWriteMore: false,
			subject: '',
			title: '',
			plan: '',
			skill: '',
			price: '',
			level: '',
			notes: '',
			isLoading: false,
			error: '',
			educationLevel: [
				{ title: 'Elementary', label: 'Elementary', value: 'Elementary' },
				{ title: 'Pre-Intermediate', label: 'Pre-Intermediate', value: 'Pre-Intermediate' },
				{ title: 'Intermediate', label: 'Intermediate', value: 'Intermediate' },
				{ title: 'Upper-Intermediate', label: 'Upper-Intermediate', value: 'Upper-Intermediate' },
				{ title: 'Advanced', label: 'Advanced', value: 'Advanced' }
			],
			page_limit_no: 1,

		};
	}

	theme = {
		colors: {
			text: color.dark,
			placeholder: color.lightblue,
			primary: color.lightblue
		}
	};

	editorHandler = (value) => {
		this.setState({ isWriteMore: false });
	};

	loaderHandler = (status) => {
		this.setState({ isLoading: status });
	};

	onChangeLessonsDesc = (text) => {
		this.setState({ editorvalue: text });
	};
	onChangeLessonsPagePaper = (text) => {
		this.setState({ pagePaper: text });
	};

	uploadResourceHandler = (type, response, initFileSize) => {
		this.loaderHandler(true);

		const fileSize = type === 'image' ? Math.round(response.size / 1024) : Math.round(response.size / 10240);
		const formData = new FormData();

		formData.append('file', {
			name: response.name,
			uri: response.uri,
			type: response.type
		});

		if (fileSize > initFileSize) {
			this.setState({ error: "file is large can't upload more than 1 mb" });
		} else {
			this.props.uploadResources(this, formData, type);
		}
	};

	handleAddFile = async () => {
		const pickerResult = await FileUploadPicker('document');

		if (pickerResult.status === 200) {
			await this.uploadResourceHandler('document', pickerResult.response, 10240);
		} else {
			console.log('document picker error', pickerResult.response);
		}
	};

	handlePublishLesson = () => {
		this.setState({ error: '' });

		let lessonDetails = {
			subject: this.state.subject,
			title: this.state.title,
			description: this.state.editorvalue.replace(/"/g, "'"),
			plan: this.state.plan.url || '',
			skill: this.state.skill,
			level: this.state.level,
			price: this.state.price,
			notes: this.state.notes,
			page_limit_no: Number(this.state.page_limit_no)

		};

		for (let key in lessonDetails) {
			if (lessonDetails.hasOwnProperty(key) && lessonDetails[key] === '') {
				this.setState({ error: `${key} is required` });
				return false;
			}
		}

		this.loaderHandler(true);

		this.props.addLesson(this, lessonDetails);
	};

	componentWillReceiveProps(nextProps) {
		if (nextProps.documentUploadDetail !== this.props.documentUploadDetail) {
			this.loaderHandler(false);
			this.setState({
				plan: nextProps.documentUploadDetail
			});
		}

		if (nextProps.addLessons !== this.props.addLessons) {
			this.loaderHandler(false);
			this.setState({ editorvalue: '' });
			this.props.navigation.navigate('LessonPlan');
		}

		if (nextProps.lessonError !== this.props.lessonError) {
			this.loaderHandler(false);
		}
	}

	render() {
		const { hour, username } = this.state;
		const { user } = this.props;
		return (
			<Container style={styles.container}>
				{this.state.isLoading && <Loader isLoading={true} />}
				<Modal isVisible={this.state.type} onBackdropPress={() => this.setState({ type: false })}>
					<View style={styles.modalMainCon}>
						<Text style={styles.modalSelect}>Education Level</Text>
						{this.state.educationLevel.map((item) => {
							return (
								<Button
									raised
									primary
									text={item.title}
									style={buttonQ}
									onPress={() =>
										this.setState({
											selected: item,
											type: false,
											level: item.value
										})}
								/>
							);
						})}
					</View>
				</Modal>
				<Content
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ paddingBottom: 10, paddingHorizontal: 20 }}
					padder
				>
					<AuthFields
						label={strings.subject_capital}
						style={styles.textInput}
						theme={this.theme}
						onChangeText={(value) => this.setState({ subject: value })}
					/>
					<AuthFields
						label={strings.title_capital}
						style={styles.textInput}
						theme={this.theme}
						onChangeText={(value) => this.setState({ title: value })}
					/>
					{/* <View>
						<AuthFields
							label="1 PAGE PAPER"
							style={styles.btnInput}
							multiline={true}
							button
							numOfLines={5}
							onPress={() =>
								this.props.navigation.navigate('TextEditor', {
									onSaveHandler: this.onChangeLessonsPagePaper,
									goBackNav: 'AddLessonPlan',
									editorvalue: this.state.pagePaper || '',
									loaderHandler: this.loaderHandler
								})}
						/>
					</View> */}
					<View>
						<AuthFields
							label={strings.description_capital}
							style={styles.btnInput}
							multiline={true}
							button
							numOfLines={5}
							onPress={() =>
								this.props.navigation.navigate('TextEditor', {
									onSaveHandler: this.onChangeLessonsDesc,
									goBackNav: 'AddLessonPlan',
									editorvalue: this.state.editorvalue || '',
									loaderHandler: this.loaderHandler
								})}
						/>
					</View>
					<AuthFields
						uploadBtn
						style={styles.textInput}
						theme={this.theme}
						value={`${this.state.plan.filename || 'PLAN'}`}
						subText="PDF, DOC"
						rightIcon={
							<Icons.FontAwesome5
								style={{ color: color.primary, opacity: 0.5, fontSize: 16 }}
								name="upload"
							/>
						}
						onPress={() => this.handleAddFile()}
					/>

					<AuthFields
						label={strings.no_of_page_to_show_as_sample}
						style={styles.textInput}
						theme={this.theme}
						maxLength={4}
						keyboardType="numeric"
						onChangeText={(value) => this.setState({ page_limit_no: value })}
					/>

					<AuthFields
						label={strings.skill_capital}
						style={styles.textInput}
						theme={this.theme}
						onChangeText={(value) => this.setState({ skill: value })}
					/>
					<TouchableOpacity onPress={() => this.setState({ type: true })} style={styles.selectButton}>
						<Text style={styles.levelText}>
							{(this.state.selected && this.state.selected.title) || `Level`}
						</Text>
						<Icons.MaterialIcons
							name="arrow-drop-down"
							size={25}
							color="#2B65EC"
							style={{ position: 'absolute', right: 10, opacity: 0.5 }}
						/>
					</TouchableOpacity>
					<AuthFields
						style={styles.textInput}
						theme={this.theme}
						label={strings.price_capital}
						rightIcon={
							<Icons.MaterialIcons
								name="arrow-drop-down"
								size={25}
								color="#2B65EC"
								style={{ position: 'absolute', right: 10, opacity: 0.5 }}
							/>
						}
						iconColor={color.primary}
						onChangeText={(value) => this.setState({ price: value })}
					/>
					<AuthFields
						style={styles.textInput}
						theme={this.theme}
						label={strings.please_add_teachers_notes_if_required_capital}
						rightIcon={
							<Icons.MaterialIcons
								name="arrow-drop-down"
								size={25}
								color="#2B65EC"
								style={{ position: 'absolute', right: 10, opacity: 0.5 }}
							/>
						}
						iconColor={color.primary}
						onChangeText={(value) => this.setState({ notes: value })}
					/>
					{this.state.isWriteMore && (
						<TextEditorModal editorHandler={this.editorHandler} modalVisiblility={this.state.isWriteMore} />
					)}
				</Content>
				<View style={styles.buttonContainer}>
					<Text style={styles.errorMessage}>{this.state.error}</Text>
					<Text style={styles.note}>{strings.you_can_have_maximum_of_10_lesson_plan}</Text>
					<AuthButton title={strings.publish_capital} icon="check" onPress={() => this.handlePublishLesson()} />
				</View>
				<DropdownAlert ref={(ref) => (this.dropDownAlertRef = ref)} zIndex={11111111} />
			</Container>
		);
	}
}

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { uploadResources } from '../../redux/actions/uploadResources';
import { addLesson } from '../../redux/actions/lesson';

const mapStateToProps = (state) => ({
	user: state.auth.user,
	uploadResourcesErr: state.uploadResource.uploadResourcesErr,
	documentUploadDetail: state.uploadResource.documentUploadDetail,
	addLessons: state.lesson.addLessons,
	lessonError: state.lesson.lessonError
});

const mapDispatchToProps = (dispatch) => ({
	uploadResources: bindActionCreators(uploadResources, dispatch),
	addLesson: bindActionCreators(addLesson, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(AddLessonPlan);

const styles = StyleSheet.create({
	container: {
		backgroundColor: color.lightbg,
		height: '100%'
	},
	textInput: {
		backgroundColor: color.light,
		marginVertical: '2%',
		textTransform: 'uppercase',
		fontFamily: fonts.regular,
		fontSize: 12,
		letterSpacing: 0.5,
		borderRadius: 10,
		borderTopEndRadius: 10,
		borderTopStartRadius: 10
	},
	errorMessage: {
		color: color.danger,
		textAlign: 'center',
		fontSize: 17,
		marginBottom: '2%'
	},
	messageText: {
		fontFamily: fonts.regular,
		fontSize: 14,
		letterSpacing: 0.7,
		color: color.dark,
		opacity: 0.4,
		alignSelf: 'center',
		textAlign: 'center',
		marginTop: 20
	},
	buttonContainer: {
		width: '90%',
		marginBottom: '5%',
		bottom: 0,
		left: 0,
		alignSelf: 'center'
	},
	note: {
		fontFamily: fonts.regular,
		alignSelf: 'center',
		opacity: 0.4,
		letterSpacing: 0.7,
		fontSize: 14,
		marginBottom: 10
	},
	selectButton: {
		backgroundColor: 'white',
		alignSelf: 'center',
		width: '100%',
		height: 60,
		marginTop: 10,
		borderRadius: 10,
		padding: 15,
		marginBottom: 5,
		justifyContent: 'center',
		elevation: 0.8
	},
	levelText: {
		fontFamily: fonts.medium,
		color: '#467DFF',
		fontSize: 12,
		textTransform: 'uppercase'
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
	btnInput: {
		fontSize: 12,
		fontFamily: fonts.regular,
		color: color.primary,
		opacity: 1
	},
	writeMoreContainer: {
		justifyContent: 'flex-end',
		alignItems: 'center',
		position: 'absolute',
		top: '72%',
		bottom: 0,
		left: 0,
		right: 0,

		height: '20%'
	},
	writeMoreTxt: {
		fontFamily: fonts.regular,
		fontSize: 10,
		color: color.primary
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
