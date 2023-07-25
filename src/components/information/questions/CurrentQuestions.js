import * as React from 'react';
import { Dimensions, StyleSheet, TouchableNativeFeedbackComponent, TouchableOpacity } from 'react-native';
import { QuestionCard } from '../..';
import { strings, changeLaguage } from '../../../translations/service';

class PerformancesCard extends React.Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	render() {
		const { closeQuestionList, user } = this.props;
		return (
			<View>
				<Text style={styles.heading}>{strings.closed_questions}</Text>
				{closeQuestionList && closeQuestionList.length > 0 ? (
					closeQuestionList
						.filter((i) => {
							if (user.user_type === userType.student) {
								if (i.ask_whom == 'student' || (i.ask_whom == 'teacher' && i.created_by == user.id)) {
									return i;
								}
							} else {
								if (i.ask_whom == 'teacher') {
									return i;
								}
							}
						})
						.map((closeQuestionDetail, index) => {
							return (
								<QuestionCard
									key={index}
									navigation={this.props.navigation}
									questionDetail={closeQuestionDetail}
								/>
							);
						})
				) : (
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
						{strings.no_close_question_found}
					</Text>
				)}
			</View>
		);
	}
}

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Avatar } from 'react-native-elements';
import { View, Text } from 'native-base';
import { color, fonts } from '../../../theme';
import { userType } from '../../../utils/constants';

const mapStateToProps = (state) => ({
	user: state.auth.user
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(PerformancesCard);

const styles = StyleSheet.create({
	heading: {
		fontSize: 20,
		fontFamily: fonts.medium,
		letterSpacing: 1,
		color: color.primary,
		textAlign: 'center',
		marginBottom: 10
	},
	subtitle: {
		opacity: 0.5,
		color: 'black',
		alignSelf: 'center',
		fontFamily: fonts.regular,
		fontSize: 12
	}
});
