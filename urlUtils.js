import { parse } from "node-html-parser";
import fetch from "node-fetch";

const getLiveVideoURLFromChannelID = async (channelID) => {
  const response = await fetch(
    `https://youtube.com/channel/${channelID}/live`
  ).catch((err) => console.log("request-failed: ", err));
  if (!response) {
    return { canonicalURL: "", isStreaming: false };
  }
  const text = await response.text();
  const html = parse(text);
  const canonicalURLTag = html.querySelector("link[rel=canonical]");
  let canonicalURL = canonicalURLTag.getAttribute("href");

  const isStreaming =
    canonicalURL.includes("/watch?v=") &&
    text.includes('isLive":true}}') &&
    !text.includes("Scheduled for");

  canonicalURL = isStreaming ? canonicalURL : "Channel is not live";
  return { canonicalURL, isStreaming };
};

const twitterUrlPurifier = (message) => {
  let purifiedTwitterUrl = "";
  //const twitterRegExp = new RegExp(/[a-zA-Z]{0,3}twitter.com/);
  const hasTrecherousURLTrackerRegExp = new RegExp(/(\?|&)[a-zA-Z].*=[^\s]*/);
  if (
    //!twitterRegExp.test(message) &&
    !hasTrecherousURLTrackerRegExp.test(message)
  ) {
    return { purifiedTwitterUrl };
  }

  purifiedTwitterUrl = message.replace(hasTrecherousURLTrackerRegExp, "");
  if (message === purifiedTwitterUrl) {
    return { purifiedTwitterUrl: "" };
  }
  return { purifiedTwitterUrl };
};

export { getLiveVideoURLFromChannelID, twitterUrlPurifier };
