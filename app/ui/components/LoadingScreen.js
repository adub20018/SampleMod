import React from "react";
import styles from "./styles/LoadingScreen.module.css"; // Import CSS module for styling

const LoadingSpinner = () => {
  return (
    <div className={styles.loadingContainer}>
      <h2>Audio Loading...</h2>
      <div className={styles.spinnerContainer}>
        <div className={styles.spinner}></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
