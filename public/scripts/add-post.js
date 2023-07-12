async function sha256(input) {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hash = await window.crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const password =
  "b94e689b09eda0647be7d676336d047e3e54ab49a16a30241b614382514dd8ce";

if (
  window.location.hostname !== "localhost" &&
  window.location.hostname !== "127.0.0.1"
) {
  let userInput = prompt("Enter password:");
  sha256(userInput).then((hashedInput) => {
    if (hashedInput !== password) {
      console.log("Incorrect password!");
      window.location.href = "/";
    }
  });
}

const apiBaseUrl =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "http://localhost:3000"
    : "https://fullstackdan-dev.onrender.com";

function populateTagSelect() {
  const tagsSelect = document.getElementById("tags");

  fetch(`${apiBaseUrl}/api/tags`)
    .then((response) => response.json())
    .then((tags) => {
      tags.forEach((tag) => {
        const option = document.createElement("option");
        option.value = tag.tag_id;
        option.textContent = tag.tag_name;

        tagsSelect.appendChild(option);
      });

      const newTagOption = document.createElement("option");
      newTagOption.value = "new";
      newTagOption.textContent = "Add new tag...";
      tagsSelect.appendChild(newTagOption);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

window.onload = populateTagSelect;

document.getElementById("tags").addEventListener("change", function () {
  const newTagInput = document.getElementById("newTag");
  if (this.value === "new") {
    newTagInput.style.display = "block";
  } else {
    newTagInput.style.display = "none";
  }
});

document
  .getElementById("add-post-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    var title = document.getElementById("title").value;
    var description = document.getElementById("description").value;
    var content = document.getElementById("content").value;
    var tags = document.getElementById("tags").value;
    var newTag = document.getElementById("newTag").value;

    if (!title || !description || !content || !tags) {
      alert("Please fill all fields");
      return;
    }

    if (tags === "new" && !newTag) {
      alert("Please enter a name for the new tag");
      return;
    }

    let postTitle = document.querySelector("#title").value;
    let postDescription = document.querySelector("#description").value;
    let postContent = document.querySelector("#content").value;
    let postTags = document.querySelector("#tags").value;
    let newPostTag = document.querySelector("#newTag").value;

    let formData = {
      title: postTitle,
      description: postDescription,
      content: postContent,
      tags: postTags,
      newTag: newPostTag,
    };

    fetch(`${apiBaseUrl}/api/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        alert("Post added successfully!");
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error adding post!");
      });
  });
