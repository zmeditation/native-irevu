import axios from 'axios';
import { backend } from '../config/weChatConfig';

const API_URL = backend;

function processRequest(request) {
	return request
		.then((json) => {
			if (json.ok == true) {
			} else {
				return json;
			}
		})
		.catch((error) => {
			throw error;
		});
}

export function Get(path, token) {
	const API_REQ_URL = API_URL + path;
	console.log('PATH', API_REQ_URL);
	const request = axios.get(API_REQ_URL, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: token
		}
	});
	return processRequest(request);
}

export function Post(path, obj, token) {
	const API_REQ_URL = API_URL + path;
	console.log('/=============================/');
	console.log({ path, obj, token });
	const request = axios.post(API_REQ_URL, obj, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: token
		}
	});
	return processRequest(request);
}
