import { CommonActions } from '@react-navigation/native';
import { auth, order } from '../types';
import { backend, wechat_appID, wechat_sns_url, app_id, secret_key } from '../../config/weChatConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UNIVERSITY_LIST_SUCCESS, COURSE_LIST_SUCCESS, GET_ERROR } from '../constants/auth.constants';
import { GET_PROFILE_SUCCESS, EDIT_PROFILE_SUCCESS } from '../constants/profile.constants';
import { strings, changeLaguage } from '../../translations/service';

//Wechat imports
import * as WeChat from 'react-native-wechat-lib';
import queryString from 'querystring';
import CryptoJS from 'react-native-crypto-js';
const parseString = require('react-native-xml2js').parseString;

WeChat.registerApp(wechat_appID, 'https://www.irevu.org/')
	.then((registerApp) => {
		console.log('registerApp', registerApp);
	})
	.catch((error) => {
		console.log('error:', error);
	});

//Wechat imports

import { Alert } from 'react-native';
import { Post } from '../../utils/api-call';
import axiosApi, { setAuthHeader } from '../../config/api';
import axios from 'axios';
import JPush from 'jpush-react-native';

export const loading = (instance, isLoading) => async (dispatch, getState) => {
	if (instance) {
		instance.setState({ loading: isLoading });
	}
};

export const getUserNotifications = (instance, offset) => async (dispatch, getState) => {
	// dispatch(loading(instance, true));
	if (instance) {
		instance.setState({ more: true });
	}
	const user = getState().auth.user;
	Post(`/users/notifications`, { user_id: user._id }, user.token)
		.then((res) => {
			if (res.status === 200) {
				if (instance) {
					instance.setState({
						notifications: instance.state.notifications
							? [ ...instance.state.notifications, ...res.data.notifications ]
							: res.data.notifications
					});
				}
				if (instance) {
					instance.setState({
						more: false,
						loading: false
					});
				}
				// dispatch(loading(instance, false));
			}
		})
		.catch((err) => {
			console.log('ERROR FETCHING NOTIFICATIONS', err.response);
			if (instance) {
				instance.setState({
					more: false,
					loading: false,
					notifications: []
				});
			}
			// dispatch(loading(instance, false));
		});
};

export const logout = (alias, instance) => async (dispatch, getState) => {
	Alert.alert(
		strings.you_really_want_to_log_out,
		strings.you_will_be_redirected_to_login_page,
		[
			{
				text: strings.cancel,
				onPress: () => console.log('Cancel Pressed'),
				style: 'cancel'
			},
			{
				text: strings.ok_capital,
				onPress: async () => {
					await dispatch({
						type: GET_PROFILE_SUCCESS,
						payload: {}
					});

					await dispatch({
						type: EDIT_PROFILE_SUCCESS,
						payload: {}
					});

					await dispatch({
						type: auth.AUTHENTICATED,
						payload: false
					});

					if (instance) {
						AsyncStorage.clear().then(() => {
							JPush.deleteAlias({ sequence: 6, alias: alias });
							instance.props.navigation.dispatch(
								CommonActions.reset({
									index: 0,
									routes: [ { name: 'Login' } ]
								})
							);
						});
					}
				}
			}
		],
		{ cancelable: false }
	);
};

export const authTokenExpired = () => async (dispatch) => {
	dispatch({
		type: auth.AUTHENTICATED,
		payload: false
	});
	CommonActions.reset({
		index: 0,
		routes: [ { name: 'Welcome' } ]
	});
};

export const updateUser = (instance, form, isHome) => async (dispatch, getState) => {
	const user = getState().auth.user;
	dispatch(loading(instance, true));
	axiosApi
		.post(`/users/complete`, {
			...form,
			user_id: user._id,
			completed: true
		})
		.then((response) => {
			if (response.status === 200 && response.data.success) {
				dispatch({
					type: auth.AUTHENTICATED,
					payload: response.data
				});

				setTimeout(() => {
					if (form.type === 'guest') {
						instance.props.navigation.navigate('CompleteProfile');
					}
				}, 4000);

				if (!isHome) {
					console.log('eeeeeeeee-----');
					instance.props.navigation.dispatch(
						CommonActions.reset({
							index: 0,
							routes: [ { name: 'Home' } ]
						})
					);
				}
			} else {
				console.log('ERROR SIGNUP');
			}

			dispatch(loading(instance, false));
			dispatch(getFavourites());
		})
		.catch((error) => {
			console.log('ERROR SIGNUP', error.response.data.error);
			if (instance.dropDownAlertRef) {
				instance.dropDownAlertRef.alertWithType(
					'error',
					'User Already Exist.',
					'Email Already Exist, Please Use OTP to signin if you forgot your password.'
				);
			}
			dispatch(loading(instance, false));
		});
};

