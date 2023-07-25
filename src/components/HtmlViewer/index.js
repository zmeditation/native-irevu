import React from 'react';
import { useWindowDimensions, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import HTML from 'react-native-render-html';
import { IGNORED_TAGS } from 'react-native-render-html/src/HTMLUtils';
import ImagePreview from '../../components/ImagePreview';
import { Icons } from '../../components';
import { color } from '../../theme';

const HtmlViewer = ({ htmlContent, navigation }) => {
	const contentWidth = useWindowDimensions().width;
	const computeEmbeddedMaxWidth = (availableWidth) => {
		return Math.min(availableWidth, 200);
	};

	const videoViewerHandle = (videoUrl) => {
		navigation.navigate('VideoPlayer', { videoUrl });
	};

	return (
		<ScrollView nestedScrollEnabled>
			<HTML
				// originWhitelist={[ '*' ]}
				contentWidth={contentWidth}
				source={{ html: `<div>${htmlContent.replace(/<\/?[^>]+(>|$)/g, '')}</div>` || '' }}
				computeEmbeddedMaxWidth={computeEmbeddedMaxWidth}
				containerStyle={{ color: '#000' }}
				renderers={{
					video: ({ src }) => (
						<TouchableOpacity
							style={[ styles.questionTouchIconRes, styles.videoQesRes ]}
							onPress={() => videoViewerHandle(src)}
						>
							<Icons.Entypo name="video" style={[ styles.quesResIcon, styles.videoQesIcon ]} />
						</TouchableOpacity>
					),
					img: ({ src }) => <ImagePreview imageStyle={{ height: 80, width: 80 }} imageUri={src || ''} />
				}}
				tagsStyles={{
					i: { color: '#000' },
					div: { color: '#000' }
				}}
				ignoredTags={IGNORED_TAGS.filter((tag) => tag !== 'video')}
			/>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	questionTouchIconRes: {
		borderWidth: 1,
		borderColor: color.darkSky,
		paddingVertical: '4%',
		paddingHorizontal: '4%',
		borderRadius: 5,
		marginRight: '3%',
		width: '20%',
		justifyContent: 'center',

		alignItems: 'center'
	},
	videoQesRes: {
		paddingVertical: '4%',
		paddingHorizontal: '3%'
	},
	videoQesIcon: {
		fontSize: 24
	}
});

export default HtmlViewer;
