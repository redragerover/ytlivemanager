/**
 * holds the fetching for specified time
 * */
let rechecked = false;
/**
 * handles polling of volatile streams. handles already live -> offline if a stream goes offline twice, it is considered to be offline permanently
 * @param {object} state
 * @param {function} actionWhenDoubleCheckIsTrue
 * @returns
 */
const handleDoubleCheck = (state, actionWhenDoubleCheckIsTrue, isStreaming) => {
  const { setDoubleCheckIfOffline, setStreamIsAlreadyOnline, setStreamerIsOn } =
    state;

  if (!state.doubleCheckIfOffline) {
    // check if a stream returned an  offline status at previous point in interval
    return;
  }

  if (isStreaming) {
    // indicates false alarm/ unstable stream, switches state to stream is online
    rechecked = false;
    setStreamIsAlreadyOnline(true);
    setDoubleCheckIfOffline(false);
    return;
  }

  if (!state.streamIsAlreadyOnline && !isStreaming && !rechecked) {
    // stream has been indicated offline. return false alarm and check again after time.
    rechecked = true;
    setStreamerIsOn(true);
    setStreamIsAlreadyOnline(true);
    setDoubleCheckIfOffline(false);
    !process.argv.includes("status") &&
      setTimeout(() => setStreamerIsOn(false), 1000 * 60 * 12); // stop checking for x minutes
    return;
  }
  if (!isStreaming && rechecked) {
    rechecked = false;
    //handles a stream switching to offline
    setDoubleCheckIfOffline(false);
    setStreamIsAlreadyOnline(false);
    actionWhenDoubleCheckIsTrue();
    console.log("stream permanently offline");
  }
};

/**
 * detects changes in a stream to handle going from offline -> live
 * @param {object} state
 * @param {function} actionWhenStreamIsOn
 * @returns
 */
const handleStreamerIsOn = (
  state,
  actionWhenStreamIsOn,
  isStreaming,
  timeToDelayCheck
) => {
  const { setStreamIsAlreadyOnline, setStreamerIsOn } = state;
  const onlineAndReadyToPreformActions =
    isStreaming && !state.streamIsAlreadyOnline && !state.doubleCheckIfOffline;
  if (onlineAndReadyToPreformActions) {
    //send message to everyone
    setStreamIsAlreadyOnline(true);
    setStreamerIsOn(true);
    actionWhenStreamIsOn();
    setTimeout(() => setStreamerIsOn(false), timeToDelayCheck);
    return;
  }
  if (!onlineAndReadyToPreformActions) {
    return;
  }
};

/**
 * polls for instability in a stream. Alerts handleDoubleCheck to verify a offline change
 * @param {object} state
 * @returns
 */
const handleStreameIsRemainingOnline = (state, isStreaming) => {
  const { setDoubleCheckIfOffline, setStreamIsAlreadyOnline } = state;
  if (isStreaming && state.streamIsAlreadyOnline) {
    return;
  }
  if (
    !isStreaming &&
    !state.doubleCheckIfOffline &&
    state.streamIsAlreadyOnline
  ) {
    setDoubleCheckIfOffline(true);
    setStreamIsAlreadyOnline(false);
    return;
  }
};

export {
  handleStreameIsRemainingOnline,
  handleStreamerIsOn,
  handleDoubleCheck,
};
