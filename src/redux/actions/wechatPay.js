import axiosApi from "../../config/api";
import * as WeChat from "react-native-wechat-lib";
import { secret_key } from "../../config/weChatConfig";
import { GET_USER_TRANSACTION_HISTORY } from "../constants/profile.constants";
import queryString from "querystring";
import CryptoJS from "react-native-crypto-js";
// const parseString = require('react-native-xml2js').parseString;
const { DOMParser } = require('xmldom')

function createNonceStr() {
  return Math.random().toString(36).substr(3, 32);
}

// UNIFIED XML
function getUnifiedorderXmlParams(obj) {
  return (
    "<xml>" +
    "<appid>" +
    obj.appid +
    "</appid>" +
    "<attach>" +
    obj.attach +
    "</attach>" +
    "<body>" +
    obj.body +
    "</body>" +
    "<mch_id>" +
    obj.mch_id +
    "</mch_id>" +
    "<nonce_str>" +
    obj.nonce_str +
    "</nonce_str>" +
    "<notify_url>" +
    obj.notify_url +
    "</notify_url>" +
    "<out_trade_no>" +
    obj.out_trade_no +
    "</out_trade_no>" +
    "<spbill_create_ip>" +
    obj.spbill_create_ip +
    "</spbill_create_ip>" +
    "<total_fee>" +
    obj.total_fee +
    "</total_fee>" +
    "<fee_type>" +
    obj.fee_type +
    "</fee_type>" +
    "<trade_type>" +
    obj.trade_type +
    "</trade_type>" +
    "<sign>" +
    obj.sign +
    "</sign>" +
    "</xml>"
  );
}

function getSign(signParams) {
  // 按 key 值的ascll 排序
  let keys = Object.keys(signParams);
  keys = keys.sort();
  let newArgs = {};
  keys.forEach(function (val, key) {
    if (signParams[val]) {
      newArgs[val] = signParams[val];
    }
  });
  let string = queryString.stringify(newArgs) + "&key=" + secret_key;
  return CryptoJS.MD5(string).toString().toUpperCase();
}

// GET SIGN KEY
function getSign_for_pay(signParams) {
  // 按 key 值的ascll 排序
  let keys = Object.keys(signParams);
  keys = keys.sort();
  let newArgs = {};
  keys.forEach(function (val, key) {
    if (signParams[val]) {
      newArgs[val] = signParams[val];
    }
  });
  let string =
    "appid=wx8b25c6e83f785918" +
    "&noncestr=" +
    String(signParams.nonce_str) +
    "&package=Sign=WXPay" +
    "&partnerid=1568603351" +
    "&prepayid=" +
    signParams.prepayId +
    "&timestamp=" +
    signParams.timeStamp +
    "&key=" +
    secret_key;
  return CryptoJS.MD5(string).toString().toUpperCase();
}

function start_pay({ payParams, then, catchh }) {
  let sign_for_pay = getSign_for_pay(payParams);
  console.log(payParams, "PAYPARAMS LOG");
  WeChat.pay({
    partnerId: payParams.partnerId, //商家向财付通申请的商家ID
    prepayId: payParams.prepayId, //预付款订单ID
    nonceStr: payParams.nonce_str, //随机串
    timeStamp: payParams.timeStamp, //可持续
    package: "Sign=WXPay", //商家根据财付通文档填写的数据和签名
    sign: sign_for_pay, //商家根据微信开放平台文档对数据做的签名
  })
    .then(then, console.log(then, 'then'))
    .catch(catchh, console.log(catchh, 'catchh'));
}

