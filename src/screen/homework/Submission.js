import * as React from 'react';
import { Container, Content, Text, View, Header, Left, Body, Title, Right } from 'native-base';
import DropdownAlert from 'react-native-dropdownalert';
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { fonts, color } from '../../theme';
import { Icons, HomeworkCard } from '../../components';
import MultiFunctionTextEditor from '../../components/MultiFunctionTextEditor';
import Loader from '../../components/Loader';
import AlertModal from '../../components/AlertModal';
import { strings, changeLaguage } from '../../translations/service';

class HomeworkSubmission extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedTag: 'body',
			isLoading: false,
			selectedStyles: [],
			value: [],
			isModalOpen: false,
			editorValue: ''
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
					<Title style={styles.headerTitle}>{strings.homework}</Title>
					<Text style={styles.subtitle}>{'Submission'}</Text>
				</Body>
				<Right style={{ maxWidth: '20%' }} />
			</Header>
		);
	};

	loaderHandler = (status) => {
		this.setState({ isLoading: status });
	};

	onStyleKeyPress = (toolType) => {
		this.editor.applyToolbar(toolType);
	};

	onSelectedTagChanged = (tag) => {
		this.setState({
			selectedTag: tag
		});
	};

	onSelectedStyleChanged = (styles) => {
		this.setState({
			selectedStyles: styles
		});
	};

	onValueChanged = (value) => {
		this.state.value = value;
	};

	postSubmission = () => {
		const { homework, clas } = this.props.route.params;
		this.props.postSubmission(this, homework, clas, this.state.value);
	};

	getExistingHomeworkDetail = () => {
		const { homework, clas } = this.props.route.params;
		const savedHomeworkParam = { class_id: clas.id, homework_id: homework.id, submitted: false };
	};

	componentWillReceiveProps(nextProps) {
		if (nextProps.submitedHomework !== this.props.submitedHomework) {
			this.loaderHandler(false);
			this.setState({ editorValue: '' });
			this.props.clearUploadResources();
			this.props.navigation.navigate('ClassDetailView');
		}

		if (nextProps.savedHomework !== this.props.savedHomework) {
			this.setState({ editorValue: nextProps.savedHomework });
		}

		if (nextProps.homeworkError !== this.props.homeworkError) {
			this.loaderHandler(false);
		}
	}

	confirmationHandler = (homeWorkDetails) => {
		this.setState({ editorValue: homeWorkDetails, isModalOpen: true });
	};

	submitHomeWorkHandler = (homeWorkDetails) => {
		this.loaderHandler(true);
		const { homework, clas } = this.props.route.params;

		const submitStatus = this.props.route.params.homeworkSubmissionStatus === 'submit' ? 'true' : 'false';


		const homeworkInfo = {
			class_id: clas.id,
			homework_id: homework.id,
			homework_details: homeWorkDetails,
			submitted: submitStatus == 'true' ? 1 : 0
		};

		this.props.submitHomework(this, homeworkInfo, homework);
	};

	modalHandler = (response) => {

		if (response === 'yes') {
			this.submitHomeWorkHandler(this.state.editorValue);
		}

		this.setState({ isModalOpen: false });
	};

	render() {
		const { homework, clas } = this.props.route.params;

		const submitBtnText = this.props.route.params.homeworkSubmissionStatus === 'submit' ? 'submit' : 'save';

		return (
			<Container style={styles.container}>
				{this.header()}
				<ScrollView>
					<View
						ref={(ref) => (this.ScrollView = ref)}
						// onKeyboardWillShow={() => {
						//   this.ScrollView._root.scrollToPosition(0, 0);
						// }}
						// onKeyboardDidChangeFrame={() =>
						//   this.ScrollView._root.scrollToPosition(0, 0)
						// }
						// onKeyboardDidShow={() => {
						//   this.ScrollView._root.scrollToPosition(0, 0);
						// }}

						keyboardDismissMode="interactive"
						padder
					>
						<HomeworkCard
							viewOnly
							navigation={this.props.navigation}
							key={homework.id + 'viewonly'}
							currentHomeWork={homework}
							clas={clas}
							user={this.props.user}
						/>
					</View>
					<Content
						keyboardDismissMode="interactive"
						padder
						contentContainerStyle={{ flex: 1, padding: 5, paddingBottom: 30 }}
					>
						{this.state.isLoading && <Loader isLoading={true} />}
						<MultiFunctionTextEditor
							editorDefaultValue={this.props.route.params.savedHomeworkDetail || this.state.editorValue}
							submitBtnText={submitBtnText}
							submitHomeWorkHandler={this.confirmationHandler}
							loaderHandler={this.loaderHandler}
							instance={this}
							isEditable={true}
						/>
					</Content>

					<AlertModal
						modalHandler={this.modalHandler}
						modalVisiblility={this.state.isModalOpen}
						modalTitle={`Are you sure you want to ${submitBtnText} homework?`}
					/>
					<DropdownAlert ref={(ref) => (this.dropDownAlertRef = ref)} />
				</ScrollView>
			</Container>
		);
	}
}

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { postSubmission } from '../../redux/actions/questions';
import { submitHomework, getSavedHomeworkDetails } from '../../redux/actions/homework';
import { clearUploadResources } from '../../redux/actions/uploadResources';

const mapStateToProps = (state) => ({
	user: state.auth.user,
	submitedHomework: state.homework.submitedHomework,
	savedHomework: state.homework.savedHomework,
	homeworkError: state.homework.homeworkError
});

const mapDispatchToProps = (dispatch) => ({
	postSubmission: bindActionCreators(postSubmission, dispatch),
	submitHomework: bindActionCreators(submitHomework, dispatch),
	getSavedHomeworkDetails: bindActionCreators(getSavedHomeworkDetails, dispatch),
	clearUploadResources: bindActionCreators(clearUploadResources, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeworkSubmission);

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
