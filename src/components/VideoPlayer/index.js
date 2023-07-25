import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Video from 'react-native-video';
import MediaControls, { PLAYER_STATES } from 'react-native-media-controls';

const VideoPlayer = (props) => {
	const videoPlayer = useRef(null);
	const [ currentTime, setCurrentTime ] = useState(0);
	const [ duration, setDuration ] = useState(0);
	const [ isFullScreen, setIsFullScreen ] = useState(true);
	const [ paused, setPaused ] = useState(true);
	const [ isLoading, setIsLoading ] = useState(true);
	const [ playerState, setPlayerState ] = useState(PLAYER_STATES.PAUSED);

	const [ screenType, setScreenType ] = useState(Platform.OS === 'android' ? 'contain' : 'content');

	const onSeek = (seek) => {
		//Handler for change in seekbar
		videoPlayer.current.seek(seek);
	};

	const onPaused = (playerState) => {
		//Handler for Video Pause
		setPaused(!paused);

		setPlayerState(playerState);
	};

	const onReplay = () => {
		//Handler for Replay

		console.log('call on replay', playerState);

		videoPlayer.current.seek(0);
		setPlayerState(PLAYER_STATES.PLAYING);

		console.log('after call on replay', playerState);
	};

	const onProgress = (data) => {
		// Video Player will progress continue even if it ends
		if (!isLoading && playerState !== PLAYER_STATES.ENDED) {
			setCurrentTime(data.currentTime);
		}
	};

	const onLoad = (data) => {
		setDuration(data.duration);
		setIsLoading(false);
	};

	const onLoadStart = (data) => {
		console.log('on load start');
	};

	const onEnd = () => setPlayerState(PLAYER_STATES.ENDED);

	const onError = (error) => {
		console.log('----->>>Oh! ', error);
	};

	const exitFullScreen = () => {
		console.log('Exit full screen');
	};

	const enterFullScreen = () => {};

	const onFullScreen = () => {
		setIsFullScreen(isFullScreen);
		if (Platform.OS === 'android') {
			if (screenType === 'contain') {
				setScreenType('cover');
			} else {
				setScreenType('contain');
			}
		} else if (screenType === 'content') {
			setScreenType('cover');
		} else {
			setScreenType('content');
		}
	};

	const renderToolbar = () => (
		<View>
			<Text style={styles.toolbar}> toolbar </Text>
		</View>
	);

	const onSeeking = (currentTime) => {
		console.log('current time', currentTime);
		setCurrentTime(currentTime);
	};

	return (
		<View style={styles.container}>
			<Video
				onEnd={onEnd}
				onLoad={onLoad}
				onLoadStart={onLoadStart}
				onProgress={onProgress}
				paused={paused}
				ref={videoPlayer}
				resizeMode={screenType}
				onFullScreen={isFullScreen}
				source={{
					uri: props.route.params.videoUrl
				}}
				style={styles.mediaPlayer}
				bufferConfig={{
					minBufferMs: 15000,
					maxBufferMs: 50000,
					bufferForPlaybackMs: 2500,
					bufferForPlaybackAfterRebufferMs: 5000
				}}
				volume={10}
				audioOnly
			/>
			<MediaControls
				duration={duration}
				isLoading={isLoading}
				mainColor="#333"
				onFullScreen={onFullScreen}
				onPaused={onPaused}
				onReplay={onReplay}
				onSeek={onSeek}
				onSeeking={onSeeking}
				playerState={playerState}
				progress={currentTime}
				toolbar={renderToolbar()}
			/>
		</View>
	);
};

export default VideoPlayer;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000'
	},
	toolbar: {
		marginTop: 30,
		backgroundColor: 'white',
		padding: 10,
		borderRadius: 5
	},
	mediaPlayer: {
		height: '100%',
		width: '100%',
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		backgroundColor: '#000',
		justifyContent: 'center'
	}
});
