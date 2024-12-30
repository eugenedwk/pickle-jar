export function isInAppBrowser(userAgent: string): boolean {
  const inAppBrowserPatterns = [
    /FB_IAB/i, // Facebook in-app browser
    /FBAN/i, // Facebook app
    /FBAV/i, // Facebook app
    /Instagram/i, // Instagram in-app browser
    /Line/i, // Line in-app browser
    /Twitter/i, // Twitter in-app browser
    /KAKAOTALK/i, // KakaoTalk in-app browser
    /WeChat/i, // WeChat in-app browser
    /MicroMessenger/i, // WeChat in-app browser
  ];

  return inAppBrowserPatterns.some((pattern) => pattern.test(userAgent));
}
