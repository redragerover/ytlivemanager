import dotenv from "dotenv";
import chalk from "chalk";
import { getLiveVideoURLFromChannelID } from "./urlUtils.js";
import {
  handleDoubleCheck,
  handleStreameIsRemainingOnline,
  handleStreamerIsOn,
} from "./ytLiveState.js";

const toSeconds = (seconds) => seconds * 1000;
const nodeArguments = process.argv;
console.log({ nodeArguments });
dotenv.config();

const getStreamStatus = (streamIsOnline) => {
  if (streamIsOnline) {
    console.log(chalk.white.bgBlack("Stream is online!"));
  } else {
    console.log(chalk.white.bgRed("Stream offline"));
  }
};

async function sleep(millis) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}
/**
 * @example handleGroupYoutubePoll({identifiers:["dfadfadfdaf"], streamToLive, streamGoesOffline})
 * handleGroupYoutubePoll calls a group of channelIds to handleYouTubePoll
 * @param {object} pollConfig
 * @param {function} pollConfig.streamGoesOffline - handles what happens when stream goes offline
 * @param {function} pollConfig.streamToLive - handles when stream goes live
 * @param {[string]} pollConfig.identifiers - a youtube channelId
 */
export const handleGroupYoutubePoll = async ({
  identifiers,
  streamGoesOffline,
  streamToLive,
}) => {
  if (typeof identifiers !== "object" && !identifiers.length) {
    console.log("no identifiers passed");
    return;
  }
  await sleep(toSeconds(30));
  for (const channelId of identifiers) {
    console.group("group poll");
    handleYouTubePoll(
      { identifier: channelId, streamGoesOffline, streamToLive },
      toSeconds(125)
    );
  }
  console.groupEnd();
};

/**
 * handleYouTubePoll.
 *
 * @param {function} streamGoesOffline - handles what happens when stream goes offline
 * @param {function} streamToLive - handles when stream goes live
 * @param {string} identifier - a youtube channelId
 * @param {int} pollingIntervalTimer - ms value of how frequent a poll should be checked
 */
export const handleYouTubePoll = (
  { identifier, streamGoesOffline, streamToLive },
  pollingIntervalTimer = toSeconds(49)
) => {
  if (!identifier) {
    console.log("identifier undefined");
    return;
  }
  const ytChannelId = identifier;

  console.log(chalk.green("ytlivemanager has started"));
  const state = {
    streamerIsOn: false,
    streamIsAlreadyOnline: nodeArguments.includes("skip"),
    doubleCheckIfOffline: false,
    intervalCounter: 0,
    setStreamerIsOn(val) {
      state.streamerIsOn = val;
    },
    setStreamIsAlreadyOnline(val) {
      state.streamIsAlreadyOnline = val;
    },
    setDoubleCheckIfOffline(val) {
      console.log(state.doubleCheckIfOffline);
      state.doubleCheckIfOffline = val;
    },
  };

  const handleInterval = async () => {
    if (state.intervalCounter > 0) {
      state.intervalCounter = 0;
      console.clear();
      getStreamStatus(state.streamIsAlreadyOnline);
    }

    state.intervalCounter++;

    await getLiveVideoURLFromChannelID(ytChannelId)
      .then(({ isStreaming, canonicalURL }) => {
        if (state.streamerIsOn) {
          return;
        }
        handleDoubleCheck(state, streamGoesOffline);
        if (state.doubleCheckIfOffline) {
          return;
        }
        handleStreameIsRemainingOnline(state, isStreaming);
        if (state.streamIsAlreadyOnline) {
          return;
        }

        handleStreamerIsOn(
          state,
          () => streamToLive(canonicalURL || ""),
          isStreaming,
          1000 * 20
        );
        return;
      })
      .catch((err) => console.log(err));
  };

  const interval = setInterval(handleInterval, pollingIntervalTimer);
};
