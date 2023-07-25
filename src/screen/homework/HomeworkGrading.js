import * as React from "react";
import {
    Container,
    Content,
    Header,
    Left,
    Body,
    Title,
    Right,
} from "native-base";
import DropdownAlert from "react-native-dropdownalert";
import {
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { fonts } from "../../theme";
import { Icons } from "../../components";
import MultiFunctionTextEditor from "../../components/MultiFunctionTextEditor";
import Loader from "../../components/Loader";
import AlertModal from "../../components/AlertModal";
import { strings } from '../../translations/service';
import {
    getInitialObject,
    getDefaultStyles,
} from "../../components/community/react-native-cn-richtext-editor";

const defaultStyles = getDefaultStyles();

class HomeworkGrading extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTag: "body",
            isLoading: false,
            selectedStyles: [],
            value: [getInitialObject()],
            isModalOpen: false,
            editorValue: "",
            gradeValue: "",
        };
    }

    header = () => {
        return (
            <Header style={{ backgroundColor: "white" }}>
                <Left>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Icons.Entypo
                            name="chevron-left"
                            color="black"
                            size={30}
                            style={{ marginLeft: 0 }}
                        />
                    </TouchableOpacity>
                </Left>
                <Body style={{ minWidth: "50%", marginLeft: "10%" }}>
                    <Title style={styles.headerTitle}>{strings.grading_homework}</Title>
                </Body>
                <Right style={{ maxWidth: "20%" }}></Right>
            </Header>
        );
    };

    loaderHandler = (status) => {
        this.setState({ isLoading: status });
    };

    onStyleKeyPress = (toolType) => {
        this.editor.applyToolbar(toolType);
    };

    onSelectedTagChanged = (tag) => {
        this.setState({
            selectedTag: tag,
        });
    };

    onSelectedStyleChanged = (styles) => {
        this.setState({
            selectedStyles: styles,
        });
    };

    postSubmission = () => {
        const { homework, clas } = this.props.route.params;
        this.props.postSubmission(this, homework, clas, this.state.value);
    };

    onGradeInputChangeTextHandler = (gradeVal) => {
        this.setState({ gradeValue: gradeVal });
    };

    // getExistingHomeworkDetail = () => {
    //     const { homework, clas } = this.props.route.params;
    //     const savedHomeworkParam = { class_id: clas.id, homework_id: homework.id, submitted: false };

    //     console.log("calll for get exisiting value")
    //     this.props.getSavedHomeworkDetails(savedHomeworkParam);
    // }

    componentDidMount() {
        // this.getExistingHomeworkDetail()

        if (
            this.props.route &&
            this.props.route.params &&
            this.props.route.params.homeworkDetails
        ) {
            this.setState({ editorValue: this.props.route.params.homeworkDetails.homework_details });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.submitedHomework !== this.props.submitedHomework) {
            this.loaderHandler(false);
            this.props.navigation.navigate("ClassDetailView");
        }

        if (
            nextProps.addHomeWorkGradeDetail !== this.props.addHomeWorkGradeDetail
        ) {
            this.loaderHandler(false);
            this.props.navigation.navigate("HomeworkInformation", {
                addedHomeworkGrade: nextProps.addHomeWorkGradeDetail,
            });
        }

        if (nextProps.homeworkError !== this.props.homeworkError) {
            this.loaderHandler(false);
        }
    }

    confirmationHandler = (homeWorkDetails) => {

        if (this.state.gradeValue !== "") {
            this.setState({ editorValue: homeWorkDetails, isModalOpen: true });
        } else {
            this.dropDownAlertRef.alertWithType(
                "info",
                "Info",
                "Plase enter a grade"
            );
        }
    };

    submitHomeWorkGradeHandler = (homeWorkDetails) => {
        this.loaderHandler(true);
        const { homework, clas } = this.props.route.params;
        const studentId = this.props.route.params && this.props.route.params.homeworkDetails && this.props.route.params.homeworkDetails.student_id;
        // console.log({ clas }, { homework }, {});

        const homeworkInfo = {
            class_id: clas.id,
            homework_id: homework.id,
            grade_detail: homeWorkDetails,
            student_id: studentId,
            grade: this.state.gradeValue,
            checked: true,
        };

        this.props.addHomeWorkGrade(this, homeworkInfo);
    };

    modalHandler = (response) => {
        if (response === "yes") {
            this.submitHomeWorkGradeHandler(this.state.editorValue);
        }

        this.setState({ isModalOpen: false });
    };

    render() {
        const { homework, clas } = this.props.route.params;

        const submitBtnText = strings.grade;

        return (
            <>
                <Container style={styles.container}>
                    {this.header()}

                    <Content
                        keyboardDismissMode="interactive"
                        padder
                        contentContainerStyle={{ flex: 1, padding: 5, paddingBottom: 30 }}
                    >
                        {this.state.isLoading && <Loader isLoading={true} />}
                        <MultiFunctionTextEditor
                            editorDefaultValue={this.props.route.params.homeworkDetails && this.props.route.params.homeworkDetails.homework_details}
                            submitBtnText={submitBtnText}
                            submitHomeWorkHandler={this.confirmationHandler}
                            loaderHandler={this.loaderHandler}
                            instance={this}
                            isGrading={true}
                            onChangeTextInputHandler={this.onGradeInputChangeTextHandler}
                            isEditable={true}
                            isDownload={false}
                        />
                    </Content>

                    <AlertModal
                        modalHandler={this.modalHandler}
                        modalVisiblility={this.state.isModalOpen}
                        modalTitle={strings.are_you_sure_you_want_to_submit_grade_alert}
                    />
                    <DropdownAlert ref={(ref) => (this.dropDownAlertRef = ref)} />
                </Container>
            </>
        );
    }
}

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { postSubmission } from "../../redux/actions/questions";
import {
    getSavedHomeworkDetails,
    addHomeWorkGrade,
} from "../../redux/actions/homework";

