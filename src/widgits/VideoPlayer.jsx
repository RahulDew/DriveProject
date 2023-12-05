import React from "react";

const VideoPlayer = ({ src, type }) => {
  return (
    <video autoPlay muted loop controls className="h-full w-full">
      {type === "video/mp4" ? (
        <source src={src} type={type === "video/mp4" ? "video/mp4" : false} />
      ) : (
        <source src={src} />
      )}
    </video>
  );
};

export default VideoPlayer;
