import * as React from 'react';
import { StyleSheet, InteractionManager } from 'react-native';
import { ClassCard } from '../..';
import { strings } from '../../../translations/service';

class PerformancesCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	// componentDidMount() {
	// 	// console.log(this.props);
	// }

	componentWillMount() {
		InteractionManager.runAfterInteractions().then(() => {
			// this.props.getUserClasses(this);
		});
	}

	render() {
		return (
			<View>
				<Text style={styles.heading}>{strings.my_classes}</Text>

				{this.props.classesDetails && this.props.classesDetails.length > 0 ? (
					this.props.classesDetails.map((clas, index) => {
						return (
							<ClassCard navigation={this.props.navigation} key={clas.id + 'class_card'} clas={clas} />
						);
					})
				) : (
					<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
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
							{strings.no_classes_found}
						</Text>
					</View>
				)}

				{/* {this.props.loading ?
                    <ActivityIndicator size="large" color="#5281EF" style={{ marginVertical: 22 }} />
                    :
                    <>
                        {this.props.classes && this.props.classes.map((clas, index) => {
                            return (
                                <ClassCard navigation={this.props.navigation} key={clas.id + 'class_card'} clas={clas} />
                            )
                        })}
                    </>
                } */}
			</View>
		);
	}
}

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View, Text } from 'native-base';
import { fonts } from '../../../theme';
import { getUserClasses } from '../../../redux/actions/class';

const mapStateToProps = (state) => ({
	user: state.auth.user,
	classes: state.classes.classes,
	loading: state.classes.loading
});

const mapDispatchToProps = (dispatch) => ({
	getUserClasses: bindActionCreators(getUserClasses, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(PerformancesCard);

const styles = StyleSheet.create({
	heading: { fontSize: 23, fontFamily: fonts.semibold, color: '#467DFF', textAlign: 'center', marginBottom: 10 },
	subtitle: {
		opacity: 0.5,
		color: 'black',
		alignSelf: 'center',
		fontFamily: fonts.regular,
		fontSize: 12
	}
});
