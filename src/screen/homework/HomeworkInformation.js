import * as React from 'react';
import { Container, Content, Text, View, Row, Col } from 'native-base';
import { StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import moment from 'moment';
import DropdownAlert from 'react-native-dropdownalert';
import { fonts, color } from '../../theme';
import { Icons } from '../../components';
import Loader from '../../components/Loader';
import { dummyImageUrl } from '../../utils/constants';
import RenderHtml from '../../components/HtmlViewer/RenderHtml';
import HtmlViewer from '../../components/HtmlViewer';
import { strings, changeLaguage } from '../../translations/service';

class HomeworkInformation extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			submissionInfo: [],
			isLoading: false
		};
	}

	getAllSumittedHomeworkByStudent = () => {
		const { homework, clas } = this.props.route.params;

		this.props.getSubmittedHomeworkList(this, {
			class_id: clas.id,
			homework_id: homework.id
		});
	};

	componentDidMount() {
		this.setState({ isLoading: true });
		this.getAllSumittedHomeworkByStudent();
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.submittedHomeworkLists !== this.props.submittedHomeworkLists) {
			this.setState({ submissionInfo: nextProps.submittedHomeworkLists, isLoading: false });
		}

		if (nextProps.homeworkError !== this.props.homeworkError) {
			this.setState({ isLoading: false });
		}
	}

	renderViewMore(onPress) {
		return (
			<TouchableOpacity style={styles.readCollapase}>
				<Text style={styles.readCollapase} onPress={onPress}>
					{strings.read_full}
				</Text>
			</TouchableOpacity>
		);
	}

	renderViewLess(onPress) {
		return (
			<TouchableOpacity style={styles.readCollapase}>
				<Text style={styles.readCollapase} onPress={onPress}>
					{strings.read_less}
				</Text>
			</TouchableOpacity>
		);
	}

	homeworkSubmissionHandler = (onPressValue, homeworkDetails) => {
		const { homework, clas } = this.props.route.params;

		if (onPressValue === 'grade') {
			this.props.navigation.navigate('HomeworkGrading', {
				homework: homework,
				clas: clas,
				homeworkSubmissionStatus: onPressValue,
				homeworkDetails: homeworkDetails || ''
			});
		} else if (onPressValue === 'view') {
			this.props.navigation.navigate('HomeworkGraded', {
				homework: homework,
				clas: clas,
				homeworkSubmissionStatus: onPressValue,
				homeworkDetails: homeworkDetails || '',
				isViewGrade: true
			});
		}
	};

	viewSubmissionHandler = ({ item }) => {
		return (
			<View style={styles.cardContainer}>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between'
					}}
				>
					<View style={styles.studInfoContainer}>
						<View>
							<Image
								source={{
									uri: item.profileImage || dummyImageUrl
								}}
								style={styles.imageContainer}
							/>
						</View>
						<View style={styles.studNameContainer}>
							<Text style={styles.nameTxt}>{item.studentFirstName}</Text>
							<Text style={styles.idTxt}>{`ID : ${item.studentId}`}</Text>
						</View>
					</View>
					{item.homework_details && item.homework_details.checked ? (
						<View>
							<Text style={styles.grade}>
								<Icons.FontAwesome5 name="check" style={styles.checkIcon} /> {strings.grade} :{' '}
								{item.homework_details.grade}{' '}
							</Text>
						</View>
					) : (
						<View>
							<Text style={styles.grade} />
						</View>
					)}
				</View>

				<View style={styles.submissionMainContainer}>
					<Row>
						<View style={styles.fileContainer}>
							<Icons.FontAwesome5 name="file" style={styles.fileIcon} />
						</View>

						<View style={styles.fileDescContainer}>
							{/* <HTMLView
              value={item.homework_details && item.homework_details.homework_details || ""}
              textComponentProps={{
                style: [styles.due, { color: "black" }],
              }}
              stylesheet={{ div: { height: 20 }, image: { height: 20, width: 20 }, p: { height: 20, width: 20 } }}
            /> */}
							<RenderHtml
								content={(item.homework_details && item.homework_details.homework_details) || ''}
							/>
							{/* <HTML
              source={{ html: item.homework_details && item.homework_details.homework_details || "" }}
              ignoredTags={[...IGNORED_TAGS, 'img', 'video']}
              containerStyle={{ color: 'black', }}
            /> */}
							{/* <Text style={styles.fileName}>{item.fileName}</Text> */}
							{/* <Text style={styles.fileStatus}>READ</Text> */}
						</View>
					</Row>
					{item.homework_details && item.homework_details.checked ? (
						<Row style={{ flex: 0 }}>
							<View style={styles.btnViewContainer}>
								<TouchableOpacity
									style={styles.btnView}
									onPress={() =>
										this.homeworkSubmissionHandler(
											'view',
											item.homework_details && item.homework_details
										)}
								>
									<Text style={styles.btnViewText}>{strings.view}</Text>
								</TouchableOpacity>
							</View>
						</Row>
					) : (
						<View style={styles.btnViewContainer}>
							<TouchableOpacity
								style={styles.btnView}
								onPress={() =>
									this.homeworkSubmissionHandler(
										'grade',
										item.homework_details && item.homework_details
									)}
							>
								<Text style={styles.btnViewText}>{strings.grade}</Text>
							</TouchableOpacity>
						</View>
					)}
				</View>
			</View>
		);
	};

	getRemainingDays = (deadline_date) => {
		const dayDate = moment();
		const deadlinedate = moment(deadline_date, 'DD/MM/YYYY');

		const remainingDay = deadlinedate.diff(dayDate, 'days');

		return remainingDay;
	};

	submissionCard = (homeworkInfo) => {
		const remainingDays = this.getRemainingDays(homeworkInfo.deadline_date);

		return (
			<View style={styles.submitCard}>
				<Row>
					<Col size={2.5} style={styles.heading}>
						<Text style={styles.due}>{strings.due_date} {homeworkInfo.deadline_date}</Text>
						<Text style={styles.daysleft}>
							{remainingDays > 0 ? remainingDays + ' days left' : 'Todays'}{' '}
						</Text>
					</Col>

					<Col
						size={2.5}
						style={{
							justifyContent: 'center',
							alignItems: 'center',
							flexDirection: 'row',
							paddingRight: 10
						}}
					>
						<View>
							<TouchableOpacity
								// onPress={() => this.submitMethod()}
								style={{ marginLeft: 10 }}
							>
								<Text
									style={{
										color: color.light,
										fontFamily: fonts.regular,
										opacity: 0.8,
										fontSize: 12
									}}
								>
									{homeworkInfo.total_submitted} / {homeworkInfo.total_submission} {strings.submissions}
								</Text>
							</TouchableOpacity>
						</View>
					</Col>
				</Row>
			</View>
		);
	};

	render() {
		const { homework, clas } = this.props.route.params;

		return (
			<Container style={styles.container}>
				<Content padder>
					{this.state.isLoading && <Loader isLoading={true} />}
					<Text style={styles.title}>{strings.instructions}</Text>

					<View style={styles.authFields}>
						<Text style={styles.label}>{strings.title}</Text>

						<Text numberOfLines={2} style={styles.textInput}>
							{' '}
							{homework.title || ''}
						</Text>
					</View>

					<View>
						<View style={[ styles.authFields, styles.descContainer ]}>
							<Text style={styles.label}>{strings.description}</Text>
							{/* <TextInput defaultValue={this.state.questionDesc} selectTextOnFocus={true} style={styles.textInput} multiline numberOfLines={5} onChangeText={(value) => this.setState({ questionDesc: value })} /> */}

							<HtmlViewer htmlContent={homework.description || ''} navigation={this.props.navigation} />

							{/* <HTMLView
                  value={homework.description || ""}
                  textComponentProps={{
                    style: [styles.due, { color: "black" }],
                  }}

                  stylesheet={{ div: { height: 20 }, image: { height: 20, width: 20 }, p: { height: 20, width: 20 }, Video: { height: 20, width: 20 } }}
                /> */}

							{/* <ViewMoreText
                  numberOfLines={4}
                  renderViewMore={this.renderViewMore}
                  renderViewLess={this.renderViewLess}
                  containerStyle={styles.txtEditorContainer}
                  // ref={RichText}
                  style={[styles.textInput, styles.richTextInput]}
                >
                  
                  <Text
                    numberOfLines={4}

                  >
                      
                  </Text>
                </ViewMoreText> */}
						</View>

						{/* <TouchableOpacity
                style={styles.readContianer}
                onPress={() => this.handleReadFullView()}
              >
                <Text style={styles.readText}>Read full</Text>
              </TouchableOpacity> */}
					</View>

					{this.submissionCard(homework)}

					<View style={styles.divider} />

					<Text style={styles.title}>{strings.submissions}</Text>

					<FlatList
						data={this.state.submissionInfo}
						renderItem={(item) => this.viewSubmissionHandler(item)}
					/>
				</Content>
				<DropdownAlert ref={(ref) => (this.dropDownAlertRef = ref)} />
			</Container>
		);
	}
}

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getSubmittedHomeworkList } from '../../redux/actions/homework';

