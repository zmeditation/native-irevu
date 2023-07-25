import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    Linking,
    View,
} from "react-native";
import QrCodeScanner from "react-native-qrcode-scanner";
import { RNCamera } from "react-native-camera";
import { Icons } from "../";

const ScanQrCode = ({ scannerStatusHandler, scannerHandler }) => {

    const [isFrontCamera, setIsFrontCamera] = useState(false);
    const [isFlashOn, setIsFlashOn] = useState(false)

    const onSuccess = (e) => {
        const check = e.data.substring(0, 4);
        console.log("scanned data" + check);

        if (check === "http") {
            // Linking
            //     .openURL(e.data)
            //     .catch(err => console.error('An error occured', err));
            console.log("get scan response url found ", e.data);
        } else {
            console.log("get scan response", e.data);
        }
    };

    console.log({ isFlashOn })

    return (
        <QrCodeScanner
            reactivate={true}
            showMarker={true}
            onRead={(e) => scannerHandler(e)}
            fadeIn={false}
            containerStyle={styles.scannerContainer}
            cameraProps={{ flashMode: isFlashOn ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off }}
            cameraType={isFrontCamera ? 'front' : 'back'}
            topContent={
                <View
                    style={styles.scannerTopContent}
                >
                    <TouchableOpacity onPress={() => setIsFlashOn(!isFlashOn)}>
                        <Icons.Entypo name="flash" color="white" size={28} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setIsFrontCamera(!isFrontCamera)}>
                        <Icons.MaterialCommunityIcons name="camera-party-mode" color="white" size={28} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => scannerStatusHandler(false)}>
                        <Icons.FontAwesome name="close" color="white" size={28} />
                    </TouchableOpacity>
                </View>
            }
            bottomContent={
                <></>
                // <TouchableOpacity style={styles.buttonTouchable}>
                //     <Text style={styles.buttonText}>OK. Got it!</Text>
                // </TouchableOpacity >
            }
        />
    );
};

const styles = StyleSheet.create({
    scannerContainer: {},
    scannerTopContent: {
        justifyContent: 'space-between',
        paddingTop: 0,
        zIndex: 1,
        width: "90%",
        flexDirection: 'row',

    },
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: "#777",
    },
    textBold: {
        fontWeight: "500",
        color: "#000",
    },
    buttonText: {
        fontSize: 21,
        color: "rgb(0,122,255)",
    },
    buttonTouchable: {
        padding: 16,
    },
});

export default ScanQrCode;
