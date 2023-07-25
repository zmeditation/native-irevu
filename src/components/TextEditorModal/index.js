import React from "react";
import {
    Appearance,
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Modal from "react-native-modal";
import {
    actions,
    RichEditor,
    RichToolbar} from "react-native-pell-rich-editor";
import { color, fonts } from "../../theme";


class TextEditorModal extends React.Component {
    richText = React.createRef();
    linkModal = React.createRef();

    constructor(props) {
        super(props);
        // const this = this;
        const theme = props.theme || Appearance.getColorScheme();
        const contentStyle = this.createContentStyle(theme);
        this.richHTML = '';
        this.state = { theme: theme, contentStyle, emojiVisible: false, disabled: false };
        this.editorFocus = false;
        this.onHome = this.onHome;
        this.save = this.save;
        this.onTheme = this.onTheme;
        this.onPressAddImage = this.onPressAddImage;
        this.onInsertLink = this.onInsertLink;
        this.onLinkDone = this.onLinkDone;

        this.handleChange = this.handleChange;
        this.handleHeightChange = this.handleHeightChange;
        this.insertEmoji = this.insertEmoji;
        this.insertHTML = this.insertHTML;
        // this.insertVideo = this.insertVideo;
        this.handleEmoji = this.handleEmoji;
        this.onDisabled = this.onDisabled;
        this.editorInitializedCallback = this.editorInitializedCallback;
    }

    componentDidMount() {
        // Appearance.addChangeListener(this.themeChange);
        Keyboard.addListener('keyboardDidShow', this.onKeyShow);
        Keyboard.addListener('keyboardDidHide', this.onKeyHide);
    }

    componentWillUnmount() {
        // Appearance.removeChangeListener(this.themeChange);
        Keyboard.removeListener('keyboardDidShow', this.onKeyShow);
        Keyboard.removeListener('keyboardDidHide', this.onKeyHide);
    }

    onKeyHide = () => { };

    onKeyShow = () => {
        // TextInput.State.currentlyFocusedInput() && this.setState({ emojiVisible: false });
    };

    editorInitializedCallback() {
        this.richText.current?.registerToolbar(function (items) {
            // console.log('Toolbar click, selected items (insert end callback):', items);
        });
    }

    /**
     * theme change to editor color
     * @param colorScheme
     */
    // themeChange({ colorScheme }) {
    //     const theme = colorScheme;
    //     const contentStyle = this.createContentStyle(theme);
    //     this.setState({ theme, contentStyle });
    // }

    async save() {
        // Get the data here and call the interface to save the data
        let html = await this.richText.current?.getContentHtml();
        console.log(html);
        // this.props.navigation.push('preview', { html, css: getContentCSS() });
    }

    /**
     * editor change data
     * @param {string} html
     */
    handleChange(html) {
        this.richHTML = html;
    }

    /**
     * editor height change
     * @param {number} height
     */
    handleHeightChange(height) {
        console.log('editor height change:', height);
    }

    insertEmoji(emoji) {
        // this.richText.current?.insertText(emoji);
        // this.richText.current?.blurContentEditor();
    }

    handleEmoji() {
        // const { emojiVisible } = this.state;
        // Keyboard.dismiss();
        // this.richText.current?.blurContentEditor();
        // this.setState({ emojiVisible: !emojiVisible });
    }

    // insertVideo() {
    //     this.richText.current?.insertVideo(
    //         'https://mdn.github.io/learning-area/html/multimedia-and-embedding/video-and-audio-content/rabbit320.mp4',
    //         'width: 50%;',
    //     );
    // }

    insertHTML() {
        this.richText.current?.insertHTML(
            `<span onclick="alert(2)" style="color: blue; padding:0 10px;" contenteditable="false">HTML</span>`,
        );
    }

    onPressAddImage() {
        // insert URL
        this.richText.current?.insertImage(
            'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/100px-React-icon.svg.png',
            'background: gray;',
        );
        // insert base64
        // this.richText.current?.insertImage(`data:${image.mime};base64,${image.data}`);
    }

    onInsertLink() {
        // this.richText.current?.insertLink('Google', 'http://google.com');
        this.linkModal.current?.setModalVisible(true);
    }

    onLinkDone({ title, url }) {
        this.richText.current?.insertLink(title, url);
    }

    onHome() {
        this.props.navigation.push('index');
    }

    createContentStyle(theme) {
        // Can be selected for more situations (cssText or contentCSSText).
        const contentStyle = {
            backgroundColor: '#2e3847',
            color: '#fff',
            placeholderColor: 'gray',
            // cssText: '#editor {background-color: #f3f3f3}', // initial valid
            contentCSSText: 'font-size: 16px; min-height: 200px; height: 100%;', // initial valid
        };
        if (theme === 'light') {
            contentStyle.backgroundColor = '#fff';
            contentStyle.color = '#000033';
            contentStyle.placeholderColor = '#a9a9a9';
        }
        return contentStyle;
    }

    onTheme() {
        let { theme } = this.state;
        theme = theme === 'light' ? 'dark' : 'light';
        let contentStyle = this.createContentStyle(theme);
        this.setState({ theme, contentStyle });
    }

    onDisabled() {
        this.setState({ disabled: !this.state.disabled });
    }

    handlePaste = data => {
        console.log('Paste:', data);
    };

    handleKeyUp = data => {
        // console.log('KeyUp:', data);
    };

    handleKeyDown = data => {
        // console.log('KeyDown:', data);
    };

    handleMessage = ({ type, id, data }) => {
        let index = 0;
        switch (type) {
            case 'ImgClick':
                index = this.i_tempIndex || 1;
                this.i_tempIndex = index + 1 >= imageList.length ? 0 : index + 1;
                this.richText.current?.commandDOM(`$('#${id}').src="${imageList[index]}"`);
                break;
            case 'TitleClick':
                index = this._tempIndex || 0;
                const color = ['red', 'blue', 'gray', 'yellow', 'coral'][index];
                this._tempIndex = index + 1 >= color.length ? 0 : index + 1;

                // command: $ = document.querySelector
                this.richText.current?.commandDOM(`$('#${id}').style.color='${color}'`);
                break;
            case 'SwitchImage':
                break;
        }
        console.log('onMessage', type, id, data);
    };

    handleFocus = () => {
        this.editorFocus = true;
    };

    handleBlur = () => {
        this.editorFocus = false;
    };

    render() {
        const { contentStyle, theme, emojiVisible, disabled } = this.state;
        const { backgroundColor, color, placeholderColor } = contentStyle;
        const dark = theme === 'dark';
        return (
            <Modal isVisible={this.props.modalVisiblility}>
                <View style={styles.modalMainCon}>
                    <View style={styles.modalHeader}>
                        <View />
                        <Text style={styles.modalHeaderTitle}>Description</Text>
                        {/* <TouchableOpacity onPress={() => this.props.modalHandler()}>
                            <Icons.FontAwesome5 name="times" size={30} />
                        </TouchableOpacity> */}
                    </View>

                    <View>
                        <ScrollView>
                            <RichEditor
                                // initialFocus={true}
                                // disabled={disabled}
                                editorStyle={contentStyle} // default light style
                                ref={this.richText}
                                style={styles.rich}
                                placeholder={'please input content'}
                                initialContentHTML=''
                                editorInitializedCallback={this.editorInitializedCallback}
                                onChange={this.handleChange}
                                onHeightChange={this.handleHeightChange}
                                onPaste={this.handlePaste}
                                onKeyUp={this.handleKeyUp}
                                onKeyDown={this.handleKeyDown}
                                onMessage={this.handleMessage}
                                onFocus={this.handleFocus}
                                onBlur={this.handleBlur}
                                pasteAsPlainText={true}
                            />
                        </ScrollView>

                        <RichToolbar
                            style={[styles.richBar,]}
                            flatContainerStyle={styles.flatStyle}
                            editor={this.richText}
                            // disabled={disabled}
                            // iconTint={color}
                            selectedIconTint={'#2095F2'}
                            disabledIconTint={'#bfbfbf'}
                            onPressAddImage={this.onPressAddImage}
                            onInsertLink={this.onInsertLink}
                            // iconSize={24}
                            // iconGap={10}
                            actions={[
                                actions.undo,
                                actions.redo,
                                // actions.insertVideo,
                                actions.insertImage,
                                actions.setStrikethrough,
                                actions.checkboxList,
                                actions.insertOrderedList,
                                actions.blockquote,
                                actions.alignLeft,
                                actions.alignCenter,
                                actions.alignRight,
                                actions.code,
                                actions.line,
                                actions.heading1,
                                actions.heading4,
                                // 'insertEmoji',
                                // 'insertHTML',
                            ]} // default defaultActions
                            iconMap={{
                                // insertEmoji: phizIcon,
                                [actions.heading1]: ({ tintColor }) => (
                                    <Text style={[styles.tib, { color: tintColor }]}>H1</Text>
                                ),
                                [actions.heading4]: ({ tintColor }) => (
                                    <Text style={[styles.tib, { color: tintColor }]}>H3</Text>
                                ),
                                // insertHTML: htmlIcon,
                            }}
                            // insertEmoji={this.handleEmoji}
                            // insertHTML={this.insertHTML}
                            // insertVideo={this.insertVideo}
                        />

                    </View>


                    <TouchableOpacity onPress={() => this.props.editorHandler(false)}><Text>Close</Text></TouchableOpacity>
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
        flex: 1
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 20,
        paddingBottom: 10,
        paddingHorizontal: '20%'

    },
    modalHeaderTitle: { fontSize: 20, fontFamily: fonts.medium, textAlign: 'center', color: color.dark },
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
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        marginLeft: '5%',
        padding: 10,
        borderRadius: 5,
        marginBottom: '3%'
    },
    btnText: {
        fontSize: 14,
        color: color.primary,
        fontFamily: fonts.medium,
        textTransform: 'uppercase'
    },
    container: {
        flex: 1,
        backgroundColor: '#efefef',
    },
    nav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 5,
    },
    rich: {
        minHeight: 300,
        flex: 1,
    },
    topVi: {
        backgroundColor: '#fafafa',
    },
    richBar: {
        borderColor: '#efefef',
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    richBarDark: {
        backgroundColor: '#191d20',
        borderColor: '#696969',
    },
    scroll: {
        backgroundColor: '#ffffff',
    },
    scrollDark: {
        backgroundColor: '#2e3847',
    },
    darkBack: {
        backgroundColor: '#191d20',
    },
    item: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#e8e8e8',
        flexDirection: 'row',
        height: 40,
        alignItems: 'center',
        paddingHorizontal: 15,
    },

    input: {
        flex: 1,
    },

    tib: {
        textAlign: 'center',
        color: '#515156',
    },

    flatStyle: {
        paddingHorizontal: 12,
    },
});

export default TextEditorModal;
