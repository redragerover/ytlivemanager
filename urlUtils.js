import fetch from "node-fetch";
import Parser from "node-html-parser";
/**
 *
 * @param {HTMLElement} videoSelector
 * @returns {string} "https://rumble.com/xxxxxx" | ""
 */
const getRumbleStreamURLFromSelector = (videoSelector) => {
  if (!videoSelector) {
    return "";
  }
  const anchor = videoSelector.parentNode.parentNode.querySelector("a");
  const canonicalURL = anchor.attrs.href;
  return `https://rumble.com${canonicalURL}`;
};
/**
 *
 * @param {string} htmlString
 * @returns "https://youtube.com/watch?v=xxxxxx" | ""
 */
const getYoutubeStreamURLfromHTMLString = (htmlString) => {
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

/**
 * returns the live stream status for a youtube channel.
 * @param {string} channelID
 *
 * @typedef {object} LiveStatus
 * @property {string} canonicalURL - the live stream URL
 * @property {boolean} isStreaming - the live state of the youtube channel
 *
 * @returns Promise{LiveStatus} - the live state of the youtube stream
 */
export const getYoutubeLiveStatusFromChannelID = async (channelID) => {
  const response = await fetch(
    `https://youtube.com/channel/${channelID}/live`
  ).catch((err) => console.warn("request-failed: ", err));
  if (!response) {
    return { canonicalURL: "", isStreaming: false };
  }
  const text = await response.text();
  const url = getYoutubeStreamURLfromHTMLString(text);
  const canonicalURL = url || "";
  const isStreaming =
    !!canonicalURL &&
    text.includes('isLive":true}}') &&
    !text.includes("Scheduled for");
  return { canonicalURL, isStreaming };
};

/**
 * returns the live stream status for a Rumble Channel
 * @param {string} channelID
 
 * @typedef {object} LiveStatus
 * @property {string} canonicalURL - the live stream URL
 * @property {boolean} isStreaming - the live state of the youtube channel
 *
 * @returns Promise{LiveStatus} - the live state of the youtube stream
 */
export const getRumbleStreamLiveStatusFromChannelID = async (channelID) => {
  const text = await fetch(`https://rumble.com/c/${channelID}`)
    .then((res) => res.text())
    .catch(() => liveEnums.isNotLive);
  const root = Parser.parse(text);
  const videoSelector = root.querySelector(".video-item--live");
  const canonicalURL = getRumbleStreamURLFromSelector(videoSelector);
  return {
    canonicalURL,
    isStreaming: !!canonicalURL,
  };
};
/**
 * removes the t and s parameter from twitter urls when sharing
 * @param {string} message
 */
export const twitterUrlPurifier = (message) => {
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

/**
 * provides a stripped string if the message is containing a url and UTM parameters
 * @example
 * UTM_Purifier("hello https://www.twitter.com/RekietaLaw?utm_source=faijf139j1f&buffalo_chicken=true")
 * @returns "hello https://www.twitter.com/RekietaLaw?buffalo_chicken=true"
 *
 * @param {string} message
 */
export const UTM_Purifier = (message) => {
  const urlsInMessage = message.match(/\bhttps?:\/\/\S+/gi);
  let stripped;
  if (!urlsInMessage) {
    return "";
  }
  if (!urlsInMessage.length) {
    return "";
  }
  const searchPattern = new RegExp(
    "utm_|stm_|clid|_hs|icid|igshid|mc_|mkt_tok|yclid|_openstat|wicked|otc|oly_|rb_clickid|soc_|cvid|oicd",
    "i"
  );
  const replacePattern = new RegExp(
    "([?&]" +
      "(icid|mkt_tok|(g|fb)clid|igshid|_hs(enc|mi)|mc_[ce]id|(utm|stm)_(id|source|medium|term|campaign|content|cid|reader|referrer|name|social|social-type)|rb_clickid|yclid|_openstat|wickedid|otc|oly_(anon|enc)_id|soc_(src|trk)|cvid|oicd)" +
      "=[^&#]*)",
    "ig"
  );
  for (const urlIndex in urlsInMessage) {
    const url = urlsInMessage[urlIndex];
    const queryStringIndex = url.indexOf("?");
    if (url.search(searchPattern) > queryStringIndex) {
      stripped = message.replace(replacePattern, "");
      if (stripped.charAt(queryStringIndex) === "&") {
        stripped = `${stripped.substr(0, queryStringIndex)}?${stripped.substr(
          queryStringIndex + 1
        )}`;
      }
    }
  }
  return stripped;
};