export const signup = (instance, form, isHome) => async (dispatch, getState) => {
	const signUpFormInfo = {};

	signUpFormInfo.user_type = form.type == 'teacher' ? 1 : 2;
	signUpFormInfo.user_at = form.education;
	signUpFormInfo.full_name = form.full_name;
	signUpFormInfo.username = form.username;
	signUpFormInfo.email = form.email;
	signUpFormInfo.password = form.password;

	signUpFormInfo.institute_id = form.university || '';
	signUpFormInfo.course_id = form.course || '';
	signUpFormInfo.student_number = form.std_id || '';
	signUpFormInfo.referralCode = form.refferral_code || '';
	signUpFormInfo.openid = form.openid || '';
	signUpFormInfo.profile_image = form.profile_image || '';

	// if (form.education === "university") {
	//   signUpFormInfo.institute_id = form.university;
	//   signUpFormInfo.course_id = form.course;
	//   signUpFormInfo.student_number = form.std_id;
	// }

	dispatch(loading(instance, true));
	axiosApi
		.post(`/registration`, signUpFormInfo)
		.then(async (res) => {
			console.log(`.then - res`, res);
			if (res.status === 200) {
				const token = res.data && res.data.token;
				setAuthHeader(token);
				await AsyncStorage.setItem('token', JSON.stringify(token));

				// const { first_name, email, username, profile_image } = res.data.output;
				// const profileDetail = { fullName: first_name || '', email: email || '', userName: username || '', profileImage: profile_image || '' }

				await dispatch({
					type: auth.AUTHENTICATED,
					payload: { ...res.data.output, token: res.data.token }
				});

				// await dispatch({
				//   type: GET_PROFILE_SUCCESS,
				//   payload: profileDetail,
				// });

				setTimeout(() => {
					if (form.type === 'guest') {
						instance.props.navigation.navigate('CompleteProfile');
					}
				}, 4000);

				if (!isHome) {
					instance.props.navigation.dispatch(
						CommonActions.reset({
							index: 0,
							routes: [ { name: 'Home' } ]
						})
					);
				}
			} else {
				if (instance.dropDownAlertRef) {
					instance.dropDownAlertRef.alertWithType('error', 'Error', res.data.error);
				}
				console.log('ERROR SIGNUP else', res);
			}

			dispatch(loading(instance, false));
			dispatch(getFavourites());
		})
		.catch((error) => {
			console.log('ERROR SIGNUP', error.response.data.error);
			if (instance.dropDownAlertRef) {
				instance.dropDownAlertRef.alertWithType('error', 'Error', error.response.data.error);
			}
			dispatch(loading(instance, false));
		});
};

export const login = (instance, form) => async (dispatch, getState) => {
	const loginInfo = {
		username: form.email,
		password: form.password
	};

	dispatch(loading(instance, true));
	axiosApi
		.post(`/login`, loginInfo)
		.then(async (res) => {
			if (res.status === 200 && res.data.status === 200) {
				const token = res.data && res.data.token;
				setAuthHeader(token);
				console.log(res);
				await AsyncStorage.setItem('token', JSON.stringify(token));
				await dispatch({
					type: auth.AUTHENTICATED,
					payload: { ...res.data.output, token: res.data.token }
				});

				if (instance) {
					instance.props.navigation.dispatch(
						CommonActions.reset({
							index: 0,
							routes: [ { name: 'Home' } ]
						})
					);
				}
			} else {
				if (instance.dropDownAlertRef) {
					instance.dropDownAlertRef.alertWithType(
						'error',
						'Incorrect Information.',
						'Invalid Username/Email or Password combination.'
					);
				}
				console.log('LOGIN ERROR', res.data.error);
				dispatch(loading(instance, false));
			}
		})
		.catch((error) => {
			console.log('error---->>', error.response);

			if (instance.dropDownAlertRef) {
				instance.dropDownAlertRef.alertWithType('error', 'Incorrect Information.', error.response.data.error);
			}
			dispatch(loading(instance, false));
		});
};

export const forgotPassword = (instance, form) => async (dispatch, getState) => {
	const forgotInfo = {
		email: form.email
	};
	await dispatch(loading(instance, true));
	await axiosApi
		.post(`/forgotPassword?email=${forgotInfo.email}`)
		.then(async (res) => {
			if (res.status === 200 && res.data.status === 200) {
				await dispatch(loading(instance, false));
				instance.dropDownAlertRef.alertWithType('success', 'Success', 'New Password sent to your e-mail id');
			} else if (res.status === 400 && res.data.status === 400) {
				await dispatch(loading(instance, false));
				instance.dropDownAlertRef.alertWithType('error', 'Error', res.data.error);
			}
		})
		.catch(async (error) => {
			await dispatch(loading(instance, false));
			if (instance.dropDownAlertRef) {
				instance.dropDownAlertRef.alertWithType('error', 'Error', error.response.data.error);
			}
		});
};

