import * as React from 'react';
import { Container, Text, View, Row, Col } from 'native-base';
import { Dimensions, StyleSheet, FlatList } from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import { color, fonts } from '../theme';
import { dummyImageUrl } from '../utils/constants';
import { strings } from '../translations/service';

const { width: screenWidth } = Dimensions.get('window');

class ViewAll extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			teacherPerfDetail: props.teacherPerformace,
			studentPerfDetail: props.studentPerformace
		};
	}
	componentDidMount() {
		this.props.getOtherPerformanceDetail();
	}

	componentWillReceiveProps(props) {
		this.setState({
			teacherPerfDetail: props.teacherPerformace || [],
			studentPerfDetail: props.studentPerformace || []
		});
	}

	otherPerformanceList = ({ item, index }) => {
		return (
			<Row>
				<Col style={{ justifyContent: 'center', alignItems: 'center' }}>
					<Text style={{ color: '#ECB22B', fontFamily: fonts.regular, letterSpacing: 0.7, fontSize: 14 }}>
						#{index + 1}
					</Text>
				</Col>
				<Col style={{ flexDirection: 'row', alignItems: 'center' }} size={4}>
					<Avatar
						rounded
						size={34}
						source={{ uri: item.profile_image ? item.profile_image : dummyImageUrl }}
					/>
					<Text
						adjustsFontSizeToFit
						style={{ marginLeft: 8, fontFamily: fonts.regular, fontSize: 14, letterSpacing: 0.7 }}
					>
						{item.first_name} {item.last_name}
					</Text>
				</Col>
				<Col size={2} style={{ alignItems: 'center', justifyContent: 'center' }}>
					<Text
						numberOfLines={1}
						adjustsFontSizeToFit={true}
						style={{
							color: color.primary,
							fontFamily: fonts.semibold,
							width: 80,
							textAlign: 'center',
							fontSize: 14,
							letterSpacing: 1.12
						}}
					>
						{item.points}
					</Text>
					<Text
						numberOfLines={1}
						adjustsFontSizeToFit={true}
						style={{
							color: color.dark,
							opacity: 0.4,
							letterSpacing: 0.7,
							fontSize: 10,
							fontFamily: fonts.medium,
							width: 80,
							textAlign: 'center'
						}}
					>
						{strings.points_capital}
					</Text>
				</Col>
			</Row>
		);
	};

	render() {
		const { route: { params: { key } } } = this.props;
		return (
			<Container style={{ borderRadius: 10, marginTop: 10, paddingVertical: 10 }}>
				{key === 'teacher' && (
					<View>
						{this.state.teacherPerfDetail.length == 0 ? (
							<ActivityIndicator color="#5281EF" />
						) : (
							<FlatList
								data={this.state.teacherPerfDetail}
								renderItem={this.otherPerformanceList}
								keyExtractor={(item) => item.id}
							/>
						)}
						<DropdownAlert ref={(ref) => (this.dropDownAlertRef = ref)} zIndex={11111111} />
					</View>
				)}
				{key === 'student' && (
					<View>
						{this.state.studentPerfDetail.length == 0 ? (
							<ActivityIndicator color="#5281EF" />
						) : (
							<FlatList
								data={this.state.studentPerfDetail}
								renderItem={this.otherPerformanceList}
								keyExtractor={(item) => item.id}
							/>
						)}
						<DropdownAlert ref={(ref) => (this.dropDownAlertRef = ref)} zIndex={11111111} />
					</View>
				)}
			</Container>
		);
	}
}

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Avatar } from 'react-native-elements';
import { ActivityIndicator } from 'react-native-paper';
import { getOtherPerformanceDetail } from '../redux/actions/profile';

const mapStateToProps = (state) => ({
	user: state.auth.user,
	teacherPerformace: state.profile.teacherPerformace,
	studentPerformace: state.profile.studentPerformace
});

const mapDispatchToProps = (dispatch) => ({
	getOtherPerformanceDetail: bindActionCreators(getOtherPerformanceDetail, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewAll);

