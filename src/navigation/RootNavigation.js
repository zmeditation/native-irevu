
import * as React from 'react';
import { DrawerActions } from '@react-navigation/native';

export const navigationRef = React.createRef();
export const drawerRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

export function openDrawer() {
  console.log(drawerRef.current);
  drawerRef.current?.dispatch(DrawerActions.openDrawer());
}

export function goBack() {
  navigationRef.current?.goBack();
}