/**
     * 获取随机的NonceStr
     */
function createNonceStr() {
	return Math.random().toString(36).substr(3, 32);
}

/**
     * 获取微信统一下单参数
     */
function getUnifiedorderXmlParams(obj) {
	let body =
		'<xml> ' +
		'<appid>' +
		obj.appid +
		'</appid> ' +
		'<attach>' +
		obj.attach +
		'</attach> ' +
		'<body>' +
		obj.body +
		'</body> ' +
		'<mch_id>' +
		obj.mch_id +
		'</mch_id> ' +
		'<nonce_str>' +
		obj.nonce_str +
		'</nonce_str> ' +
		'<notify_url>' +
		obj.notify_url +
		'</notify_url>' +
		'<out_trade_no>' +
		obj.out_trade_no +
		'</out_trade_no>' +
		'<spbill_create_ip>' +
		obj.spbill_create_ip +
		'</spbill_create_ip> ' +
		'<total_fee>' +
		obj.total_fee +
		'</total_fee> ' +
		'<trade_type>' +
		obj.trade_type +
		'</trade_type> ' +
		'<sign>' +
		obj.sign +
		'</sign> ' +
		'</xml>';
	return body;
}

const wxpaykey = 'b243f30c607dc5a635efad699c838f49';
/**
     * 获取微信支付的签名
     * @param payParams
     */

function getSign(signParams) {
	// 按 key 值的ascll 排序
	let keys = Object.keys(signParams);
	keys = keys.sort();
	let newArgs = {};
	keys.forEach(function(val, key) {
		if (signParams[val]) {
			newArgs[val] = signParams[val];
		}
	});
	let string = queryString.stringify(newArgs) + '&key=' + secret_key;
	return CryptoJS.MD5(string).toString().toUpperCase();
}

function getSign_for_pay(signParams) {
	// 按 key 值的ascll 排序
	let keys = Object.keys(signParams);
	keys = keys.sort();
	let newArgs = {};
	keys.forEach(function(val, key) {
		if (signParams[val]) {
			newArgs[val] = signParams[val];
		}
	});
	let string =
		'appid=wx8b25c6e83f785918' +
		'&noncestr=' +
		String(signParams.nonce_str) +
		'&package=Sign=WXPay' +
		'&partnerid=1568603351' +
		'&prepayid=' +
		signParams.prepayId +
		'&timestamp=' +
		signParams.timeStamp +
		'&key=' +
		secret_key;
	return CryptoJS.MD5(string).toString().toUpperCase();
}

function start_pay(payParams) {
	let sign_for_pay = getSign_for_pay(payParams);
	console.log(payParams, 'payParamspayParams RESPONE +++');
	WeChat.pay({
		partnerId: payParams.partnerId, //商家向财付通申请的商家ID
		prepayId: payParams.prepayId, //预付款订单ID
		nonceStr: payParams.nonce_str, //随机串
		timeStamp: payParams.timeStamp, //可持续
		package: 'Sign=WXPay', //商家根据财付通文档填写的数据和签名
		sign: sign_for_pay //商家根据微信开放平台文档对数据做的签名
	})
		.then((rs) => {
			console.log('Pay success', rs);
			//支付成功
		})
		.catch((e) => {
			console.log('Pay fail', e);
			//支付失败
		});
}

export const start_wechat_pay = ({ totalPayment }) => () => {
	// 生成统一下单接口参数
	let UnifiedorderParams = {
		appid: 'wx8b25c6e83f785918',
		attach: 'position',
		body: 'function',
		mch_id: '1568603351',
		nonce_str: createNonceStr(),
		notify_url: 'weixin.qq.com', // 微信付款后的回调地址
		out_trade_no: parseInt(new Date().getTime() / 1000).toString(),
		spbill_create_ip: '14.23.150.211',
		// total_fee: Number(totalPayment),
		trade_type: 'APP'
		//sign : "",
	};
	// 返回 promise 对象
	// 获取 sign 参数

	const body_xml = getUnifiedorderXmlParams(UnifiedorderParams);
	/*发起支付请求*/
	axiosApi
		.post('http://api.irevu.org/wechat_payment', { data: JSON.stringify(body_xml) })
		.then((response) => {
			if (response.data.status == 200) {
				parseString(response.data.output, function(_, result) {
					console.log(result.xml);

					let prepay_id = result.xml.prepay_id[0];
					let payParams = {
						appid: 'wx8b25c6e83f785918',
						partnerId: '1568603351',
						prepayId: prepay_id.toString(),
						nonce_str: createNonceStr(),
						timeStamp: parseInt(new Date().getTime() / 1000).toString(),
						package: 'Sign=WXPay',
						// total_fee: Number(totalPayment),
						notify_url: 'https://irevu.org',
						body: 'about'
						// time_start: 'moment()',
					};
					start_pay(payParams);
				});
			} else {
				console.log('Error !200: ', response);
			}
		})
		.catch((err) => {
			console.log('Error pay: ', err);
		});
};

