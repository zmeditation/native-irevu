import DocumentPicker from "react-native-document-picker";

export const FileUploadPicker = async (pickerType) => {
  try {
    const response = await DocumentPicker.pick({
      type:
        pickerType === "video"
          ? [DocumentPicker.types.video]
          : pickerType === "image"
          ? [DocumentPicker.types.images]
          : [
              DocumentPicker.types.plainText,
              DocumentPicker.types.pdf,
              DocumentPicker.types.doc,
              DocumentPicker.types.docx,
              DocumentPicker.types.ppt,
              DocumentPicker.types.pptx,
              DocumentPicker.types.xls,
              DocumentPicker.types.xlsx,
            ],
    });
    return { status: 200, response };
  } catch (error) {
    console.log(error, "ERROR");
    return { status: 400, response: error };
  }
};
