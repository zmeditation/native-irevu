import * as React from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import { Container, Text, View } from "native-base";
import { fonts, color } from "../../theme";
import { bindActionCreators } from "redux";
import { strings } from "../../translations/service";
import DropdownAlert from "react-native-dropdownalert";

class Topup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      price: "",
    };
  }

  theme = {
    colors: {
      text: color.dark,
      placeholder: color.lightblue,
      primary: color.lightblue,
    },
  };

  onPay = () => {
    this.setState({ loading: true });
    const { price } = this.state;
    this.props.start_wechat_pay({
      totalPayment: Number(price),
      data: {
        order_type: "Top-up",
        product_id: 1, // details.id,
        buyer_id: this.props.user.id,
        seller_id: 1, //details.created_by,
        is_wallet: "0",
      },
      then:(e)=>{
        console.log('then',e);
        this.props.topUp( Number(price),this)
      },
      catchh:(e)=>{
        this.dropDownAlertRef.alertWithType(
          'error',
          'Top-up failed!',
          );
          console.log(e);
      }
    });
    this.setState({ price: "", loading: false});
  };

  render() {
    const { textInput, btnContainer, touchBtnContainer, btnText } = styles;
    return (
      <Container style={styles.container}>
        <AuthFields
          label={strings.topup_amount_capital}
          onChangeText={(text) => this.setState({ price: text })}
          theme={this.theme}
          style={textInput}
          maxLength={6}
          keyboardType={"number-pad"}
        />
        {this.state.loading === true ? (
          <View style={btnContainer}>
            <TouchableOpacity style={touchBtnContainer}>
              <ActivityIndicator color={"#FFF"} size={"small"} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={btnContainer}>
            <TouchableOpacity
              onPress={() => this.onPay()}
              style={touchBtnContainer}
            >
              <Text style={btnText}>{strings.top_up}</Text>
            </TouchableOpacity>
          </View>
        )}
        <DropdownAlert ref={(ref) => (this.dropDownAlertRef = ref)} zIndex={11111111} />
      </Container>
    );
  }
}

import { connect } from "react-redux";
import { AuthFields } from "../../components";
import { start_wechat_pay, topUp } from "../../redux/actions/wechatPay";

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

const mapDispatchToProps = (dispatch) => ({
  start_wechat_pay: bindActionCreators(start_wechat_pay, dispatch),
  topUp: bindActionCreators(topUp, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Topup);

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.bg,
    width: "100%",
    alignSelf: "center",
    padding: 10,
    // flex:1
  },
  textInput: {
    backgroundColor: color.light,
    marginVertical: "2%",
    textTransform: "uppercase",
    fontFamily: fonts.regular,
    fontSize: 12,
    letterSpacing: 0.5,
    borderRadius: 10,
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
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
    bottom: 10,
  },
  btnText: {
    color: color.light,
    fontFamily: fonts.regular,
    textTransform: "uppercase",
    fontSize: 14,
    letterSpacing: 1,
  },
});
