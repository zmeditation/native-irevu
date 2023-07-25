import * as React from 'react';
import { Container, Content, Text, View } from 'native-base';
import { StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { DialogContent, SlideAnimation, DialogComponent } from 'react-native-dialog-component';
import { fonts, color } from '../../theme';
import { Card } from 'react-native-paper';
import { Icons } from '../../components';
import { strings } from '../../translations/service';

class Wallet extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedTrans: { student: '', status: '', amount: '', time: '', date: '', order_type: '', id: '' },
			showModal: false,
			showRefundModal: false
		};
	}
	// Forum: id == 86 , status == open, is_answered == 0, created_at (only 15 min.)
	componentDidMount() {
		this.props.transationHistory(this);
	}

	viewTransactionDetailsHandler({ item }) {
		return (
			<Card
				style={styles.container}
				onPress={() => {
					this.setState({ selectedTrans: item, showModal: true }, () => this.dialogComponent.show());
				}}
			>
				<Text style={styles.transHeading}>{ item.order_type === 'Forum' ? item.status : 'Paid To'}</Text>
				<Text style={styles.textNumber}>{item.order_type}</Text>
				<View style={{ flex: 1 }}>
					<Text numberOfLines={3} style={styles.textNumber}>
						{item.status === 'withdrawn' ? '-' : ''}{strings.RMB} {item.total_fee}
					</Text>
					<Text numberOfLines={3} style={styles.textDate}>
						{moment(item.created_at).format('MMMM Do YYYY, h:mm A')}
					</Text>
				</View>
			</Card>
		);
	}

	render() {
		const { hour, username, selectedTrans } = this.state;
		const { user, transationHistory } = this.props;
		return (
			<Container style={styles.mainContainer}>
				<Content showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }} padder
				refreshControl={
					<RefreshControl refreshing={false} onRefresh={() =>this.props.transationHistory(this)} />
				}>
					<View>
						<Card onPress={() => { }} style={styles.container}>
							<Text style={styles.heading}>{strings.balance}</Text>
							<View style={{ flex: 1 }}>
								<Text numberOfLines={3} style={styles.text}>
									{strings.RMB} {user.balance}
								</Text>
							</View>
						</Card>
					</View>

					<View style={styles.btnMainContainer}>
						<TouchableOpacity style={styles.btnTouchContainer}>
							<Icons.FontAwesome5 name="money-bill-wave-alt" style={styles.btnIcon} />
							<Text style={styles.btnText}> {strings.withdraw}</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.btnTouchContainer}
							onPress={() => this.props.navigation.navigate('Topup')}
						>
							<Icons.FontAwesome5 name="arrow-up" style={styles.btnIcon} />
							<Text style={styles.btnText}> {strings.topup} </Text>
						</TouchableOpacity>
					</View>

					<View style={styles.horizontalDivider} />

					<View style={styles.transactionContainer}>
						<Text style={styles.transactionTxt}>{strings.transactions}</Text>
					</View>

					<View style={styles.transactionLstContainer}>
						<FlatList
							data={this.props.transactionsHistoryList}
							renderItem={(item) => this.viewTransactionDetailsHandler(item)}
						/>
					</View>
				</Content>
				{this.state.showModal && (
					<DialogComponent
						key={'DialogComponent' + 'classes'}
						dialogStyle={{
							width: '90%',
							top: -120,
							borderRadius: 5,
							height: 300,
							elevation: 2
						}}
						dialogAnimation={new SlideAnimation({ slideFrom: 'bottom' })}
						ref={(dialogComponent) => {
							this.dialogComponent = dialogComponent;
						}}
						onDismissed={() => this.setState({ showModal: false })}
					>
						<DialogContent key={'transactions'}>
							<View style={styles.modalMainContainer}>
								<Text style={styles.modalTitle}>{strings.transaction}</Text>
								<Text style={styles.textDate}>
									{moment(selectedTrans.created_at).format('MMMM Do YYYY, h:mm A')}
								</Text>
								<View style={styles.modalInputBoxContainer}>
									<Text style={styles.studentIdLabel}>{strings.student_id}</Text>
									<Text style={styles.studentIdValue}>{selectedTrans.buyer_id}</Text>
								</View>
								<View style={styles.modalHorizontalDivider} />
								<Text style={[styles.transHeading, styles.balanceText]}>{strings.balance}</Text>
								<Text style={styles.textNumber}>{strings.RMB} {selectedTrans.total_fee}</Text>

								{selectedTrans.order_type === 'Forum' ? <TouchableOpacity
									onPress={() => {
										selectedTrans.status == 'refund' ? alert('Amount Already Refunded!') :
											this.setState({ showRefundModal: true, showModal: false }, () =>
												this.dialogTransComponent.show()
											)
									}}
								>
									<Text style={styles.issueRefundTxt}>{strings.issue_refund}</Text>
								</TouchableOpacity> : <Text style={styles.textNumber}>{selectedTrans.order_type}</Text>}
							</View>
						</DialogContent>
					</DialogComponent>
				)}

				{this.state.showRefundModal && (
					<DialogComponent
						key={'DialogComponentTransaction' + 'classes'}
						dialogStyle={{
							width: '100%',
							top: -120,
							borderRadius: 5,
							height: 300,
							// elevation: 2,
							backgroundColor: 'transparent'
						}}
						ref={(dialogComponent) => {
							this.dialogTransComponent = dialogComponent;
						}}
						dialogAnimation={new SlideAnimation({ slideFrom: 'bottom' })}
						onDismissed={() => this.setState({ showRefundModal: false })}
					>
						<DialogContent key={'transactionsRefund'}>
							<View>
								<View style={styles.confirmContainer}>
									<Text style={styles.confirmMessageTitle}>{strings.are_you_sure}</Text>
									<Text style={styles.confirmMessageText}>
										{strings.the_amount_will_be_refunded_to_the_student}
									</Text>
								</View>
							</View>
							<View style={styles.confirmBtnContainer}>
								<TouchableOpacity
									style={[styles.btnRefundContainer, { backgroundColor: color.light }]}
									onPress={() => {
										const { selectedTrans } = this.state;
										{
											selectedTrans.order_type == "Forum" ?
												this.props.refund(
													selectedTrans.out_trade_no,
													selectedTrans.total_fee,
													selectedTrans.product_id,
													selectedTrans.id
												) : alert('Only order type "Forum" are eligible for refund!')
										}
										this.setState({ showRefundModal: false });
									}}
								>
									<Text style={[styles.btnConfirmText, { color: color.dark }]}>
										{strings.issue_refund}
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[styles.btnRefundContainer, { backgroundColor: color.primary }]}
									onPress={() => this.setState({ showRefundModal: false })}
								>
									<Text style={styles.btnConfirmText}>{strings.return}</Text>
								</TouchableOpacity>
							</View>
						</DialogContent>
					</DialogComponent>
				)}
			</Container>
		);
	}
}

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { refund, transationHistory } from '../../redux/actions/wechatPay';
import moment from 'moment';
import { RefreshControl } from 'react-native';

