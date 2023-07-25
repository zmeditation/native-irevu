import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import FastImage from "react-native-fast-image";
import ImageModal from "./ImageModal";

const ImagePreview = ({ imageStyle, imageUri }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isTransparent, setIsTransperent] = useState(true);
    const [images, setImages] = useState([]);

    const onImagePressHandler = (visibleStatus) => {
        setIsVisible(visibleStatus);
        setImages([{ url: imageUri || "" }]);
    };

    return (
        <>
            <TouchableOpacity onPress={() => onImagePressHandler(true)}>
                <FastImage
                    style={imageStyle}
                    source={{
                        uri: imageUri || "",
                        priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                />
            </TouchableOpacity>

            {isVisible && (
                <ImageModal
                    images={images}
                    isVisible={isVisible}
                    isTransparent={isTransparent}
                    onImagePressHandler={onImagePressHandler}
                />
            )}
        </>
    );
};

export default ImagePreview;
