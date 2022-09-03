import { exec } from  "child_process";
import dotenv from "dotenv"
import chalk from "chalk"
import { getLiveVideoURLFromChannelID} from "./urlUtils.js"
import { handleDoubleCheck, handleStreameIsRemainingOnline, handleStreamerIsOn } from "./ytLiveState.js"

const toSeconds = seconds => seconds * 1000
const toMinutes = minutes => 60_000 * minutes

const nodeArguments = process.argv
dotenv.config()
const ytChannelId = process.env.ytChannelId
const saveFilePath = process.env.saveFilePath

const pollingIntervalTimer = toSeconds(49)
const timeToDelayCheck = toSeconds(40)
const getStreamStatus= (streamIsOnline)=>{
	if(streamIsOnline){
		console.log(chalk.white.bgBlack("Stream is online!"))
	} 
	else {
		console.log(chalk.white.bgRed("Stream offline"))
	}

}

/**
 * handleYouTubePoll.
 *
 * @param {function} streamGoesOffline - handles what happens when stream goes offline
 * @param {function} streamToLive - handles when stream goes live
 */
export const handleYouTubePoll = ({streamGoesOffline, streamToLive}) => {
	console.log(chalk.green("ytlivemanager has started"))
	const state = {
		streamerIsOn: false,
		streamIsAlreadyOnline: nodeArguments.includes("skip"),
		doubleCheckIfOffline: false,
		intervalCounter: 0,
		setStreamerIsOn(val) {
			state.streamerIsOn = val
		},
		setStreamIsAlreadyOnline(val) {
			state.streamIsAlreadyOnline = val
		},
		setDoubleCheckIfOffline(val) {
			console.log(state.doubleCheckIfOffline)
			state.doubleCheckIfOffline = val
		},
	}	
	
	const handleInterval = async () => {
		if(state.intervalCounter > 0){
			state.intervalCounter = 0
			console.clear()
			getStreamStatus(state.streamIsAlreadyOnline)
		}


		state.intervalCounter++

		await getLiveVideoURLFromChannelID(ytChannelId).then(({ isStreaming, canonicalURL }) => {

			if(state.streamerIsOn){
				return;
			}
			handleDoubleCheck(state, streamGoesOffline)
			if(state.doubleCheckIfOffline){
				return
			}
			handleStreameIsRemainingOnline(state, isStreaming)
			if(state.streamIsAlreadyOnline){
				return
			}

			handleStreamerIsOn(state,  streamToLive , isStreaming, 1000 * 20)
			return;
		}).catch(err => console.log(err))
	}

	const interval = setInterval(handleInterval, pollingIntervalTimer)

}
