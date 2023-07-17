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

window.onload = () => {
  if (
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1"
  ) {
    let userInput = prompt("Enter password:");
    sha256(userInput).then((hashedInput) => {
      if (hashedInput !== password) {
        alert("Incorrect password!");
        window.location.href = "/";
      } else {
        createForm();
      }
    });
  } else {
    createForm();
  }
  populateTagSelect();

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
};

function createForm() {
  let form = document.createElement("form");
  form.setAttribute("id", "add-post-form");

  let titleDiv = createFormField("title", "Title", "text", 25);
  let descriptionDiv = createFormField(
    "description",
    "Description",
    "text",
    25
  );
  let contentDiv = createFormField("content", "Content", "textarea");
  let tagDiv = createTagField();

  let submitButton = document.createElement("button");
  submitButton.setAttribute("type", "submit");
  submitButton.textContent = "Submit";

  form.appendChild(titleDiv);
  form.appendChild(descriptionDiv);
  form.appendChild(contentDiv);
  form.appendChild(tagDiv);
  form.appendChild(submitButton);

  document.querySelector("main").appendChild(form);

  document.getElementById("tags").addEventListener("change", function () {
    const newTagInput = document.getElementById("newTag");
    if (this.value === "new") {
      newTagInput.style.display = "block";
    } else {
      newTagInput.style.display = "none";
    }
  });
}

function createFormField(id, labelText, type, maxLength) {
  let div = document.createElement("div");

  let label = document.createElement("label");
  label.setAttribute("for", id);
  label.textContent = labelText;

  let input;
  if (type === "textarea") {
    input = document.createElement("textarea");
  } else {
    input = document.createElement("input");
    input.setAttribute("type", type);
  }

  input.setAttribute("name", id);
  input.setAttribute("id", id);
  if (maxLength) {
    input.setAttribute("maxlength", maxLength);
  }

  div.appendChild(label);
  div.appendChild(input);

  return div;
}

function createTagField() {
  let div = document.createElement("div");

  let label = document.createElement("label");
  label.setAttribute("for", "tags");
  label.textContent = "Tags";

  let select = document.createElement("select");
  select.setAttribute("name", "tags");
  select.setAttribute("id", "tags");

  let input = document.createElement("input");
  input.setAttribute("type", "text");
  input.setAttribute("name", "newTag");
  input.setAttribute("id", "newTag");
  input.style.display = "none";

  div.appendChild(label);
  div.appendChild(select);
  div.appendChild(input);

  return div;
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
