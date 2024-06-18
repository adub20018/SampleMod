"use client";

import { useState } from "react";
import styles from "./styles/YoutubeAudioProcessor.module.css";
// import Waveform from "./Waveform";
import dynamic from "next/dynamic";
import LoadingScreen from "./components/LoadingScreen";

const Waveform = dynamic(() => import("./Waveform"), {
  ssr: false,
});

const YoutubeAudioProcessor = () => {
  const [url, setUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState();
  const [loading, setLoading] = useState(false); // sets state for when user has submitted url

  const handleConvert = async (e) => {
    e.preventDefault();
    setLoading(true); // set loading true, to display loading modal

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
    } finally {
      setLoading(false); // remove loading screen once loading is done
    }
  };

  return (
    <div>
      {!audioUrl && !loading && (
        <div className={styles.formContainer}>
          <label className={styles.inputInstructions}>Paste YouTube Link</label>
          <form className={styles.inputForm}>
            {/* youtube link input */}
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Example: https://www.youtube.com/watch?v=qLrnkK2YEcE"
              className={styles.input}
            />
            {/*  youtube link submit button */}
            <button className={styles.submitBtn} onClick={handleConvert}>
              Submit
            </button>
          </form>
          <div className={styles.introductionContainer}>
            <h2 className={styles.introduction}>
              Youtube Audio Sample Modifier
            </h2>
            <div className={styles.instructionContainer}>
              <ol className={styles.instructionList}>
                <li className={styles.instruction}>
                  Find a Youtube song you want to modify
                </li>
                <li className={styles.instruction}>Copy Youtube video URL</li>
                <li className={styles.instruction}>
                  Paste URL in the above input field.
                </li>
                <li className={styles.instruction}>Click Submit and wait!</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {
        // display loading screen after submission
        loading && <LoadingScreen />
      }

      {
        // display waveform if audio conversion was successful
        audioUrl && <Waveform audioFile={audioUrl} />
      }
    </div>
  );
};

export default YoutubeAudioProcessor;
