import * as React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import {
  Container,
  Text,
  View,
  ListItem,
  Right,
  Left,
  Radio,
} from "native-base";
import { Icons, AuthButton } from "../../components";
import Modal from "react-native-modal";
import CheckBox from "react-native-check-box";
import { bindActionCreators } from "redux";
import { fonts, color } from "../../theme";
import { strings } from "../../translations/service";
import moment from "moment";

class Subscriptions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subscription_fees: "15", // 15 RMB (1 Month)
      plan_time: 1,
      modal: false,
      isChecked: false,
    };
  }

  theme = {
    colors: {
      text: color.dark,
      placeholder: color.lightblue,
      primary: color.lightblue,
    },
  };

  btnHandler = () => {
    this.setState({ modal: true });
  };

  onPay = () => {
    const { subscription_fees, isChecked } = this.state;
    this.props.start_wechat_pay({
      totalPayment: Number(subscription_fees),
      data: {
        order_type: "Subscription-Plan",
        product_id: 1,
        buyer_id: this.props.user.id,
        seller_id: 1,
        is_wallet: isChecked == false ? "0" : "1",
        plan_time: 1,
      },
    });
    this.setState({ modal: false });
  };

  render() {
    const { btnContainer, touchBtnContainer, btnText } = styles;
    const {
      subscription_status,
      subscription_start_date,
      subscription_end_date,
      free_trial_status,
    } = this.props.user; // subscription_status => 1 ON / 0 or 2 Off
    return (
      <Container style={styles.container}>
        <View style={styles.headingView}>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit={true}
            style={styles.headingText}
          >
            {free_trial_status === 2
              ? "2 Month Free Trial"
              : subscription_status == 1
              ? strings.active
              : strings.inactive}
          </Text>
        </View>
        <View style={styles.subHeadingView}>
          <Text
            style={{ textAlign: "center", marginBottom: 5, fontWeight: "bold" }}
          >
            {strings.subscription_started_date}
          </Text>
          <Text style={{ textAlign: "center", marginBottom: 20 }}>
            {moment(subscription_start_date).format("MMM Do YYYY")}
          </Text>
          <Text
            style={{ textAlign: "center", marginBottom: 5, fontWeight: "bold" }}
          >
            {strings.next_subscription_renewal_date}
          </Text>
          <Text style={{ textAlign: "center", marginBottom: 20 }}>
            {moment(subscription_end_date).format("MMM Do YYYY")}
          </Text>
        </View>

        <View style={styles.listItemView}>
          <ListItem>
            <Left>
              <Text>{strings.RMB_for_1_month}</Text>
            </Left>
            <Right>
              <Radio
                color={"blue"}
                onPress={() =>
                  this.setState({ subscription_fees: "15", plan_time: 1 })
                }
                selected={this.state.subscription_fees == "15"}
              />
            </Right>
          </ListItem>

          <ListItem>
            <Left>
              <Text>{strings.RMB_for_6_month}</Text>
            </Left>
            <Right>
              <Radio
                color={"blue"}
                onPress={() =>
                  this.setState({ subscription_fees: "70", plan_time: 6 })
                }
                selected={this.state.subscription_fees == "70"}
              />
            </Right>
          </ListItem>

          <ListItem>
            <Left>
              <Text>{strings.RMB_for_12_month}</Text>
            </Left>
            <Right>
              <Radio
                color={"blue"}
                onPress={() =>
                  this.setState({ subscription_fees: "120", plan_time: 12 })
                }
                selected={this.state.subscription_fees == "120"}
              />
            </Right>
          </ListItem>
        </View>

        <View style={btnContainer}>
          <TouchableOpacity
            onPress={() => {
              console.log("1");
              if (subscription_status == 1 && free_trial_status == 2) {
                alert(strings.subscription_already_active);
              }
              if (subscription_status == 2 && free_trial_status == 1) {
                alert("2 Month Free Trial Mode On");
              }
              if (subscription_status == 2 && free_trial_status == 2)
                this.btnHandler();
            }}
            style={touchBtnContainer}
          >
            <Text style={btnText}>
              {strings.pay} {this.state.subscription_fees + " " + strings.RMB}
            </Text>
          </TouchableOpacity>
        </View>

        {/* MODAL */}

        <Modal isVisible={this.state.modal}>
          <View style={styles.modalMainCon}>
            <View style={styles.modalHeader}>
              <View />
              <Text style={styles.modalHeaderTitle}>{strings.pay}</Text>
              <TouchableOpacity onPress={() => this.setState({ modal: false })}>
                <Icons.FontAwesome5 name="times" size={30} />
              </TouchableOpacity>
            </View>
            <View style={{ width: "100%" }}>
              <View style={{ backgroundColor: "#ecf2ff", padding: 20 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={styles.serviceText}>{strings.service}</Text>
                  <Text style={styles.serviceText}>{strings.cost}</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 5,
                  }}
                >
                  <Text
                    style={{
                      opacity: 0.8,
                      fontSize: 14,
                      fontFamily: fonts.regular,
                    }}
                  >
                    {strings.subscriptions}
                  </Text>
                  <Text
                    style={{
                      opacity: 0.8,
                      fontSize: 14,
                      fontFamily: fonts.popins_semibold,
                      textTransform: "uppercase",
                    }}
                  >
                    {this.state.subscription_fees || 0} {strings.RMB}
                  </Text>
                </View>
              </View>
              <View style={styles.bodyRows}>
                <Text
                  style={{
                    color: "#467DFF",
                    fontSize: 14,
                    fontFamily: fonts.medium,
                  }}
                >
                  {strings.total}
                </Text>
                <Text
                  style={{
                    textTransform: "uppercase",
                    fontSize: 14,
                    fontFamily: fonts.semibold,
                  }}
                >
                  {this.state.subscription_fees} {strings.RMB}
                </Text>
              </View>
            </View>
            <View style={{ padding: 20 }}>
              <CheckBox
                leftTextStyle={{
                  opacity: 0.3,
                  fontFamily: fonts.regular,
                  fontSize: 14,
                  marginRight: 10,
                }}
                style={{
                  width: "60%",
                  alignSelf: "center",
                  marginHorizontal: 10,
                }}
                onClick={() => {
                  this.setState({
                    isChecked: !this.state.isChecked,
                  });
                }}
                isChecked={this.state.isChecked}
                leftText={strings.use_my_wallet_balance}
                checkedCheckBoxColor="#467DFF"
                uncheckedCheckBoxColor="rgba(0,0,0,0.5)"
              />
              <View style={{ width: "100%", alignSelf: "center" }}>
                <AuthButton
                  title={strings.use_wechat_pay}
                  icon="wechat"
                  onPress={() => this.onPay()}
                />
              </View>
            </View>
          </View>
        </Modal>
      </Container>
    );
  }
}

