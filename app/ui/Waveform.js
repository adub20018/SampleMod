import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";

import { WaveSurfer, WaveForm, Region, Marker } from "wavesurfer-react";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min";
import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min";
import MarkersPlugin from "wavesurfer.js/src/plugin/markers";
import styles from "./styles/Waveform.module.css";
import {
  BsFillSkipBackwardFill,
  BsFillSkipForwardFill,
  BsFillPlayFill,
  BsFillPauseFill,
  BsArrowLeft,
} from "react-icons/bs";
// import { generateNum, generateTwoNumsWithDistance } from "../lib/generateNums"; // route to lib function

// helper function for generate nums
function generateNum(min, max) {
  return Math.random() * (max - min + 1) + min;
}

// get numbers for region/marker generation
function generateTwoNumsWithDistance(distance, min, max) {
  const num1 = generateNum(min, max);
  const num2 = generateNum(min, max);
  if (num2 - num1 >= 10) {
    return [num1, num2];
  }
  return generateTwoNumsWithDistance(distance, min, max);
}

export default function Waveform({ audioFile }) {
  const [timelineVis, setTimelineVis] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false); // keeps track of playing state for button display
  const [markers, setMarkers] = useState([
    // { // ----- Dummy Marker Initial States -----
    //   time: 5.5,
    //   label: "V1",
    //   color: "#ff990a",
    //   draggable: true,
    // },
    // {
    //   time: 10,
    //   label: "V2",
    //   color: "#00ffcc",
    //   position: "top",
    // },
  ]);
  const [regions, setRegions] = useState([
    // ------- Dummy Region Initial States --------
    // {
    //   id: "region-1",
    //   start: 0.5,
    //   end: 10,
    //   color: "rgba(0, 0, 0, .5)",
    //   data: {
    //     systemRegionId: 31,
    //   },
    // },
    // {
    //   id: "region-2",
    //   start: 5,
    //   end: 25,
    //   color: "rgba(225, 195, 100, .5)",
    //   data: {
    //     systemRegionId: 32,
    //   },
    // },
    // {
    //   id: "region-3",
    //   start: 15,
    //   end: 35,
    //   color: "rgba(25, 95, 195, .5)",
    //   data: {
    //     systemRegionId: 33,
    //   },
    // },
  ]);
  const [currentRegion, setCurrentRegion] = useState(null);

  const wavesurferRef = useRef();

  // memorise plugins (to avoid re-rendering)
  const plugins = useMemo(() => {
    return [
      {
        plugin: RegionsPlugin,
        options: { dragSelection: true }, // enable drag selection for region
      },
      timelineVis && {
        plugin: TimelinePlugin,
        options: {
          container: "#timeline", // container for timeline
        },
      },
      {
        plugin: MarkersPlugin,
        options: {
          markers: [{ draggable: true }], // enable draggable markers
        },
      },
    ].filter(Boolean); // remove falsy values from array
  }, [timelineVis]);

  // toggle visibility of timeline
  const toggleTimeline = useCallback(() => {
    setTimelineVis(!timelineVis);
  }, [timelineVis]);

  // use regions ref always have latest regions
  const regionsRef = useRef(regions);
  useEffect(() => {
    regionsRef.current = regions;
  }, [regions]);

  // enable play/pause audio on space bar press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        e.preventDefault(); // prevent default spacebar action (scrolling)
        playPause();
      }
    };
    // REPLACED BY BELOW CODE IN ATTEMPT TO FIX BUILD ERRORS:
    // window.addEventListener("keydown", handleKeyDown);
    // return () => {
    //   window.removeEventListener("keydown", handleKeyDown);
    // };
    // Only add event listener on the client side
    if (typeof window !== "undefined") {
      window.addEventListener("keydown", handleKeyDown);

      // Cleanup event listener on unmount
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isPlaying]);

  // region creation code
  const regionCreatedHandler = useCallback(
    (region) => {
      console.log("region-created --> region:", region);

      // ignore regions with a systemRegionId
      if (region.data.systemRegionId) return;

      setCurrentRegion(region);

      // update regions state
      setRegions([
        ...regionsRef.current,
        { ...region, data: { ...region.data, systemRegionId: -1 } },
      ]);
    },
    [regionsRef]
  );

  // Manually handle loop
  useEffect(() => {
    const handleLoop = () => {
      if (currentRegion) {
        const { start, end } = currentRegion;

        const currentTime = wavesurferRef.current.getCurrentTime();

        if (currentTime >= end) {
          wavesurferRef.current.play(start);
        }
      }
    };

    if (wavesurferRef.current) {
      wavesurferRef.current.on("audioprocess", handleLoop);

      return () => {
        wavesurferRef.current.un("audioprocess", handleLoop);
      };
    }
  }, [currentRegion]);

  const handleWSMount = useCallback(
    (waveSurfer) => {
      if (waveSurfer.markers) {
        waveSurfer.clearMarkers();
      }

      wavesurferRef.current = waveSurfer;

      if (wavesurferRef.current) {
        wavesurferRef.current.load(audioFile); // load audio file

        // region event listeners
        wavesurferRef.current.on("region-created", regionCreatedHandler);

        wavesurferRef.current.on("ready", () => {
          console.log("WaveSurfer is ready");
        });

        wavesurferRef.current.on("region-removed", (region) => {
          console.log("region-removed --> ", region);
        });

        wavesurferRef.current.on("loading", (data) => {
          console.log("loading --> ", data);
        });

        // click/drag region creation/update event to ensure playback is localised to region
        wavesurferRef.current.on("region-update-end", (region) => {
          console.log("region-update-end --> region:", region);
          wavesurferRef.current.play(region.start);
        });

        // update isPlaying state on play and pause events
        wavesurferRef.current.on("play", () => {
          setIsPlaying(true);
        });
        wavesurferRef.current.on("pause", () => {
          setIsPlaying(false);
        });

        // if (window) {
        //   window.surferidze = wavesurferRef.current;
        // }
        // only run this code on the client side
        if (typeof window !== "undefined") {
          window.surferidze = wavesurferRef.current;
        }
      }
    },
    [regionCreatedHandler, audioFile]
  );

  // generate random region
  const generateRegion = useCallback(() => {
    if (!wavesurferRef.current) return;
    const minTimestampInSeconds = 0;
    const maxTimestampInSeconds = wavesurferRef.current.getDuration();
    const distance = generateNum(0, 10);
    const [min, max] = generateTwoNumsWithDistance(
      distance,
      minTimestampInSeconds,
      maxTimestampInSeconds
    );

    const r = generateNum(0, 255);
    const g = generateNum(0, 255);
    const b = generateNum(0, 255);

    setRegions([
      ...regions,
      {
        id: `custom-${generateNum(0, 9999)}`,
        start: min,
        end: max,
        color: `rgba(${r}, ${g}, ${b}, 0.5)`,
      },
    ]);
  }, [regions]);

  // generate random marker
  const generateMarker = useCallback(() => {
    if (!wavesurferRef.current) return;
    const minTimestampInSeconds = 0;
    const maxTimestampInSeconds = wavesurferRef.current.getDuration();
    const distance = generateNum(0, 10);
    const [min] = generateTwoNumsWithDistance(
      distance,
      minTimestampInSeconds,
      maxTimestampInSeconds
    );

    const r = generateNum(0, 255);
    const g = generateNum(0, 255);
    const b = generateNum(0, 255);

    setMarkers([
      ...markers,
      {
        label: `custom-${generateNum(0, 9999)}`,
        time: min,
        color: `rgba(${r}, ${g}, ${b}, 0.5)`,
      },
    ]);
  }, [markers]);

  // remove the last created region
  const removeLastRegion = useCallback(() => {
    let nextRegions = [...regions];
    nextRegions.pop();
    setRegions(nextRegions);
  }, [regions]);

  // remove the last created marker
  const removeLastMarker = useCallback(() => {
    let nextMarkers = [...markers];
    nextMarkers.pop();
    setMarkers(nextMarkers);
  }, [markers]);

  // skip forward 10 seconds
  const skipBack = useCallback(() => {
    wavesurferRef.current.skip(-10);
  });

  // toggle play/pause button
  const playPause = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
    }
  };

  // skip forward 10 seconds
  const skipForward = useCallback(() => {
    wavesurferRef.current.skip(10);
  });

  // update region
  const handleRegionUpdate = useCallback((region, smth) => {
    console.log("region-update-end --> region:", region);
    console.log(smth);
  }, []);

  // toggle zoom
  const setZoom50 = () => {
    const currentZoom = wavesurferRef.current.params.minPxPerSec;
    const newZoom = currentZoom === 50 ? 0 : 50; // if already zoomed in, zoom back out
    wavesurferRef.current.zoom(newZoom);
  };

  return (
    <div className={styles.playerContainer}>
      <div className={styles.backButtonContainer}>
        <a className={styles.backButton} href="/">
          <BsArrowLeft /> Back
        </a>
      </div>
      <div className={styles.waveformContainer}>
        <p className={styles.instructions}>
          Click and drag on the waveform to create a section to loop over
          <br />
        </p>
        <div className={styles.waveform}>
          <WaveSurfer plugins={plugins} onMount={handleWSMount}>
            <WaveForm
              // waveform parameters
              id="waveform"
              cursorColor="transparent"
              waveColor="#D1d7e0"
              progressColor="#802bb1"
              barWidth={1}
            >
              {regions.map((regionProps) => (
                <Region
                  onUpdateEnd={handleRegionUpdate}
                  key={regionProps.id}
                  {...regionProps}
                />
              ))}
              {markers.map((marker, index) => {
                return (
                  <Marker // displays markers
                    key={index}
                    {...marker}
                    onClick={(...args) => {
                      console.log("onClick", ...args);
                    }}
                    onDrag={(...args) => {
                      console.log("onDrag", ...args);
                    }}
                    onDrop={(...args) => {
                      console.log("onDrop", ...args);
                    }}
                  />
                );
              })}
            </WaveForm>
            <div id="timeline" />
          </WaveSurfer>
        </div>
        {/* displays play audio controls */}
        <div className={styles.playControlsContainer}>
          <button className={styles.playControl} onClick={skipBack}>
            <BsFillSkipBackwardFill />
          </button>
          <button
            className={styles.playControl}
            id={styles.playPauseBtn}
            onClick={playPause}
            // play/pause on space
            onKeyDown={(e) => {
              if (e.key == "Space") playPause;
            }}
          >
            {
              isPlaying ? <BsFillPauseFill /> : <BsFillPlayFill /> // displays play/pause button respectively
            }
          </button>
          <button className={styles.playControl} onClick={skipForward}>
            <BsFillSkipForwardFill />
          </button>
        </div>
        <button className={styles.controls} onClick={generateRegion}>
          Generate region
        </button>
        {/* <button onClick={generateMarker}>Generate Marker</button> */}
        <button className={styles.controls} onClick={removeLastRegion}>
          Remove Last Region
        </button>
        {/* <button onClick={removeLastMarker}>Remove last marker</button> */}
        <button className={styles.controls} onClick={toggleTimeline}>
          Toggle Timeline
        </button>
        <button className={styles.controls} onClick={setZoom50}>
          Toggle Zoom
        </button>
      </div>
    </div>
  );
}