// INITIALIZE PAY
export const start_wechat_pay =
  ({ totalPayment, data, then, catchh }) =>
    () => {
      // 生成统一下单接口参数
      console.log(" D A T A => ", data);
      let UnifiedorderParams = {
        appid: "wx8b25c6e83f785918",
        attach: "position",
        body: "function",
        mch_id: "1568603351",
        nonce_str: createNonceStr(),
        notify_url: "weixin.qq.com", // 微信付款后的回调地址 // Callback address after WeChat payment
        out_trade_no: parseInt(new Date().getTime() / 1000).toString() + Math.floor(Math.random() * (+999999999999 + 1 - +999)),
        spbill_create_ip: "14.23.150.211",
        total_fee: parseInt(Number(totalPayment).toFixed(2) * 100),
        fee_type: "CNY",
        trade_type: "APP",
        sign: "",
      };
      UnifiedorderParams.sign = getSign(UnifiedorderParams);
      // 返回 promise 对象
      // 获取 sign 参数
      const body_xml = getUnifiedorderXmlParams(UnifiedorderParams);

      /*发起支付请求*/
      axiosApi
        .post("http://api.irevu.org/wechat_payment", {
          data: JSON.stringify(body_xml),
          total_fee: totalPayment,
          out_trade_no: UnifiedorderParams.out_trade_no,
          is_wallet: data.is_wallet,
          ...data,
        })
        .then((response) => {
          if (response.data.status == 200) {
            if (data.is_wallet == "1") {
              then({ errCode: 0 });
            } else {
              // var xmldata = response.data.output
              const doc = new DOMParser().parseFromString(response.data.output)
              // parseString(xmldata, function (err, result) {
              //   console.log(result, err);
              let prepay_id = doc.childNodes[30].data // result.xml.prepay_id[0];
              let payParams = {
                appid: "wx8b25c6e83f785918",
                partnerId: "1568603351",
                prepayId: prepay_id.toString(),
                nonce_str: createNonceStr(),
                timeStamp: parseInt(new Date().getTime() / 1000).toString(),
                package: "Sign=WXPay",
                total_fee: Number(totalPayment),
                fee_type: "CNY",
              };
              start_pay({ payParams, then, catchh });
              // });
            }
          } else {
            console.log("ELSE -- END");
          }
        })
        .catch((err) => {
          console.log("ERROR PAY ==>>: ", err);
        });
    };

// TRANSACTION HISTORY SUCCESS
const transationHistorySuccess = (payload) => async (dispatch) => {
  dispatch({ type: GET_USER_TRANSACTION_HISTORY, payload });
};

// PAYMENT STATUS SUCCESS
const paymentStatusSuccess = (payload) => async (dispatch) => {
  dispatch({ type: POST_PAYMENT_STATUS, payload });
};

// TRANSACTION HISTORY
export const transationHistory = () => (dispatch) => {
  axiosApi
    .get("http://api.irevu.org/transationHistory")
    .then((response) => {
      dispatch(transationHistorySuccess(response.data.output));
    })
    .catch((err) => {
      console.log("ERROR: transationHistory => ", err.response);
    });
};

// REFUND
export const refund = (out_trade_no, amount, product_id, id) => (dispatch) => {
  axiosApi
    .post("https://api.irevu.org/payment/refund", {
      id: id,
      out_trade_no: out_trade_no,
      amount: amount,
      product_id: product_id,
      order_type: "Forum",
      body: "Test Forum Refund",
    })
    .then((response) => {
      if (response.status === 200 && response.data.eligible_time == true) {
        axiosApi
          .post("http://api.irevu.org/payment_status", {
            out_trade_no: out_trade_no,
            status: "refund",
          })
          .then((r) => {
            if (r.status === 200) {
              alert("Amount Refunded");
            }
          })
          .catch((err) => {
            console.log("ERROR: payment_status => ", err.response);
          });
      } else {
        alert("Not eligible for refund yet! Try again later!");
      }
    })
    .catch((err) => {
      console.log("ERROR: refund => ", err.response);
    });
};

export const payment_status =
  ({ out_trade_no, status }) =>
    (dispatch) => {
      axiosApi
        .post("http://api.irevu.org/payment_status", {
          //
          out_trade_no: out_trade_no,
          status: status, // 'paid', 'refund' , 'pending'
        })
        .then((response) => {
          dispatch(paymentStatusSuccess(response.data.output));

          console.log(response, "RESPONSE PAYMENT_STATUS");
        })
        .catch((err) => {
          console.log("ERROR: Payment Status => ", err.response);
        });
    };
export const topUp = (total_fee, instance) => (dispatch) => {
  axiosApi
    .post(`http://api.irevu.org/payment_topup`, { total_fee })
    .then((e) => {
      instance.dropDownAlertRef.alertWithType(
        "success",
        "Top-up Successfully done!"
      );
      console.log(e);
    })
    .catch((e) => {
      instance.dropDownAlertRef.alertWithType("error", "Top-up failed!");
      console.log(e);
    });
};
