import { Share } from "react-native";

export const onShare = async (title, url, message) => {
    console.log({ title }, { url }, { message });
    try {
        const result = await Share.share({
            title: title || "",
            url: url || "",
            message: message || "",
        });
        if (result.action === Share.sharedAction) {
            if (result.activityType) {
                // shared with activity type of result.activityType
            } else {
                // shared
            }
        } else if (result.action === Share.dismissedAction) {
            // dismissed
        }
    } catch (error) {
        console.log("share error", error);

    }
};
