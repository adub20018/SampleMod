"use client";

import { useState } from "react";
import AudioVisualiser from "./AudioVisualiser";
import styles from "./styles/YoutubeAudioProcessor.module.css";
import Waveform from "./Waveform";

const YoutubeAudioProcessor = () => {
  const [url, setUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState();

  const handleConvert = async (e) => {
    e.preventDefault();

    try {
      // convert from youtube link to mp3
      const response = await fetch(
        `/api/ConvertFromYoutube?url=${encodeURIComponent(url)}`
      );
      if (!response.ok) {
        // error handling if the conversion failed
        throw new Error("Failed to convert to mp3");
      }
      // assign result audio to blob and set to audio
      const blob = await response.blob();
      setAudioUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Error extracting audio", error);
    }
  };

  return (
    <div>
      {!audioUrl && (
        <form className={styles.inputForm}>
          {/* youtube link input */}
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste YouTube Link Here"
            className={styles.input}
          />
          {/*  youtube link submit button */}
          <button className={styles.submitBtn} onClick={handleConvert}>
            Extract Audio
          </button>
        </form>
      )}

      {audioUrl && <Waveform audioFile={audioUrl} />}
    </div>
  );
};

export default YoutubeAudioProcessor;
