import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { ActivityIndicator, View, Image } from 'react-native';
import { useDispatch } from 'react-redux';
import axiosApi from '../config/api';
import { getOtherPerformanceDetail } from '../redux/actions/profile';
import { changeLaguage } from '../translations/service';

const splash = ({ navigation }) => {
  const dispatch = useDispatch();
  useEffect(
    async () => {
      AsyncStorage.getItem('LocalizedStrings').then(changeLaguage);
      dispatch(getOtherPerformanceDetail('1'));
      dispatch(getOtherPerformanceDetail('2'));
      axiosApi
        .get('http://api.irevu.org/tokanCheck', {
          Headers: { Authorization: JSON.parse(await AsyncStorage.getItem('token')) }
        })
        .then((e) => {
          if (e.data.output == true) {
            navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
          } else {
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
          }
        })
        .catch((e) => {
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        });
    },
    [navigation]
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
      <Image source={require('../../assets/logos/simple-logo.png')} style={{ height: 150, width: 150, resizeMode: 'contain', marginBottom: 10 }} />
      <ActivityIndicator size={30} color="#07f" />
    </View>
  );
};

export default splash;
