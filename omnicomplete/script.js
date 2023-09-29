function renderData() {
  chrome.storage.sync.get(null).then((data) => {
    const config = data.config || [];
    // Add extra entry for additional row
    config.push({ key: "", value: "" });
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";
    // Render config
    for (const entry of config) {
      const row = document.createElement("tr");
      row.innerHTML = `<td><input name="key" type="text" size=8 value="${entry.key}" /></td>
        <td><input name="value" type="text" size=24 value="${entry.value}" /></td>
        <td><input name="delete" type="button" value="Delete" /></td>`;
      tbody.appendChild(row);
    }
    // Add event listener on delete buttons
    document.querySelectorAll("input[name=delete]").forEach((element) =>
      element.addEventListener("click", (event) => {
        event.target.parentElement.parentElement.remove();
        saveData();
      })
    );
  });
}

function saveData() {
  const form = document.querySelector("form");
  const formData = new FormData(form);
  const config = [];
  let entry = {};
  for (const [key, value] of formData) {
    if (key.startsWith("key")) {
      entry = { key: value };
    }
    if (key.startsWith("value")) {
      entry.value = value;
    }
    if ("key" in entry && "value" in entry) {
      if (entry.key.length > 0 && entry.value.length > 0) {
        config.push(entry);
        entry = {};
      }
    }
  }
  chrome.storage.sync
    .set({ config: config })
    .then(chrome.runtime.sendMessage({ action: "update" }))
    .then(renderData());
}

document
  .querySelector("input[name=save]")
  .addEventListener("click", () => saveData());

document.addEventListener("DOMContentLoaded", renderData());
