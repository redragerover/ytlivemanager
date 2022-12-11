# ytlivemanager

A set of functions`handleYouTubePoll` and `handleRumblePoll`, to poll live streams. Programatically determine if a stream is going live

Node 18+

# install

`npm i redragerover/ytlivemanager`

## use
example being used in a discord bot
- Note your that streamToLive function will get access to the live video URL in a string
![image](https://user-images.githubusercontent.com/105608997/188329083-01253712-442e-43ba-ae87-7153ac784cbd.png)

```javascript 
handleYouTubePoll({
identifier, // a channel ID for a YouTube channel. Looks like 'fAFJcchSAFnASfq0'
streamToLive, // a function to run when a stream goes live
streamGoesOffline, // a function to run when stream goes offline
{ enableLogs: false } // options for the poll
    })
```
### How does the transition from stream online to offline work?
This is handled in `ytLiveState.js` in `handleDoubleCheckIfOffline`
If the stream goes offline the state handler checks again on the next ping. If the next ping the stream is offline it will pause pinging for 12 minutes and check again. If that next ping is offline it'll check one last time, and if that ping is offline it'll return the stream as an offline status entirely. So that's 4 checks. It should theoretically be impossible to provide a false positive 4 times in a row 

Currently the waiting period for fetching to verify false positives is 12 minutes. I believe that works well for accuracy. Will make this value configurable from the options object though
