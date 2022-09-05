import { twitterUrlPurifier, getLiveVideoURLFromChannelID } from "../urlUtils";

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
      `https://VXCtwitter.com/denverchannel/status/1565189956892430336?jfd=iafjaidfj33`
    );
    expect(result).toMatchObject({
      purifiedTwitterUrl:
        "https://VXCtwitter.com/denverchannel/status/1565189956892430336",
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
