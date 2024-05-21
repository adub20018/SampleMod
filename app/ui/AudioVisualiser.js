// "use client";

// import styles from "./styles/AudioVisualiser.module.css";
// import { useEffect, useRef, useState } from "react";
// import WaveSurfer from "wavesurfer.js";
// import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min";
// import {
//   BsSkipBackward,
//   BsSkipForward,
//   BsFillStopFill,
//   BsFillPlayFill,
//   BsFillPauseFill,
// } from "react-icons/bs";

// export default function AudioVisualiser({ audioFile }) {
//   const waveformRef = useRef(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [wavesurfer, setWavesurfer] = useState(null);

//   // create the visual waveform
//   useEffect(() => {
//     const ws = WaveSurfer.create({
//       container: waveformRef.current,
//       waveColor: "#ffffffad",
//       progressColor: "#865CAC",
//       url: audioFile,
//       dragToSeek: true,
//       width: "70vw",
//       height: 100,
//       hideScrollbar: true,
//       normalize: true,
//       dragToSeek: true,
//       // barHeight: 20,
//       // barRadius: 20,
//       barWidth: 2,
//     });

//     setWavesurfer(ws);

//     return () => {
//       ws.destroy();
//     };
//   }, [audioFile]);

//   // stop audio button
//   const handleStop = () => {
//     if (wavesurfer) {
//       wavesurfer.stop();

//       if (isPlaying) {
//         setIsPlaying(false);
//       }
//     }
//   };

//   // toggle play/pause button
//   const handlePlayPause = () => {
//     if (wavesurfer) {
//       wavesurfer.playPause();
//       setIsPlaying(!isPlaying);
//     }
//   };

//   // skip forward 10 seconds
//   const handleSkipForward = () => {
//     if (wavesurfer) {
//       wavesurfer.skip(10);
//     }
//   };

//   // skip back 10 seconds
//   const handleSkipBack = () => {
//     if (wavesurfer) {
//       wavesurfer.skip(-10);
//     }
//   };

//   // // regions code
//   // // initialise regions plugin
//   // const wsRegions = wavesurfer.registerPlugin(RegionsPlugin.create());

//   // // create regions
//   // wavesurfer.on("decode", () => {
//   //   // regions
//   //   wsRegions.addRegion({
//   //     start: 30,
//   //     end: 90,
//   //     content: "Cramped Region",
//   //     color: "#fffcad",
//   //   });

//   //   // markers - zero length regions / queue points
//   //   // wsRegions.addRegion({})

//   //   wsRegions.enableDragSelection({
//   //     color: "rgba(255, 0, 0, 0.1)",
//   //   });

//   //   wsRegions.on("region-updated", (region) => {
//   //     console.log("Updated region", region);
//   //   });

//   //   // loop region on click
//   //   let loop = true;
//   //   // toggle looping with checkbox
//   //   document.querySelector(input[(type = "checkbox")]).onClick = (e) => {
//   //     loop = e.target.checked;
//   //   };

//   //   {
//   //     let activeRegion = null;
//   //     wsRegions.on("region-in", (region) => {
//   //       console.log("region-in", region);
//   //       activeRegion = region;
//   //     });
//   //     wsRegions.on("region-out", (region) => {
//   //       console.log("region-out", region);
//   //       if (activeRegion === region) {
//   //         if (loop) {
//   //           region.play();
//   //         } else {
//   //           activeRegion = null;
//   //         }
//   //       }
//   //     });
//   //     wsRegions.on("region-clicked", (region, e) => {
//   //       e.stopPropagation(); // prevent triggering a click on the waveform
//   //       activeRegion = region;
//   //       region.play();
//   //       region.setOptions({ color: randomColor() });
//   //     });
//   //     // Reset the active region when the user clicks anywhere in the waveform
//   //     ws.on("interaction", () => {
//   //       activeRegion = null;
//   //     });
//   //   }

//   //   // Update the zoom level on slider change
//   //   ws.once("decode", () => {
//   //     document.querySelector('input[type="range"]').oninput = (e) => {
//   //       const minPxPerSec = Number(e.target.value);
//   //       ws.zoom(minPxPerSec);
//   //     };
//   //   });
//   // });

//   return (
//     <div className={styles.container}>
//       <div className={styles.subContainer}>
//         <div ref={waveformRef} className={styles.wavesurfer} />

//         <div className={styles.wavesurferControls}>
//           <button className={styles.childControl} onClick={handleSkipBack}>
//             <BsSkipBackward /> {/* skip audio back icon */}
//           </button>
//           <button className={styles.childControl} onClick={handlePlayPause}>
//             {/* displays play or pause button based on isPlaying state */}
//             {isPlaying ? <BsFillPauseFill /> : <BsFillPlayFill />}
//           </button>
//           <button className={styles.childControl} onClick={handleStop}>
//             <BsFillStopFill /> {/* stop audio icon */}
//           </button>
//           <button className={styles.childControl} onClick={handleSkipForward}>
//             <BsSkipForward /> {/* Skip audio forward icon */}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
