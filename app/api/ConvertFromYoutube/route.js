import { NextResponse } from "next/server";
import ytdl from "ytdl-core";

export async function GET(req) {
  const url = new URL(req.url);
  const youtubeUrl = url.searchParams.get("url");

  // check for invalid youtube URL is valid
  if (!youtubeUrl || !ytdl.validateURL(youtubeUrl)) {
    return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
  }

  try {
    // call ytdl api with youtube url
    const info = await ytdl.getInfo(youtubeUrl);
    const audioFormats = ytdl.filterFormats(info.formats, "audioonly");
    const audioFormat = audioFormats.find(
      (format) => format.container === "mp4"
    );

    if (!audioFormat) {
      // error checking for if API fails to send audio format
      return NextResponse.json(
        { error: "No audio format available" },
        { status: 500 }
      );
    }

    const audioStream = ytdl.downloadFromInfo(info, {
      format: audioFormat,
    });

    // set information on audio
    const headers = new Headers();
    headers.set(
      "Content-Disposition",
      `attachment; filename="${info.videoDetails.title}.mp3"`
    );

    return new NextResponse(audioStream, {
      headers,
    });
  } catch (error) {
    // error checking for if conversion failed
    console.error("Error converting to MP3:", error);
    return NextResponse.json(
      { error: "Failed to convert to MP3" },
      { status: 500 }
    );
  }
}
