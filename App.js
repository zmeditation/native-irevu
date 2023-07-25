import React from 'react';
import { StyleSheet, StatusBar, LogBox } from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';
import Navigation from './src/navigation';
import { PersistGate } from 'redux-persist/integration/react';
import JPush from 'jpush-react-native';
import { Provider } from 'react-redux';
import { store, persistor } from './src/redux/store';
import socketIO from 'socket.io-client';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
		this.forceUpdate();

		// Init JPush
		JPush.init();
		JPush.setLoggerEnable(true);
		JPush.getRegistrationID((results) => {
			console.log('====================================');
			console.log(JSON.stringify(results));
			console.log('====================================');
		});
		const isEnble = JPush.isNotificationEnabled((enabled) => {
			console.log('Notification Enabled ==>', enabled);
		});

		// Connection Status
		this.connectListener = (result) => {
			console.log('connectListener ==> ' + JSON.stringify(result));
		};
		JPush.addConnectEventListener(this.connectListener);
		// Notification Callback
		this.notificationListener = (result) => {
			console.log('Receive notification // notificationListener ==>' + JSON.stringify(result));
		};
		// Local Notification
		JPush.addLocalNotificationListener((res) => {
			console.log('Local Notification', res);
		});
		JPush.addNotificationListener(this.notificationListener);

		const socket = socketIO('http://167.172.64.190:8002', {      
			transports: ['websocket'], jsonp: false });   
			socket.connect(); 
			socket.on('connect', () => { 
			  console.log('connected to socket server'); 
			}); 

		// let data = {question_id: value.id}
		// socket.emit('sender', data)

		// socket.on('recevier', (data) => {
		// 	dispatch(forumFeedbackList({"question_id" : data.question_id})).then( (res) => {
		// 	  console.log("recevier by ===>>> ",data, res);
		// 	});
		// });
	}

	render() {
		return (
			<Provider store={store}>
				<PersistGate persistor={persistor}>
					<MenuProvider>
						<StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
						<Navigation />
					</MenuProvider>
				</PersistGate>
			</Provider>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center'
	}
});
