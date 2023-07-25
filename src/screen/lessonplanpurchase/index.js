import * as React from "react";
import {
  Container,
  Content,
  Text,
  View,
  Header,
  Left,
  Body,
  Title,
  Right,
} from "native-base";
import { StyleSheet, TouchableOpacity } from "react-native";
import { fonts, color } from "../../theme";
import { Icons, AuthButton, DocumentViewer } from "../../components";
import { Avatar } from "react-native-elements";
import { BlurView } from "@react-native-community/blur";
import Modal from "react-native-modal";
import CheckBox from "react-native-check-box";
import { dummyImageUrl } from "../../utils/constants";
import RenderHtml from "../../components/HtmlViewer/RenderHtml";
import { connect } from 'react-redux';
import { start_wechat_pay } from '../../redux/actions/wechatPay';
import { bindActionCreators } from 'redux'; import SimpleButton from "../../components/button/SimpleButton";
import { strings } from '../../translations/service';

class ClassDetailViewLessonPlanPurchase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      showDocument: false,
      isChecked: false, // 0 == False && 1 == True
    };
  }

  btnHandler = () => {
    this.setState({ modal: true });
  };

  onPay = (details) => {
    const { isChecked } = this.state
    if (Number(details.price) < Number(this.props.user.balance) == false && this.state.isChecked == true) {
      alert('Insufficient amount in wallet, Please top-up or wechat pay.')
      this.setState({ isChecked: false })
    } else {
      this.props.start_wechat_pay({
        totalPayment: details.price + details.price * 10 / 100,
        data: {
          order_type: 'Lesson-Plan',
          product_id: details.id,
          buyer_id: this.props.user.id,
          seller_id: details.created_by,
          is_wallet: isChecked == false ? "0" : "1",
        },
      });
      this.setState({ showDocument: false, modal: false });
    }
  };

  render() {
    const { details } = this.props.route.params;
    return (
      <>
        <Header style={{ backgroundColor: "white" }}>
          <Left>
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={{ marginLeft: "15%" }}
            >
              <Icons.Entypo name="chevron-left" color="black" size={30} />
            </TouchableOpacity>
          </Left>
          <Body style={{ minWidth: "50%" }}>
            <Title
              style={{
                color: "black",
                alignSelf: "center",
                fontFamily: fonts.medium,
                fontSize: 20,
              }}
            >
              {strings.lesson_plans}
            </Title>
            <Text
              style={{
                opacity: 0.5,
                color: "black",
                alignSelf: "center",
                fontFamily: fonts.regular,
                fontSize: 12,
              }}
            >
              {details.subject || ""}
            </Text>
          </Body>
          <Right style={{ maxWidth: "10%" }}></Right>
        </Header>
        <Container style={styles.container}>
          <Content
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            <View style={styles.topcard}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Avatar
                  rounded
                  source={{
                    uri: details.profileImage || dummyImageUrl,
                  }}
                  size={35}
                  avatarStyle={{}}
                />
                <View style={styles.profile}>
                  <Text style={styles.profileName}>
                    {details.userName || ""}
                  </Text>
                  <Text style={styles.degreeName}>{details.level || ""}</Text>
                </View>
              </View>
              <View style={{}}>
                <Text style={styles.gradesTitle}>Price</Text>
                <Text style={styles.grades}>{`RMB ${details.price || 0}`}</Text>
              </View>
            </View>

            <View
              style={{
                backgroundColor: "white",
                width: "90%",
                alignSelf: "center",
                marginTop: 15,
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.regular,
                  fontSize: 18,
                  letterSpacing: 1.26,
                }}
              >
                {details.title}
              </Text>
              <View>
                <BlurView
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "50%",
                    zIndex: 20,
                    bottom: 0,
                    left: -1,
                  }}
                  blurType="light"
                  blurAmount={2}
                  reducedTransparencyFallbackColor="white"
                />
                <RenderHtml content={details.description} />
              </View>
              <View
                style={{
                  marginTop: 20,
                  alignSelf: "center",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: "#467DFF",
                    borderRadius: 35,
                    width: 35,
                    height: 35,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Icons.FontAwesome5
                    color="white"
                    name="angle-left"
                    size={24}
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    marginHorizontal: 10,
                    fontFamily: fonts.regular,
                    fontSize: 14,
                  }}
                >
                  1/3
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#467DFF",
                    borderRadius: 35,
                    width: 35,
                    height: 35,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Icons.FontAwesome5
                    color="white"
                    name="angle-right"
                    size={24}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                backgroundColor: color.bg,
                alignItems: "center",
                position: "absolute",
                bottom: 0,
                marginBottom: "10%",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <SimpleButton
                containerStyle={styles.purchasePaper}
                textStyle={styles.btnTxt}
                text={strings.purchase_the_complete_paper}
                buttonPressHandler={this.btnHandler}
              />

              {/* <TouchableOpacity style={styles.purchasePaper}>

                <Text styl={btnTxt}>Purchase the complete paper</Text> */}

              {/* <AuthButton
                  onPress={() => this.setState({ modal: true })}
                  title="Purchase the complete paper"
                  style={{ fontSize: 50, backgroundColor: color.primary }}
                /> */}
              {/* </TouchableOpacity> */}
            </View>
            <Modal isVisible={this.state.modal}>
              <View style={styles.modalMainCon}>
                <View style={styles.modalHeader}>
                  <View />
                  <Text style={styles.modalHeaderTitle}>{strings.pay}</Text>
                  <TouchableOpacity
                    onPress={() => this.setState({ modal: false })}
                  >
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
                        {strings.lesson_plans}
                      </Text>
                      <Text
                        style={{
                          opacity: 0.8,
                          fontSize: 14,
                          fontFamily: fonts.popins_semibold,
                          textTransform: "uppercase",
                        }}
                      >
                        {details.price || 0} {strings.RMB}
                      </Text>
                    </View>
                    <Text
                      style={{
                        opacity: 0.3,
                        fontSize: 14,
                        fontFamily: fonts.regular,
                      }}
                    >
                      {strings.platform_fee}
                    </Text>
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
                      {details.price + details.price * 10 / 100 || 0} {strings.RMB}
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
                      onPress={() => this.onPay(details)}
                    />
                  </View>
                </View>
              </View>
            </Modal>
          </Content>
          {this.state.showDocument && (
            <DocumentViewer
              documentUrl={details.plan}
              onDismiss={() => this.setState({ showDocument: false })}
            ></DocumentViewer>
          )}
        </Container>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.auth.user
});