const mapStateToProps = (state) => ({
	user: state.auth.user,
	homeworkError: state.homework.homeworkError,
	submittedHomeworkLists: state.homework.submittedHomeworkLists
});

const mapDispatchToProps = (dispatch) => ({
	getSubmittedHomeworkList: bindActionCreators(getSubmittedHomeworkList, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeworkInformation);

const styles = StyleSheet.create({
	container: {
		backgroundColor: color.bg
	},
	title: {
		textAlign: 'center',
		color: '#467DFF',
		fontSize: 20,
		fontFamily: fonts.medium,
		marginTop: 10,
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
		top: '74%'
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
		width: '95%',
		backgroundColor: 'white',
		minHeight: 60,
		paddingHorizontal: 18,
		paddingTop: 10,
		borderRadius: 10,
		justifyContent: 'center',
		alignSelf: 'center',
		marginBottom: 15,
		elevation: 0.4
	},
	descContainer: {
		maxHeight: 148
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
	divider: {
		width: 60,
		height: 1.5,
		backgroundColor: 'gray',
		alignSelf: 'center',
		opacity: 0.3,
		marginTop: 15
	},
	cardContainer: {
		width: '96%',
		backgroundColor: 'white',
		paddingHorizontal: 18,
		paddingTop: 10,
		borderRadius: 10,
		marginBottom: 15,
		elevation: 0.4,
		marginLeft: '2%'
	},
	submitCard: {
		height: 54,
		backgroundColor: color.blue,
		borderRadius: 10,
		marginHorizontal: '3%'
	},
	daysleft: {
		color: 'white',
		fontFamily: fonts.regular,
		fontSize: 13,
		paddingBottom: 5
	},
	heading: { paddingHorizontal: 15, paddingVertical: 6 },
	closeHeading: {
		justifyContent: 'center',
		alignItems: 'flex-start',
		marginLeft: 15
	},
	due: {
		color: color.light,
		opacity: 0.6,
		fontFamily: fonts.regular,
		fontSize: 14
	},
	studInfoContainer: {
		flexDirection: 'row'
	},
	studNameContainer: {
		flexDirection: 'column',
		marginLeft: '5%'
	},
	imageContainer: {
		height: 35,
		width: 35,
		borderRadius: 50
	},
	nameTxt: {
		fontSize: 12,
		color: color.dark,
		fontFamily: fonts.regular
	},
	idTxt: {
		fontSize: 10,
		color: color.darkgray,
		fontFamily: fonts.regular,
		marginLeft: '5%'
	},
	grade: {
		fontSize: 14,
		fontFamily: fonts.regular
	},
	submissionMainContainer: {
		width: '100%',
		flexDirection: 'row',
		marginVertical: '5%',
		justifyContent: 'space-between'
	},
	fileContainer: {
		backgroundColor: color.darkSky,
		padding: 10,
		alignItems: 'center',
		borderRadius: 5
	},
	fileIcon: {
		fontSize: 24,
		color: color.light
	},
	fileDescContainer: {
		flexDirection: 'column',
		width: '70%',
		justifyContent: 'center',
		marginHorizontal: '3%',
		maxHeight: 45
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
		// width: '24%',
		// justifyContent: 'center',/
		alignItems: 'center'
	},
	btnView: {
		width: '100%',
		backgroundColor: color.primary,
		borderRadius: 5,
		paddingHorizontal: 15,
		paddingVertical: 4,
		alignItems: 'center'
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
		marginLeft: '5%',
		marginTop: '3%',
		marginBottom: '2%'
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
		fontSize: 12,
		color: '#70ED3E'
	},
	readCollapase: {
		color: color.blue,
		fontFamily: fonts.regular,
		opacity: 0.7,
		fontSize: 12,
		textAlign: 'center'
	}
});
