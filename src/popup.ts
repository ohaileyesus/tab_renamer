const saveButton = document.getElementById('saveButton')
const deleteButton = document.getElementById('deleteButton')
const tabNameInput = document.getElementById('tabName')

saveButton?.addEventListener('click', async () => {
  if (!tabNameInput) return

  const tabName = (tabNameInput as HTMLInputElement).value
  if (!tabName) return

  const { id: tabId, url } = await getCurrentTab()

  if (!tabId) return

  const existingTabNames = await chrome.storage.sync.get({ tabNames: {} })

  if (url) {
    const {
      tabNames: { [url]: _tabNameToClear, ...otherTabNames },
    } = existingTabNames

    chrome.storage.sync.set({
      tabNames: {
        ...existingTabNames.tabNames,
        [url]: tabName,
      },
    })
  }

  chrome.scripting.executeScript({
    args: [tabName],
    target: { tabId },
    func: (tabName) => {
      document.title = tabName
    },
  })
})

deleteButton?.addEventListener('click', async () => {
  if (!tabNameInput) return

  const { id: tabId, url } = await getCurrentTab()

  if (!tabId) return

  const existingTabNames = await chrome.storage.sync.get({ tabNames: {} })

  if (url) {
    const {
      tabNames: { [url]: _tabNameToClear, ...otherTabNames },
    } = existingTabNames

    chrome.storage.sync.set({
      tabNames: {
        ...otherTabNames,
      },
    })

    chrome.tabs.reload()
  }
})

async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  })

  return tab
}
