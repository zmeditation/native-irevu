import * as React from 'react';
import { Container, Content, View } from 'native-base';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-elements';
import { fonts } from '../../theme';
import {
	CurrentQuestions,
	NewQuestions,
	AskAQuestionRow} from '../../components';
import { userType } from '../../utils/constants';
import Loader from '../../components/Loader';
import { dummyImageUrl } from '../../utils/constants';

class Forum extends React.Component {
	// static navigationOptions={
	//     headerTitle: 'All products',
	//     // headerRight : (
	//     //   <HeaderButtons headerButtonCompoenent={HeaderButton}>
	//     //     <Item title='Cart' iconName={'ios-search'} onPress={()=>{}}/>
	//     // </HeaderButtons>
	//     // )
	// }

	constructor(props) {
		super(props);
		this.state = {
			username: '',
			openQuestionList: [],
			closeQuestionList: []
			// isLoading: false,
		};
	}

	questionListHandler = () => {
		// this.setState({ isLoading: true });
		this.props.getOpenQuestionList(this, 'open');
		this.props.getCloseQuestionList(this, 'close');
	};

	componentDidMount() {
		this.getHour();
		this.props.navigation.addListener('focus', this.questionListHandler);
		this.props.navigation.setOptions({
			headerRight: () => (
				<TouchableOpacity onPress={() => this.props.navigation.navigate('Profile')}>
					<Avatar
						rounded
						size={35}
						source={{
							uri: (this.props.user && this.props.user.profileImage) || dummyImageUrl
						}}
						containerStyle={{ marginRight: 10 }}
					/>
				</TouchableOpacity>
			)
		});
	}

	getHour = () => {
		const date = new Date();
		const hour = date.getHours();
		this.setState({ hour });
	};

	componentWillReceiveProps(nextProps) {
		if (nextProps.allOpenQuestionList !== this.props.allOpenQuestionList) {
			this.setState({ openQuestionList: nextProps.allOpenQuestionList });
		}

		if (nextProps.allCloseQuestionList !== this.props.allCloseQuestionList) {
			this.setState({ closeQuestionList: nextProps.allCloseQuestionList });
		}
	}

	render() {
		const { hour, username } = this.state;
		const { user } = this.props;
		return (
			<Container style={styles.container}>
				{this.state.loading && <Loader isLoading={this.state.loading} />}
				<Content showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }} padder>
					{user.user_type === userType.student && (
						<View>
							<AskAQuestionRow
								onPress={() => this.props.navigation.navigate('WriteQuestion')}
								navigation={this.props.navigation}
							/>
							<View style={styles.dividertransparent} />
							<View style={styles.dividertransparent} />
							<View style={styles.divider} />
						</View>
					)}

					<View style={styles.dividertransparent} />

					{/* keep in mind new question means open questions*/}
					<NewQuestions navigation={this.props.navigation} openQuestionList={this.state.openQuestionList} />

					<View style={styles.dividertransparent} />
					<View style={styles.dividertransparent} />

					{/* keep in mind current question means closed question */}
					<CurrentQuestions
						navigation={this.props.navigation}
						closeQuestionList={this.state.closeQuestionList}
					/>
				</Content>
			</Container>
		);
	}
}

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getOpenQuestionList, getCloseQuestionList } from '../../redux/actions/forum';
const mapStateToProps = (state) => ({
	user: state.auth.user,
	profileDetail: state.profile.profileDetail,
	allOpenQuestionList: state.forum.allOpenQuestionList,
	allCloseQuestionList: state.forum.allCloseQuestionList
});

const mapDispatchToProps = (dispatch) => ({
	getOpenQuestionList: bindActionCreators(getOpenQuestionList, dispatch),
	getCloseQuestionList: bindActionCreators(getCloseQuestionList, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Forum);

const styles = StyleSheet.create({
	divider: {
		width: 100,
		height: 1,
		backgroundColor: 'gray',
		alignSelf: 'center',
		opacity: 0.3,
		marginBottom: 10
	},
	dividertransparent: {
		width: 100,
		height: 1,
		backgroundColor: 'gray',
		alignSelf: 'center',
		opacity: 0,
		marginBottom: 10
	},

	full_name: {
		fontFamily: fonts.semibold,
		color: 'black',
		fontSize: 25,
		opacity: 0.75
	},
	morning: { fontFamily: fonts.semibold, color: 'gray', fontSize: 17 },
	greetingCon: {
		width: '96%',
		backgroundColor: 'white',
		alignSelf: 'center',
		borderRadius: 10,
		alignItems: 'center',
		padding: 20
	},
	container: {
		backgroundColor: '#F2F6FF'
	}
});
