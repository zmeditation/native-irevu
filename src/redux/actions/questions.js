import { auth, classes, homework } from '../types';
import * as utils from './utils';
import { Post, Get } from '../../utils/api-call';
import * as WeChat from 'react-native-wechat-lib';
import { wechat_appID } from '../../config/weChatConfig';
WeChat.registerApp(wechat_appID, 'universalLink');

export const createClassHomework = (instance, form, clas) => async (dispatch, getState) => {
	dispatch(utils.loading(instance, true));
	const user = getState().auth.user;

	let question = {
		user_id: user._id,
		title: form.title,
		class_id: clas._id,
		description: form.editorvalue,
		date: form.date,
		deadline: form.deadline,
		overtime: form.overtime
	};

	// return;
	Post(`/homework/add`, question, user.token)
		.then((res) => {
			if (res.status === 200) {
				console.log('CREATE CLASS HOMEWORK RESPONSE', res);
				dispatch(utils.loading(instance, false));

				// dispatch({
				//   type: classes.ADD_CLASS,
				//   payload: { ...res.data.data, author_name: "Self" },
				// });

				// dispatch(getUserClasses())
				if (instance) {
					instance.props.navigation.goBack();
					//   instance.setState({
					//     loading: false,
					//   });
				}
			}
		})
		.catch((err) => {
			console.log('CREATE CLASS HOMEWORK RESPONSE ERROR', err.response.data);
			alert(err.response.data.message);
			dispatch(utils.loading(instance, false));
		});
};

export const postQuestion = (instance, information, pricing, question) => async (dispatch, getState) => {
	const user = getState().auth.user;
	WeChat.isWXAppInstalled().then((isInstalled) => {
		if (isInstalled) {
			let payload = {
				partnerId: '1568603351',
				prepayId: 'wx8b25c6e83f785918',
				nonceStr: '',
				timeStamp: new Date().getTime(),
				package: '',
				sign: ''
			};

			Post(`/users/payment`, { user_id: user._id }, user.token)
				.then((res) => {
					console.log('RESPONSE PAYMENT', res);
				})
				.catch((err) => {
					console.log('RESPONSE PAYMENT ERROR REPSONSE', err.response);
				});

			// WeChat.pay(payload)
			//   .then((payload) => {
			//     console.log("I RECIEVED A PAYLOAD", payload);
			//   })
			//   .catch((err) => {
			//     console.log("I RECIEVED ERROR", err);
			//   });
		} else {
			alert('We are unable to find wechat in your phone.');
		}
	});
};

export const currentHomework = (instance, clas) => async (dispatch, getState) => {
	const user = getState().auth.user;
	dispatch(utils.loading(instance, true));
	dispatch({
		type: homework.HOMEWORK_LOADING,
		payload: true
	});

	Post(`/homework/current_homework`, { user_id: user._id, class_id: clas._id }, user.token)
		.then((res) => {
			console.log(`.then - res`, res);
			if (res.status === 200) {
				console.log('GET CLASS HOMEWORK RESPONSE', res);
				dispatch(utils.loading(instance, false));

				dispatch({
					type: classes.CURRENT_HOMEWORK,
					payload: res.data.homework
				});

				dispatch({
					type: homework.HOMEWORK_LOADING,
					payload: false
				});

				// dispatch(getUserClasses())
				// if (instance) {
				//   instance.props.navigation.goBack();
				//   //   instance.setState({
				//   //     loading: false,
				//   //   });
				// }
			} else {
				dispatch({
					type: homework.HOMEWORK_LOADING,
					payload: false
				});
			}
		})
		.catch((err) => {
			console.log('GET CLASS HOMEWORK RESPONSE ERROR', err.response.data);
			dispatch(utils.loading(instance, false));
			dispatch({
				type: classes.CURRENT_HOMEWORK,
				payload: []
			});
			dispatch({
				type: homework.HOMEWORK_LOADING,
				payload: false
			});
		});
};

export const postSubmission = (instance, homework, clas, submission) => async (dispatch, getState) => {
	dispatch(utils.loading(instance, true));
	const user = getState().auth.user;

	// user_id: Joi.string().required(),
	//   submission: Joi.string(),
	//   class_id: Joi.string().required(),
	//   homework_id: Joi.string().required(),

	let _submission = {
		user_id: user._id,
		class_id: clas._id,
		submission: submission,
		homework_id: homework._id
	};

	console.log('POST SUBMISSION IS READY', _submission);

	Post(`homework/post_submission`, _submission, user.token)
		.then((res) => {
			if (res.status === 200) {
				console.log('POST SUBMISSION IS READY RESPONSE', res);
				// dispatch(utils.loading(instance, false));

				dispatch(utils.loading(instance, false));
				// dispatch(getUserClasses())
				if (instance) {
					dispatch(currentHomework(false, clas));
					instance.props.navigation.goBack();
					//   //   instance.setState({
					//   //     loading: false,
					//   //   });
				}
			}
		})
		.catch((err) => {
			console.log('POST SUBMISSION IS READY RESPONSE ERROR', err.response.data);
			dispatch(utils.loading(instance, false));
			// dispatch(utils.loading(instance, false));
			// dispatch({
			//   type: classes.CURRENT_HOMEWORK,
			//   payload: [],
			// });
			// dispatch({
			//   type: homework.HOMEWORK_LOADING,
			//   payload: false,
			// });
		});
};
