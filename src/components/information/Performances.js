import * as React from 'react';
import { Text, View } from 'native-base';
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { strings } from '../../translations/service';
import Carousel from 'react-native-snap-carousel';
import DropdownAlert from 'react-native-dropdownalert';
import { fonts } from '../../theme';
import PerformanceCard from './PerformanceCard';

const { width: screenWidth } = Dimensions.get('window');
let THIS = false;
class Performances extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			index: 0,
			buttons: [
				{
					title: strings.student,
					key: 'student'
				},
				{
					title: strings.teacher,
					key: 'teacher'
				},
				{
					title: strings.you,
					key: 'self'
				}
			]
		};
		THIS = this;
		this.selectTabFunction = this.selectTab.bind(this);
	}

	selectTab = (index) => {
		if (this.state.index !== index) {
			this.CatCarousel.snapToItem(index);
			this.setState({ index });
		}
	};

	_renderItem({ item, index }, parallaxProps) {
		return <PerformanceCard navigation={THIS.props.navigation} key={index + 'performcarousel'} item={item} />;
	}

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.heading}>{strings.performers}</Text>
				<View style={styles.buttonCon}>
					{this.state.buttons &&
						this.state.buttons.map((button, index) => {
							return (
								<TouchableOpacity
									key={index}
									onPress={() => this.selectTabFunction(index)}
									style={[this.state.index === index ? styles.selectedButton : styles.button]}
								>
									<Text
										style={{
											fontFamily: fonts.semibold,
											color: this.state.index === index ? 'white' : 'black'
										}}
									>
										{button.title}
									</Text>
								</TouchableOpacity>
							);
						})}
				</View>

				<Carousel
					ref={(ref) => (this.CatCarousel = ref)}
					onSnapToItem={(index) => {
						if (this.state.index !== index) {
							this.setState({ index });
						}
					}}
					sliderWidth={screenWidth}
					sliderHeight={screenWidth}
					itemWidth={screenWidth - 50}
					data={this.state.buttons}
					renderItem={this._renderItem}
					inactiveSlideScale={0.95}
				/>

				<DropdownAlert ref={(ref) => (this.dropDownAlertRef = ref)} zIndex={11111111} />
			</View>
		);
	}
}

import { connect } from 'react-redux';
const mapStateToProps = (state) => ({
	user: state.auth.user
});

export default connect(mapStateToProps)(Performances);

const styles = StyleSheet.create({
	item: { width: '100%', height: 300 },
	heading: { fontSize: 20, fontFamily: fonts.semibold, color: '#467DFF' },
	selectedButton: {
		width: '32%',
		height: '80%',
		backgroundColor: '#467DFF',
		borderRadius: 5,
		justifyContent: 'center',
		alignItems: 'center'
	},
	button: {
		width: '32%',
		height: '80%',
		backgroundColor: 'white',
		borderRadius: 5,
		justifyContent: 'center',
		alignItems: 'center'
	},
	buttonCon: {
		width: '100%',
		height: 45,
		marginTop: 10,
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 15
	},
	container: { height: 450, width: '100%', marginTop: 13, alignItems: 'center', padding: 10 }
});
