"use client";

import styles from "./styles/AudioVisualiser.module.css";
import { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";
import {
  BsSkipBackward,
  BsSkipForward,
  BsFillStopFill,
  BsFillPlayFill,
} from "react-icons/bs";

export default function AudioVisualiser({ audioFile }) {
  const waveformRef = useRef(null);
  let wavesurfer;

  // create the visual waveform
  useEffect(() => {
    wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#ffffffad",
      progressColor: "#865CAC",
      url: audioFile,
      dragToSeek: true,
      width: "70vw",
      height: 100,
      hideScrollbar: true,
      normalize: true,
      dragToSeek: true,
      // barHeight: 20,
      // barRadius: 20,
      barWidth: 2,
    });

    return () => {
      wavesurfer.destroy();
    };
  }, []);

  // stop audio button
  const handleStop = () => {
    if (wavesurfer) {
      wavesurfer.stop();
    }
  };

  // toggle play/pause button
  const handlePlayPause = () => {
    if (wavesurfer) {
      wavesurfer.playPause();
    }
  };

  // skip forward 10 seconds
  const handleSkipForward = () => {
    if (wavesurfer) {
      wavesurfer.skip(10);
    }
  };

  // skip back 10 seconds
  const handleSkipBack = () => {
    if (wavesurfer) {
      wavesurfer.skip(-10);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.subContainer}>
        <div ref={waveformRef} className={styles.wavesurfer} />

        <div className={styles.wavesurferControls}>
          <button className={styles.childControl} onClick={handleSkipBack}>
            <BsSkipBackward /> {/* skip audio back icon */}
          </button>
          <button className={styles.childControl} onClick={handlePlayPause}>
            <BsFillPlayFill />
          </button>
          <button className={styles.childControl} onClick={handleStop}>
            <BsFillStopFill /> {/* stop audio icon */}
          </button>
          <button className={styles.childControl} onClick={handleSkipForward}>
            <BsSkipForward /> {/* Skip audio forward icon */}
          </button>
        </div>
      </div>
    </div>
  );
}
