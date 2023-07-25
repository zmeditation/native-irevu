import React from "react";
import HTML, { IGNORED_TAGS } from "react-native-render-html";
import { color } from '../../theme';
import {
    ScrollView,
} from "react-native";

const RenderHtml = ({ content }) => {

    return (
        <>
            <ScrollView nestedScrollEnabled>
                <HTML
                    source={{ html: content || '' }}
                    containerStyle={{ color: color.dark }}
                    tagsStyles={{ i: { color: color.dark }, div: { color: color.dark, height: 20 }, img: { height: 10, width: 10 }, p: { height: 20, width: 20 } }}
                    ignoredTags={[...IGNORED_TAGS, 'img', 'video', 'head', 'script']}
                />
            </ScrollView>
        </>
    )
}


export default RenderHtml;