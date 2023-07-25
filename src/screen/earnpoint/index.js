import * as React from 'react';
import { Container, Content, Text, View } from 'native-base';
import { StyleSheet, TouchableOpacity, Clipboard, ToastAndroid } from 'react-native';
import ShareE from 'react-native-share';
import ViewShot from 'react-native-view-shot';
import { fonts, color } from '../../theme';
import { Card } from 'react-native-paper';
import { Icons } from '../../components';
import QRCode from 'react-native-qrcode-svg';
import { strings } from '../../translations/service';

class EarnPoint extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			refCode: `irevu.org/register?invite=${props.user.referral_code ? props.user.referral_code : ''}&type=${props
				.user.module_type}`
		};
	}

	onShare = async () => {
		this.refs.viewShot.capture().then(async (url) => {
			ShareE.open({
				title: 'Share referral link',
				message: 'https://' + this.state.refCode,
				url
			})
				.then((res) => {
					console.log(res);
				})
				.catch((err) => {
					console.log(err);
				});
		});
	};

	render() {
		const { hour, username } = this.state;
		const { user } = this.props;
		let points = user.user_type == '1' ? user.referral_used * 100 : user.referral_used * 50;
		return (
			<Container style={styles.container}>
				<Content
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ paddingBottom: 100, alignSelf: 'center' }}
					padder
				>
					<Card style={styles.pointContainer}>
						<View style={styles.pointDescContainer}>
							<Text style={styles.title}>{strings.invite_teacher_student}</Text>
							<Text style={styles.description}>
								{strings.remember_the_more_teachers_and_students} {'\n'}
								{strings.on_the_platform_the_more_chances_you} {'\n'}
								{strings.have_of_making_money_and_points}
							</Text>
							<Text style={styles.pointDesc}>
								{strings.points_for_a_students} {'\n'}
								{strings.points_for_a_teacher}
							</Text>
						</View>
						<Card style={styles.referralContainer}>
							<View style={styles.referralWrapper}>
								<View style={styles.linkWrapper}>
									<Text style={styles.referralLinkText}>{strings.your_referral_link}</Text>
									<Text style={styles.referralLink}>{this.state.refCode}</Text>
								</View>
								<View style={styles.actionWrapper}>
									<TouchableOpacity onPress={this.onShare}>
										<Icons.FontAwesome5 name="share-alt" style={styles.actionIcon} />
									</TouchableOpacity>
									<TouchableOpacity
										onPress={() => {
											Clipboard.setString(`https://${this.state.refCode}`);
											ToastAndroid.show('Referral link copied', ToastAndroid.SHORT);
										}}
									>
										<Icons.FontAwesome5 name="copy" style={styles.actionIcon} />
									</TouchableOpacity>
								</View>
							</View>
						</Card>
					</Card>
					<ViewShot
						ref="viewShot"
						options={{ format: 'jpg', quality: 0.9 }}
						style={{
							marginHorizontal: 20,
							marginTop: '13%'
						}}
					>
						<Card style={styles.QRCodeBox}>
							{/* <Row style={{ alignItems: 'center', justifyContent: 'center', marginLeft: 65 }}> */}
							<QRCode
								size={200}
								logoSize={40}
								logoMargin={3}
								logoBorderRadius={3}
								logoBackgroundColor={'#fff'}
								value={`https://${this.state.refCode}`}
								logo={require('../../../assets/logos/logo.png')}
							/>
							{/* <TouchableOpacity
									style={{
										width: 30,
										height: 30,
										margin: 20,
										alignItems: 'center',
										justifyContent: 'center'
									}}
									onPress={this.onShare}
								>
									<Icons.FontAwesome5 name="share-alt" style={styles.qrShare} />
								</TouchableOpacity>
							</Row> */}
						</Card>
					</ViewShot>
					<Card style={styles.pointCountContainer}>
						<View style={styles.pointWrapper}>
							<View>
								<Text style={styles.pointLabel}>{strings.referrals}</Text>
								<Text style={styles.pointCount}>{user.referral_used}</Text>
							</View>
							<View>
								<Text style={styles.pointLabel}>{strings.points_from_referrals}</Text>
								<Text style={styles.pointCount}>{points}</Text>
							</View>
						</View>
					</Card>
				</Content>
			</Container>
		);
	}
}

import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
	user: state.auth.user
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(EarnPoint);

const styles = StyleSheet.create({
	container: {
		backgroundColor: color.lightbg
	},
	pointDescContainer: {
		flexDirection: 'column',
		padding: 24,
		alignItems: 'center'
	},
	title: {
		fontFamily: fonts.medium,
		color: color.primary,
		fontSize: 20,
		letterSpacing: 1
	},
	description: {
		fontFamily: fonts.regular,
		fontSize: 14,
		letterSpacing: 0.7,
		textAlign: 'center',
		marginTop: 11,
		lineHeight: 20
	},
	pointDesc: {
		fontFamily: fonts.medium,
		fontSize: 12,
		letterSpacing: 0.6,
		textAlign: 'center',
		marginTop: 11,
		opacity: 0.25,
		lineHeight: 20,
		marginBottom: -40
	},
	pointContainer: {
		width: '100%',
		marginTop: '5%'
	},
	pointCountContainer: {
		height: 80,
		marginHorizontal: 20,
		borderRadius: 5,
		marginTop: '5%'
	},
	pointWrapper: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginTop: 20
	},
	pointLabel: {
		fontFamily: fonts.regular,
		fontSize: 10,
		letterSpacing: 0.7,
		textTransform: 'uppercase'
	},
	pointCount: {
		fontFamily: fonts.regular,
		fontSize: 25,
		letterSpacing: 1.25,
		color: color.primary,
		opacity: 0.8
	},
	referralContainer: {
		top: 30,
		alignSelf: 'center',
		width: '90%'
	},
	referralLinkText: {
		fontFamily: fonts.regular,
		fontSize: 10,
		letterSpacing: 0.7,
		color: color.primary
	},
	referralWrapper: {
		paddingVertical: 15,
		paddingHorizontal: 24,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	linkWrapper: {
		width: '70%'
	},
	actionWrapper: {
		flexDirection: 'row'
	},
	actionIcon: {
		color: color.primary,
		fontSize: 18,
		marginLeft: 24
	},
	referralLink: {
		fontFamily: fonts.regular,
		fontSize: 14,
		letterSpacing: 0.7,
		marginTop: 3
	},
	QRCodeBox: {
		height: 220,
		borderRadius: 5,
		padding: 10,
		alignItems: 'center',
		justifyContent: 'center'
	},
	qrShare: {
		color: color.primary,
		fontSize: 18
		// marginLeft: 24
	}
});
