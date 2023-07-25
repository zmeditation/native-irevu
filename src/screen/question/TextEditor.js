import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet, ScrollView, TouchableOpacity, Pressable, Modal } from 'react-native';
import { Container, Content, Text, View } from 'native-base';
import { actions, RichEditor, RichToolbar } from 'react-native-pell-rich-editor';
import { Card } from 'react-native-paper';
import { Icons } from '../../components';
import { fonts, color } from '../../theme';
import { Button } from 'react-native-material-ui';
import { Dimensions } from 'react-native';
import { parse } from 'node-html-parser';
import { FileUploadPicker } from '../../components/FileUploadPicker';
import { uploadResources } from '../../redux/actions/uploadResources';
import { strings } from '../../translations/service';

const height = Dimensions.get('screen').height - 250;

const TextEditor = (props) => {
	// console.log('Receive text', props.route.params.editorvalue);
	// console.log('handle chnage function', props.route.params.handleTextEditorSaveChange);
	// console.log('handler function', props.route.params.onSaveHandler);

	const dispatch = useDispatch();
	const [ foreColor, setforeColor ] = useState('#000');
	const [ fontColorSelector, setfontColorSelector ] = useState(false);
	const strikethrough = ''; //icon for strikethrough
	const video = ''; //icon for Addvideo
	// const saveChangesView = (
	//     <TouchableOpacity style={{ backgroundColor: 'pink' }}>
	//         <Text>saveChanges</Text>
	//     </TouchableOpacity>
	// );
	const RichText = useRef(); //reference to the RichEditor component
	const RichToolbarRef = useRef(); //reference to the RichToolbar component
	const [ article, setArticle ] = useState(props.route.params.editorvalue || '');
	const [ textCount, setTextCount ] = useState(0);
	const { loaderHandler, instance } = props.route.params;

	const videoUploadDetail = useSelector((state) => {
		return state.uploadResource.videoUploadDetail;
	});
	const imageUploadDetail = useSelector((state) => {
		return state.uploadResource.imageUploadDetail;
	});
	const uploadResourcesErr = useSelector((state) => {
		return state.uploadResource.uploadResourcesErr;
	});

	const countWords = (str) => {
		str = str.replace(/(^\s*)|(\s*$)/gi, '');
		str = str.replace(/[ ]{2,}/gi, ' ');
		str = str.replace(/\n /, '\n');
		return str.split(' ').length;
	};

	useEffect(
		() => {
			const root = parse(article);
			const wordCount = countWords(root.textContent);
			if (root.textContent === '') {
				setTextCount(0);
			} else {
				setTextCount(wordCount);
			}
		},
		[ article ]
	);

	// useEffect(
	// 	() => {
	// 		if (videoUploadDetail) {
	// 			loaderHandler(false);
	// 			RichText.current.insertVideo(videoUploadDetail.url);
	// 		}
	// 	},
	// 	[ videoUploadDetail ]
	// );

	useEffect(
		() => {
			if (imageUploadDetail) {
				loaderHandler(false);
				RichText.current.insertImage(imageUploadDetail.url);
			}
		},
		[ imageUploadDetail ]
	);

	useEffect(
		() => {
			if (uploadResourcesErr) {
				loaderHandler(false);
			}
		},
		[ uploadResourcesErr ]
	);

	const uploadResourceHandler = (type, response, initFileSize) => {
		loaderHandler(true);
		console.log('picker response', response.size);

		const fileSize = type === 'video' ? Math.round(response.size / 10240) : Math.round(response.size / 1024);
		const formData = new FormData();

		formData.append('file', {
			name: response.name,
			uri: response.uri,
			type: response.type
		});
		console.log({ fileSize });

		if (fileSize > initFileSize) {
			console.log("file is large can't upload more than 1 mb", initFileSize);
		} else {
			dispatch(uploadResources(instance, formData, type));
			console.log('upload image files');
		}
	};

	// this function will be called when the editor has been initialized
	function editorInitializedCallback() {
		RichText.current.registerToolbar(function(items) {
			// items contain all the actions that are currently active
			console.log('Toolbar click, selected items (insert end callback):', items);
		});
	}

	// Callback after height change
	function handleHeightChange(height) {
		// console.log("editor height change:", height);
	}

	const onPressAddImage = async () => {
		// you can easily add images from your gallery
		// RichText.current?.insertImage(
		//   "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/100px-React-icon.svg.png"
		// );

		const pickerResult = await FileUploadPicker('image');

		if (pickerResult.status === 200) {
			await uploadResourceHandler('image', pickerResult.response, 1024);
		} else {
			console.log('image picker error', pickerResult.response);
		}
	};

	// const insertVideo = async () => {
	// 	// you can easily add videos from your gallery
	// 	// RichText.current?.insertVideo(
	// 	//   "https://mdn.github.io/learning-area/html/multimedia-and-embedding/video-and-audio-content/rabbit320.mp4"
	// 	// );

	// 	const pickerResult = await FileUploadPicker('video');

	// 	if (pickerResult.status === 200) {
	// 		await uploadResourceHandler('video', pickerResult.response, 10240);
	// 	} else {
	// 		console.log('video picker error', pickerResult.response);
	// 	}
	// };

	function saveChanges() {
		RichText.current.saveChanges(`sdfsdf`);
	}
	function fontColor(color) {
		setforeColor(color);
		setfontColorSelector(false);
	}
	const _renderIcon = (action, selected) => {
		let iconName = '';
		switch (action) {
			case actions.setBold:
				iconName = 'bold';
				break;
			case actions.setItalic:
				iconName = 'italic';
				break;
			case actions.setUnderline:
				iconName = 'underline';
				break;
			case actions.setStrikethrough:
				iconName = 'strikethrough';
				break;
			case actions.insertBulletsList:
				iconName = 'list';
				break;
			case actions.insertImage:
				iconName = 'image';
				break;
			// case actions.insertVideo:
			// 	iconName = 'film';
			// 	break;
			case 'color':
				iconName = 'format-color-text';
				break;
		}
		if (action == 'color') {
			return <Icons.MaterialIcons name={iconName} style={{ fontSize: 16, color: foreColor }} />;
		} else {
			return (
				<Icons.FontAwesome
					name={iconName}
					style={{ fontSize: 14, color: selected ? color.primary : color.dark }}
				/>
			);
		}
	};

	const defaultRenderAction = (action, selected) => {
		return action === 'save' ? (
			<Button
				text="save"
				style={{ ...button }}
				onPress={() => {
					props.route.params.onSaveHandler(article);
					props.navigation.navigate(props.route.params.goBackNav || 'Questions', {
						richTextInputValue: article
					});
				}}
			/>
		) : (
			<TouchableOpacity
				style={[ { width: 35 }, styles.item ]}
				key={action}
				onPress={() => {
					if (action == 'color') {
						setfontColorSelector(true);
					} else {
						RichToolbarRef.current._onPress(action);
					}
				}}
			>
				{_renderIcon(action, selected)}
			</TouchableOpacity>
		);
	};

	return (
		<Container style={styles.container}>
			<TouchableOpacity
				onPress={() =>
					props.navigation.navigate(props.route.params.goBackNav || 'Questions', {
						richTextInputValue: article
					})}
				style={{ flexDirection: 'row', alignItems: 'center', marginTop: '4%', marginLeft: '4%' }}
			>
				<Icons.Entypo
					name="chevron-left"
					color="black"
					size={24}
					style={{ marginLeft: 0 }}
					color={color.blue}
				/>
				<Text
					style={{
						color: color.blue,
						fontSize: 14,
						fontFamily: fonts.regular,
						textTransform: 'uppercase',
						letterSpacing: 0.7
					}}
				>
					{strings.description_capital}
				</Text>
			</TouchableOpacity>

			<Content
				keyboardDismissMode="interactive"
				padder
				contentContainerStyle={{ flex: 1, padding: 5, paddingBottom: 30 }}
			>
				<RichEditor
					initialContentHTML={props.route.params.editorvalue || ''}
					disabled={false}
					containerStyle={styles.editor}
					ref={RichText}
					style={styles.rich}
					editorStyle={{ color: foreColor }}
					placeholder={strings.start_writing_here}
					onChange={(text) => setArticle(text)}
					editorInitializedCallback={editorInitializedCallback}
					onHeightChange={handleHeightChange}
				/>
				<Text style={styles.workCountLable}>
					{strings.wordcount} : {textCount}
				</Text>

				<RichToolbar
					editor={RichText}
					ref={RichToolbarRef}
					disabled={false}
					iconTint={color.dark}
					selectedIconTint={color.primary}
					disabledIconTint={color.gray}
					onPressAddImage={onPressAddImage}
					actions={[
						actions.setBold,
						actions.setItalic,
						actions.setUnderline,
						actions.setStrikethrough,
						actions.insertBulletsList,
						actions.insertImage,
						// actions.insertVideo,
						'color',
						'save'
					]}
					// map icons for self made actions
					iconMap={{
						[actions.setStrikethrough]: strikethrough,
						insertText: <Icons.FontAwesome name="whatsapp" style={{ fontSize: 14 }} />
					}}
					// insertVideo={insertVideo}
					renderAction={defaultRenderAction}
					style={[ styles.richBar ]}
				/>
			</Content>
			<Modal animationType="fade" transparent={true} visible={fontColorSelector}>
				<View
					style={{
						flex: 1,
						justifyContent: 'center',
						alignItems: 'center',
						backgroundColor: 'rgba(0, 0, 0, 0.5)'
					}}
				>
					<View
						style={{
							padding: 15,
							backgroundColor: '#fff',
							borderRadius: 5,
							width: '90%',
							alignSelf: 'center'
						}}
					>
						<Pressable
							onPress={() => setfontColorSelector(false)}
							style={{
								flexDirection: 'row',
								justifyContent: 'flex-end',
								alignItems: 'center'
							}}
						>
							<Icons.AntDesign name="closecircle" style={{ fontSize: 25, marginBottom: 10 }} />
						</Pressable>

						<ScrollView style={{ alignSelf: 'center' }}>
							<Pressable
								style={[ styles.color, { backgroundColor: '#C0C0C0' } ]}
								onPress={() => fontColor('#C0C0C0')}
							>
								<Text>Gris</Text>
							</Pressable>
							<Pressable
								style={[ styles.color, { backgroundColor: '#FFFFFF' } ]}
								onPress={() => fontColor('#FFFFFF')}
							>
								<Text style={{ color: 'black' }}>Blanco</Text>
							</Pressable>
							<Pressable
								style={[ styles.color, { backgroundColor: '#808080' } ]}
								onPress={() => fontColor('#808080')}
							>
								<Text style={{ color: '#fff' }}>Gris Oscuro</Text>
							</Pressable>
							<Pressable
								style={[ styles.color, { backgroundColor: '#000000' } ]}
								onPress={() => fontColor('#000000')}
							>
								<Text style={{ color: '#fff' }}>Negro</Text>
							</Pressable>
							<Pressable
								style={[ styles.color, { backgroundColor: '#FF0000' } ]}
								onPress={() => fontColor('#FF0000')}
							>
								<Text style={{ color: '#fff' }}>Rojo</Text>
							</Pressable>
							<Pressable
								style={[ styles.color, { backgroundColor: '#800000' } ]}
								onPress={() => fontColor('#800000')}
							>
								<Text style={{ color: '#fff' }}>Marron</Text>
							</Pressable>
							<Pressable
								style={[ styles.color, { backgroundColor: '#FFFF00' } ]}
								onPress={() => fontColor('#FFFF00')}
							>
								<Text style={{ color: 'black' }}>Amarillo</Text>
							</Pressable>
							<Pressable
								style={[ styles.color, { backgroundColor: '#808000' } ]}
								onPress={() => fontColor('#808000')}
							>
								<Text style={{ color: '#fff' }}>Olivo</Text>
							</Pressable>
							<Pressable
								style={[ styles.color, { backgroundColor: '#00FF00' } ]}
								onPress={() => fontColor('#00FF00')}
							>
								<Text style={{ backgroundColor: '#00FF00', color: 'black' }}>Lima</Text>
							</Pressable>
							<Pressable
								style={[ styles.color, { backgroundColor: '#008000' } ]}
								onPress={() => fontColor('#008000')}
							>
								<Text style={{ color: '#fff' }}>Verde</Text>
							</Pressable>
							<Pressable
								style={[ styles.color, { backgroundColor: '#00FFFF' } ]}
								onPress={() => fontColor('#00FFFF')}
							>
								<Text style={{ color: 'black' }}>Aqua</Text>
							</Pressable>
							<Pressable
								style={[ styles.color, { backgroundColor: '#008080' } ]}
								onPress={() => fontColor('#008080')}
							>
								<Text style={{ color: '#fff' }}>Verde Azulado</Text>
							</Pressable>
							<Pressable
								style={[ styles.color, { backgroundColor: '#0000FF' } ]}
								onPress={() => fontColor('#0000FF')}
							>
								<Text style={{ color: '#fff' }}>Azul</Text>
							</Pressable>
							<Pressable
								style={[ styles.color, { backgroundColor: '#000080' } ]}
								onPress={() => fontColor('#000080')}
							>
								<Text style={{ color: '#fff' }}>Azul Marino</Text>
							</Pressable>
							<Pressable
								style={[ styles.color, { backgroundColor: '#FF00FF' } ]}
								onPress={() => fontColor('#FF00FF')}
							>
								<Text style={{ color: '#fff' }}>Rosa</Text>
							</Pressable>
							<Pressable
								style={[ styles.color, { backgroundColor: '#800080' } ]}
								onPress={() => fontColor('#800080')}
							>
								<Text style={{ color: '#fff' }}>Morado</Text>
							</Pressable>
						</ScrollView>
					</View>
				</View>
			</Modal>
		</Container>
	);
};