const mapStateToProps = (state) => ({
	user: state.auth.user,
	transactionsHistoryList: state.profile.transationHistory
});

const mapDispatchToProps = (dispatch) => ({
	refund: bindActionCreators(refund, dispatch),
	transationHistory: bindActionCreators(transationHistory, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);

const styles = StyleSheet.create({
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
		color: color.dark,
		fontSize: 25,
		opacity: 0.75
	},
	morning: { fontFamily: fonts.semibold, color: 'gray', fontSize: 17 },
	greetingCon: {
		width: '96%',
		backgroundColor: color.light,
		alignSelf: 'center',
		borderRadius: 10,
		alignItems: 'center',
		padding: 20
	},
	mainContainer: {
		backgroundColor: color.lightbg
	},
	container: {
		width: '95%',
		marginVertical: 8,
		borderRadius: 10,
		paddingVertical: 14,
		paddingLeft: 20,
		marginHorizontal: '2%',
		justifyContent: 'space-between'
	},
	heading: {
		fontFamily: fonts.medium,
		fontSize: 10,
		textTransform: 'uppercase',
		color: color.lightblue
	},
	text: { fontFamily: fonts.medium, fontSize: 14, marginTop: 3 },
	timeremain: {
		fontFamily: fonts.semibold,
		fontSize: 13,
		color: 'gray',
		opacity: 0.7
	},
	btnMainContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginVertical: '5%'
	},
	btnTouchContainer: {
		backgroundColor: color.primary,
		width: '40%',
		padding: 8,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 50,
		flexDirection: 'row',
		height: 36
	},
	btnRefundContainer: {
		width: '48%',
		padding: 8,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 5,
		flexDirection: 'row',
		height: 43
	},
	btnIcon: {
		color: color.light,
		marginRight: 5,
		fontSize: 14
	},
	btnText: {
		textTransform: 'uppercase',
		color: color.light,
		fontFamily: fonts.regular,
		fontSize: 13,
		letterSpacing: 0.7
	},
	btnConfirmText: {
		textTransform: 'uppercase',
		color: color.light,
		fontFamily: fonts.medium,
		fontSize: 14,
		letterSpacing: 1.12
	},
	horizontalDivider: {
		borderBottomColor: color.lightGray,
		borderBottomWidth: 2,
		width: '14%',
		borderRadius: 50,
		justifyContent: 'center',
		alignSelf: 'center',
		marginVertical: '1%'
	},
	transactionContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		marginVertical: '3%'
	},
	transactionLstContainer: {
		width: '100%',
		alignSelf: 'center'
	},
	transactionTxt: {
		fontSize: 20,
		fontFamily: fonts.medium,
		color: color.primary
	},
	transHeading: {
		color: color.dark,
		opacity: 0.4,
		textTransform: 'uppercase',
		fontSize: 10,
		fontFamily: fonts.regular,
		letterSpacing: 0.7
	},
	textNumber: {
		color: color.dark,
		fontFamily: fonts.regular,
		fontSize: 14,
		marginVertical: 2
	},
	textDate: {
		color: color.dark,
		opacity: 0.2,
		fontFamily: fonts.regular,
		fontSize: 12,
		letterSpacing: 0.8
	},
	modalMainContainer: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	modalTitle: {
		fontSize: 20,
		fontFamily: fonts.medium,
		color: color.dark,
		letterSpacing: 1
	},
	modalInputBoxContainer: {
		width: '100%',
		marginTop: '3%',
		backgroundColor: color.bg,
		paddingVertical: 15,
		paddingHorizontal: 20,
		borderRadius: 5
	},
	studentIdLabel: {
		color: color.primary,
		fontFamily: fonts.regular,
		letterSpacing: 0.7,
		textTransform: 'uppercase',
		fontSize: 10
	},
	studentIdValue: {
		color: color.dark,
		fontFamily: fonts.regular,
		letterSpacing: 0.7,
		textTransform: 'uppercase',
		fontSize: 14,
		marginTop: 4
	},
	modalHorizontalDivider: {
		borderBottomColor: color.mediumGray,
		borderBottomWidth: 1,
		width: '60%',
		borderRadius: 50,
		justifyContent: 'center',
		alignSelf: 'center',
		marginTop: '9%',
		marginBottom: '5%'
	},
	balanceText: {
		fontSize: 10
	},
	issueRefundTxt: {
		fontSize: 14,
		fontFamily: fonts.medium,
		color: color.primary,
		textTransform: 'uppercase',
		marginTop: '4%',
		letterSpacing: 1.12
	},
	confirmContainer: {
		backgroundColor: color.light,
		paddingHorizontal: 20,
		paddingVertical: 20,
		borderRadius: 10
	},
	confirmMessageTitle: {
		color: color.lightblue,
		fontFamily: fonts.regular,
		letterSpacing: 0.7,
		fontSize: 10,
		textTransform: 'uppercase'
	},
	confirmMessageText: {
		color: color.dark,
		fontFamily: fonts.regular,
		letterSpacing: 0.65,
		fontSize: 13,
		marginTop: 5
	},
	confirmBtnContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: '4%'
	}
});
