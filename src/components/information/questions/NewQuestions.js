import * as React from 'react';
import { Dimensions, StyleSheet, TouchableNativeFeedbackComponent, TouchableOpacity } from 'react-native';
import { QuestionCard } from '../..';
import { strings, changeLaguage } from '../../../translations/service';

class NewQuestions extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		const { openQuestionList, user } = this.props;
		return (
			<View>
				<Text style={styles.heading}>{strings.open_questions}</Text>

				{openQuestionList && openQuestionList.length > 0 ? (
					openQuestionList
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
						.map((openQuestionDetail, index) => {
							return (
								<QuestionCard
									key={index}
									navigation={this.props.navigation}
									questionDetail={openQuestionDetail}
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
						{strings.no_open_questions_found}
					</Text>
				)}

				{/* <QuestionCard navigation={this.props.navigation} /> */}
			</View>
		);
	}
}

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Avatar } from 'react-native-elements';
import { View, Text } from 'native-base';
import { fonts, color } from '../../../theme';
import { userType } from '../../../utils/constants';

const mapStateToProps = (state) => ({
	user: state.auth.user
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(NewQuestions);

const styles = StyleSheet.create({
	heading: {
		fontSize: 20,
		fontFamily: fonts.medium,
		letterSpacing: 1,
		color: color.primary,
		textAlign: 'center',
		marginBottom: 10,
		marginTop: 10
	},
	subtitle: {
		opacity: 0.5,
		color: 'black',
		alignSelf: 'center',
		fontFamily: fonts.regular,
		fontSize: 12
	}
});
