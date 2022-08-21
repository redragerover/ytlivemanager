
import { parse } from 'node-html-parser'
import fetch from 'node-fetch'


const getLiveVideoURLFromChannelID = async (channelID) => {

    const response = await fetch(`https://youtube.com/channel/${channelID}/live`).catch(err=>console.log("request-failed: ", err))
    if(!response){
        return {canonicalURL: "", isStreaming: false}
    }
    const text = await response.text()
    const html = parse(text)
    const canonicalURLTag = html.querySelector('link[rel=canonical]')
    let canonicalURL = canonicalURLTag.getAttribute('href')

    const isStreaming = canonicalURL.includes('/watch?v=') && text.includes('isLive":true}}') && !text.includes("Scheduled for")

    canonicalURL = isStreaming ? canonicalURL : "Channel is not live"
    return { canonicalURL, isStreaming }
}

const twitterUrlPurifier = (message) => {
    let purifiedTwitterUrl = ''
    if (!message.includes("twitter.com/")) {
        return { purifiedTwitterUrl }
    }
    const isDirtyTwitterUrl = message.includes("?s=") || message.includes("&t=")
    if (!isDirtyTwitterUrl) {
        return { purifiedTwitterUrl };
    }
    const twitterUrl = message.substring(message.indexOf("twitter.com/"), message.indexOf("?s="))
    purifiedTwitterUrl = `https://${twitterUrl}`
    if(message.includes("vxtwitter")){
        purifiedTwitterUrl = `https://vx${twitterUrl}`
    }

    return { purifiedTwitterUrl }
}

export { getLiveVideoURLFromChannelID, twitterUrlPurifier }
