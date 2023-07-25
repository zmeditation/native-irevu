import React, { useState, useEffect } from "react";
import { Modal, TouchableOpacity } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import { Icons } from "../../components";

const ImageModal = ({
    isVisible,
    images,
    isTransparent,
    onImagePressHandler,
}) => {
    return (
        <Modal
            visible={isVisible || false}
            transparent={isTransparent || true}
            onRequestClose={() => onImagePressHandler(false)}
            enableSwipeDown={true}
        >
            <ImageViewer
                imageUrls={images}
                renderHeader={() => (
                    <TouchableOpacity
                        onPress={() => onImagePressHandler(false)}
                        style={{ alignItem: "right", backgroundColor: "#FFA800" }}
                    >
                        <Icons.EvilIcons
                            right
                            name="close"
                            size={24}
                            style={{
                                color: "white",
                                textAlign: "right",
                                paddingTop: 10,
                                paddingRight: 10,
                                backgroundColor: "#000",
                            }}
                        />
                    </TouchableOpacity>
                )}
                renderIndicator={() => <></>}
            />
        </Modal>
    );
};

export default ImageModal;
