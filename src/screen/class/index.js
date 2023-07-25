import * as React from 'react';
import { Container, Content, Text, View, Header, Left, Body, Title, Right } from 'native-base';
import { StyleSheet, TouchableOpacity } from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import { fonts } from '../../theme';
import { Icons, ClassFacePiles, CurrentHomework } from '../../components';
import { userType } from '../../utils/constants';
import { Button } from 'react-native-material-ui';
import Homework from '../../components/homework/Homework';
import EnrollStudentModal from '../../components/EnrollStudentModal';
import Loader from '../../components/Loader';
import { strings, changeLaguage } from '../../translations/service';

class ClassDetail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			studentsList: [],
			currentHomeWorkList: [],
			isEnrollModalOpen: false,
			isLoading: false
		};
	}

	loaderHandler = (status) => {
		this.setState({ isLoading: status });
	};

	getHomeWorkList = () => {
		this.props.getHomeworkLists(this, this.props.route.params.clas.class_id);

		this.loaderHandler(true);
	};

	getEnrolledStudentListHandler = () => {
		const { clas } = this.props.route.params;

		this.props.getEnrolledStudentList(this, clas.id);
	};

	getAllSubmitedHomeWorksHandler = () => {
		const { clas } = this.props.route.params;

		this.props.getAllSubmittedHomeWork(clas.id);
	};

	componentWillReceiveProps(nextProps) {
		if (nextProps.homeworks !== this.props.homeworks && nextProps.homeworks.length > 0) {
			console.log(`componentWillReceiveProps - nextProps.homeworks`, nextProps.homeworks);
			this.setState({ currentHomeWorkList: nextProps.homeworks });
			this.loaderHandler(false);
		}

		if (nextProps.homeworks !== this.props.homeworks && nextProps.homeworks.length === 0) {
			this.loaderHandler(false);
		}

		if (nextProps.allSubmittedHomeworkList !== this.props.allSubmittedHomeworkList) {
		}

		if (nextProps.enrollStudentList !== this.props.enrollStudentList) {
			this.setState({ studentsList: nextProps.enrollStudentList });
		}

		if (nextProps.enrollStudent !== this.props.enrollStudent) {
			this.loaderHandler(false);
		}

		if (nextProps.classError !== this.props.classError) {
			this.loaderHandler(false);
		}
	}

	componentDidMount() {
		this.getHomeWorkList();
		this.getEnrolledStudentListHandler();
		this.getAllSubmitedHomeWorksHandler();
	}

	enrollStudentHandler = (status) => {
		this.setState({ isEnrollModalOpen: status });
	};

	enrollStudentSubmitHandler = (status, username) => {
		const { clas } = this.props.route.params;

		if (username !== '' && clas.id !== '') {
			this.loaderHandler(true);
			this.props.enrollStudentByTeacher(this, clas.id, username);

			this.setState({ isEnrollModalOpen: status });
		}
	};

	header = () => {
		const { clas } = this.props.route.params;

		return (
			<Header
				style={{
					backgroundColor: 'white',
					justifyContent: 'center',
					alignItems: 'center'
				}}
			>
				<Left>
					<TouchableOpacity onPress={() => this.props.navigation.goBack()}>
						<Icons.Entypo name="chevron-left" color="black" size={30} style={{ marginLeft: 10 }} />
					</TouchableOpacity>
				</Left>
				<Body style={{ minWidth: '50%' }}>
					<Title style={styles.headerTitle}>{strings.classes}</Title>
					<Text style={styles.subtitle}>{clas.name || ''}</Text>
				</Body>
				<Right style={{ maxWidth: '10%' }} />
			</Header>
		);
	};

	render() {
		const { clas } = this.props.route.params;
		const { user } = this.props;
		return (
			<Container style={styles.container}>
				{this.header()}
				{this.state.isLoading && <Loader isLoading={this.state.isLoading} />}
				<Content style={{ paddingHorizontal: '4%' }}>
					<ClassFacePiles
						class_id={clas._id}
						clas={clas}
						studentsList={this.state.studentsList}
						enrollStudentHandler={this.enrollStudentHandler}
						loading={this.state.isLoading}
					/>

					{user.user_type === userType.teacher && (
						<View>
							<Button
								onPress={() => this.props.navigation.navigate('CreateHomework', { clas: clas })}
								icon="add"
								iconSet="MaterialIcons"
								style={button}
								raised
								primary
								text={strings.create_a_homework_capital}
							/>
							<View style={styles.divider} />
						</View>
					)}
					<CurrentHomework
						clas={clas}
						navigation={this.props.navigation}
						currrentHomeworkDetails={this.state.currentHomeWorkList}
						isLoading={this.state.isLoading}
					/>

					<Homework
						clas={clas}
						navigation={this.props.navigation}
						currrentHomeworkDetails={this.state.currentHomeWorkList}
						isLoading={this.state.isLoading}
					/>

					{this.state.isEnrollModalOpen && (
						<EnrollStudentModal
							enrollStudentHandler={this.enrollStudentHandler}
							enrollStudentSubmitHandler={this.enrollStudentSubmitHandler}
							classDetails={clas}
						/>
					)}
				</Content>
				<DropdownAlert ref={(ref) => (this.dropDownAlertRef = ref)} zIndex={11111111} />
			</Container>
		);
	}
}

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getHomeworkLists, getAllSubmittedHomeWork } from '../../redux/actions/homework';
import { enrollStudentByTeacher, getEnrolledStudentList } from '../../redux/actions/class';

const mapStateToProps = (state) => ({
	user: state.auth.user,
	homeworks: state.homework.homeworks,
	allSubmittedHomeworkList: state.homework.allSubmittedHomeworkList,
	enrollStudent: state.classes.enrollStudent,
	classError: state.classes.classError,
	enrollStudentList: state.classes.enrollStudentList
});

const mapDispatchToProps = (dispatch) => ({
	getHomeworkLists: bindActionCreators(getHomeworkLists, dispatch),
	enrollStudentByTeacher: bindActionCreators(enrollStudentByTeacher, dispatch),
	getEnrolledStudentList: bindActionCreators(getEnrolledStudentList, dispatch),
	getAllSubmittedHomeWork: bindActionCreators(getAllSubmittedHomeWork, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ClassDetail);

const button = {
	container: {
		marginTop: 10,
		backgroundColor: '#467DFF',
		height: 45
	},
	text: {
		fontSize: 16,
		fontFamily: fonts.regular
	}
};

const styles = StyleSheet.create({
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
		// alignItems: "center",
		// paddingHorizontal: "2.5%",
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
	}
});
