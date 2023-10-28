import React from "react";

const VideoPlayer = ({ src, type }) => {
  return (
    <video autoPlay muted loop controls className="h-full w-full">
      <source src={src} type={type ? type : "video/mp4"} />
    </video>
  );
};

export default VideoPlayer;
