import fetch from "node-fetch";

export const getYoutubeVideoURL = (htmlString) => {
  const vidURLRegExp = new RegExp(/u0026v=(.*?)"/);
  const regExpResult = vidURLRegExp.exec(htmlString);

  if (regExpResult) {
    const incompleteURL = regExpResult[0];
    const firstIndex = incompleteURL.indexOf("v=");
    const endIndex = incompleteURL.indexOf('"', firstIndex);
    const cleanURL = `https://www.youtube.com/watch?${incompleteURL.substring(
      firstIndex,
      endIndex
    )}`;
    return cleanURL;
  }
  return "";
};
const getLiveVideoURLFromChannelID = async (channelID) => {
  const response = await fetch(
    `https://youtube.com/channel/${channelID}/live`
  ).catch((err) => console.log("request-failed: ", err));
  if (!response) {
    return { canonicalURL: "", isStreaming: false };
  }
  const url = getYoutubeVideoURL(response.text());
  const canonicalURL = url || "PA is offline";
  const isStreaming = !!url;
  return { canonicalURL, isStreaming };
};

const twitterUrlPurifier = (message) => {
  let purifiedTwitterUrl = "";
  const twitterRegExp = new RegExp(/[a-zA-Z]{0,3}twitter.com/);
  const hasTrecherousURLTrackerRegExp = new RegExp(/(\?|&)[a-zA-Z].*=[^\s]*/);
  if (!twitterRegExp.test(message)) {
    return { purifiedTwitterUrl };
  }
  if (!hasTrecherousURLTrackerRegExp.test(message)) {
    return { purifiedTwitterUrl };
  }
  purifiedTwitterUrl = message.replace(hasTrecherousURLTrackerRegExp, "");

  if (message === purifiedTwitterUrl) {
    return { purifiedTwitterUrl: "" };
  }
  return { purifiedTwitterUrl };
};

export { getLiveVideoURLFromChannelID, twitterUrlPurifier };
