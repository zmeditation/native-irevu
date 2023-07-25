import * as React from 'react';
import { Container, Content, Header, View, Left, Body, Title, Right, Footer } from 'native-base';
import DropdownAlert from 'react-native-dropdownalert';
import { StyleSheet, Linking, Text, TouchableOpacity } from 'react-native';
import { fonts, color } from '../../theme';
import { Icons, AuthFields, DocumentViewer } from '../../components';
import MultiFunctionTextEditor from '../../components/MultiFunctionTextEditor';
import Loader from '../../components/Loader';
import { createRef } from 'react';
import moment from 'moment';
import { Card } from 'react-native-paper';
import { userType } from '../../utils/constants';
import { FileUploadPicker } from '../../components/FileUploadPicker';
import ImagePreview from '../../components/ImagePreview';
import { strings } from '../../translations/service';

class HomeworkGraded extends React.Component {
	constructor(props) {
		super(props);
		this.touchable = createRef();
		this.menuRef = createRef();
		this.state = {
			selectedTag: 'body',
			isLoading: false,
			selectedStyles: [],
			isModalOpen: false,
			editorValue: '',
			gradeValue: '',
			showDocument: false,
			downloadDocumentUrl: '',
			///////////////
			homeworkDetails: {},
			isLoading: false,
			image: [],
			video: [],
			document: [],
			answer: '',
			questionFeedbacks: [],
			showDocument: false,
			downloadDocumentUrl: '',
			showPopover: false
		};
	}

	header = () => {
		return (
			<Header style={{ backgroundColor: 'white' }}>
				<Left>
					<TouchableOpacity onPress={() => this.props.navigation.goBack()}>
						<Icons.Entypo name="chevron-left" color="black" size={30} style={{ marginLeft: 0 }} />
					</TouchableOpacity>
				</Left>
				<Body style={{ minWidth: '50%', marginLeft: '10%' }}>
					<Title style={styles.headerTitle}>{`${this.props.route.params.componentheaderTitle ||
						strings.graded_homework} `}</Title>
				</Body>
				<Right style={{ maxWidth: '20%' }} />
			</Header>
		);
	};

	loaderHandler = (status) => {
		this.setState({ isLoading: status });
	};

	componentDidMount() {
		if (this.props.route && this.props.route.params && this.props.route.params.homeworkDetails) {
			this.setState({
				editorValue: this.props.route.params.homeworkDetails.homework_details || '',
				gradeValue: this.props.route.params.homeworkDetails.grade || ''
			});
		}

		this.loaderHandler(false);
		this.getQuestionAnswers();
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.savedHomework !== this.props.savedHomework) {
			this.setState({ editorValue: nextProps.savedHomework });
		}

		if (nextProps.homeworkError !== this.props.homeworkError) {
			this.loaderHandler(false);
			console.log('submited homework', nextProps.homeworkError);
		}

		if (nextProps.downloadResult !== this.props.downloadResult && nextProps.downloadResult.length > 0) {
			this.setState({ isLoading: false });
			this.setState({
				downloadDocumentUrl: nextProps.downloadResult[0].fileUrl,
				showDocument: true
			});
		}

		if (nextProps.downloadErr !== this.props.downloadErr) {
			this.setState({ isLoading: false });
		}

		if (nextProps.imageUploadDetail !== this.props.imageUploadDetail) {
			this.loaderHandler(false);
			this.setState({
				image: [ ...this.state.image, nextProps.imageUploadDetail ]
			});
			console.log('image upload detail success---->>>', nextProps.imageUploadDetail);
		}

		if (nextProps.videoUploadDetail !== this.props.videoUploadDetail) {
			this.loaderHandler(false);
			this.setState({
				video: [ ...this.state.video, nextProps.videoUploadDetail ]
			});
			console.log('video upload detail success---->>>', nextProps.videoUploadDetail);
		}

		if (nextProps.documentUploadDetail !== this.props.documentUploadDetail) {
			this.loaderHandler(false);
			this.setState({
				document: [ ...this.state.document, nextProps.documentUploadDetail ]
			});
		}