const mapStateToProps = (state) => ({
    user: state.auth.user,
    submitedHomework: state.homework.submitedHomework,
    savedHomework: state.homework.savedHomework,
    homeworkError: state.homework.homeworkError,
    addHomeWorkGradeDetail: state.homework.addHomeWorkGradeDetail,
});

const mapDispatchToProps = (dispatch) => ({
    postSubmission: bindActionCreators(postSubmission, dispatch),
    getSavedHomeworkDetails: bindActionCreators(
        getSavedHomeworkDetails,
        dispatch
    ),
    addHomeWorkGrade: bindActionCreators(addHomeWorkGrade, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeworkGrading);

const button = {
    container: {
        marginTop: 10,
        backgroundColor: "#467DFF",
        height: 45,
    },
    text: {
        fontSize: 16,
        fontFamily: fonts.bold,
    },
};

const styles = StyleSheet.create({
    footer: { backgroundColor: "transparent", height: 70, width: "100%" },
    footerCard: {
        backgroundColor: "white",
        width: "100%",
        marginTop: 10,
        height: 50,
        paddingTop: 10,
    },
    dividertransparent: {
        width: 100,
        height: 1,
        backgroundColor: "gray",
        alignSelf: "center",
        opacity: 0,
        marginBottom: 10,
    },

    divider: {
        width: 100,
        height: 1,
        backgroundColor: "gray",
        alignSelf: "center",
        opacity: 0.3,
        marginVertical: 15,
    },

    subtitle: {
        opacity: 0.5,
        color: "black",
        alignSelf: "center",
        fontFamily: fonts.regular,
        fontSize: 12,
    },
    headerTitle: {
        color: "black",
        alignSelf: "center",
        fontFamily: fonts.medium,
        fontSize: 20,
    },
    container: {
        backgroundColor: "#F2F6FF",
        // alignItems: "center",
        // paddingHorizontal: "2.5%",
    },
    topcard: {
        width: "100%",
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
        borderRadius: 20,
        marginTop: 20,
        alignSelf: "center",
    },
    profile: { justifyContent: "center", marginLeft: 10 },
    profileName: {
        fontFamily: fonts.regular,
        fontSize: 14,
        top: 5,
    },
    degreeName: {
        fontSize: 14,
        fontFamily: fonts.regular,
        opacity: 0.2,
        bottom: 0,
    },
    gradesTitle: {
        fontSize: 12,
        fontFamily: fonts.regular,
        textAlign: "right",
    },
    grades: {
        opacity: 0.8,
        fontFamily: fonts.regular,
        fontSize: 23,
        color: "#467DFF",
    },
    serviceText: {
        color: "#467DFF",
        fontSize: 14,
        fontFamily: fonts.medium,
    },
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
});
