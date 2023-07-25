import React from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Progress from "react-native-progress";
import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";
import { color, fonts } from "../../theme";
class DocumentViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
    };
  }

  getFilename = (url) => {
    return url.split("/").pop();
  };

  componentDidMount() {
    const { documentUrl, isFileSave } = this.props;
    const fileSave = isFileSave || false;
    const url = documentUrl || "";
    const fileName = this.getFilename(url);
    const localFile = `${RNFS.DocumentDirectoryPath}/${fileName}`;
    const options = {
      fromUrl: url,
      toFile: localFile,
      background: true,
      discretionary: true,
      cacheable: true,
      begin: (res) => {
        console.log(res);
      },
      progress: (res) => {
        let progressPercent = (res.bytesWritten / res.contentLength) * 100; // to calculate in percentage
        this.setState({ progress: progressPercent / 100 });
      },
    };
    
    RNFS.downloadFile(options)
      .promise.then((res) => {
        FileViewer.open(localFile, {
          displayName: fileName,
          showAppsSuggestions: true,
          showOpenWithDialog: true,
          onDismiss: () =>
            !fileSave
              ? RNFS.unlink(localFile).then(() => {
                  console.log("file deleted successfully");
                  this.props.onDismiss();
                })
              : this.props.onDismiss(),
        });
      })
      .then(() => this.props.onDismiss())
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.progressLable}>
          {parseInt(this.state.progress * 100)} %
        </Text>
        <Progress.Bar
          progress={this.state.progress}
          width={200}
          color={color.primary}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    height: "100%",
    width: "100%",
    backgroundColor: color.light,
  },
  progressLable: {
    color: color.primary,
    fontFamily: fonts.semibold,
    fontSize: 20,
    letterSpacing: 1,
    marginBottom: 20,
  },
});

export default DocumentViewer;
