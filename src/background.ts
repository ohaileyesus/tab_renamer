chrome.tabs.onUpdated.addListener(async function (tabId, _changeInfo, tab) {
  if (!tab.url) return

  const savedTabNames = await chrome.storage.sync.get({ tabNames: {} })
  const savedTabName = savedTabNames.tabNames[tab.url]

  if (savedTabName) {
    chrome.scripting.executeScript({
      args: [savedTabName],
      target: { tabId },
      func: (tabName) => {
        document.title = tabName
      },
    })
  }
})
