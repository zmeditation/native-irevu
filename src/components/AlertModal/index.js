import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { color, fonts } from "../../theme";
import { strings } from "../../translations/service";

class AlertModal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal isVisible={this.props.modalVisiblility}>
        <View style={styles.modalMainCon}>
          <View style={styles.modalHeader}>
            <View />
            <Text style={styles.modalHeaderTitle}>
              {this.props.modalTitle ||
                strings.are_you_sure_you_want_to_delete_this}
            </Text>
          </View>
          <View style={{ width: "100%", marginBottom: "3%" }}>
            <TouchableOpacity
              style={styles.btnContainer}
              onPress={() => this.props.modalHandler("yes")}
            >
              <Text style={styles.btnText}>{strings.yes_capital}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnContainer}
              onPress={() => this.props.modalHandler("no")}
            >
              <Text style={styles.btnText}>{strings.no_capital}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalMainCon: {
    width: "100%",
    alignSelf: "center",
    backgroundColor: color.light,
    borderRadius: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: "20%",
  },
  modalHeaderTitle: {
    fontSize: 20,
    fontFamily: fonts.medium,
    textAlign: "center",
    color: color.dark,
  },
  bodyRows: {
    backgroundColor: "#dce7ff",
    width: "100%",
    flexDirection: "row",
    padding: 20,
    justifyContent: "space-between",
  },
  btnContainer: {
    borderWidth: 1,
    borderColor: color.primary,
    backgroundColor: color.light,
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    marginLeft: "5%",
    padding: 10,
    borderRadius: 5,
    marginBottom: "3%",
  },
  btnText: {
    fontSize: 14,
    color: color.primary,
    fontFamily: fonts.medium,
    textTransform: "uppercase",
  },
});

export default AlertModal;
