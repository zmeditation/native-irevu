import * as React from 'react';
import { Container, Content } from 'native-base';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-elements';
import DropdownAlert from 'react-native-dropdownalert';
import { fonts } from '../../theme';
import { UserNotifications } from '../../components';
import { dummyImageUrl } from '../../utils/constants';
import Loader from '../../components/Loader';

class Notifications extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			notificationDetail: [],
			isLoading: false
		};
	}

	loaderHandler = (status) => {
		this.setState({ isLoading: status });
	};

	handleGetNotification = () => {
		this.props.getNotification(this);
	};

	componentDidMount() {
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

		this.handleGetNotification();
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.notificationDetail !== this.props.notificationDetail) {
			// this.loaderHandler(false);
			this.setState({ notificationDetail: nextProps.notificationDetail });
		}

		if (nextProps.notificationError !== this.props.notificationError) {
			// this.loaderHandler(false);
		}
	}

	getHour = () => {
		const date = new Date();
		const hour = date.getHours();
		this.setState({
			hour
		});
	};

	render() {
		const { hour, username } = this.state;
		const { user } = this.props;

		return (
			<Container style={styles.container}>
				{this.state.isLoading && <Loader isLoading={this.state.isLoading} />}
				<Content showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }} padder>
					<UserNotifications
						navigation={this.props.navigation}
						notificationDetail={this.state.notificationDetail}
					/>
				</Content>
				<DropdownAlert ref={(ref) => (this.dropDownAlertRef = ref)} zIndex={11111111} />
			</Container>
		);
	}
}

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getNotification } from '../../redux/actions/notification';

const mapStateToProps = (state) => ({
	user: state.auth.user,
	profileDetail: state.profile.profileDetail,
	notificationDetail: state.notification.notificationDetail,
	notificationError: state.notification.notificationError
});

const mapDispatchToProps = (dispatch) => ({
	getNotification: bindActionCreators(getNotification, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);

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