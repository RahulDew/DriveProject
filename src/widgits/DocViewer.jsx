import React from "react";

const DocViewer = ({ src, type }) => {
  return (
    <embed
      src={src}
      type={type ? type : "application/pdf"}
      frameBorder="0"
      scrolling="auto"
      className="w-full h-full rounded-xl"
      // toolbar={false}
    ></embed>
  );
};

export default DocViewer;
