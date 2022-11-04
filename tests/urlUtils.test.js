import {
  twitterUrlPurifier,
  getLiveVideoURLFromChannelID,
  getYoutubeVideoURL,
  UTM_Purifier,
} from "../urlUtils";

describe("twitterUrlPurifier", () => {
  it("should return a twitter URL free from query params", () => {
    const result = twitterUrlPurifier(
      "https://twitter.com/denverchannel/status/1565189956892430336?s=21&t=43143fjafj"
    );

    expect(result).toMatchObject({
      purifiedTwitterUrl:
        "https://twitter.com/denverchannel/status/1565189956892430336",
    });
  });
  it("should return a prefix twitterUrl for any prefix'd twitterUrls if they exist, up to 3 alpha numeric letters", () => {
    const prefix = "VXC";
    const result = twitterUrlPurifier(
      `https://${prefix}twitter.com/denverchannel/status/1565189956892430336?jfd=iafjaidfj33`
    );
    expect(result).toMatchObject({
      purifiedTwitterUrl: `https://${prefix}twitter.com/denverchannel/status/1565189956892430336`,
    });
  });
  it("should only work for twitterURLs", () => {
    const result = twitterUrlPurifier(
      "https://www.youtube.com/watch?v=fDoJnUXnek4"
    );
    expect(result).toMatchObject({
      purifiedTwitterUrl: "",
    });
  });
  it("should work with twitter urls inside of a paragraph of text while returning the text", () => {
    const result = twitterUrlPurifier(
      `and stuff here https://VXCtwitter.com/denverchannel/status/1565189956892430336?jfd=iafjaidfj33  stuff here`
    );
    expect(result).toMatchObject({
      purifiedTwitterUrl:
        "and stuff here https://VXCtwitter.com/denverchannel/status/1565189956892430336  stuff here",
    });
  });
  it("should return an empty string if just a standard twitter url", () => {
    const result = twitterUrlPurifier(
      "https://twitter.com/denverchannel/status/1565189956892430336"
    );
    expect(result).toMatchObject({ purifiedTwitterUrl: "" });
  });
});
describe("getLiveVideoURLFromChannelID", () => {
  it("if the youtube request  fails, it should return isStreaming false and a message", async () => {
    const result = await getLiveVideoURLFromChannelID("ff1234567");
    expect(result).toMatchObject({
      canonicalURL: "",
      isStreaming: null,
    });
  });
  // get node-fetch mock to work
  it.todo(
    "if he youtube request succeeds, then it should return isStreaming true and a youtube url"
  );
});
describe("getYoutubeVideoURL", () => {
  it("should return a youtubevideo URL from HTML that contains it", () => {
    const result = getYoutubeVideoURL(
      `/[a-zA-Z]{0,3}twitter.com/) u0026v=rUxyKA_-grg","targ`
    );
    expect(result).toBe("https://www.youtube.com/watch?v=rUxyKA_-grg");
  });
});

describe("UTM_Purifier", () => {
  it("should remove URL parameters that contain UTM_", () => {
    const result = UTM_Purifier(
      "https://www.ibtimes.sg/your-twitter-account-active-twitter-suspends-487000-accounts-877000-are-deactivated-elon-musk-67583?utm_source=social&utm_medium=twitter&utm_campaign=/your-twitter-account-active-twitter-suspends-487000-accounts-877000-are-deactivated-elon-musk-67583"
    );

    expect(result).toBe(
      "https://www.ibtimes.sg/your-twitter-account-active-twitter-suspends-487000-accounts-877000-are-deactivated-elon-musk-67583"
    );
  });
});
