import * as React from 'react';
import { createRef } from 'react';
import {
	StyleSheet,
	Text,
	Image,
	TouchableOpacity,
	ScrollView,
	SafeAreaView,
	Linking
} from 'react-native';
import { View } from 'native-base';
import moment from 'moment';
import { Card } from 'react-native-paper';
import DropdownAlert from 'react-native-dropdownalert';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { AuthFields, Icons, DocumentViewer } from '../../components';
import { fonts, color } from '../../theme';
import { dummyImageUrl } from '../../utils/constants';
import { FileUploadPicker } from '../../components/FileUploadPicker';
import Loader from '../../components/Loader';
import ImagePreview from '../../components/ImagePreview';
import HtmlViewer from '../../components/HtmlViewer';
import { DialogContent, DialogComponent } from 'react-native-dialog-component';
import { strings } from '../../translations/service';

class FeedbackChat extends React.Component {
	constructor(props) {
		super(props);
		this.touchable = createRef();
		this.menuRef = createRef();
		this.state = {
			questionDetails: null,
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

	getQuestionDetails = () => {
		if (this.props.route && this.props.route.params) {
			const { id } = this.props.route.params;
			this.loaderHandler(false);
			this.props.getQuestionDetail(this, id);
		}
	};

	getQuestionAnswers = () => {
		if (this.props.route && this.props.route.params) {
			const { id } = this.props.route.params;
			this.loaderHandler(true);
			this.props.getQuestionFeedbackList(this, id);
		}
	};

	componentDidMount() {
		this.getQuestionDetails();
		this.getQuestionAnswers();
	}
	componentDidUpdate() {
		const { questionDetail } = this.props.route && this.props.route.params;

		let demo = moment(questionDetail.created_date).add(15, 'minutes').format('DD/MM/YYYY HH:mm');

		setTimeout(() => {
			this.setState({ timing: demo <= moment().format('DD/MM/YYYY HH:mm') });
		}, 1000);

		this.props.navigation.setOptions({
			headerRight: () => (
				<Menu style={{ zIndex: 9999 }} ref={this.menuRef}>
					<MenuTrigger>
						<Icons.FontAwesome5 name="ellipsis-v" color="black" size={20} style={{ margin: 15 }} />
					</MenuTrigger>
					<MenuOptions
						optionsContainerStyle={{
							width: 180,
							marginTop: 30,
							borderRadius: 5,
							backgroundColor: color.dark
						}}
					>
						{this.state.questionFeedbacks.length == 0 &&
							questionDetail.created_by == this.props.user.id &&
							this.state.timing && (
								<View>
									<MenuOption>
										<TouchableOpacity
											onPress={() => {
												const forumQuestionDetail = {
													is_repost: 1,
													is_locked: 0,
													status: 'open',
													is_answered: 0,
													id: questionDetail.id,
													created_date: moment().format('YYYY-MM-DD HH:mm:ss'),
													ask_whom: questionDetail.ask_whom,
													question_category: questionDetail.question_category,
													question_length: questionDetail.question_length,
													time_limit: questionDetail.time_limit,
													price: questionDetail.price,
													question_type: questionDetail.question_type,
													subject: questionDetail.subject,
													title: questionDetail.title,
													description: questionDetail.description
												};
												console.log(forumQuestionDetail);
												this.props.repostQuestion(this, forumQuestionDetail);
												this.menuRef.current.close();
											}}
										>
											<Text style={styles.menuText}>Repost</Text>
										</TouchableOpacity>
									</MenuOption>
									<MenuOption>
										<TouchableOpacity
											onPress={() => {
												this.props.navigation.navigate('editQuestion', {
													questionDetail: questionDetail
												});
												this.menuRef.current.close();
											}}
										>
											<Text style={styles.menuText}>Edit</Text>
										</TouchableOpacity>
									</MenuOption>
									<MenuOption>
										<TouchableOpacity
											onPress={() => {
												this.props.deleteQuestion(this, questionDetail.id);
												this.menuRef.current.close();
											}}
										>
											<Text style={styles.menuText}>Delete</Text>
										</TouchableOpacity>
									</MenuOption>
								</View>
							)}
						<MenuOption>
							<TouchableOpacity
								onPress={() => {
									this.setState({ showLeaveQes: true });
									this.menuRef.current.close();
								}}
							>
								<Text style={styles.menuText}>Leave Question</Text>
							</TouchableOpacity>
						</MenuOption>
					</MenuOptions>
				</Menu>
			)
		});
	}

	handleAskQes = (qesFeedBackLst) => {
		const { user } = this.props;
		let askQesCounter = this.state.askQesCount;
		qesFeedBackLst.map((questionAns, index) => {
			if (questionAns.user_id === user.id && askQesCounter <= 20) {
				askQesCounter = askQesCounter + 1;
			}
			// else if (askQesCounter > 5) {
			//     // this.setState({: true })
			//     return true;
			// }
		});

		this.setState({ askQesCount: askQesCounter });
		if (askQesCounter >= 20) {
			this.setState({ inputDisabled: true });
		}

		// if (userId === askQesUid) {
		//     // this.askQesCount = this.askQesCount + 1;

		//     // this.setState(
		//     //     prevState => ({ askQesCount: prevState.askQesCount + 1 })
		//     // )
		//     // if (this.askQesCount > 5) {
		//     //     this.setState({ inputDisabled: true })
		//     // }
		// }
	};

	componentWillReceiveProps(nextProps) {
		if (nextProps.questionDetail !== this.props.questionDetail) {
			this.loaderHandler(false);

			this.setState({ questionDetails: nextProps.questionDetail });
		}

		if (nextProps.imageUploadDetail !== this.props.imageUploadDetail) {
			this.loaderHandler(false);
			this.setState({
				image: [...this.state.image, nextProps.imageUploadDetail]
			});
		}

		if (nextProps.videoUploadDetail !== this.props.videoUploadDetail) {
			this.loaderHandler(false);
			this.setState({
				video: [...this.state.video, nextProps.videoUploadDetail]
			});
		}

		if (nextProps.documentUploadDetail !== this.props.documentUploadDetail) {
			this.loaderHandler(false);
			this.setState({
				document: [...this.state.document, nextProps.documentUploadDetail]
			});
		}

		if (nextProps.addQuestionFeedback !== this.props.addQuestionFeedback) {
			this.loaderHandler(false);

			let newCount = this.state.askQesCount + 1;

			this.setState({ answer: '' });
		}

		if (nextProps.questionFeedbackList !== this.props.questionFeedbackList) {
			this.loaderHandler(false);
			this.setState({ questionFeedbacks: nextProps.questionFeedbackList });
			this.handleAskQes(nextProps.questionFeedbackList);
		}

		if (nextProps.uploadResourcesErr !== this.props.uploadResourcesErr) {
			this.loaderHandler(false);
		}

		if (nextProps.fourmErr !== this.props.fourmErr) {
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
		const { questionDetails } = this.state;
		const submitedAnswer = {
			question_id: questionDetails.questionDetail.id,
			answer: this.state.answer,
			image: this.state.image,
			video: this.state.video,
			document: this.state.document,
			notification_id:
				this.props.user.id == questionDetails.questionDetail.created_by
					? `${questionDetails.questionDetail.accepted_by}`
					: `${questionDetails.questionDetail.created_by}`,
			is_like: 0
		};

		this.loaderHandler(true);

		this.props.submitQuestionFeedback(this, submitedAnswer);
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
	handleAcceptQuestion = (questionId) => {
		const { questionDetails } = this.state;
		this.props.acceptQuestion(this, questionId, questionDetails.questionDetail.created_by);
	};

	check = () => {
		const { user } = this.props;
		const { questionDetails } = this.state;
		if (questionDetails) {
			if (questionDetails.questionDetail.created_by != user.id) {
				if (!questionDetails.questionDetail.is_locked) {
					return (
						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'space-around',
								marginTop: '5%'
							}}
						>
							<TouchableOpacity
								style={styles.btnAccept}
								onPress={() => this.handleAcceptQuestion(questionDetails.questionDetail.id)}
							>
								<Text style={styles.txtAccept}>Accept</Text>
							</TouchableOpacity>

							<TouchableOpacity style={styles.btnPass} onPress={() => this.props.navigation.goBack()}>
								<Text style={styles.txtPass}>Pass</Text>
							</TouchableOpacity>
						</View>
					);
				} else return this.chat();
			} else return this.chat();
		}
	};

	chat = () => {
		const { user } = this.props;
		const { questionFeedbacks } = this.state;
		if (questionFeedbacks && questionFeedbacks.length > 0) {
			return questionFeedbacks.map((questionAns, index) => {
				// console.log(questionAns,'Answer List ') // DEBUG
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
									<Text style={styles.notifyTitle}>{`Answer#${questionAns.id || index} ` || ''}</Text>

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
														style={[styles.questionTouchIconRes, styles.videoQesRes]}
														onPress={() => this.videoViewerHandle(queVideoAns.url)}
													>
														<Icons.Entypo
															name="video"
															style={[styles.quesResIcon, styles.videoQesIcon]}
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
														onPress={() => this.documentViewrHandle(queDocAns.url)}
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
									</View>
								</View>
							</View>
						</Card>
					</View>
				);
			});
		}
	};

	render() {
		const { user } = this.props;
		const { questionDetails } = this.state;

		return (
			<View style={styles.rootContainer}>
				{this.state.isLoading && <Loader isLoading={true} />}
				<View style={[styles.topMainContainer, styles.userInfoContainer]}>
					<Card style={styles.container}>
						<View style={styles.cardMainContainer}>
							<View style={styles.imageContainer}>
								<Image
									source={{
										uri:
											(questionDetails &&
												questionDetails.userDetail &&
												questionDetails.userDetail.profile_image) ||
											dummyImageUrl
									}}
									style={styles.userImg}
									resizeMode="contain"
								/>
							</View>
							<View style={styles.msgMainContainer}>
								{/* <Text style={styles.notifyTitle}>{'Course Id' || ''}</Text> */}
								<Text style={styles.userNameText}>
									{(questionDetails &&
										questionDetails.userDetail &&
										questionDetails.userDetail.first_name) ||
										''}
								</Text>
								{questionDetails &&
									questionDetails.questionDetail &&
									questionDetails.questionDetail && (
										<Text style={styles.dateTime}>
											{questionDetails.questionDetail.question_type || ''}
										</Text>
									)}
							</View>
							<View style={styles.rightLblContainer}>
								<Text style={styles.notifyTitle}>{'Time to answer' || ''}</Text>
								<Text style={styles.hours}>
									{(questionDetails &&
										questionDetails.questionDetail &&
										questionDetails.questionDetail.time_limit) ||
										''}
								</Text>
							</View>
						</View>
					</Card>
				</View>

				<SafeAreaView style={{ marginBottom: '60%' }}>
					<ScrollView>
						<View style={[styles.topMainContainer]}>
							<Card style={[styles.container, styles.topMainContainerBorder]}>
								<View style={styles.cardMainContainer}>
									<View style={styles.msgQuesMainContainer}>
										<Text style={styles.notifyTitle}>{'Question' || ''}</Text>

										<Text style={styles.description}>
											{(questionDetails &&
												questionDetails.questionDetail &&
												questionDetails.questionDetail.title) ||
												''}
										</Text>
									</View>
								</View>
							</Card>
						</View>

						<View style={[styles.topMainContainer]}>
							<Card style={[styles.container, styles.topMainContainerBorder]}>
								<View style={styles.cardMainContainer}>
									<View style={styles.msgQuesMainContainer}>
										<Text style={styles.notifyTitle}>{'Description' || ''}</Text>
										<HtmlViewer
											htmlContent={
												questionDetails && questionDetails.questionDetail ? (
													questionDetails.questionDetail.description
												) : (
													''
												)
											}
											navigation={this.props.navigation}
										/>
									</View>
								</View>
							</Card>
						</View>
						{this.check()}
					</ScrollView>
				</SafeAreaView>
				{questionDetails &&
					(questionDetails.questionDetail.created_by == user.id || questionDetails.questionDetail.is_locked) && (
						<View
							style={[styles.btnContainer, this.state.inputDisabled && styles.disabledContainer]}
							pointerEvents={this.state.inputDisabled ? 'none' : 'auto'}
						>
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
					)}
				{this.state.showDocument && (
					<DocumentViewer
						documentUrl={this.state.downloadDocumentUrl}
						onDismiss={() => this.setState({ showDocument: false })}
					/>
				)}

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
					show={this.state.showLeaveQes}
					onDismissed={() => this.setState({ showLeaveQes: false })}
				>
					<DialogContent key={'transactionsRefund'}>
						<View>
							<View style={styles.confirmContainer}>
								<Text style={styles.confirmMessageTitle}>Are you sure?</Text>
								<Text style={styles.confirmMessageText}>
									You will no longer be able to answer this question. Do you want to leave this
									question?
								</Text>
							</View>
						</View>
						<View style={styles.confirmBtnContainer}>
							<TouchableOpacity
								style={[styles.btnRefundContainer, { backgroundColor: color.light }]}
								onPress={() => this.props.navigation.navigate('Home')}
							>
								<Text style={[styles.btnConfirmText, { color: color.dark }]}>Leave Question</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.btnRefundContainer, { backgroundColor: color.primary }]}
								onPress={() => this.setState({ showLeaveQes: false })}
							>
								<Text style={styles.btnConfirmText}>Return</Text>
							</TouchableOpacity>
						</View>
					</DialogContent>
				</DialogComponent>

				<DropdownAlert ref={(ref) => (this.dropDownAlertRef = ref)} zIndex={11111111} />
			</View>
		);
	}
}

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { uploadResources } from '../../redux/actions/uploadResources';
import {
	deleteQuestion,
	getQuestionDetail,
	submitQuestionFeedback,
	getQuestionFeedbackList,
	repostQuestion,
	acceptQuestion
} from '../../redux/actions/forum';
import { sendNotification } from '../../redux/actions/notification';

