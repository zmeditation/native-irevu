import * as React from 'react';
import * as screens from '../screen';
import { TouchableOpacity } from 'react-native';
import { strings } from '../translations/service';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { AnimatedTabBarNavigator } from 'react-native-animated-nav-tab-bar';
import { Avatar } from 'react-native-elements';
import { Icons, Drawer as DrawerComponent } from '../components';
import { dummyImageUrl } from '../utils/constants';

const Tabs = AnimatedTabBarNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

export default class DrawerClass extends React.Component {
	render() {
		return (
			<Drawer.Navigator 
				drawerStyle={{ width: '85%' }}
				drawerContent={(props) => <DrawerComponent  {...props} />}
			>
				<Drawer.Screen name="Drawer" component={BottomTab} />
			</Drawer.Navigator>
		);
	}
}

class HomeNavigatorComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = { user: props.user };
	}
	componentWillReceiveProps(props) {
		this.setState({ user: props.profileDetail });
	}
	render() {
		const { user } = this.state;
		return (
			<Stack.Navigator
				screenOptions={{
					headerStyle: {
						borderBottomEndRadius: 20,
						borderBottomStartRadius: 20
					},
					headerTitleAlign: 'center',
					headerTitleStyle: { fontFamily: fonts.semibold }
				}}
				initialRouteName={'Home'}
			>
				<Stack.Screen
					name="Home"
					component={screens.Home}
					options={{
						headerShown: true,
						headerTitle: strings.dashboard,
						headerLeft: () => (
							<TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
								<Icons.Entypo name="menu" color="black" size={30} style={{ marginLeft: 10 }} />
							</TouchableOpacity>
						),
						headerRight: () => (
							<TouchableOpacity onPress={() => this.props.navigation.navigate('Profile')}>
								<Avatar
									rounded
									size={35}
									source={{
										uri: user.profileImage || dummyImageUrl
									}}
									containerStyle={{ marginRight: 10 }}
								/>
							</TouchableOpacity>
						)
					}}
				/>
			</Stack.Navigator>
		);
	}
}

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { logout } from '../redux/actions/auth';
import { fonts } from '../theme';

const mapStateToProps = (state) => ({
	user: state.auth.user,
	profileDetail: state.profile.editProfDetails
});

const mapDispatchToProps = (dispatch) => ({
	logout: bindActionCreators(logout, dispatch)
});

export const HomeNavigator = connect(mapStateToProps, mapDispatchToProps)(HomeNavigatorComponent);

class ClassNavigator extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<Stack.Navigator
				screenOptions={{
					headerStyle: {
						borderBottomEndRadius: 20,
						borderBottomStartRadius: 20
					},
					headerTitleAlign: 'center',
					headerTitleStyle: { fontFamily: fonts.semibold }
				}}
				initialRouteName={'Classes'}
			>
				<Stack.Screen
					name="Classes"
					component={screens.Classes}
					options={{
						headerTitle: strings.classes,
						headerLeft: () => (
							<TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
								<Icons.Entypo name="menu" color="black" size={30} style={{ marginLeft: 10 }} />
							</TouchableOpacity>
						),
						headerRight: () => (
							<TouchableOpacity>
								<Icons.Entypo name="plus" color="black" size={30} style={{ marginRight: 10 }} />
							</TouchableOpacity>
						)
					}}
				/>
			</Stack.Navigator>
		);
	}
}

class ForumNavigator extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<Stack.Navigator
				screenOptions={{
					headerStyle: {
						borderBottomEndRadius: 20,
						borderBottomStartRadius: 20
					},
					headerTitleAlign: 'center',
					headerTitleStyle: { fontFamily: fonts.semibold }
				}}
				initialRouteName={'Forums'}
			>
				<Stack.Screen
					name="Forums"
					component={screens.Forum}
					options={{
						headerShown: true,
						headerTitle: strings.forums,
						headerLeft: () => (
							<TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
								<Icons.Entypo name="menu" color="black" size={30} style={{ marginLeft: 10 }} />
							</TouchableOpacity>
						)
					}}
				/>
			</Stack.Navigator>
		);
	}
}

class NotificationNavigator extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<Stack.Navigator
				screenOptions={{
					headerStyle: {
						borderBottomEndRadius: 20,
						borderBottomStartRadius: 20
					},
					headerTitleAlign: 'center',
					headerTitleStyle: { fontFamily: fonts.semibold }
				}}
				initialRouteName={'Notifications'}
			>
				<Stack.Screen
					name="Notifications"
					component={screens.Notifications}
					options={{
						headerShown: true,
						headerTitle: strings.notifications,
						headerLeft: () => (
							<TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
								<Icons.Entypo name="menu" color="black" size={30} style={{ marginLeft: 10 }} />
							</TouchableOpacity>
						)
					}}
				/>
			</Stack.Navigator>
		);
	}
}

class BottomTab extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<Tabs.Navigator
				// default configuration from React Navigation
				tabBarOptions={{
					activeTintColor: 'white',
					inactiveTintColor: '#467DFF',
					activeBackgroundColor: '#467DFF',
					labelStyle: {
						fontWeight: 'bold'
					}
				}}
				appearence={{ topPadding: 12 }}
				initialRouteName="Home"
			>
				<Tabs.Screen
					name="Notifications"
					component={NotificationNavigator}
					options={{
						tabBarIcon: ({ focused, color, size }) => (
							<Icons.MaterialIcons
								name="notifications"
								size={size ? size : 24}
								color={focused ? color : '#222222'}
								focused={focused}
								color={color}
							/>
						)
					}}
				/>

				<Tabs.Screen
					name="Home"
					component={HomeNavigator}
					options={{
						tabBarIcon: ({ focused, color, size }) => (
							<Icons.SimpleLineIcons
								name="home"
								size={size ? size : 24}
								color={focused ? color : '#222222'}
								focused={focused}
								color={color}
							/>
						)
					}}
				/>

				<Tabs.Screen
					name="Classes"
					component={ClassNavigator}
					onPress={() => this.props.navigation.navigate('Classes')}
					options={{
						tabBarIcon: ({ focused, color, size }) => (
							<Icons.FontAwesome5
								name="school"
								size={size ? size : 24}
								color={focused ? color : '#222222'}
								focused={focused}
								color={color}
							/>
						)
					}}
				/>

				<Tabs.Screen
					name="Forum"
					component={ForumNavigator}
					onPress={() => this.props.navigation.navigate('Forum')}
					options={{
						tabBarIcon: ({ focused, color, size }) => (
							<Icons.FontAwesome5
								name="question"
								size={size ? size : 24}
								color={focused ? color : '#222222'}
								focused={focused}
								color={color}
							/>
						)
					}}
				/>
			</Tabs.Navigator>
		);
	}
}
