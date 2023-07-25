import * as React from "react";
import { Container, Content, Text } from "native-base";
import { StyleSheet, useWindowDimensions } from "react-native";
import { color } from "../../theme";
import { strings } from '../../translations/service';
import WebView from "react-native-webview";

class Policy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { hour, username } = this.state;
    const { user } = this.props;
    return (
      <Container style={styles.container}>
        {strings._language == 'English' ?
          <WebView
            originWhitelist={['*']}
            source={{ uri: 'https://irevu.org/privacy-policy' }}
          />
          :
          <WebView
            originWhitelist={['*']}
            source={{ uri: 'https://irevu.org/privacy-policy#' }}
          />
        }
      </Container>
    );
  }
}

import { connect } from "react-redux";

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Policy);

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.lightbg,
  },
});
