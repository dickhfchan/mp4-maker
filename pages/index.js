import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

import React, { useState, useEffect } from "react";

import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
const ffmpeg = createFFmpeg({ log: true });

function App() {
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  };

  useEffect(() => {
    load();
  }, []);

  const convertToGif = async () => {
    // Write the file to memory
    ffmpeg.FS("writeFile", "test.webm", await fetchFile(video));

    // Run the FFMpeg command
    // the parameters are referring to https://gist.github.com/AVGP/4c2ce4ab3c67760a0f30a9d54544a060
    await ffmpeg.run(
      // "-i",
      // "test.webm",
      // "-t",
      // "2.5",
      // "-ss",
      // "2.0",
      // "-f",
      // "mp4",
      "-i",
      "test.webm",
//       "-vcodec",
      "-c:v"
      "copy",
//       "-q:a",
//       "0",
      "out.mp4"
    );

    // Read the result
    const data = ffmpeg.FS("readFile", "out.mp4");

    // Create a URL
    const url = URL.createObjectURL(
      new Blob([data.buffer], { type: "video/mp4" })
    );
    setGif(url);
  };

  return ready ? (
    <div className={styles.container}>
      {video && (
        <video controls width="250" src={URL.createObjectURL(video)}></video>
      )}

      <input type="file" onChange={(e) => setVideo(e.target.files?.item(0))} />

      <h3>Result</h3>

      <button onClick={convertToGif}>Convert</button>

      {gif && <video controls width="250" src={gif} />}
    </div>
  ) : (
    <div className={styles.container}>
      <p>Loading...</p>
    </div>
  );
}

export default App;
