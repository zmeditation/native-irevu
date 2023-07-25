import RNHTMLtoPDF from "react-native-html-to-pdf";

export const DownloadPdf = async () => {
  try {
    let options = {
      html: "<h1>PDF TEST</h1>",
      fileName: "test",
      directory: "Documents",
    };

    let file = await RNHTMLtoPDF.convert(options);
    console.log("Download File ==>>", file.filePath);
  } catch (error) {
    console.log("Download PDF Error ==>>", error);
  }
};