const mapStateToProps = (state) => ({
	user: state.auth.user,
	questionDetail: state.forum.questionDetail,
	imageUploadDetail: state.uploadResource.imageUploadDetail,
	videoUploadDetail: state.uploadResource.videoUploadDetail,
	documentUploadDetail: state.uploadResource.documentUploadDetail,
	uploadResourcesErr: state.uploadResource.uploadResourcesErr,
	addQuestionFeedback: state.forum.addQuestionFeedback,
	questionFeedbackList: state.forum.questionFeedbackList,
	fourmErr: state.forum.fourmErr
});

const mapDispatchToProps = (dispatch) => ({
	acceptQuestion: bindActionCreators(acceptQuestion, dispatch),
	getQuestionDetail: bindActionCreators(getQuestionDetail, dispatch),
	uploadResources: bindActionCreators(uploadResources, dispatch),
	submitQuestionFeedback: bindActionCreators(submitQuestionFeedback, dispatch),
	deleteQuestion: bindActionCreators(deleteQuestion, dispatch),
	repostQuestion: bindActionCreators(repostQuestion, dispatch),
	getQuestionFeedbackList: bindActionCreators(getQuestionFeedbackList, dispatch),
	sendNotification: bindActionCreators(sendNotification, dispatch)
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
		transform: [{ rotateY: '180deg' }]
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
	},
	menuText: {
		color: color.light,
		fontWeight: 'normal',
		textAlign: 'center',
		fontFamily: fonts.regular,
		letterSpacing: 0.2,
		fontSize: 14
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(FeedbackChat);
