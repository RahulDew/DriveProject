import FileSaver from "file-saver";

const downloadFile = async (fileUrl, fileName) => {
  // console.log("fileUrl: ", fileUrl);
  // console.log("fileName: ", fileName);
  const fileResponse = await fetch(fileUrl);
  const file = await fileResponse.blob();
  FileSaver.saveAs(file, fileName);
};

const pageTitle = (titleName) => {
  document.title = titleName;
};

export { downloadFile, pageTitle };
