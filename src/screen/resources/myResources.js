import * as React from 'react';
import { Container, Content, Text, View } from 'native-base';
import { StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import { color, fonts } from '../../theme';
import { Icons } from '../../components';
import { Card } from 'react-native-paper';
import AlertModal from '../../components/AlertModal';
import Loader from '../../components/Loader';

class MyResources extends React.Component {
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
			isModalOpen: false,
			resourceDetails: [],
			removeId: '',
			isLoading: false
		};
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
		this.props.getResource(this);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.resourceList !== this.props.resourceList) {
			this.setState({ resourceDetails: nextProps.resourceList, isLoading: false });
		}

		if (nextProps.removeResource !== this.props.removeResource) {
			this.setState({ isLoading: false });
		}

		if (nextProps.resourceError !== this.props.resourceError) {
			this.setState({ isLoading: false });
		}
	}

	modalHandler = (response) => {
		if (response === 'yes') {
			this.setState({ isLoading: true });
			this.props.removeResource(this, this.state.removeId);
		}
		this.setState({ isModalOpen: false });
	};

	resourcesListHandler = ({ item }) => {
		return (
			<Card style={styles.cardContainer}>
				<View>
					<View style={styles.titleContainer}>
						<Text style={styles.degree}>{item.level || ''}</Text>
						<TouchableOpacity onPress={() => this.setState({ removeId: item.id, isModalOpen: true })}>
							<Icons.FontAwesome5 name="trash" style={styles.icon} />
						</TouchableOpacity>
					</View>
					<Text
						style={styles.title}
						onPress={() => {
							this.props.navigation.navigate('ResourcePurchase', { details: item });
						}}
					>
						{item.subject}
					</Text>
					<Text
						numberOfLines={2}
						style={styles.subText}
						onPress={() => {
							this.props.navigation.navigate('ResourcePurchase', { details: item });
						}}
					>
						{item.title}
					</Text>
				</View>
			</Card>
		);
	};

	render() {
		return (
			<Container style={styles.container}>
				{this.state.isLoading && <Loader isLoading={true} />}
				<Content showsVerticalScrollIndicator={false} style={{ width: 374, height: 115 }}>
					<FlatList
						data={this.state.resourceDetails}
						renderItem={(items) => this.resourcesListHandler(items)}
						keyExtractor={(item) => item.id}
					/>
					<AlertModal modalHandler={this.modalHandler} modalVisiblility={this.state.isModalOpen} />
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
		backgroundColor: 'white',
		alignSelf: 'center',
		opacity: 0.3,
		marginBottom: 10
	},
	cardContainer: {
		padding: 20,
		marginTop: 20,
		borderRadius: 10,
		width: '100%'
	},
	icon: {
		fontSize: 18,
		color: color.primary
	},
	titleContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between'
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
		alignSelf: 'center',
		paddingTop: 10,
		width: '100%'
	},
	heading: {
		fontSize: 23,
		fontFamily: fonts.medium,
		color: '#467DFF',
		textAlign: 'center'
	},
	searchMainCon: {
		width: '95%',
		alignSelf: 'center',
		marginVertical: 10,
		height: 50,
		backgroundColor: 'white',
		borderRadius: 15,
		flexDirection: 'row'
	},
	searchIconCon: {
		flex: 0.35,
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
		letterSpacing: 0.6
	},
	title: {
		fontFamily: fonts.regular,
		fontSize: 18,
		marginTop: 5,
		letterSpacing: 1.26,
		lineHeight: 27
	},
	subText: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20 }
});

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getResource, removeResource } from '../../redux/actions/resource';
import { start_wechat_pay } from '../../redux/actions/auth';

const mapStateToProps = (state) => ({
	resourceList: state.resource.resourceList,
	removeResource: state.resource.removeResource,
	resourceError: state.resource.resourceError
});

const mapDispatchToProps = (dispatch) => ({
	start_wechat_pay: bindActionCreators(start_wechat_pay, dispatch),
	getResource: bindActionCreators(getResource, dispatch),
	removeResource: bindActionCreators(removeResource, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(MyResources);
