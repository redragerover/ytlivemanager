/**
 * 
 * @param {object} state 
 * @param {function} actionWhenDoubleCheckIsTrue 
 * @returns 
 */
const handleDoubleCheck = (state, actionWhenDoubleCheckIsTrue, isStreaming) => {

    const { setDoubleCheckIfOffline, setStreamIsAlreadyOnline } = state


    if (!state.doubleCheckIfOffline) {
        return
    }

    if (isStreaming) {
        setStreamIsAlreadyOnline(true)
        setDoubleCheckIfOffline(false)
        return;
    }
    if (!isStreaming) {
        setDoubleCheckIfOffline(false)
        setStreamIsAlreadyOnline(false)
        actionWhenDoubleCheckIsTrue()
        console.log("stream permanently offline")
    }
}

/**
 * 
 * @param {object} state 
 * @param {function} actionWhenStreamIsOn 
 * @returns 
 */
const handleStreamerIsOn = (state, actionWhenStreamIsOn, isStreaming, timeToDelayCheck) => {

    const { setStreamIsAlreadyOnline, setStreamerIsOn } = state
    const sendMessageToEveryone = isStreaming && !state.streamIsAlreadyOnline && !state.doubleCheckIfOffline
    if (sendMessageToEveryone) {
        //send message to everyone
        setStreamIsAlreadyOnline(true)
        setStreamerIsOn(true)
        actionWhenStreamIsOn()
        setTimeout(() => setStreamerIsOn(false), timeToDelayCheck)
        return;
    }
    if (!sendMessageToEveryone) {
        console.log(`stream is online: ${state.streamIsAlreadyOnline}`)
        return
    }
}

/**
 * 
 * @param {object} state 
 * @returns 
 */
const handleStreameIsRemainingOnline = (state, isStreaming) => {

    const { setDoubleCheckIfOffline, setStreamIsAlreadyOnline } = state
    if (isStreaming && state.streamIsAlreadyOnline) {
        return
    }
    if (!isStreaming && !state.doubleCheckIfOffline && state.streamIsAlreadyOnline) {
        setDoubleCheckIfOffline(true)
        setStreamIsAlreadyOnline(false)
        return;
    }
}

export { handleStreameIsRemainingOnline, handleStreamerIsOn, handleDoubleCheck }
