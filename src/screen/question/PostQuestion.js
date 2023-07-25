import * as React from 'react';
import { Container, Content, Text, View, Header, Footer } from 'native-base';
import {
	StyleSheet,
	TouchableOpacity} from 'react-native';
import { fonts, color } from '../../theme';
import {
	Icons,
	AuthFields,
	AuthButton
} from '../../components';
import { Card } from 'react-native-paper';
import CNRichTextEditor, {
	CNToolbar,
	getInitialObject,
	getDefaultStyles
} from '../../components/community/react-native-cn-richtext-editor';
import { SketchCanvas } from '@terrylinla/react-native-sketch-canvas';
import { strings } from '../../translations/service';

const defaultStyles = getDefaultStyles();

class PostQuestion extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// value: "",
			selectedTag: 'body',
			selectedStyles: [],
			value: [ getInitialObject() ]
		};
	}

	componentWillMount() {
		const { editorvalue } = this.props.route.params;
		if (editorvalue) {
			this.state.value = editorvalue;
		}
	}

	onStyleKeyPress = (toolType) => {
		this.editor.applyToolbar(toolType);
	};

	onSelectedTagChanged = (tag) => {
		this.setState({
			selectedTag: tag
		});
	};

	onSelectedStyleChanged = (styles) => {
		this.setState({
			selectedStyles: styles
		});
	};

	onValueChanged = (value) => {
		// const { onChangeQuestion } = this.props.route.params;
		// this.setState({
		//     value: value
		// });
		// if (this.props.route.params) {
		//   this.props.route.params.onChangeQuestion(value);
		// }
		this.state.value = value;
	};

	render() {
		const { information, pricing } = this.props.route.params;
		return (
			<Container style={styles.container}>
				<Header transparent style={{ height: 30 }} />

				<TouchableOpacity
					onPress={() => this.props.navigation.goBack()}
					style={{ flexDirection: 'row', alignItems: 'center' }}
				>
					<Icons.Entypo
						name="chevron-left"
						color="black"
						size={24}
						style={{ marginLeft: 0 }}
						color={color.blue}
					/>
					<Text style={{ color: color.blue }}>{strings.write_your_questions}</Text>
				</TouchableOpacity>

				<Content
					ref={(ref) => (this.ScrollView = ref)}
					onKeyboardWillShow={() => {
						this.ScrollView._root.scrollToPosition(0, 0);
					}}
					onKeyboardDidChangeFrame={() => this.ScrollView._root.scrollToPosition(0, 0)}
					onKeyboardDidShow={() => {
						this.ScrollView._root.scrollToPosition(0, 0);
					}}
					keyboardDismissMode="interactive"
					stickyHeaderIndices={[ 1 ]}
					padder
					bounces={false}
					contentContainerStyle={{ flex: 1, padding: 5, paddingBottom: 30 }}
				>
					<AuthFields
						onChangeText={(text) => {
							this.state.title = text;
						}}
						key={0 + '_create_question_add'}
						multiline
						unique={'_create_question_add'}
						keyboardType={'default'}
						key={'_create_question_add'}
						label={strings.title_capital}
						placeholder={strings.provide_title}
						style={{ backgroundColor: 'white', width: '100%' }}
					/>

					<View style={styles.footer}>
						<Card elevation={0} style={styles.footerCard}>
							<CNToolbar
								style={{
									height: 30,
									borderRadius: 0,
									borderWidth: 0
								}}
								selectedBackgroundColor={color.blue}
								selectedColor={'white'}
								iconSetContainerStyle={{
									// flexGrow: 1,
									// justifyContent: 'space-evenly',
									// alignItems: 'center',
								}}
								size={20}
								iconSet={[
									{
										type: 'tool',
										iconArray: [
											{
												toolTypeText: 'bold',
												buttonTypes: 'style',
												iconComponent: <Icons.MaterialIcons name="format-bold" size={5} />
											}
										]
									},
									{
										type: 'tool',
										iconArray: [
											{
												toolTypeText: 'italic',
												buttonTypes: 'style',
												iconComponent: <Icons.MaterialIcons name="format-italic" size={5} />
											}
										]
									},
									{
										type: 'tool',
										iconArray: [
											{
												toolTypeText: 'underline',
												buttonTypes: 'style',
												iconComponent: <Icons.MaterialIcons name="format-underlined" size={5} />
											}
										]
									},
									{
										type: 'tool',
										iconArray: [
											{
												toolTypeText: 'lineThrough',
												buttonTypes: 'style',
												iconComponent: <Icons.FontAwesome5 name="slash" size={5} />
											}
										]
									},

									{
										type: 'seperator'
									},
									// {
									//     type: 'tool',
									//     iconArray: [
									//         {
									//             toolTypeText: 'body',
									//             buttonTypes: 'tag',
									//             iconComponent:
									//                 <Text style={styles.toolbarButton}>
									//                     body
									//                     </Text>
									//         },
									//     ]
									// },
									{
										type: 'tool',
										iconArray: [
											{
												toolTypeText: 'ul',
												buttonTypes: 'tag',
												iconComponent: <Icons.Octicons name="list-unordered" size={5} />
											}
										]
									},
									{
										type: 'tool',
										iconArray: [
											{
												toolTypeText: 'ol',
												buttonTypes: 'tag',
												iconComponent: <Icons.Octicons name="list-ordered" size={5} />
											}
										]
									},
									{
										type: 'tool',
										iconArray: [
											{
												toolTypeText: 'image',
												iconComponent: <Icons.Entypo name="image" size={5} />
											}
										]
									}
								]}
								selectedTag={this.state.selectedTag}
								selectedStyles={this.state.selectedStyles}
								onStyleKeyPress={this.onStyleKeyPress}
							/>
						</Card>
					</View>

					<Card elevation={0} style={{ flex: 1, maxHeight: 400 }}>
						<CNRichTextEditor
							ref={(input) => (this.editor = input)}
							onSelectedTagChanged={this.onSelectedTagChanged}
							onSelectedStyleChanged={this.onSelectedStyleChanged}
							value={this.state.value}
							style={{ backgroundColor: 'transparent', flex: 1, width: '100%' }}
							styleList={defaultStyles}
							onValueChanged={this.onValueChanged}
						/>

						{this.state.pencil && (
							<SketchCanvas
								style={{ flex: 1, position: 'absolute' }}
								touchEnabled={true}
								strokeColor={'red'}
								strokeWidth={7}
							/>
						)}
					</Card>

					<View
						style={{
							width: '100%',
							height: 100,
							marginTop: 10
						}}
					>
						<Text style={[ styles.heading, { textAlign: 'left' } ]}>{strings.summary}</Text>
						<View style={{ height: 2 }} />
						<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
							<View>
								<Text style={[ styles.heading, { textAlign: 'left', fontSize: 18, color: 'black' } ]}>
									{strings.total_price}{' '}
									<Text style={{ fontSize: 14, color: 'gray' }}>{strings.price_platform_fee}</Text>
								</Text>

								<Text style={[ styles.heading, { textAlign: 'left', fontSize: 18, color: 'black' } ]}>
									{pricing.price + pricing.price * 0.1} {strings.RMB}
								</Text>

								<Text style={[ styles.heading, { textAlign: 'left', fontSize: 12, color: 'gray' } ]}>
									{strings.your_question_will_be_posted_to_portal_on_success}
								</Text>
							</View>
							{/* <Icons.AntDesign name="wechat" size={25} /> */}
						</View>
					</View>
				</Content>
				<Footer style={{ backgroundColor: '#fff' }}>
					<View style={{ width: '90%' }}>
						<AuthButton
							marginRightIcon={0.1}
							title="PROCEED TO PAYMENT"
							icon="wechat"
							iconSet="FontAwesome"
							onPress={() => this.handleSubmit()}
						/>
					</View>
				</Footer>
			</Container>
		);
	}

	handleSubmit = () => {
		const { information, pricing } = this.props.route.params;

		// if (!this.state.title) {
		//   alert("Please provide Title for the question.");
		//   return;
		// }

		// alert("Payment will hit here and questuon will be posted to server.");

		this.props.postQuestion(this, information, pricing, this.state);
	};
}

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { postQuestion } from '../../redux/actions/questions';
const mapStateToProps = (state) => ({
	user: state.auth.user
});

