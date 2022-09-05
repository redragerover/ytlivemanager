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
});
