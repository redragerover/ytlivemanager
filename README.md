# ytlivemanager

A simple function to poll a youtube channel for a live stream.

Node 18+

# install

`npm i https://github.com/redragerover/ytlivemanager`

## use

````javascript handleYouTubePoll({
identifier, // a channel ID for a YouTube channel. Looks like 'fAFJcchSAFnASfq0'
streamToLive, // a function to run when a stream goes live
streamGoesOffline // a function to run when stream goes offline
    })
```

I want to make this into a simple package and worker you just run and give it 3 functions to handle live stream state for a channel and y'all can do what you want with it