const mapDispatchToProps = (dispatch) => ({
  start_wechat_pay: bindActionCreators(start_wechat_pay, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ClassDetailViewLessonPlanPurchase);

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.lightbg,
    alignItems: "center",
  },
  topcard: {
    width: "90%",
    backgroundColor: color.light,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignSelf: "center",
  },
  profile: { justifyContent: "center", marginLeft: 10 },
  profileName: {
    fontFamily: fonts.regular,
    fontSize: 14,
    top: 5,
    letterSpacing: 0.7,
    lineHeight: 21,
  },
  degreeName: {
    fontSize: 14,
    fontFamily: fonts.regular,
    opacity: 0.2,
    bottom: 0,
    letterSpacing: 0.7,
    lineHeight: 21,
    marginTop: 3,
  },
  gradesTitle: {
    fontSize: 12,
    fontFamily: fonts.regular,
    textAlign: "right",
    letterSpacing: 0.6,
  },
  grades: {
    opacity: 0.8,
    fontFamily: fonts.regular,
    fontSize: 23,
    color: "#467DFF",
    letterSpacing: 1.15,
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
  purchasePaper: {
    width: "90%",
    backgroundColor: color.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    padding: 12,
  },
  btnTxt: {
    color: color.light,
    textTransform: "uppercase",
    fontFamily: fonts.primary,
  },
});
