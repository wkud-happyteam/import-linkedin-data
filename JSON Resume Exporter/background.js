/**
 * === Handle Toggling of Button Action based on domain match ===
 * This is only necessary because we are using  `page_action` instead of `browser_action`
 */

const { chromium } = require('playwright');

(async () => {
  const pathToExtension = require('path').join(__dirname, 'JSON Resume Exporter');
  const userDataDir = '/tmp/test-user-data-dir';
  const browserContext = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    args: [
      `--disable-extensions-except=${pathToExtension}`,
      `--load-extension=${pathToExtension}`
    ]
  });
  let [backgroundPage] = browserContext.backgroundPages();
  if (!backgroundPage)
    backgroundPage = await browserContext.waitForEvent('backgroundpage');

  // Test the background page as you would any other page.
  await browserContext.close();
})();

chrome.runtime.onInstalled.addListener(() => {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
        chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: {
                            hostContains: 'linkedin.com'
                        }
                    })
                ],
                actions: [new chrome.declarativeContent.ShowPageAction()]
            }
        ]);
    });
});
