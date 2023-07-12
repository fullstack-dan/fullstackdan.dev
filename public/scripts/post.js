const apiBaseUrl =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "http://localhost:3000"
    : "https://fullstackdan-dev.onrender.com";

fetch(`${apiBaseUrl}/blog`)
  .then((response) => response.json())
  .then((data) => console.log(data));

//on load, check the local storage for a post id
const main = document.querySelector("main");
window.onload = function () {
  const postId = parseInt(localStorage.getItem("postId"));
  if (postId !== null) {
    fetch(`${apiBaseUrl}/blog/${postId}`)
      .then((res) => {
        return res.json();
      })
      .then((post) => {
        const postHTML = generatePostHTML(post);

        main.innerHTML = postHTML;
      })
      .catch((error) => console.error(error));
  }
};

function generatePostHTML(post) {
  // Replace newline characters with <br> tags
  const body = post.body.replace(/\n/g, "<br>");

  return `
    <div id="post-title">
      <h1>${post.title}</h1>
      <h1>[${post.id.toString().padStart(2, "0")}]</h1>
    </div>
    <div id="post-info">
      <div id="post-author">${post.author}</div>
      <div id="post-date">${post.created_at.slice(0, 10)}</div>
    </div>
    <div id="post-content">
      ${body}
    </div>
  `;
}
