const apiBaseUrl =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "http://localhost:3000"
    : "https://fullstackdan-dev.onrender.com";

import { createBlogPost } from "./global.js";

const blogPosts = document.querySelector("#blog-posts");

const postsPerPage = 5;
let currentPage = 1;
let allPosts = [];

function loadPosts(page) {
  if (allPosts.length === 0) {
    fetch(`${apiBaseUrl}/api/posts`)
      .then((response) => response.json())
      .then((posts) => {
        allPosts = posts.reverse();
        displayPosts(page);
      })
      .catch((error) => console.error(error));
  } else {
    displayPosts(page);
  }
}

function displayPosts(page) {
  // Clear out old posts
  blogPosts.innerHTML = "";

  const start = (page - 1) * postsPerPage;
  const end = page * postsPerPage;
  const postsForPage = allPosts.slice(start, end);

  for (let i = 0; i < postsForPage.length; i++) {
    blogPosts.appendChild(createBlogPost(postsForPage[i]));
  }
  document.querySelector("#page-btns").style.display = "flex";

  // Disable 'Next' button if there are no more posts
  if (end >= allPosts.length) {
    document.querySelector("#next-page").disabled = true;
  } else {
    document.querySelector("#next-page").disabled = false;
  }

  // Disable 'Prev' button if there are no previous posts
  if (start === 0) {
    document.querySelector("#prev-page").disabled = true;
  } else {
    document.querySelector("#prev-page").disabled = false;
  }
}

// Initial load of posts
loadPosts(currentPage);

// Handle click on next page button
document.querySelector("#next-page").addEventListener("click", () => {
  currentPage++;
  loadPosts(currentPage);
});

// Handle click on previous page button
document.querySelector("#prev-page").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    loadPosts(currentPage);
  }
});
