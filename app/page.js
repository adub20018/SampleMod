import Image from "next/image";
import styles from "./page.module.css";
import YoutubeAudioProcessor from "./ui/YoutubeAudioProcessor";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>SampleMod</h1>
      <div className={styles.container}>
        <YoutubeAudioProcessor />
      </div>
    </main>
  );
}
