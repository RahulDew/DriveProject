import React from "react";

const AudioPlayer = ({ src, type }) => {
  return (
    <audio autoPlay loop controls className="w-4/6">
      <source src={src} type={type ? type : "audio/mp3"} />
    </audio>
  );
};

export default AudioPlayer;
