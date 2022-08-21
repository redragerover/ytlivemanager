import { exec } from  "child_process";
import dotenv from "dotenv"

import { getLiveVideoURLFromChannelID, twitterUrlPurifier } from "./urlUtils.js"
import { handleDoubleCheck, handleStreameIsRemainingOnline, handleStreamerIsOn } from "./ytLiveState.js"

const toSeconds = seconds => seconds * 1000
const toMinutes = minutes => 60_000 * minutes

const nodeArguments = process.argv
dotenv.config()
const ytChannelId = process.env.ytChannelId
const saveFilePath = process.env.saveFilePath

const pollingIntervalTimer = toSeconds(49)
const timeToDelayCheck = toMinutes(1)



const handleYouTubePoll = () => {
	const state = {
		streamerIsOn: false,
		streamIsAlreadyOnline: nodeArguments.includes("skip"),
		doubleCheckIfOffline: false,
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
		await getLiveVideoURLFromChannelID(ytChannelId).then(({ isStreaming, canonicalURL }) => {

			if(state.streamerIsOn){
				return;
			}
			handleDoubleCheck(state, () => {
				// streamer has gone permanently offline
				// handleStreamerGoneOffline

			}, isStreaming, timeToDelayCheck)
			if(state.doubleCheckIfOffline){
				return
			}
			handleStreameIsRemainingOnline(state, isStreaming)
			if(state.streamIsAlreadyOnline){
				return
			}

			handleStreamerIsOn(state, () => {
				//send message only once
				console.clear()
				const today = new Date();
				const date = today.getMonth()+'-'+(today.getYear())+'-'+today.getDate();
				const time = today.getHours() + ":" + today.getMinutes()
				const dateTime = date+' '+time;
				const filename = `cc${dateTime}`
				console.log("Channel has gone online!", dateTime)

				exec(`streamlink --http-no-ssl-verify ${canonicalURL} best -o ${saveFilePath}/${filename}.ts`)

			}, isStreaming, 1000 * 60 * 25)
			return;
		}).catch(err => console.log(err))
	}

	const interval = setInterval(handleInterval, pollingIntervalTimer)
}
handleYouTubePoll()
