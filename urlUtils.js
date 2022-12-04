import fetch from "node-fetch";

export const getYoutubeVideoURL = (htmlString) => {
  const vidURLRegExp = new RegExp(/u0026v=(.*?)\"/);
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
  const text = await response.text();
  const url = getYoutubeVideoURL(text);
  const canonicalURL = url || "";
  const isStreaming =
    !!canonicalURL &&
    text.includes('isLive":true}}') &&
    !text.includes("Scheduled for");
  return { canonicalURL, isStreaming };
};

const twitterUrlPurifier = (message) => {
  const twitterRegExp = new RegExp(/[a-zA-Z]{0,3}twitter.com/);
  const hasTrecherousURLTrackerRegExp = new RegExp(/(\?|&)[a-zA-Z].*=[^\s]*/);
  const replacementMessage = message.replace(hasTrecherousURLTrackerRegExp, "");
  if (
    !twitterRegExp.test(message) ||
    message === replacementMessage ||
    !hasTrecherousURLTrackerRegExp.test(message) ||
    message.includes("/search?") ||
    message.includes("/spaces/")
  ) {
    return { purifiedTwitterUrl: "" };
  }
  const purifiedTwitterUrl = message.replace(hasTrecherousURLTrackerRegExp, "");
  return { purifiedTwitterUrl };
};
const UTM_Purifier = (message) => {
  let utmFreeUrl = "";

  const utm_purifiedRegExp = new RegExp(/(\?|&)[a-zA-Z].*=[^\s]*utm_\w+=(.*)/);
  const urlToxicParams = utm_purifiedRegExp.exec(message);
  if (urlToxicParams) {
    utmFreeUrl = message.replace(utm_purifiedRegExp, "");
  }
  return utmFreeUrl;
};

export { getLiveVideoURLFromChannelID, twitterUrlPurifier, UTM_Purifier };
