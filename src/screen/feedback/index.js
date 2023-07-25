import * as React from 'react';
import { StyleSheet, InteractionManager, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { View, Footer } from 'native-base';
import { Card, ActivityIndicator } from 'react-native-paper';
import DropdownAlert from 'react-native-dropdownalert';
import { fonts, color } from '../../theme';
import HtmlViewer from '../../components/HtmlViewer';
import { dummyImageUrl } from '../../utils/constants';
import Loader from '../../components/Loader';

class Feedback extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			questionDetails: {},
			isLoading: false
		};
	}

	loaderHandler = (status) => {
		this.setState({ isLoading: status });
	};

	getQuestionDetails = () => {
		if (this.props.route && this.props.route.params && this.props.route.params.questionDetail) {
			const { questionDetail } = this.props.route && this.props.route.params;
			this.loaderHandler(true);
			this.props.getQuestionDetail(this, questionDetail.id);
		}
	};

	handleAcceptQuestion = (questionId) => {
		this.props.acceptQuestion(this, questionId);
	};

	componentDidMount() {
		this.getQuestionDetails();
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.questionDetail !== this.props.questionDetail) {
			this.loaderHandler(false);

			this.setState({ questionDetails: nextProps.questionDetail });

			const { questionDetail } = this.props.route && this.props.route.params;

			if (questionDetail.created_by == this.props.user.id) {
				this.props.navigation.navigate('FeedbackChat', {
					id: nextProps.questionDetail.questionDetail.id,
					questionDetail
				});
			} else if (questionDetail.is_locked) {
				this.props.navigation.navigate('FeedbackChat', {
					id: nextProps.questionDetail.questionDetail.id,
					questionDetail
				});
			}
		}
	}

	render() {
		const { questionDetail, userDetail } = this.state.questionDetails;

		return (
			<View style={styles.rootContainer}>
				{this.state.isLoading && <Loader isLoading={this.state.isLoading} />}
				<View style={[ styles.topMainContainer, styles.userInfoContainer ]}>
					<Card style={styles.container}>
						<View style={styles.cardMainContainer}>
							<View style={styles.imageContainer}>
								<Image
									source={{
										uri: (userDetail && userDetail.profile_image) || dummyImageUrl
									}}
									style={styles.userImg}
									resizeMode="contain"
								/>
							</View>
							<View style={styles.msgMainContainer}>
								{/* <Text style={styles.notifyTitle}>{'Course Id' || ''}</Text> */}
								<Text style={styles.userNameText}>{(userDetail && userDetail.first_name) || ''}</Text>

								<Text style={styles.dateTime}>
									{(questionDetail && questionDetail.question_type) || ''}
								</Text>
							</View>
							<View style={styles.rightLblContainer}>
								<Text style={styles.notifyTitle}>{'Time to answer' || ''}</Text>
								<Text style={styles.hours}>{(questionDetail && questionDetail.time_limit) || ''}</Text>
							</View>
						</View>
					</Card>
				</View>

				<View style={styles.topMainContainer}>
					<Card style={styles.container}>
						<View style={styles.cardMainContainer}>
							<View style={styles.msgQuesMainContainer}>
								<Text style={styles.notifyTitle}>{'Question' || ''}</Text>

								<Text style={styles.description}>{(questionDetail && questionDetail.title) || ''}</Text>
							</View>
						</View>
					</Card>
				</View>

				<View style={styles.topMainContainer}>
					<Card style={styles.container}>
						<View style={styles.cardMainContainer}>
							<View style={styles.msgQuesMainContainer}>
								<Text style={styles.notifyTitle}>{'Description' || ''}</Text>

								<HtmlViewer
									htmlContent={(questionDetail && questionDetail.description) || ''}
									navigation={this.props.navigation}
								/>
							</View>
						</View>
					</Card>
				</View>

				{questionDetail &&
				!questionDetail.is_locked && (
					<View style={styles.btnContainer}>
						<TouchableOpacity
							style={styles.btnAccept}
							onPress={() => this.handleAcceptQuestion(questionDetail && questionDetail.id)}
						>
							<Text style={styles.txtAccept}>Accept</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.btnPass} onPress={() => this.props.navigation.goBack()}>
							<Text style={styles.txtPass}>Pass</Text>
						</TouchableOpacity>
					</View>
				)}

				<DropdownAlert ref={(ref) => (this.dropDownAlertRef = ref)} zIndex={11111111} />
			</View>
		);
	}
}

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getQuestionDetail, acceptQuestion } from '../../redux/actions/forum';

const mapStateToProps = (state) => ({
	user: state.auth.user,
	questionDetail: state.forum.questionDetail,
	acceptQuestionRes: state.forum.acceptQuestionRes
});

const mapDispatchToProps = (dispatch) => ({
	getQuestionDetail: bindActionCreators(getQuestionDetail, dispatch),
	acceptQuestion: bindActionCreators(acceptQuestion, dispatch)
});

const styles = StyleSheet.create({
	rootContainer: {
		flex: 1,
		backgroundColor: color.bg
	},
	userInfoContainer: {
		marginTop: '5%'
	},
	topMainContainer: {
		marginHorizontal: '2%'
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
		marginLeft: '5%'
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
		justifyContent: 'space-around',
		marginTop: '5%'
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
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(Feedback);
