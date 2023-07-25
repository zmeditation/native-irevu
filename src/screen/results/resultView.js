import * as React from 'react';
import { Text, View } from 'native-base';
import { StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { fonts, color } from '../../theme';
import { Card } from 'react-native-paper';
import { Icons } from '../../components';
import HtmlViewer from '../../components/HtmlViewer';

class ResultsView extends React.Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	viewResultsDetailsHandler = (submitedHomeworkDetails) => {
		if (submitedHomeworkDetails && submitedHomeworkDetails.checked) {
			this.props.navigation.navigate('HomeworkGraded', {
				homeworkDetails: submitedHomeworkDetails || '',
				isDownload: true,
				isViewGrade: true
			});
		} else {
			this.props.navigation.navigate('HomeworkGraded', {
				homeworkDetails: submitedHomeworkDetails || '',
				isDownload: false,
				isViewGrade: false,
				componentheaderTitle: 'Homework'
			});
		}
	};

	resultViewHandler = ({ item }, isViewIcon) => {
		return (
			<View style={styles.resultMainContainer}>
				<View style={styles.dateTimeContainer}>
					<Text style={styles.dateTime}>
						{item.submited_homeworkDetail && item.submited_homeworkDetail.created_at}
					</Text>
				</View>

				<Card style={{ borderRadius: 10 }}>
					<View style={styles.headerTitleContainer}>
						<Text style={[ styles.cardHeaderText, styles.headerClassName ]}>
							Class id : {item.submited_homeworkDetail && item.submited_homeworkDetail.class_name}
						</Text>
						{isViewIcon ? (
							<Text>
								<Icons.FontAwesome5 name="check" style={styles.checkIcon} />
							</Text>
						) : (
							<Text style={[ styles.cardHeaderText, styles.headerClassResult ]}>result</Text>
						)}
					</View>

					<View style={styles.titleContainer}>
						<Text style={styles.lblTitle}>Title</Text>
						<Text style={styles.description} numberOfLines={2}>
							{item.homeworkDetail && item.homeworkDetail.title}{' '}
						</Text>
					</View>

					<View style={[ styles.titleContainer, { maxHeight: 48 } ]}>
						<Text style={styles.lblTitle}>Submission</Text>
						<View style={styles.submissionMainContainer}>
							<View style={styles.fileContainer}>
								<Icons.FontAwesome5 name="file" style={styles.fileIcon} />
							</View>

							<View style={styles.fileDescContainer}>
								<HtmlViewer
									htmlContent={
										(item.submited_homeworkDetail &&
											item.submited_homeworkDetail.homework_details) ||
										''
									}
								/>

								{/* <HTMLView
                  value={item.submited_homeworkDetail && item.submited_homeworkDetail.homework_details || ""}
                  textComponentProps={{
                    style: [styles.due, { color: "black" }],
                  }}
                  stylesheet={{ div: { height: 20 }, image: { height: 20, width: 20 }, p: { height: 20, width: 20 } }}
                /> */}
								{/* <Text style={styles.fileName}>{item.submited_homeworkDetail && item.submited_homeworkDetail.homework_details}</Text> */}
								{/* <Text style={styles.fileStatus}>{item.status}</Text> */}
							</View>
						</View>
					</View>

					<View style={styles.gradeContainer}>
						<View>
							<Text style={styles.gradeTxt}>Grade</Text>
							{item.submited_homeworkDetail && item.submited_homeworkDetail.checked !== true ? (
								<Text style={styles.gradePendingTxt}>Yet to be Graded</Text>
							) : (
								<Text style={styles.gradePrTxt}>
									{item.submited_homeworkDetail && item.submited_homeworkDetail.grade}
								</Text>
							)}
						</View>
						<View style={styles.btnViewContainer}>
							<TouchableOpacity
								style={styles.btnView}
								onPress={() =>
									this.viewResultsDetailsHandler({
										...item.submited_homeworkDetail,
										// ...item,
										user_id: item.homeworkDetail.user_id
									})}
							>
								<Text style={styles.btnViewText}>View</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Card>
			</View>
		);
	};

	render() {
		const { hour, username } = this.state;
		const { user, resultDetails, isViewIcon } = this.props;
		return <FlatList data={resultDetails} renderItem={(item) => this.resultViewHandler(item, isViewIcon)} />;
	}
}

import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
	user: state.auth.user
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ResultsView);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: color.lightbg
	},
	resultMainContainer: {
		backgroundColor: color.lightbg
	},
	cardContainer: {
		width: '90%',
		marginVertical: 8,
		borderRadius: 10,
		marginHorizontal: '5%'
	},
	heading: {
		fontFamily: fonts.medium,
		fontSize: 10,
		textTransform: 'uppercase',
		color: color.lightblue
	},
	dateTime: {
		fontSize: 14,
		textTransform: 'uppercase',
		fontFamily: fonts.regular,
		color: color.darkgray,
		letterSpacing: 0.7
	},
	dateTimeContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: '5%'
	},
	resultContainer: {
		backgroundColor: color.bg
	},
	cardHeaderText: {
		fontFamily: fonts.regular,
		fontSize: 13,
		color: color.light,
		marginHorizontal: '5%'
	},
	headerClassResult: {
		textTransform: 'uppercase'
	},
	headerTitleContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
		backgroundColor: color.primary,
		padding: '4%',
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10
	},
	titleContainer: {
		width: '100%',
		marginHorizontal: '5%',
		marginTop: '3%'
	},
	dateTime: {
		fontSize: 14,
		textTransform: 'uppercase',
		fontFamily: fonts.regular,
		color: color.darkgray,
		letterSpacing: 0.7
	},
	lblTitle: {
		fontSize: 10,
		textTransform: 'uppercase',
		fontFamily: fonts.regular,
		color: color.darkgray,
		letterSpacing: 0.7
	},
	description: {
		fontFamily: fonts.regular,
		fontSize: 14,
		maxWidth: '93%'
	},
	submissionMainContainer: {
		flexDirection: 'row',
		marginRight: '8%',
		marginTop: '1%'
	},
	fileContainer: {
		width: '12%',
		backgroundColor: color.lightbg,
		paddingVertical: 10,
		paddingHorizontal: 5,
		alignItems: 'center',
		borderRadius: 5
	},
	fileIcon: {
		fontSize: 24,
		color: color.light
	},
	fileDescContainer: {
		flexDirection: 'column',
		width: '100%',
		justifyContent: 'center',
		marginHorizontal: '3%'
	},
	fileName: {
		fontFamily: fonts.regular,
		fontSize: 14,
		color: color.dark
	},
	fileStatus: {
		fontSize: 12,
		fontFamily: fonts.regular,
		color: color.primary,
		textTransform: 'uppercase'
	},
	btnViewContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	btnView: {
		backgroundColor: color.primary,
		borderRadius: 5,
		paddingHorizontal: 18,
		paddingVertical: 6
	},
	btnViewText: {
		fontSize: 14,
		fontFamily: fonts.regular,
		color: color.light
	},
	gradeTxt: {
		color: color.dark,
		fontFamily: fonts.regular,
		fontSize: 14
	},
	gradeContainer: {
		marginHorizontal: '5%',
		marginTop: '5%',
		marginBottom: '2%',
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	gradePrTxt: {
		color: color.primary,
		fontFamily: fonts.regular,
		fontSize: 25
	},
	gradePendingTxt: {
		color: color.bg,
		fontFamily: fonts.regular,
		fontSize: 25
	},
	checkIcon: {
		fontSize: 16,
		color: '#70ED3E'
	}
});
