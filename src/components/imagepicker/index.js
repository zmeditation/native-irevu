import React from 'react';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';



class ImagePicker extends React.Component {

    constructor(props) {
        super(props);

        this.state = {


        }

    }

    chooseImage = () => {
        const options = {
            title: 'Select Profile Pic',
            mediaType: 'photo',
            takePhotoButtonTitle: 'Take a Photo',
            maxWidth: 256,
            maxHeight: 256,
            allowsEditing: true,
            quality: 1,
            noData: true,
        };

        launchImageLibrary(options, response => {
            if (response.didCancel) {
                // User cancelled image picker
            } else if (response.error) {
                console.log("response error", response.error)
                // AlertMessage('', 'error', 'Error', response.error || '');
            } else if (response.customButton) {
                // User tapped custom button
            } else {
                const source = { uri: response.uri };

                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };

                console.log('response', JSON.stringify(response));
                console.log(' response.uri', response.uri);


            }
        });
    };

    render() {

        return (

            this.props.luanchFrom === "gallery" ? this.chooseImage() : ""

        )
    }
}


export default ImagePicker;