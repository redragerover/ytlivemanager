# ytlivemanager

A simple function to poll a youtube channel for a live stream.

Node 18+

# install

`npm i https://github.com/redragerover/ytlivemanager`

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


I want to make this into a simple package and worker you just run and give it 3 functions to handle live stream state for a channel and y'all can do what you want with it
