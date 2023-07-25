import * as React from 'react';
import { Text, View, Row, Col } from 'native-base';
import { StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { strings } from '../../translations/service';
import { color, fonts } from '../../theme';
import { dummyImageUrl } from '../../utils/constants';

class PerformancesCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			teacherPerfDetail: props.teacherPerformace,
			studentPerfDetail: props.studentPerformace,
			user: props.user
		};
	}
	componentWillReceiveProps(props) {
		this.setState({
			teacherPerfDetail: props.teacherPerformace || [],
			studentPerfDetail: props.studentPerformace || []
		});
		if (props.profileDetail !== this.props.profileDetail) {
			this.setState({ user: props.profileDetail });
		}
		if (props.user !== this.props.user) {
			this.setState({ user: props.user });
		}
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
		const { item } = this.props;
		const { user } = this.state;

		if (item.key === 'self') {
			return (
				<View style={styles.selfItem}>
					<Card style={styles.selfCard}>
						<View style={{ flexDirection: 'row', maxHeight: 120 }}>
							<Avatar
								rounded
								size={60}
								source={{ uri: user.profile_image ? user.profile_image : dummyImageUrl }}
							/>
							<View style={{ marginLeft: 10, width: '100%' }}>
								<Text
									numberOfLines={1}
									adjustsFontSizeToFit={true}
									style={{
										fontSize: 25,
										width: '70%',
										marginLeft: 8,
										color: '#467DFF',
										fontFamily: fonts.medium
									}}
								>
									{user.first_name} {user.last_name}
								</Text>
								<View style={{ width: '68%', height: 55, marginLeft: 10, flexDirection: 'row' }}>
									<Col style={{ padding: 0 }}>
										<Text style={{ fontFamily: fonts.semibold }}>{strings.points}</Text>
										<Text style={{ fontFamily: fonts.medium, fontSize: 23, color: '#467DFF' }}>
											{user.points}
										</Text>
										<View
											style={{
												position: 'absolute',
												width: 1,
												height: '80%',
												backgroundColor: 'lightgray',
												right: 20,
												top: 3
											}}
										/>
									</Col>
									<Col style={{ padding: 0 }}>
										<Text style={{ fontFamily: fonts.semibold }}>{strings.position}</Text>
										<Text style={{ fontFamily: fonts.medium, fontSize: 23, color: '#467DFF' }}>
											{user.positionrow}
										</Text>
									</Col>
								</View>
							</View>
						</View>

						<View
							style={{
								flex: 1,
								marginTop: 10,
								borderRadius: 10,
								backgroundColor: 'rgba(43, 101, 236, .2)'
							}}
						>
							<Row>
								<Col style={{ justifyContent: 'center', paddingLeft: 20 }}>
									<Text style={{ textAlign: 'left' }}>{strings.questions_answered}</Text>
									<Text
										style={{
											fontSize: 30,
											color: '#467DFF',
											fontFamily: fonts.medium,
											textAlign: 'left'
										}}
									>
										{user.answerCount}
									</Text>
								</Col>
								<View
									style={{
										borderLeftWidth: 1,
										borderLeftColor: 'lightgray',
										height: '50%',
										justifyContent: 'center',
										alignSelf: 'center',
										alignItems: 'center'
									}}
								/>
								<Col style={{ justifyContent: 'center', paddingLeft: 20 }}>
									<Text style={{ textAlign: 'left' }}>{strings.resources_created}</Text>
									<Text
										style={{
											fontSize: 30,
											color: '#467DFF',
											fontFamily: fonts.medium,
											textAlign: 'left'
										}}
									>
										{user.resourcesCount}
									</Text>
								</Col>
								<View
									style={{
										borderLeftWidth: 1,
										borderLeftColor: 'lightgray',
										height: '50%',
										justifyContent: 'center',
										alignSelf: 'center',
										alignItems: 'center'
									}}
								/>
								<Col style={{ justifyContent: 'center', paddingLeft: 20 }}>
									<Text style={{ textAlign: 'left' }}>{strings.referrals}</Text>
									<Text
										style={{
											fontSize: 30,
											color: '#467DFF',
											fontFamily: fonts.medium,
											marginTop: 16,
											textAlign: 'left'
										}}
									>
										{user.referral_used}
									</Text>
								</Col>
							</Row>
						</View>
					</Card>
				</View>
			);
		}

		if (item.key === 'teacher') {
			return (
				<View style={styles.item}>
					<Card style={styles.card}>
						{this.state.teacherPerfDetail.length == 0 ? (
							<ActivityIndicator color="#5281EF" />
						) : (
							<FlatList
								data={this.state.teacherPerfDetail}
								renderItem={this.otherPerformanceList}
								keyExtractor={(item) => item.id}
							/>
						)}
					</Card>

					<TouchableOpacity
						style={styles.viewButton}
						onPress={() => this.props.navigation.navigate('ViewAll', { key: item.key })}
					>
						<Text style={styles.view}>{strings.view_all_capital}</Text>
					</TouchableOpacity>
					{/* <DropdownAlert ref={(ref) => (this.dropDownAlertRef = ref)} zIndex={11111111} /> */}
				</View>
			);
		}

		if (item.key === 'student') {
			return (
				<View style={styles.item}>
					<Card style={styles.card}>
						{this.state.studentPerfDetail.length == 0 ? (
							<ActivityIndicator color="#5281EF" />
						) : (
							<FlatList
								data={this.state.studentPerfDetail}
								renderItem={this.otherPerformanceList}
								keyExtractor={(item) => item.id}
							/>
						)}
					</Card>

					<TouchableOpacity
						style={styles.viewButton}
						onPress={() => this.props.navigation.navigate('ViewAll', { key: item.key })}
					>
						<Text style={styles.view}>{strings.view_all_capital}</Text>
					</TouchableOpacity>
					{/* <DropdownAlert ref={(ref) => (this.dropDownAlertRef = ref)} zIndex={11111111} /> */}
				</View>
			);
		}
	}
}

import { connect } from 'react-redux';
import { Avatar } from 'react-native-elements';
import { ActivityIndicator, Card } from 'react-native-paper';

const mapStateToProps = (state) => ({
	user: state.auth.user,
	profileDetail: state.profile.editProfDetails,
	teacherPerformace: state.profile.teacherPerformace.filter((_, i) => i < 3),
	studentPerformace: state.profile.studentPerformace.filter((_, i) => i < 3)
});

export default connect(mapStateToProps)(PerformancesCard);

const styles = StyleSheet.create({
	view: { color: 'white', fontFamily: fonts.semibold },
	viewButton: {
		height: 40,
		width: 150,
		marginTop: 10,
		backgroundColor: '#5281EF',
		borderRadius: 30,
		justifyContent: 'center',
		alignItems: 'center'
	},
	card: { width: '100%', backgroundColor: 'white', borderRadius: 10, paddingVertical: 10 },
	item: { width: '100%', height: 300, alignItems: 'center' },
	selfItem: { width: '100%', height: 300, alignItems: 'center' },
	selfCard: { width: '100%', height: 300, backgroundColor: 'white', borderRadius: 10, padding: 15 }
});
