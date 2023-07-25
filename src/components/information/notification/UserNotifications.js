import * as React from 'react';
import { StyleSheet, InteractionManager, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-elements';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View, Footer } from 'native-base';
import { Card, ActivityIndicator } from 'react-native-paper';
import { NotificationCard } from '../../';
import { fonts, color } from '../../../theme';
import { getUserNotifications } from '../../../redux/actions/auth';
import { homework } from '../../../redux/types';
import { dummyImageUrl } from '../../../utils/constants';

class UserNorifications extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			notificationDetails: [],
			questionNotifyType: [ 'createQuestion', 'acceptQuestion', 'writeFeedback' ],
			homeworkNotifyType: [ 'createHomework', 'submitHomework' ]
		};
	}

	// componentDidMount() {
	// 	// this.props.navigation.setOptions({
	// 	//   headerRight: () => (
	// 	//     <TouchableOpacity onPress={() => this.props.navigation.navigate("Profile")}>
	// 	//       <Avatar
	// 	//         rounded
	// 	//         size={35}
	// 	//         source={{
	// 	//           uri:
	// 	//             this.props.user && this.props.user.headimgurl
	// 	//               ? this.props.user.headimgurl
	// 	//               : this.props.profileDetail.profileImage || dummyImageUrl,
	// 	//         }}
	// 	//         containerStyle={{ marginRight: 10 }}
	// 	//       />
	// 	//     </TouchableOpacity>
	// 	//   ),
	// 	// });
	// }

	// componentWillMount() {
	// 	// InteractionManager.runAfterInteractions().then(() => {
	// 	//   this.props.getUserNotifications(this);
	// 	// });
	// }

	notificationRedirectHandler(notifyTitle, notificationDetail) {
		switch (notifyTitle) {
			case 'writeFeedback':
				this.props.navigation.navigate('Forum', { questionDetail: notificationDetail });
				return;
			case 'createHomework':
				this.props.navigation.navigate('Classes');
				return;
			case 'submitHomework':
				this.props.navigation.navigate('Classes');
				return;
			case 'createQuestion':
				this.props.navigation.navigate('Feedback', { questionDetail: notificationDetail });
				return;
			case 'acceptQuestion':
				this.props.navigation.navigate('Forum', { questionDetail: notificationDetail });
				return;
			default:
				this.props.navigation.navigate('Classes');
				return;
		}
	}

	handleHomeworkNotification = (homeworkDetail) => {
		return (
			<Card
				style={styles.container}
				onPress={() => this.notificationRedirectHandler(homeworkDetail.notificationType, homeworkDetail)}
			>
				<View style={styles.cardMainContainer}>
					<View style={styles.imageContainer}>
						<Image
							source={{ uri: homeworkDetail.profileImage || dummyImageUrl }}
							style={styles.userImg}
							resizeMode="contain"
						/>
					</View>
					<View style={styles.msgMainContainer}>
						<Text style={styles.notifyTitle}>{homeworkDetail.notificationName || ''}</Text>
						<Text style={styles.userNameText}>{homeworkDetail.userName || ''}</Text>
						<Text style={styles.description}>{homeworkDetail.homeworkTitle || ''}</Text>
						<Text style={styles.dateTime}>
							{moment(homeworkDetail.createdAt || '').format('HH:mm')} -{' '}
							{moment(homeworkDetail.createdAt || '').format('DD/MM/yyyy')}
						</Text>
					</View>
					<View style={styles.rightLblContainer}>
						<Text style={styles.notifyTitle}>{''}</Text>
					</View>
				</View>
			</Card>
		);
	};

	handleSubmitHomeworkNotification = (homeworkDetail) => {
		console.log('handleSubmitHomeworkNotification detail', homeworkDetail);
	};

	handleQuestionNotification = (questionDetail) => {
		return (
			<Card
				style={styles.container}
				onPress={() => this.notificationRedirectHandler(questionDetail.notificationType, questionDetail)}
			>
				<View style={styles.cardMainContainer}>
					<View style={styles.imageContainer}>
						<Image
							source={{ uri: questionDetail.profileImage || dummyImageUrl }}
							style={styles.userImg}
							resizeMode="contain"
						/>
					</View>
					<View style={styles.msgMainContainer}>
						<Text style={styles.notifyTitle}>{questionDetail.notificationName || ''}</Text>
						<Text style={styles.userNameText}>{questionDetail.userName || ''}</Text>
						<Text style={styles.description}>{questionDetail.questionDetail.title || ''}</Text>
						<Text style={styles.dateTime}>
							{moment(questionDetail.createdAt || '').format('HH:mm')} -{' '}
							{moment(questionDetail.createdAt || '').format('DD/MM/yyyy')}
						</Text>
					</View>
					<View style={styles.rightLblContainer}>
						<Text style={styles.notifyTitle}>{questionDetail.questionDetail.question_type || ''}</Text>
					</View>
				</View>
			</Card>
		);
	};

	handleAcceptQuestionNotification = (questionDetail) => {
		console.log('handleAcceptQuestionNotification', questionDetail);
	};

	handleWriteFeedbackNotification = (feedbackDetail) => {
		console.log('handleWriteFeedbackNotification', feedbackDetail);
	};

	notificationViewHandler = ({ item }) => {
		if (this.state.homeworkNotifyType.includes(item.notificationType)) {
			return this.handleHomeworkNotification(item);
		} else if (this.state.questionNotifyType.includes(item.notificationType)) {
			return this.handleQuestionNotification(item);
		}
	};

	render() {
		const { notificationDetail, onEndThreshold, onEndReached } = this.props;
		return (
			<FlatList
				data={notificationDetail}
				renderItem={(item) => this.notificationViewHandler(item)}
				onEndThreshold={onEndThreshold}
				onEndReached={onEndReached}
			/>
		);
	}
}

const mapStateToProps = (state) => ({
	user: state.auth.user
});

const mapDispatchToProps = (dispatch) => ({
	getUserNotifications: bindActionCreators(getUserNotifications, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(UserNorifications);

const styles = StyleSheet.create({
	heading: {
		fontSize: 23,
		fontFamily: fonts.semibold,
		color: '#467DFF',
		textAlign: 'center'
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
		width: '70%',
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
		letterSpacing: 0.7,
		marginTop: '2%'
	}
});
