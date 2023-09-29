// Open options page when action button clicked
chrome.action.onClicked.addListener((tab) => {
  chrome.runtime.openOptionsPage();
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.action == "update") {
    updateConfig();
  }
});

chrome.omnibox.onInputChanged.addListener(function (text, suggest) {
  const suggestions = [];
  let match = config.find((element) => text.startsWith(element.key));
  if (match) {
    const trimmed = text.replace(match.key, "").trim();
    const description = `<match>${match.key}</match>: <dim>${match.value}</dim> ${trimmed}`;
    if (text.length > 0) {
      suggestions.push({ content: text, description: description });
    }
    chrome.omnibox.setDefaultSuggestion({
      description: description,
    });
  } else if (text.length > 0) {
    chrome.omnibox.setDefaultSuggestion({
      description: text,
    });
  }
  for (const entry of config) {
    if (text.startsWith(entry.key)) {
      continue;
    }
    const description = `<match>${entry.key}</match>: <dim>${entry.value}</dim> ${text}`;
    if (text.length > 0) {
      suggestions.push({ content: text, description: description });
    }
  }
  suggest(suggestions);
});

chrome.omnibox.onInputEntered.addListener((text) => {
  let match = config.find((element) => text.startsWith(element.key));
  if (match) {
    text = text.replace(match.key, match.value).trim();
  }
  // Encode user input for special characters , / ? : @ & = + $ #
  const newURL = "https://www.google.com/search?q=" + encodeURIComponent(text);
  chrome.tabs.update({ url: newURL });
});

function updateConfig() {
  chrome.storage.sync.get(null).then((data) => {
    config = data.config;
  });
}

let config = [];
updateConfig();