const mapDispatchToProps = (dispatch) => ({
	postQuestion: bindActionCreators(postQuestion, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(PostQuestion);

const styles = StyleSheet.create({
	footer: { backgroundColor: 'transparent', height: 70, width: '100%' },
	footerCard: {
		backgroundColor: 'white',
		width: '100%',
		marginTop: 10,
		height: 50,
		paddingTop: 10
	},
	divider: {
		width: 100,
		height: 1,
		backgroundColor: 'gray',
		alignSelf: 'center',
		opacity: 0.3,
		marginBottom: 10
	},
	dividertransparent: {
		width: 100,
		height: 1,
		backgroundColor: 'gray',
		alignSelf: 'center',
		opacity: 0,
		marginBottom: 10
	},

	full_name: {
		fontFamily: fonts.semibold,
		color: 'black',
		fontSize: 25,
		opacity: 0.75
	},
	morning: { fontFamily: fonts.semibold, color: 'gray', fontSize: 17 },
	greetingCon: {
		width: '96%',
		backgroundColor: 'white',
		alignSelf: 'center',
		borderRadius: 10,
		alignItems: 'center',
		padding: 20
	},
	container: {
		backgroundColor: '#F2F6FF',
		// alignItems: "center",
		paddingHorizontal: '1.5%'
	},
	heading: {
		fontSize: 23,
		fontFamily: fonts.medium,
		color: '#467DFF',
		textAlign: 'center'
	},
	searchMainCon: {
		width: '95%',
		alignSelf: 'center',
		marginVertical: 10,
		height: 50,
		backgroundColor: 'white',
		borderRadius: 15,
		flexDirection: 'row'
	},
	searchIconCon: {
		flex: 0.35,
		justifyContent: 'center',
		alignItems: 'center'
	},
	searchTextinputCon: {
		flex: 1,
		fontFamily: fonts.regular,
		fontSize: 14,
		color: 'black'
	},
	degree: { opacity: 0.2, fontSize: 12, fontFamily: fonts.regular },
	title: { fontFamily: fonts.regular, fontSize: 18 },
	subText: { fontFamily: fonts.regular, fontSize: 14 }
});
