import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import Modal from "react-native-modal";
import { color, fonts } from "../../theme";
import { Icons, DocumentViewer } from "../../components";
import ImageModal from "../../components/ImagePreview/ImageModal";
import { onShare } from "../../components/Share";
import { strings } from "../../translations/service";

class EnrollStudentModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      showDocument: false,
      isVisible: false,
      isTransparent: true,
      images: [],
    };
  }

  onQrcodeImgPressHandler = (visibleStatus, imageUri) => {
    this.setState({
      isVisible: visibleStatus,
      images: [{ url: imageUri || "" }],
    });
  };

  render() {
    const { classDetails } = this.props;

    return (
      <View>
        <Modal isVisible={true}>
          <View style={styles.modalMainContainer}>
            <View style={styles.headingContainer}>
              <Text style={styles.modalTitle}>{strings.enroll_student}</Text>
              <TouchableOpacity
                onPress={() => this.props.enrollStudentHandler(false)}
              >
                <Icons.FontAwesome name="close" style={styles.closeIcon} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalInputBoxContainer}>
              <TextInput
                label={strings.student_username_email}
                editable={true}
                onChangeText={(value) => this.setState({ username: value })}
                underlineColor="#a4baf4"
                selectionColor="#a4baf4"
                style={{
                  backgroundColor: "#e9effd",
                  textTransform: "uppercase",
                  fontSize: 14,
                }}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginHorizontal: "5%",
                marginVertical: "4%",
              }}
            >
              <View
                style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: color.mediumGray,
                }}
              />
              <View>
                <Text style={{ width: 50, textAlign: "center" }}>
                  {strings.or_capital}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: color.mediumGray,
                }}
              />
            </View>

            <Text style={[styles.transHeading, styles.shareQrTitle]}>
              {strings.share_qr_code_with_students}
            </Text>

            <View style={styles.shareIconsContainer}>
              <TouchableOpacity
                onPress={() =>
                  onShare(
                    "Share QR Code",
                    classDetails.qr_image,
                    `Enroll in class using scan this Qr Code ${classDetails.qr_image}`
                  )
                }
              >
                <Text>
                  <Icons.FontAwesome name="whatsapp" style={styles.shareIcon} />
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.setState({ showDocument: true })}
              >
                <Text>
                  <Icons.Entypo name="download" style={styles.shareIcon} />{" "}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  this.onQrcodeImgPressHandler(true, classDetails.qr_image)
                }
              >
                <Text>
                  <Icons.FontAwesome name="qrcode" style={styles.shareIcon} />
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() =>
                this.props.enrollStudentSubmitHandler(
                  false,
                  this.state.username
                )
              }
              style={styles.btnEnrollContainer}
            >
              <View style={{ flexDirection: "row" }}>
                <Icons.MaterialIcons name="add" style={styles.addIcon} />
                <Text style={styles.issueRefundTxt}>
                  {strings.enroll_student_capital}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
        {this.state.showDocument && classDetails.qr_image && (
          <DocumentViewer
            documentUrl={classDetails.qr_image || ""}
            onDismiss={() => this.setState({ showDocument: false })}
            isFileSave={true}
          />
        )}

        {this.state.isVisible && (
          <ImageModal
            images={this.state.images}
            isVisible={this.state.isVisible}
            isTransparent={this.state.isTransparent}
            onImagePressHandler={this.onQrcodeImgPressHandler}
          />
        )}
      </View>
    );
  }
}

import { connect } from "react-redux";

const mapStateToProps = (state) => ({
  user: state.auth.user,
  loading: state.classes.students_loading,
  students: state.classes.class_students,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(EnrollStudentModal);

const styles = StyleSheet.create({
  modalMainCon: {
    width: "100%",
    alignSelf: "center",
    backgroundColor: "white",
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
  modalMainContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: color.light,
    borderRadius: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: fonts.medium,
    color: color.dark,
    letterSpacing: 1,
    width: "80%",
    paddingLeft: "20%",
  },

  modalInputBoxContainer: {
    width: "90%",
    marginTop: "2%",
  },
  headingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: "5%",
  },
  closeIcon: {
    fontSize: 20,
    color: color.dark,
    fontFamily: fonts.regular,
  },
  shareQrTitle: {
    color: color.dark,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    fontSize: 12,
    fontFamily: fonts.medium,
  },
  shareIconsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "90%",
    marginVertical: "4%",
  },
  shareIcon: {
    fontSize: 26,
    color: color.primary,
  },
  btnEnrollContainer: {
    backgroundColor: color.primary,
    width: "100%",
    padding: "3%",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  addIcon: {
    fontSize: 18,
    color: color.light,
  },
  issueRefundTxt: {
    fontSize: 14,
    color: color.light,
    letterSpacing: 1,
    fontFamily: fonts.medium,
    textTransform: "uppercase",
    marginLeft: "1%",
  },
});
