import * as React from 'react';
import { Container, Content, Text, View } from 'native-base';
import { StyleSheet, TouchableOpacity, TextInput, FlatList } from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import { debounce } from 'lodash';
import { fonts } from '../../theme';
import { AskAQuestionRow, Icons } from '../../components';
import { Card } from 'react-native-paper';
import Loader from '../../components/Loader';
import { strings } from '../../translations/service';

class Resources extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			isLoading: false,
			cards: [],
			otherResourceDetails: [],
			search: ''
		};
		this.searchHandler = debounce(this.searchHandler, 800);
	}

	componentDidMount() {
		this.props.navigation.setOptions({
			headerRight: () => (
				<TouchableOpacity onPress={() => this.props.navigation.navigate('AddResource')}>
					<Icons.Entypo name="plus" color="black" size={30} style={{ marginRight: 10 }} />
				</TouchableOpacity>
			)
		});

		this.setState({ isLoading: true });
		this.props.getOtherResource(this);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.otherResources !== this.props.otherResources) {
			this.setState({ otherResourceDetails: nextProps.otherResources, isLoading: false });
		}

		if (nextProps.resourceError !== this.props.resourceError) {
			this.setState({ isLoading: false });
		}
	}

	searchHandler = (searchVal) => {
		this.props.searchResource(this, searchVal);
	};

	onChangeSearchHandle = (searchVal) => {
		this.setState({ search: searchVal });

		this.searchHandler(searchVal);
	};

	resourceListHandler = ({ item }) => {
		return (
			<Card
				onPress={() => {
					this.props.navigation.navigate('ResourcePurchase', { details: item });
				}}
				style={{
					padding: 20,
					marginTop: 10,
					borderRadius: 15,
					width: '100%',
					alignSelf: 'center'
				}}
			>
				<Text style={styles.degree}>{item.level}</Text>
				<Text style={styles.title}>{item.subject}</Text>
				<Text numberOfLines={2} style={styles.subText}>
					{item.title}
				</Text>
			</Card>
		);
	};

	render() {
		return (
			<Container style={styles.container}>
				{this.state.isLoading && <Loader isLoading={true} />}
				<AskAQuestionRow
					text={strings.my_resources}
					textButton={strings.open}
					navigation={this.props.navigation}
					onPress={() => this.props.navigation.navigate('MyResources')}
				/>
				<View style={styles.dividertransparent} />
				<View style={styles.dividertransparent} />
				<Text style={styles.heading}>{strings.resources_by_others}</Text>
				<View style={styles.searchMainCon}>
					<View style={styles.searchIconCon}>
						<Icons.FontAwesome5 name="search" size={18} color="black" style={{ opacity: 0.2 }} />
					</View>
					<View style={{ flex: 1.9 }}>
						<TextInput
							style={styles.searchTextinputCon}
							placeholder="Search Paper(e.g. Maths, Algebra)"
							onChangeText={(value) => this.onChangeSearchHandle(value)}
						/>
					</View>
				</View>
				<View style={styles.dividertransparent} />
				<Content showsVerticalScrollIndicator={false} style={{ width: 374, height: 115 }}>
					<FlatList
						data={this.state.otherResourceDetails}
						renderItem={(item) => this.resourceListHandler(item)}nestedScrollEnabled={true}
						keyExtractor={(item) => item.id}
					/>
				</Content>
				<DropdownAlert ref={(ref) => (this.dropDownAlertRef = ref)} zIndex={11111111} />
			</Container>
		);
	}
}

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
		backgroundColor: '#F2F6FF',
		alignItems: 'center',
		paddingHorizontal: '2.5%',
		paddingTop: 20
	},
	heading: {
		fontSize: 23,
		fontFamily: fonts.medium,
		color: '#467DFF',
		textAlign: 'center',
		marginBottom: 10
	},
	searchMainCon: {
		width: '95%',
		alignSelf: 'center',
		marginVertical: 9,
		height: 50,
		backgroundColor: 'white',
		borderRadius: 15,
		flexDirection: 'row'
	},
	searchIconCon: {
		flex: 0.2,
		justifyContent: 'center',
		alignItems: 'center'
	},
	searchTextinputCon: {
		flex: 1,
		fontFamily: fonts.regular,
		fontSize: 14,
		color: 'black'
	},
	degree: {
		opacity: 0.2,
		fontSize: 12,
		fontFamily: fonts.regular,
		textTransform: 'capitalize'
	},
	title: { fontFamily: fonts.regular, fontSize: 18 },
	subText: { fontFamily: fonts.regular, fontSize: 14 }
});

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getOtherResource, searchResource } from '../../redux/actions/resource';

const mapStateToProps = (state) => ({
	otherResources: state.resource.otherResources,
	resourceError: state.resource.resourceError
});

const mapDispatchToProps = (dispatch) => ({
	getOtherResource: bindActionCreators(getOtherResource, dispatch),
	searchResource: bindActionCreators(searchResource, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Resources);