export const signupViaWechat = (instance, form, isHome) => async (dispatch, getState) => {
	console.log('START SIGNUP');
	dispatch(loading(instance, true));
	const scope = 'snsapi_userinfo';
	let state = '_' + new Date();

	WeChat.isWXAppInstalled().then((isInstalled) => {
		if (isInstalled) {
			WeChat.sendAuthRequest(scope, state).then((responseCode) => {
				axiosApi
					.post(backend + `wechat-login`, { code: responseCode.code })
					.then(async (response) => {
						console.log(22222);

						if (response.status === 200) {
							// dispatch({
							//   type: auth.WECHATAUTH,
							//   payload: { ...response.data.output },
							// });

							const user = {
								full_name: response.data.output.nickname,
								openid: response.data.output.unionid,
								sex: response.data.output.sex,
								language: response.data.output.language,
								country: response.data.output.country,
								city: response.data.output.city + '',
								headimgurl: response.data.output.headimgurl
							};

							console.log('signupViaWechat userinfo', user);

							// User not register
							if (response.data.token === null) {
								if (instance.props.navigation) {
									instance.props.navigation.navigate('Signup', user);
								}
							} else {
								console.log('Login...');
								if (instance.props.navigation) {
									instance.props.navigation.replace('Home');
								}
								const token = res.data && res.data.token;
								setAuthHeader(token);
								await AsyncStorage.setItem('token', token, function(errs) {
									if (errs) {
										console.log(err, 222222);
										return;
									}
									alert('数据保存成功!');
								});

								dispatch({
									type: auth.AUTHENTICATED,
									payload: { ...response.data.output, token: response.data.token }
								});
							}
						} else {
							console.log('signupViaWechat ERROR');

							if (instance.dropDownAlertRef) {
								instance.dropDownAlertRef.alertWithType(
									'error',
									'Something Went Wrong.',
									resp.data.errmsg
								);
							}
							dispatch(loading(instance, false));
						}
					})
					.catch((error) => {
						console.log('signupViaWechat ERROR', error.response.data.error);
						if (instance.dropDownAlertRef) {
							instance.dropDownAlertRef.alertWithType(
								'error',
								'Something Went Wrong.',
								error.response.data.error
							);
						}
						dispatch(loading(instance, false));
					});
			});
		} else {
			alert('Wechat Login is not available, Please install WeChat App.');
		}
	});
};

export const getErrors = (payload) => (dispatch) => {
	dispatch({
		type: GET_ERROR,
		payload: payload
	});
};

const getUniversityListSuccess = (payload) => (dispatch) => {
	dispatch({
		type: UNIVERSITY_LIST_SUCCESS,
		payload: payload
	});
};

export const getUniversityList = () => (dispatch) => {
	axiosApi
		.get(`/university/list`)
		.then(async (getUniversityRes) => {
			if (getUniversityRes.status === 200) {
				await dispatch(getUniversityListSuccess(getUniversityRes.data.output));
			} else {
				console.log(getUniversityRes.data.error);
				dispatch(getErrors(getUniversityRes.data.error));
			}
		})
		.catch((error) => {
			console.log(error.response.data.error);
			dispatch(getErrors(error.response.data.error));
		});
};

const getCourseListSuccess = (payload) => (dispatch) => {
	dispatch({
		type: COURSE_LIST_SUCCESS,
		payload: payload
	});
};

export const getCourceList = () => (dispatch) => {
	axiosApi
		.get(`/course/list`)
		.then(async (getCourceRes) => {
			if (getCourceRes.status === 200) {
				await dispatch(getCourseListSuccess(getCourceRes.data.output));
			} else {
				console.log(getCourceRes.data.error);
				dispatch(getErrors(getCourceRes.data.error));
			}
		})
		.catch((error) => {
			console.log(error.response.data.error);
			dispatch(getErrors(error.response.data.error));
		});
};
