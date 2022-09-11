# ytlivemanager

A function `handleYouTubePoll`, to poll a youtube channel for a live stream. Programatically determine if a YouTube stream is going live

Node 18+

# install

`npm i redragerover/ytlivemanager#alpha`

## use
example being used in a discord bot
- Note your that streamToLive function will get access to the live video URL in a string
![image](https://user-images.githubusercontent.com/105608997/188329083-01253712-442e-43ba-ae87-7153ac784cbd.png)

```javascript 
handleYouTubePoll({
identifier, // a channel ID for a YouTube channel. Looks like 'fAFJcchSAFnASfq0'
streamToLive, // a function to run when a stream goes live
streamGoesOffline // a function to run when stream goes offline
    })
```

### Known issues
- Polling from `getLiveVideoURLFromChannelID` in `urlUtils.js` provides reliable data, but I think it can be improved. I am no RegExp God.
- Polling will run sometimes if a channel posts a "preview" for an event
- I have excess stuff in here. I am still planning out what I want to do with the repo.
- If a stream is chaotic with internet issues, it can ping twice. There is a 40 second double check to prevent most issues with this. But sometimes your streamer gets drunk in Las Vegas, going in and out of casinos restarting his stream and your streamToLive function will hate him
- Polling runs at a static 49 second intervals. Don't know how much polling is too much, 49 seconds is good for me. Will add dyanmic handling later if I feel like it.
