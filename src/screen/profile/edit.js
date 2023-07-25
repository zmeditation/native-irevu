import * as React from 'react';
import { Container, Content, Text, View, Footer } from 'native-base';
import { StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import DropDownPicker from 'react-native-dropdown-picker';
import ImagePicker from 'react-native-image-crop-picker';
import { strings } from '../../translations/service';
import { Avatar } from 'react-native-elements';
import * as _ from 'lodash';
import { Icons, AuthButton } from '../../components';
import Loader from '../../components/Loader';
import { fonts } from '../../theme';
import { universityData, courseData, educationTypeData, dummyImageUrl } from '../../utils/constants';

class EditProfile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			universityInitData: props.universityList || [],
			courseInitData: props.courseList || [],
			educationInitData: educationTypeData,
			checked: 'student',
			education: 'university',
			fields: [
				{
					key: 'fullName',
					label: strings.full_name,
					data: '',
					placeholder: '',
					keyboardType: 'default'
				},
				{
					key: 'email',
					label: strings.email,
					data: '',
					placeholder: '',
					keyboardType: 'email-address'
				},
				{
					key: 'username',
					label: strings.username,
					data: '',
					placeholder: '',
					keyboardType: 'default'
				},
				// { key: "password", label: "Password", data: "New Password", secure: true, placeholder: "", keyboardType: "default" },
				{
					key: 'education',
					label: strings.education,
					data: '',
					searchablePlaceholder: 'search eduction',
					placeholder: strings.education,
					keyboardType: 'default',
					type: 'dropdown',
					height: 160
				},
				{
					key: 'university',
					label: strings.university,
					data: '',
					searchablePlaceholder: strings.search_university,
					placeholder: strings.university,
					keyboardType: 'default',
					type: 'dropdown',
					height: 300
				},
				{
					key: 'course',
					label: strings.course,
					data: '',
					searchablePlaceholder: strings.search_course,
					placeholder: strings.course,
					keyboardType: 'default',
					type: 'dropdown',
					height: 300
				}
			],
			editDetails: {},
			hide: true,
			isLoading: false
		};
	}

	// imagePickerHandler = (luanchFrom) => {
	//   if (luanchFrom === "gallery") {
	//     return <ImagePicker luanchFrom={luanchFrom} />
	//   }
	// };

	getDropdownData = (field) => {
		switch (field) {
			case 'education':
				return this.state.educationInitData;
			case 'university':
				return _.chain(this.state.universityInitData)
					.take(50)
					.map((value) => ({ label: value.value, value: value.id }))
					.value();
			case 'course':
				return _.chain(this.state.courseInitData)
					.take(50)
					.map((value) => ({ label: value.value, value: value.id }))
					.value();
		}
	};

	cleanTempImages = () => {
		ImagePicker.clean()
			.then(() => {
				console.log('removed all tmp images from tmp directory');
			})
			.catch((e) => {
				console.log(e);
			});
	};

	getSearchData = (field, search) => {
		switch (field) {
			case 'education':
				this.setState({
					educationInitData: _.filter(educationTypeData, (educationValue) => {
						console.log(`educationInitData:_.filter - educationValue`, educationValue);
						return educationValue.label.toLowerCase().indexOf(search.toLowerCase()) > -1;
					})
				});
				break;
			case 'university':
				this.setState({
					universityInitData: _.filter(
						universityData,
						(universityValue) => universityValue.toLowerCase().indexOf(search.toLowerCase()) > -1
					)
				});
				break;
			case 'course':
				this.setState({
					courseInitData: _.filter(
						courseData,
						(universityValue) => universityValue.toLowerCase().indexOf(search.toLowerCase()) > -1
					)
				});
				break;
		}
	};

	getUniversities = () => {
		this.props.getUniversityList();
	};

	getCourses = () => {
		this.props.getCourceList();
	};

	handleGetProfileDetail = () => {
		this.setState({ isLoading: true });
		this.getUniversities();
		this.getCourses();
		this.props.getProfileDetail(this);
	};

	onInputChangeHandler = (value, name) => {
		this.setState({
			editDetails: { ...this.state.editDetails, [name]: value }
		});
	};

	componentDidMount() {
		this.handleGetProfileDetail();
	}

	handleDropDownDefault = (field) => {
		if (field.key === 'education') {
			return '';
		} else if (field.key === 'university') {
			return '';
		} else if (field.key === 'course') {
			return '';
		}
	};

	componentWillReceiveProps(nextProps) {
		if (nextProps.imageUploadDetail !== this.props.imageUploadDetail) {
			this.setState({ isLoading: false });
			this.setState({
				editDetails: {
					...this.state.editDetails,
					['profileImage']: nextProps.imageUploadDetail.url
				}
			});
		}
		if (nextProps.profileDetail !== this.props.profileDetail) {
			this.setState({ isLoading: false });
			let userPorfileInfo = {};
			this.state.fields.map((profile, index) => {
				if (profile.key === 'course') {
					userPorfileInfo = {
						...userPorfileInfo,
						[profile.key]: nextProps.profileDetail.courseId
					};
					return (this.state.fields[index].data = nextProps.profileDetail.courseId);
				} else if (profile.key === 'university') {
					userPorfileInfo = {
						...userPorfileInfo,
						[profile.key]: nextProps.profileDetail.universityId
					};
					return (this.state.fields[index].data = nextProps.profileDetail.universityId);
				} else {
					userPorfileInfo = {
						...userPorfileInfo,
						[profile.key]: nextProps.profileDetail[profile.key]
					};
					return (this.state.fields[index].data = nextProps.profileDetail[profile.key]);
				}
			});

			userPorfileInfo = {
				...userPorfileInfo,
				profileImage: nextProps.profileDetail.profileImage
			};

			this.setState({ editDetails: userPorfileInfo });
		}

		if (nextProps.editProfDetails !== this.props.editProfDetails) {
			console.log('edit profile success will receive props', nextProps.editProfDetails);
			this.setState({ isLoading: false });
			// this.props.navigation.navigate('Home');
		}

		if (nextProps.uploadResourcesErr !== this.props.uploadResourcesErr) {
			this.setState({ isLoading: false });
		}
		this.cleanTempImages(); // OLD DEV SHT
	}

	handleSaveProfileDetails = async () => {
		this.setState({ isLoading: true });
		await this.props.editProfileDetail(this, this.state.editDetails);
		// await this.props.editProfileDetail(this, this.state.editDetails);
	};

	uploadResourceHandler = (type, response, initFileSize) => {
		this.setState({ isLoading: true });

		const fileSize = type === 'image' ? Math.round(response.size / 1024) : Math.round(response.size / 10240);
		const formData = new FormData();

		formData.append('file', {
			name:
				Platform.OS === 'android'
					? response.path.substring(response.path.lastIndexOf('/') + 1)
					: response.filename,
			uri: response.path,
			type: response.mime
		});

		if (fileSize > initFileSize) {
			console.log("file is large can't upload more than 1 mb", initFileSize);
		} else {
			this.props.uploadResources(this, formData, type);
		}
	};

	openImagePicker = async (chooseFrom) => {
		if (chooseFrom === 'camera') {
			ImagePicker.openCamera({
				cropping: true,
				width: 500,
				height: 500,
				mediaType: 'photo',
				cropperCircleOverlay: true,
				enableRotationGesture: true
			}).then((response) => {
				this.uploadResourceHandler('image', response, 1024);
			});
		} else {
			ImagePicker.openPicker({
				cropping: true,
				width: 500,
				height: 500,
				mediaType: 'photo',
				cropperCircleOverlay: true,
				enableRotationGesture: true
			}).then((response) => {
				this.uploadResourceHandler('image', response, 1024);
			});
		}
	};

	render() {
		return (
			<Container style={styles.container}>
				<DropdownAlert ref={(ref) => (this.dropDownAlertRef = ref)} zIndex={11111111} />
				{this.state.isLoading && <Loader isLoading={true} />}
				<Content showsVerticalScrollIndicator={false} style={{ marginBottom: '10%' }}>
					<View style={styles.profilePicCard}>
						<View style={styles.profilePicMainCon}>
							<Text style={styles.profilePicTextStyle}>{strings.profile_picture}</Text>
							<View style={{ flexDirection: 'row' }}>
								<TouchableOpacity onPress={() => this.openImagePicker('camera')}>
									<Icons.FontAwesome5
										name="camera"
										color="#2B65EC"
										size={22}
										style={{ opacity: 0.5 }}
									/>
								</TouchableOpacity>
								<TouchableOpacity onPress={() => this.openImagePicker('gallery')}>
									<Icons.FontAwesome5
										name="image"
										color="#2B65EC"
										size={22}
										style={{ opacity: 0.5, marginLeft: 25 }}
									/>
								</TouchableOpacity>
							</View>
						</View>
						<Avatar
							rounded
							source={{
								uri: this.state.editDetails.profileImage || dummyImageUrl
							}}
							avatarStyle={{ borderWidth: 0 }}
							size={110}
							containerStyle={styles.avatarStyle}
						/>
					</View>

					<View style={{ marginBottom: '80%' }}>
						{this.state.fields &&
							this.state.fields.map((field, index) => {
								if (field.type !== 'dropdown') {
									return (
										<View style={styles.authFields}>
											<Text style={styles.label}>{field.label}</Text>
											<TextInput
												keyboardType={field.keyboardType}
												selectTextOnFocus={true}
												secureTextEntry={this.state.hide && field.secure ? true : false}
												defaultValue={field.data}
												onChangeText={(value) => this.onInputChangeHandler(value, field.key)}
												style={styles.textInput}
											/>
											{field.secure && (
												<TouchableOpacity
													onPress={() => this.setState({ hide: !this.state.hide })}
													style={{
														position: 'absolute',
														right: '5%'
													}}
												>
													<Icons.MaterialCommunityIcons
														name={this.state.hide ? 'eye-off' : 'eye'}
														color="#2B65EC"
														size={20}
														style={{ opacity: 0.5 }}
													/>
												</TouchableOpacity>
											)}
										</View>
									);
								} else {
									return (
										<View
											style={{
												...(Platform.OS !== 'android' && {
													zIndex: 100 - index
												})
											}}
										>
											<DropDownPicker
												searchable
												searchablePlaceholder={field.searchablePlaceholder}
												items={this.getDropdownData(field.key)}
												defaultValue={this.handleDropDownDefault(field || '')}
												searchTextInputProps={{
													onChangeText: (i) => this.getSearchData(field.key, i)
												}}
												onChangeItem={(item, index) =>
													this.onInputChangeHandler(item.value, field.key)}
												containerStyle={{ height: 67, marginTop: 10 }}
												placeholder={field.label}
												placeholderStyle={{
													color: '#467DFF',
													fontFamily: fonts.semibold
												}}
												labelStyle={{
													color: '#467DFF',
													fontFamily: fonts.semibold
												}}
												style={{
													backgroundColor: 'white',
													zIndex: 100 - index
												}}
												itemStyle={{
													justifyContent: 'flex-start',
													color: '#467DFF'
												}}
												dropDownStyle={{
													backgroundColor: '#fafafa',
													elevation: 2,
													height: field.height,
													zIndex: 100 - index
												}}
												dropDownMaxHeight={400}
											/>
										</View>
									);
								}
							})}
					</View>
				</Content>
				<Footer style={{ backgroundColor: 'transparent' }}>
					<View style={{ width: '100%', backgroundColor: 'transparent' }}>
						<AuthButton title="Save" onPress={() => this.handleSaveProfileDetails()} />
					</View>
				</Footer>
			</Container>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#E9EFFD',
		paddingHorizontal: '5%'
	},
	profilePicCard: {
		height: 80,
		width: '100%',
		alignItems: 'center',
		backgroundColor: 'white',
		marginTop: 60,
		paddingHorizontal: '5%',
		borderRadius: 5
	},
	profilePicMainCon: {
		flex: 1,
		width: '100%',
		height: '100%',
		borderWidth: 0,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	profilePicTextStyle: {
		color: '#2B65EC',
		fontSize: 10,
		fontFamily: fonts.regular,
		textTransform: 'uppercase'
	},
	avatarStyle: {
		position: 'absolute',
		top: -50,
		zIndex: 1,
		elevation: 2,
		padding: 8,
		backgroundColor: '#E9EFFD'
	},
	textInput: {
		width: '100%',
		fontFamily: fonts.regular,
		fontSize: 14
	},
	label: {
		textTransform: 'uppercase',
		color: '#2B65EC',
		fontSize: 11,
		fontFamily: fonts.regularxs
	},
	authFields: {
		width: '100%',
		backgroundColor: 'white',
		minHeight: 67,
		maxHeight: 75,
		marginTop: 10,
		padding: 12,
		borderRadius: 5,
		justifyContent: 'center'
	}
});

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getProfileDetail, editProfileDetail } from '../../redux/actions/profile';
import { getUniversityList, getCourceList } from '../../redux/actions/auth';
import { uploadResources } from '../../redux/actions/uploadResources';

const mapStateToProps = (state) => ({
	profileError: state.profile.profileError,
	profileDetail: state.profile.profileDetail,
	editProfDetails: state.profile.editProfDetails,
	universityList: state.auth.universityList,
	courseList: state.auth.courseList,
	imageUploadDetail: state.uploadResource.imageUploadDetail,
	documentUploadDetail: state.uploadResource.documentUploadDetail,
	uploadResourcesErr: state.uploadResource.uploadResourcesErr
});

const mapDispatchToProps = (dispatch) => ({
	getProfileDetail: bindActionCreators(getProfileDetail, dispatch),
	editProfileDetail: bindActionCreators(editProfileDetail, dispatch),
	getUniversityList: bindActionCreators(getUniversityList, dispatch),
	getCourceList: bindActionCreators(getCourceList, dispatch),
	uploadResources: bindActionCreators(uploadResources, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
