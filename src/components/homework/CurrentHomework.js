import * as React from 'react';
import { Text } from 'native-base';
import { StyleSheet, View } from 'react-native';
import { fonts, color } from '../../theme';
import { ActivityIndicator } from 'react-native-paper';
import HomeWorkCard from './Card';
// import { strings, changeLaguage } from '../../translations/service';

class CurrentHomework extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: ''
		};
	}

	render() {
		const { isLoading, homeworks, clas, currrentHomeworkDetails } = this.props;

		return (
			<View>
				<Text
					style={[
						styles.subtitle,
						{
							marginVertical: 14,
							fontSize: 17,
							fontFamily: fonts.medium,
							opacity: 0.3
						}
					]}
				>
					{!isLoading && (!currrentHomeworkDetails || currrentHomeworkDetails.length === 0) ? (
						'NO HOMEWORKS TODAY'
					) : (
						'CURRENT HOMEWORK'
					)}
				</Text>

				{isLoading ? (
					<ActivityIndicator size="small" color={color.blue} />
				) : (
					currrentHomeworkDetails &&
					currrentHomeworkDetails.map((homework, index) => {
						return (
							homework.status === 1 && (
								<HomeWorkCard
									{...this.props}
									navigation={this.props.navigation}
									key={homework.id + 'homeworkcard'}
									currentHomeWork={homework}
									clas={clas}
									user={this.props.user}
								/>
							)
						);
					})
				)}
			</View>
		);
	}
}

import { connect } from 'react-redux';

const mapStateToProps = (state) => {
	return {
		user: state.auth.user
	};
};

export default connect(mapStateToProps)(CurrentHomework);

const styles = StyleSheet.create({
	top: {
		height: 50,
		backgroundColor: color.blue,
		borderTopEndRadius: 5,
		borderTopStartRadius: 5
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