export default TextEditor;

const styles = StyleSheet.create({
	/********************************/
	/* styles for html tags */
	// a: {
	//     fontWeight: "bold",
	//     color: "purple",
	// },
	// div: {
	//     fontFamily: "monospace",
	// },
	// p: {
	//     fontSize: 30,
	// },
	/*******************************/
	container: {
		flex: 1,
		backgroundColor: color.bg
	},
	workCountLable: {
		bottom: 5,
		left: 15,
		fontFamily: fonts.regular,
		fontSize: 14,
		letterSpacing: 0.7,
		color: color.dark,
		opacity: 0.4
	},
	editor: {
		backgroundColor: color.light,
		borderRadius: 10,
		marginVertical: 10,
		marginHorizontal: 10
	},
	rich: {
		flex: 1,
		backgroundColor: color.bg
	},
	richBar: {
		height: 50,
		backgroundColor: color.light,
		borderRadius: 10,
		marginHorizontal: 10,
	},
	toolbarIcon: {
		// width: '75%'
	},
	text: {
		fontWeight: 'bold',
		fontSize: 20
	},
	tib: {
		textAlign: 'center',
		color: '#515156'
	},
	toolbarContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	item: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	color: {
		padding: 5,
		marginBottom: 5,
		borderRadius: 20,
		paddingHorizontal: 10,
		// alignItems: 'center',
		justifyContent: 'center'
	}
});

const button = {
	container: {
		backgroundColor: color.primary,
		height: 31,
		borderRadius: 5,
		flexDirection: 'row-reverse',
		marginTop: 10,
		marginRight: 15
	},
	text: {
		fontSize: 14,
		fontFamily: fonts.regular,
		letterSpacing: 0.7,
		color: color.light
	}
};