		if (nextProps.addHomeworkChat !== this.props.addHomeworkChat) {
			this.loaderHandler(false);

			this.setState({ answer: '' });
		}

		if (nextProps.homeworkChat !== this.props.homeworkChat) {
			this.loaderHandler(false);
			this.setState({ questionFeedbacks: nextProps.homeworkChat });
		}

		if (nextProps.uploadResourcesErr !== this.props.uploadResourcesErr) {
			this.loaderHandler(false);
		}

		if (nextProps.homeworkError !== this.props.homeworkError) {
			this.loaderHandler(false);
		}
	}

	downloadResultsHandler = () => {
		console.log('calll doneload handler', this.props.route.params.homeworkDetails);
		this.setState({ isLoading: true });
		const homeworkDetails = {
			class_id: this.props.route.params.homeworkDetails && this.props.route.params.homeworkDetails.class_id,
			homework_id: this.props.route.params.homeworkDetails && this.props.route.params.homeworkDetails.homework_id
		};
		// dispatch(downloadHomework());
		this.props.getCheckedHomeworkPDF(this, homeworkDetails);
	};
	///////////////////////////////////////////////////////////////////////////

	loaderHandler = (status) => {
		this.setState({ isLoading: status });
	};

	getQuestionAnswers = () => {
		if (this.props.route && this.props.route.params && this.props.route.params.homeworkDetails) {
			this.loaderHandler(true);
			const { homeworkDetails } = this.props.route.params;
			this.setState({ homeworkDetails });
			this.props.getHomeworkChatList(this, homeworkDetails.id);
		}
	};

	theme = {
		colors: {
			text: color.dark,
			placeholder: color.lightblue,
			primary: color.lightblue
		}
	};

	buttonTheam = { button: { height: '100%', backgroundColor: 'yellow' } };

	openLink(event, url) {
		Linking.openURL(url);
	}

	uploadResourceHandler = (type, response, initFileSize) => {
		this.loaderHandler(true);
		console.log('picker response', response.size);

		const fileSize = type === 'image' ? Math.round(response.size / 1024) : Math.round(response.size / 10240);
		const formData = new FormData();

		formData.append('file', {
			name: response.name,
			uri: response.uri,
			type: response.type
		});
		console.log({ fileSize });

		if (fileSize > initFileSize) {
			console.log("file is large can't upload more than 1 mb", initFileSize);
		} else {
			this.props.uploadResources(this, formData, type);
		}
	};

	handleAddImage = async () => {
		const pickerResult = await FileUploadPicker('image');

		if (pickerResult.status === 200) {
			await this.uploadResourceHandler('image', pickerResult.response, 1024);
		} else {
			console.log('image picker error', pickerResult.response);
		}
	};

	handleAddVideo = async () => {
		const pickerResult = await FileUploadPicker('video');

		console.log('reseponseee------', pickerResult);

		if (pickerResult.status === 200) {
			await this.uploadResourceHandler('video', pickerResult.response, 10240);
		} else {
			console.log('video picker error', pickerResult.response);
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

	handleOnChangeInput = (inputValue) => {
		this.setState({ answer: inputValue });
	};

	handleSubmitAnswer = () => {
		const { homeworkDetails, homework } = this.props.route && this.props.route.params;
		console.log(`homeworkDetails`, homeworkDetails);

		const submitedAnswer = {
			homework_id: homeworkDetails.homework_id,
			homework_submission_id: homeworkDetails.id,
			answer: this.state.answer,
			image: this.state.image,
			video: this.state.video,
			document: this.state.document,
			is_like: 0,
			notification_id:
				userType.student == this.props.user.user_type
					? `${homeworkDetails.user_id}`
					: `${homeworkDetails.student_id}`
		};
		console.log(`submitedAnswer`, submitedAnswer, this.props.user);

		this.loaderHandler(true);

		this.props.submitHomeworkChat(this, submitedAnswer);
	};

	questionFeedbackImages = (imageUrl) => {
		return <ImagePreview imageStyle={styles.ansImages} imageUri={imageUrl || ''} />;
	};

	quesFeedbackDateTime = (dateTime) => {
		const ansDate = moment(dateTime).format('DD/MM/yyyy');
		const ansTime = moment(dateTime).format('HH:MM');

		return ansTime + ' - ' + ansDate;
	};

	videoViewerHandle = (videoUrl) => {
		console.log('calll video ', videoUrl);
		this.props.navigation.navigate('VideoPlayer', { videoUrl });
	};

	documentViewrHandle = (documentUrl) => {
		this.setState({ showDocument: true, downloadDocumentUrl: documentUrl });
	};

	///////////////////////////////////////////////////////////////////////////

	render() {
		const submitBtnText = strings.grade;
		const { user } = this.props;
		const { homeworkDetails } = this.props.route && this.props.route.params;
		return (
			<Container style={styles.container}>
				{this.header()}

				<MultiFunctionTextEditor
					editorDefaultValue={this.state.editorValue}
					submitBtnText={submitBtnText}
					loaderHandler={this.loaderHandler}
					downloadResultHandler={this.downloadResultsHandler}
					instance={this}
					isGrading={false}
					isEditable={false}
					gradeValue={this.state.gradeValue || ''}
					rich={{
						minHeight: Dimensions.get('window').height / 4,
						maxHeight: Dimensions.get('window').height / 4
					}}
					isDownload={this.props.route.params.isDownload || false}
					isViewGrade={this.props.route.params.isViewGrade}
				/>
				<Content keyboardDismissMode="interactive" style={{ padding: 5 }}>
					{this.state.isLoading && <Loader isLoading={true} />}
					{this.state.questionFeedbacks && this.state.questionFeedbacks.length > 0 ? (
						this.state.questionFeedbacks.map((questionAns, index) => {
							return (
								<View
									key={index}
									style={[
										styles.topMainContainer,
										user.id === questionAns.user_id || questionAns.user_id === ''
											? styles.rightTopMainContainer
											: styles.leftTopMainContainer
									]}
								>
									<Card style={styles.Chatcontainer}>
										<View style={styles.cardMainContainer}>
											<View style={styles.msgQuesMainContainer}>
												<Text style={styles.description}>{questionAns.answer || ''}</Text>

												<View style={styles.ansImgContainer}>
													{questionAns.image && questionAns.image.length > 0 ? (
														questionAns.image.map((queImagesAns, index) => {
															return this.questionFeedbackImages(queImagesAns.url);
														})
													) : (
														<View />
													)}

													{questionAns.video && questionAns.video.length > 0 ? (
														questionAns.video.map((queVideoAns, index) => {
															return (
																<TouchableOpacity
																	style={[
																		styles.questionTouchIconRes,
																		styles.videoQesRes
																	]}
																	onPress={() =>
																		this.videoViewerHandle(queVideoAns.url)}
																>
																	<Icons.Entypo
																		name="video"
																		style={[
																			styles.quesResIcon,
																			styles.videoQesIcon
																		]}
																	/>
																</TouchableOpacity>
															);
														})
													) : (
														<View />
													)}

													{questionAns.document && questionAns.document.length > 0 ? (
														questionAns.document.map((queDocAns, index) => {
															return (
																<TouchableOpacity
																	style={styles.questionTouchIconRes}
																	onPress={() =>
																		this.documentViewrHandle(queDocAns.url)}
																>
																	<Icons.MaterialCommunityIcons
																		name="file-document"
																		style={styles.quesResIcon}
																	/>
																</TouchableOpacity>
															);
														})
													) : (
														<View />
													)}
												</View>

												<View style={styles.dateTimeContainer}>
													<Text style={styles.notifyTitle}>
														{this.quesFeedbackDateTime(questionAns.created_at)}
													</Text>

													{/* <TouchableOpacity>
                                                            <Icons.FontAwesome5
                                                                name="thumbs-down"
                                                                style={styles.thumbIcon}
                                                            ></Icons.FontAwesome5>
                                                        </TouchableOpacity> */}
												</View>
											</View>
										</View>
									</Card>
								</View>
							);
						})
					) : (
						<View />
					)}
					{this.state.showDocument && (
						<DocumentViewer
							documentUrl={this.state.downloadDocumentUrl}
							onDismiss={() => this.setState({ showDocument: false })}
						/>
					)}
				</Content>
				{homeworkDetails.checked &&
				(homeworkDetails.checked == 1 || homeworkDetails.checked == true) && (
					<Footer style={[ styles.btnContainer, { width: '100%', height: 125, marginHorizontal: 0 } ]}>
						<View style={styles.btnContainer} pointerEvents={this.state.inputDisabled ? 'none' : 'auto'}>
							<View style={styles.answerInputContainer}>
								<View style={styles.answerInnerContainer}>
									<AuthFields
										label="ANSWER"
										style={styles.textInput}
										inputValue={this.state.answer}
										theme={this.theme}
										underLineColor={color.light}
										multiline={true}
										onChangeText={(txtValue) => this.handleOnChangeInput(txtValue)}
										isDisabled={this.state.inputDisabled}
									/>
								</View>
								<View style={styles.attachContainer}>
									<TouchableOpacity onPress={() => this.handleAddImage()}>
										<Icons.FontAwesome5 name="image" style={styles.attachIcon} />
									</TouchableOpacity>
									<TouchableOpacity onPress={() => this.handleAddVideo()}>
										<Icons.FontAwesome5 name="film" style={styles.attachIcon} />
									</TouchableOpacity>
									<TouchableOpacity onPress={() => this.handleAddFile()}>
										<Icons.FontAwesome5 name="link" style={styles.attachIcon} />
									</TouchableOpacity>
								</View>
							</View>
							<View style={styles.btnSendContainer}>
								<TouchableOpacity style={styles.btnSend} onPress={() => this.handleSubmitAnswer()}>
									<Icons.FontAwesome5 name="paper-plane" style={styles.btnIcon} />
								</TouchableOpacity>
							</View>
						</View>
					</Footer>
				)}
				<DropdownAlert ref={(ref) => (this.dropDownAlertRef = ref)} />
			</Container>
		);
	}
}

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { postSubmission } from '../../redux/actions/questions';
import { getHomeworkChatList, submitHomework, submitHomeworkChat } from '../../redux/actions/homework';
import { getCheckedHomeworkPDF } from '../../redux/actions/downloadResources';
import { uploadResources } from '../../redux/actions/uploadResources';
import { Dimensions } from 'react-native';

const mapStateToProps = (state) => ({
	user: state.auth.user,
	submitedHomework: state.homework.submitedHomework,
	savedHomework: state.homework.savedHomework,
	homeworkError: state.homework.homeworkError,
	downloadResult: state.downloadResource.downloadResult,
	downloadErr: state.downloadResource.downloadErr,
	/////////
	imageUploadDetail: state.uploadResource.imageUploadDetail,
	videoUploadDetail: state.uploadResource.videoUploadDetail,
	documentUploadDetail: state.uploadResource.documentUploadDetail,
	uploadResourcesErr: state.uploadResource.uploadResourcesErr,
	addHomeworkChat: state.homework.addHomeworkChat,
	homeworkChat: state.homework.homeworkChat
});

const mapDispatchToProps = (dispatch) => ({
	postSubmission: bindActionCreators(postSubmission, dispatch),
	submitHomework: bindActionCreators(submitHomework, dispatch),
	getCheckedHomeworkPDF: bindActionCreators(getCheckedHomeworkPDF, dispatch),
	/////////
	uploadResources: bindActionCreators(uploadResources, dispatch),
	submitHomeworkChat: bindActionCreators(submitHomeworkChat, dispatch),
	getHomeworkChatList: bindActionCreators(getHomeworkChatList, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeworkGraded);

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
	footer: { backgroundColor: 'transparent', height: 70, width: '100%' },
	footerCard: {
		backgroundColor: 'white',
		width: '100%',
		marginTop: 10,
		height: 50,
		paddingTop: 10
	},
	dividertransparent: {
		width: 100,
		height: 1,
		backgroundColor: 'gray',
		alignSelf: 'center',
		opacity: 0,
		marginBottom: 10
	},

	divider: {
		width: 100,
		height: 1,
		backgroundColor: 'gray',
		alignSelf: 'center',
		opacity: 0.3,
		marginVertical: 15
	},

	subtitle: {
		opacity: 0.5,
		color: 'black',
		alignSelf: 'center',
		fontFamily: fonts.regular,
		fontSize: 12
	},
	headerTitle: {
		color: 'black',
		alignSelf: 'center',
		fontFamily: fonts.medium,
		fontSize: 20
	},
	container: {
		backgroundColor: '#F2F6FF'
	},
	topcard: {
		width: '100%',
		backgroundColor: 'white',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 15,
		borderRadius: 20,
		marginTop: 20,
		alignSelf: 'center'
	},
	profile: { justifyContent: 'center', marginLeft: 10 },
	profileName: {
		fontFamily: fonts.regular,
		fontSize: 14,
		top: 5
	},
	degreeName: {
		fontSize: 14,
		fontFamily: fonts.regular,
		opacity: 0.2,
		bottom: 0
	},
	gradesTitle: {
		fontSize: 12,
		fontFamily: fonts.regular,
		textAlign: 'right'
	},
	grades: {
		opacity: 0.8,
		fontFamily: fonts.regular,
		fontSize: 23,
		color: '#467DFF'
	},
	serviceText: {
		color: '#467DFF',
		fontSize: 14,
		fontFamily: fonts.medium
	},
	modalMainCon: {
		width: '100%',
		alignSelf: 'center',
		backgroundColor: 'white',
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
	/////////////
	rootContainer: {
		flex: 1,
		backgroundColor: color.bg
	},
	disabledContainer: {
		opacity: 0.5
	},
	userInfoContainer: {
		marginTop: '5%',
		zIndex: 0
	},
	topMainContainer: {
		marginHorizontal: '2%'
	},
	rightTopMainContainer: {
		maxWidth: '88%',
		alignSelf: 'flex-end'
	},
	leftTopMainContainer: {
		maxWidth: '88%',
		alignSelf: 'flex-start'
	},
	topMainContainerBorder: {
		borderWidth: 1,
		borderColor: color.primary
	},
	heading: {
		fontSize: 23,
		fontFamily: fonts.semibold,
		color: '#467DFF',
		textAlign: 'center'
	},
	rightLblContainer: {
		justifyContent: 'center'
	},
	imageContainer: {
		marginTop: '2%'
	},
	ansImgContainer: {
		flexDirection: 'row',
		marginVertical: '1%',
		width: '100%',
		flexWrap: 'wrap',
		justifyContent: 'flex-start',
		alignItems: 'center'
	},
	ansImages: {
		height: 50,
		width: 50,
		borderRadius: 5,
		marginHorizontal: '2%'
	},
	dateTimeContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginRight: '2%'
	},
	Chatcontainer: {
		width: '95%',
		marginVertical: 8,
		borderRadius: 10,
		paddingVertical: 14,
		paddingLeft: 20,
		marginHorizontal: '2%',
		justifyContent: 'space-between'
	},
	cardMainContainer: {
		flexDirection: 'row'
	},
	userImg: {
		height: 40,
		width: 40,
		borderRadius: 50
	},
	msgMainContainer: {
		width: '52%',
		marginLeft: '5%',
		justifyContent: 'center'
	},
	notifyTitle: {
		fontSize: 10,
		textTransform: 'uppercase',
		fontFamily: fonts.regular,
		color: color.darkgray,
		letterSpacing: 0.7
	},
	userNameText: {
		fontSize: 14,
		color: color.darkSky,
		fontFamily: fonts.regular
	},
	description: {
		color: color.dark,
		fontFamily: fonts.regular,
		fontSize: 13
	},
	dateTime: {
		fontSize: 10,
		textTransform: 'uppercase',
		fontFamily: fonts.regular,
		color: color.darkgray,
		letterSpacing: 0.7
	},
	hours: {
		fontSize: 12,
		fontFamily: fonts.regular,
		color: color.dark,
		letterSpacing: 0.7,
		textAlign: 'right'
	},
	msgQuesMainContainer: {
		width: '95%',
		marginLeft: '2%'
	},
	btnContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		borderRadius: 5,
		backgroundColor: color.bg,
		marginHorizontal: '5%',
		width: '90%',
		height: 120
	},
	btnAccept: {
		backgroundColor: color.primary,
		width: '40%',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 10,
		borderRadius: 5
	},
	btnPass: {
		backgroundColor: color.light,
		width: '40%',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 10,
		borderRadius: 5
	},
	txtAccept: {
		textTransform: 'uppercase',
		color: color.light,
		fontFamily: fonts.regular,
		fontSize: 13
	},
	txtPass: {
		textTransform: 'uppercase',
		color: color.dark,
		fontFamily: fonts.regular,
		fontSize: 13
	},
	textInput: {
		backgroundColor: color.light,
		marginVertical: '2%',
		textTransform: 'uppercase',
		fontFamily: fonts.regular,
		fontSize: 12,
		letterSpacing: 0.5,
		maxHeight: '100%'
	},
	answerInputContainer: {
		width: '87%',
		height: '100%',
		borderRadius: 10,
		backgroundColor: color.light
	},
	answerInnerContainer: {
		width: '100%',
		marginTop: '2%',
		maxHeight: '100%'
	},
	btnSendContainer: {
		height: '100%',
		marginLeft: '2%',
		marginTop: '2%'
	},
	btnSend: {
		height: '90%',
		backgroundColor: color.primary,
		paddingHorizontal: '2%',
		borderRadius: 5,
		justifyContent: 'center',
		alignItems: 'center'
	},
	btnIcon: {
		color: color.light,
		marginRight: 5,
		fontSize: 20
	},
	attachContainer: {
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		width: '30%'
		// marginTop: '3%'
	},
	attachIcon: {
		color: color.primary,
		fontSize: 15
	},
	thumbIcon: {
		color: color.primary,
		fontSize: 18,
		transform: [ { rotateY: '180deg' } ]
	},
	questionTouchIconRes: {
		borderWidth: 1,
		borderColor: color.darkSky,
		paddingVertical: '4%',
		paddingHorizontal: '4%',
		borderRadius: 5,
		marginRight: '3%'
	},
	quesResIcon: {
		color: color.primary,
		fontSize: 24
	},
	videoQesRes: {
		paddingVertical: '4%',
		paddingHorizontal: '4%'
	},
	videoQesIcon: {
		fontSize: 24
	},
	confirmContainer: {
		backgroundColor: color.light,
		paddingHorizontal: 20,
		paddingVertical: 20,
		borderRadius: 10
	},
	confirmMessageTitle: {
		color: color.lightblue,
		fontFamily: fonts.regular,
		letterSpacing: 0.7,
		fontSize: 10,
		textTransform: 'uppercase'
	},
	confirmMessageText: {
		color: color.dark,
		fontFamily: fonts.regular,
		letterSpacing: 0.65,
		fontSize: 13,
		marginTop: 5
	},
	confirmBtnContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: '4%'
	},
	btnRefundContainer: {
		width: '48%',
		padding: 8,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 5,
		flexDirection: 'row',
		height: 43
	},
	btnConfirmText: {
		textTransform: 'uppercase',
		color: color.light,
		fontFamily: fonts.medium,
		fontSize: 14,
		letterSpacing: 1.12
	}
});
