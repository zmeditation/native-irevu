import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { persistReducer, persistStore } from 'redux-persist';
import auth from '../redux/reducers/auth';
import classes from '../redux/reducers/class';
import homework from '../redux/reducers/homework';
import uploadResource from '../redux/reducers/uploadResources';
import downloadResource from '../redux/reducers/downloadResources';
import forum from '../redux/reducers/forum';
import resource from '../redux/reducers/resource';
import lesson from '../redux/reducers/lesson';
import profile from '../redux/reducers/profile';
import notification from '../redux/reducers/notification';
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistedConfig = {
	key: 'root',
	storage: AsyncStorage
};

const persistedReducer = persistReducer(
	persistedConfig,
	combineReducers({
		auth,
		classes,
		homework,
		uploadResource,
		downloadResource,
		forum,
		resource,
		lesson,
		profile,
		notification
	})
);

const initialState = {};
const middleware = [ thunk ];
const store = createStore(persistedReducer, initialState, compose(applyMiddleware(...middleware)));

const persistor = persistStore(store);

export { persistor, store };
