import * as React from 'react';
import { createRef } from 'react';
import {
	StyleSheet,
	Text,
	TouchableOpacity,
	Linking} from 'react-native';
import { View } from 'native-base';
import moment from 'moment';
import { Card } from 'react-native-paper';
import DropdownAlert from 'react-native-dropdownalert';
import { AuthFields, Icons, DocumentViewer } from '../../components';
import { fonts, color } from '../../theme';
import { FileUploadPicker } from '../../components/FileUploadPicker';
import Loader from '../../components/Loader';
import ImagePreview from '../../components/ImagePreview';
import {
	DialogContent,
	SlideAnimation,
	DialogComponent
} from 'react-native-dialog-component';
import { strings } from '../../translations/service';

class HomeworkChat extends React.Component {
	constructor(props) {
		super(props);
		this.touchable = createRef();
		this.menuRef = createRef();
		this.state = {
			homeworkDetails: {},
			isLoading: false,
			image: [],
			video: [],
			document: [],
			answer: '',
			questionFeedbacks: [],
			showDocument: false,
			downloadDocumentUrl: '',
			inputDisabled: false,
			askQesCount: 0,
			showPopover: false,
			showLeaveQes: false,
			showLeavOpt: false
		};
	}

	loaderHandler = (status) => {
		this.setState({ isLoading: status });
	};

	gethomeworkDetails = () => {
		if (this.props.route && this.props.route.params && this.props.route.params.homeworkDetails) {
			const { homeworkDetails } = this.props.route && this.props.route.params;
			this.loaderHandler(false);
			this.props.gethomeworkDetail(this, homeworkDetails.id);
		}
	};

	getQuestionAnswers = () => {
		if (this.props.route && this.props.route.params && this.props.route.params.homeworkDetails) {
			this.loaderHandler(true);
			const { homeworkDetails } = this.props.route && this.props.route.params;
			this.setState({ homeworkDetails });
			console.log(`homeworkDetails`, homeworkDetails);
			this.props.getHomeworkChatList(this, homeworkDetails.id);
		}
	};

	componentDidMount() {
		this.loaderHandler(false);
		this.getQuestionAnswers();
	}

	handleAskQes = (qesFeedBackLst) => {
		const { user } = this.props;
		let askQesCounter = this.state.askQesCount;
		qesFeedBackLst.map((questionAns, index) => {
			console.log('inn handle asssss qqq', questionAns, '--->>', user.id);
			if (questionAns.user_id === user.id && askQesCounter <= 5) {
				console.log('innnnnnn');
				askQesCounter = askQesCounter + 1;
			}
			console.log('extra===>>', askQesCounter);
		});

		this.setState({ askQesCount: askQesCounter });
		if (askQesCounter >= 5) {
			this.setState({ inputDisabled: true });
		}
	};

	componentWillReceiveProps(nextProps) {
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

			let newCount = this.state.askQesCount + 1;
			console.log('add question successfully', newCount);

			this.setState({ answer: '' });
		}

		console.log('next props homeworkChat', nextProps.homeworkChat);
		console.log('state homeworkChat', this.props.homeworkChat);

		if (nextProps.homeworkChat !== this.props.homeworkChat) {
			console.log('get feedback details', nextProps.homeworkChat);

			this.loaderHandler(false);
			this.setState({ questionFeedbacks: nextProps.homeworkChat });
			this.handleAskQes(nextProps.homeworkChat);
		}

		if (nextProps.uploadResourcesErr !== this.props.uploadResourcesErr) {
			this.loaderHandler(false);
		}

