import React from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import { color, fonts } from '../../theme';
import { strings, changeLaguage } from '../../translations/service';

const Loader = ({ isLoading, textContent, textStyleColor, overlayColor, spinnerColor }) => {
	return (
		<Spinner
			visible={isLoading}
			textContent={textContent || strings.please_wait_loader}
			textStyle={{
				color: textStyleColor || color.primary,
				fontSize: 14,
				fontFamily: fonts.regular,
				letterSpacing: 1
			}}
			overlayColor={'#f4faff00'}
			size="small"
			color={spinnerColor || color.primary}
			animation="fade"
			cancelable={false}
		/>
	);
};

export default Loader;
