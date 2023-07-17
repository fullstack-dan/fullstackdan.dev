const apiBaseUrl =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "http://localhost:3000"
    : "https://fullstackdan-dev.onrender.com";

window.addEventListener("DOMContentLoaded", (event) => {
  const changelogContainer = document.getElementById("changelog");

  fetch(`${apiBaseUrl}/getChangelog`)
    .then((response) => response.text())
    .then((data) => {
      const entries = data.trim().split("\n\n\n");

      if (entries[0] === "") {
        return;
      }

      entries.forEach((entry) => {
        const lines = entry.split("\n");
        const [version, date] = lines[0]
          .replace("[", "")
          .replace("]", "")
          .split(" - ");
        const fixed = lines
          .slice(2, lines.indexOf("Added:") - 1)
          .filter((i) => i !== "");
        const added = lines
          .slice(lines.indexOf("Added:") + 1, lines.indexOf("Removed:") - 1)
          .filter((i) => i !== "");
        const removed = lines
          .slice(lines.indexOf("Removed:") + 1, lines.indexOf("Changed:") - 1)
          .filter((i) => i !== "");
        const changed = lines
          .slice(lines.indexOf("Changed:") + 1)
          .filter((i) => i !== "");

        const entryElement = document.createElement("div");
        entryElement.classList.add("changelog-entry");

        const versionDateElement = document.createElement("h1");
        versionDateElement.textContent = `[${version}] - ${date}`;
        entryElement.appendChild(versionDateElement);

        const sections = [
          { title: "Fixed:", items: fixed, sectionClass: "fix-section" },
          { title: "Added:", items: added, sectionClass: "add-section" },
          { title: "Removed:", items: removed, sectionClass: "remove-section" },
          { title: "Changed:", items: changed, sectionClass: "change-section" },
        ];

        sections.forEach(({ title, items, sectionClass }) => {
          if (items.length > 0 && items[0] !== "- " && items[0] !== "-") {
            const sectionElement = document.createElement("div");
            sectionElement.classList.add(sectionClass);

            const titleElement = document.createElement("p");
            titleElement.textContent = title;
            sectionElement.appendChild(titleElement);

            const listElement = document.createElement("ul");
            listElement.classList.add("list");
            items.forEach((item) => {
              const listItemElement = document.createElement("li");
              listItemElement.textContent = item;
              listElement.appendChild(listItemElement);
            });
            sectionElement.appendChild(listElement);

            entryElement.appendChild(sectionElement);
          }
        });

        changelogContainer.appendChild(entryElement);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

window.addEventListener("DOMContentLoaded", (event) => {
  const addChangelogBtn = document.getElementById("add-changelog-btn");
  const addChangelogForm = document.getElementById("add-changelog-form");

  addChangelogForm.style.display = "none";

  addChangelogBtn.addEventListener("click", () => {
    const isFormDisplayed = addChangelogForm.style.display === "flex";
    addChangelogForm.style.display = isFormDisplayed ? "none" : "flex";
  });
});

window.addEventListener("DOMContentLoaded", (event) => {
  const form = document.getElementById("add-changelog-form");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const version = document.getElementById("version").value;
    const date = document.getElementById("date").value;
    const fixed = document.getElementById("fixed").value;
    const added = document.getElementById("added").value;
    const removed = document.getElementById("removed").value;
    const changed = document.getElementById("changed").value;

    const changelogEntry =
      `[${version}] - ${date}\n` +
      `Fixed:\n${fixed
        .split("\n")
        .map((i) => `- ${i}`)
        .join("\n")}\n\n` +
      `Added:\n${added
        .split("\n")
        .map((i) => `- ${i}`)
        .join("\n")}\n\n` +
      `Removed:\n${removed
        .split("\n")
        .map((i) => `- ${i}`)
        .join("\n")}\n\n` +
      `Changed:\n${changed
        .split("\n")
        .map((i) => `- ${i}`)
        .join("\n")}\n\n`;

    fetch(`${apiBaseUrl}/addChangelog`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ change: changelogEntry }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    form.reset();
  });
});
