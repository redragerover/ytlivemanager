import dotenv from "dotenv";
import chalk from "chalk";
import { getLiveVideoURLFromChannelID } from "./urlUtils.js";
import {
  handleDoubleCheck,
  handleStreameIsRemainingOnline,
  handleStreamerIsOn,
} from "./ytLiveState.js";

const toSeconds = (seconds) => seconds * 1000;

dotenv.config();

const pollingIntervalTimer = toSeconds(49);
const getStreamStatus = (streamIsOnline) => {
  if (streamIsOnline) {
    console.log(chalk.white.bgBlack("Stream is online!"));
  } else {
    console.log(chalk.white.bgRed("Stream offline"));
  }
};

/**
 * handleYouTubePoll.
 *
 * @param {function} streamGoesOffline - handles what happens when stream goes offline
 * @param {function} streamToLive - handles when stream goes live
 */
export const handleYouTubePoll = ({
  identifier,
  streamGoesOffline,
  streamToLive,
}) => {
  if (!identifier) {
    console.log("identifier undefined");
  }
  const ytChannelId = identifier;

  console.log(chalk.green("ytlivemanager has started"));
  const state = {
    streamerIsOn: false,
    streamIsAlreadyOnline: false,
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
          () => streamToLive(canonicalURL),
          isStreaming,
          1000 * 20
        );
        return;
      })
      .catch((err) => console.log(err));
  };

  const interval = setInterval(handleInterval, pollingIntervalTimer);
};