		if (nextProps.homeworkError !== this.props.homeworkError) {
			this.loaderHandler(false);
		}
	}

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
		const { homeworkDetails } = this.props.route && this.props.route.params;
		console.log('question id', homeworkDetails.id);
		console.log('iamge', this.state.image);
		console.log('video', this.state.video);
		console.log('document', this.state.document);
		console.log('answer ', this.state.answer);

		const submitedAnswer = {
			homework_id: homeworkDetails.id,
			answer: this.state.answer,
			image: this.state.image,
			video: this.state.video,
			document: this.state.document,
			is_like: 0
		};

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

	render() {
		const { user } = this.props;

		return (
			<View style={styles.rootContainer}>
				{this.state.isLoading && <Loader isLoading={this.state.isLoading} />}
				<View style={{ flex: 1 }}>
					{this.state.questionFeedbacks && this.state.questionFeedbacks.length > 0 ? (
						this.state.questionFeedbacks.map((questionAns, index) => {
							console.log(user.id, questionAns.user_id);

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
									<Card style={styles.container}>
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
				</View>
				<View
					style={[ styles.btnContainer, this.state.inputDisabled && styles.disabledContainer ]}
					pointerEvents={this.state.inputDisabled ? 'none' : 'auto'}
				>
					<View style={styles.answerInputContainer}>
						<View style={styles.answerInnerContainer}>
							<AuthFields
								label={strings.answers_capital}
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
				{this.state.showDocument && (
					<DocumentViewer
						documentUrl={this.state.downloadDocumentUrl}
						onDismiss={() => this.setState({ showDocument: false })}
					/>
				)}

				{this.state.showLeaveQes && (
					<DialogComponent
						key={'DialogComponentTransaction' + 'question'}
						dialogStyle={{
							width: '100%',
							top: -50,
							borderRadius: 5,
							height: 280,
							elevation: 0,
							backgroundColor: 'transparent'
						}}
						ref={(dialogComponent) => {
							this.dialogTransComponent = dialogComponent;
						}}
						dialogAnimation={new SlideAnimation({ slideFrom: 'bottom' })}
						onDismissed={() => this.setState({ showLeaveQes: false })}
					>
						<DialogContent key={'transactionsRefund'}>
							<View>
								<View style={styles.confirmContainer}>
									<Text style={styles.confirmMessageTitle}>{strings.are_you_sure}</Text>
									<Text style={styles.confirmMessageText}>
										{strings.leave_this_question}
									</Text>
								</View>
							</View>
							<View style={styles.confirmBtnContainer}>
								<TouchableOpacity
									style={[ styles.btnRefundContainer, { backgroundColor: color.light } ]}
									onPress={() => this.props.navigation.navigate('Home')}
								>
									<Text style={[ styles.btnConfirmText, { color: color.dark } ]}>{strings.leave_question}</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[ styles.btnRefundContainer, { backgroundColor: color.primary } ]}
									onPress={() => this.setState({ showLeaveQes: false })}
								>
									<Text style={styles.btnConfirmText}>{strings.return}</Text>
								</TouchableOpacity>
							</View>
						</DialogContent>
					</DialogComponent>
				)}

				<DropdownAlert ref={(ref) => (this.dropDownAlertRef = ref)} zIndex={11111111} />
			</View>
		);
	}
}

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { uploadResources } from '../../redux/actions/uploadResources';
import { submitHomeworkChat, getHomeworkChatList } from '../../redux/actions/homework';

const mapStateToProps = (state) => ({
	user: state.auth.user,
	imageUploadDetail: state.uploadResource.imageUploadDetail,
	videoUploadDetail: state.uploadResource.videoUploadDetail,
	documentUploadDetail: state.uploadResource.documentUploadDetail,
	uploadResourcesErr: state.uploadResource.uploadResourcesErr,
	addHomeworkChat: state.homework.addHomeworkChat,
	homeworkChat: state.homework.homeworkChat,
	homeworkError: state.homework.homeworkError
});

const mapDispatchToProps = (dispatch) => ({
	uploadResources: bindActionCreators(uploadResources, dispatch),
	submitHomeworkChat: bindActionCreators(submitHomeworkChat, dispatch),
	getHomeworkChatList: bindActionCreators(getHomeworkChatList, dispatch)
});

const styles = StyleSheet.create({
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
	container: {
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
		height: '18%',
		position: 'absolute', //Here is the trick
		bottom: 5
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
		width: '30%',
		marginTop: '3%'
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeworkChat);
