const saveButton = document.querySelector<HTMLButtonElement>('#saveButton')
const deleteButton = document.querySelector<HTMLButtonElement>('#deleteButton')
const tabNameInput = document.querySelector<HTMLInputElement>('#tabName')

if (!tabNameInput) throw new ReferenceError('tabNameInput does not exist')
if (!saveButton) throw new ReferenceError('saveButton does not exist')
if (!deleteButton) throw new ReferenceError('deleteButton does not exist')

const init = async () => {
  const { id: tabId, url } = await getCurrentTab()
  if (!url || !tabId) return

  const savedTabNames = await chrome.storage.sync.get({ tabNames: {} })
  const savedNameForCurrentTab = savedTabNames.tabNames[url]

  if (savedNameForCurrentTab) {
    tabNameInput.value = savedNameForCurrentTab
  }

  tabNameInput.focus()
}

init()

saveButton.addEventListener('click', async () => {
  const tabName = tabNameInput.value
  if (!tabName) return

  const { id: tabId, url } = await getCurrentTab()
  if (!tabId || !url) return

  const savedTabNames = await chrome.storage.sync.get({ tabNames: {} })

  chrome.storage.sync.set({
    tabNames: {
      ...savedTabNames.tabNames,
      [url]: tabName,
    },
  })

  chrome.scripting.executeScript({
    args: [tabName],
    target: { tabId },
    func: (tabName) => {
      document.title = tabName
    },
  })
})

deleteButton.addEventListener('click', async () => {
  const { id: tabId, url } = await getCurrentTab()
  if (!tabId || !url) return

  const savedTabNames = await chrome.storage.sync.get({ tabNames: {} })

  const {
    tabNames: { [url]: _tabNameToClear, ...otherTabNames },
  } = savedTabNames

  chrome.storage.sync.set({
    tabNames: {
      ...otherTabNames,
    },
  })

  tabNameInput.value = ''

  chrome.tabs.reload()
})

async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  })

  return tab
}
