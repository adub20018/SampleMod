import Image from "next/image";
import styles from "./page.module.css";
import YoutubeAudioProcessor from "./ui/YoutubeAudioProcessor";
import Link from "next/link";
import logo from "../public/SampleModLogo.png";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <a className={styles.title} href={"/"}>
          <Image className={styles.logo} src={logo} alt="SampleMod Logo" />
          <h1>SampleMod</h1>
        </a>
        <YoutubeAudioProcessor />
      </div>
    </main>
  );
}