import { connect } from "react-redux";
import { start_wechat_pay } from "../../redux/actions/wechatPay";

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

const mapDispatchToProps = (dispatch) => ({
  start_wechat_pay: bindActionCreators(start_wechat_pay, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Subscriptions);

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.bg,
    width: "100%",
    alignSelf: "center",
    padding: 10,
  },
  headingView: {
    width: "100%",
    backgroundColor: "white",
    alignSelf: "center",
    borderRadius: 10,
    alignItems: "center",
    padding: 20,
  },
  headingText: {
    fontFamily: fonts.semibold,
    color: "black",
    fontSize: 25,
    opacity: 0.75,
  },
  subHeadingView: {
    width: "90%",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: "5%",
  },
  listItemView: {
    backgroundColor: "#FFF",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  btnContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
  },
  touchBtnContainer: {
    backgroundColor: color.primary,
    width: "100%",
    paddingVertical: 14,
    borderRadius: 5,
    alignItems: "center",
  },
  btnText: {
    color: color.light,
    fontFamily: fonts.regular,
    textTransform: "uppercase",
    fontSize: 14,
    letterSpacing: 1,
  },
  serviceText: {
    color: "#467DFF",
    fontSize: 14,
    fontFamily: fonts.medium,
  },
  modalMainCon: {
    width: "100%",
    alignSelf: "center",
    backgroundColor: color.light,
    borderRadius: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: "5%",
  },
  modalHeaderTitle: { fontSize: 29, fontFamily: fonts.medium },
  bodyRows: {
    backgroundColor: "#dce7ff",
    width: "100%",
    flexDirection: "row",
    padding: 20,
    justifyContent: "space-between",
  },
});
