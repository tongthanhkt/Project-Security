import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { completeLesson } from "../../utils/courseHelper";
import "./styles/styles.css";
import { usePlayer } from "../../contexts/playerContext";

const SEEK_TIME = 10;
export default function Player({
  // playerRef = null,
  playing = true,
  url,
  setCurrenTime = () => {},
  handleCompleteLesson = () => {},
  isDone = false,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const lessonId = searchParams.get("lessonId");
  const prevSeekTimeRef = useRef(0);
  const { playerRef } = usePlayer();
  const handleSeek = (time) => {
    const prevSeekTime = prevSeekTimeRef.current;
    console.log("distance", Math.abs(prevSeekTime - time));
    if (
      Math.abs(prevSeekTime - time) > 1 &&
      Math.abs(prevSeekTime - time) < 2
    ) {
      if (time > prevSeekTime) {
        console.log(
          "🚀 ~ file: Player.jsx:27 ~ handleSeek ~ prevSeekTime:",
          prevSeekTime
        );
        const newTime = playerRef.current.getCurrentTime() + SEEK_TIME;
        console.log(
          "🚀 ~ file: Player.jsx:29 ~ handleSeek ~ newTime:",
          newTime
        );
        if (newTime !== prevSeekTime) {
          playerRef.current.seekTo(newTime);
          prevSeekTimeRef.current = newTime;
        }
      } else if (time < prevSeekTime) {
        const newTime = playerRef.current.getCurrentTime() - SEEK_TIME;
        if (newTime !== prevSeekTime) {
          playerRef.current.seekTo(newTime);
          prevSeekTimeRef.current = newTime;
        }
      }
    } else return;
  };
  const handleNext = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10);
  };

  const handlePrevious = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10);
  };

  const CustomControls = ({ player }) => (
    <div className="custom-controls">
      <button onClick={handlePrevious}>Previous 10s</button>
      <button onClick={handleNext}>Next 10s</button>
      <div className="react-player__controls">
        {React.cloneElement(player, {
          config: {
            ...player.props.config,
            youtube: { playerVars: { modestbranding: 1 } },
          },
        })}
      </div>
    </div>
  );

  const handleDuration = async () => {
    setCurrenTime(playerRef.current.getCurrentTime());
    // console.log("isDone", isDone);
    prevSeekTimeRef.current = playerRef.current.getCurrentTime();
    if (
      playerRef.current.getCurrentTime() / playerRef.current.getDuration() >
        0.8 &&
      isDone === false
    ) {
      handleCompleteLesson(lessonId);
    }
  };
  if (url.indexOf("youtube.com") !== -1) {
    return (
      <div className="wrapper-video" data-width="wide">
        <ReactPlayer
          ref={playerRef}
          playing={playing}
          url={url}
          onProgress={handleDuration}
          onSeek={handleSeek}
          width="100%"
          height="100%"
          controls={true}
          config={{
            youtube: {
              playerVars: {
                modestbranding: 1,
              },
            },
          }}
        />
      </div>
    );
  } else {
    return (
      <div className="wrapper-video" data-width="wide">
        {url ? (
          <ReactPlayer
            ref={playerRef}
            playing={playing}
            url={url}
            onProgress={handleDuration}
            onSeek={handleSeek}
            width="100%"
            height="100%"
            controls={true}
            config={{
              youtube: {
                playerVars: {
                  showinfo: 0,
                  modestbranding: 1,
                },
              },
            }}
          />
        ) : (
          <div className="w-full h-[500px]  bg-gray-900 flex flex-col items-center justify-center text-white gap-2">
            <img
              src="/images/none_video.png"
              alt="no video"
              className="text-white w-24"
            />
            <div className="text-xl">Chưa có video bài giảng</div>
          </div>
        )}
      </div>
    );
  }
}
