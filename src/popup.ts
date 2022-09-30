const saveButton = document.getElementById("saveButton");
const tabNameInput = document.getElementById("tabName");

async function getCurrentTab() {
  let [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  return tab;
}

saveButton?.addEventListener("click", async () => {
  if (!tabNameInput) return;

  const tabName = (tabNameInput as HTMLInputElement).value;
  if (!tabName) return;

  const tabId = (await getCurrentTab())?.id;
  if (!tabId) return;

  chrome.scripting.executeScript({
    args: [tabName],
    target: { tabId: tabId },
    func: (tabName) => {
      document.title = tabName;
    },
  });
});
