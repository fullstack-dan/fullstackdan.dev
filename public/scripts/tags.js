const apiBaseUrl =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "http://localhost:3000"
    : "https://fullstackdan-dev.onrender.com";

import { createBlogPost } from "./global.js";

let posts = [];
let postTagMap = new Map();

window.onload = function () {
  Promise.all([fetchTagsAndPopulate(), fetchPosts(), fetchPostTags()])
    .then(() =>
      displayPostsForTag(document.querySelector("#blog-posts").dataset.tag)
    )
    .catch((error) => {
      console.log(`Failed to load data: ${error}`);
    });
};

function fetchTagsAndPopulate() {
  return fetch(`${apiBaseUrl}/api/tags`)
    .then((response) => response.json())
    .then((tags) => {
      const tagList = document.querySelector("#tag-list");

      appendTagToTagList("all", 0, tagList);

      tags.forEach((tag) => {
        const divider = document.createElement("div");
        divider.textContent = "|";
        tagList.appendChild(divider);

        appendTagToTagList(tag.tag_name, tag.tag_id, tagList);
      });
    });
}

function appendTagToTagList(tagName, tagID, tagList) {
  const tagElement = document.createElement("div");
  tagElement.classList.add("tag");
  tagElement.dataset.tagID = tagID;
  tagElement.textContent = tagName;
  tagElement.addEventListener("click", () => displayPostsForTag(tagID));
  tagList.appendChild(tagElement);
}

function displayPostsForTag(tagID) {
  const blogPosts = document.querySelector("#blog-posts");
  blogPosts.innerHTML = "";

  if (tagID === 0) {
    posts
      .reverse()
      .forEach((post) => blogPosts.appendChild(createBlogPost(post)));
    return;
  }

  var taggedPosts = [];

  for (let postId of postTagMap.keys()) {
    let tagIds = postTagMap.get(postId);
    if (tagIds.includes(parseInt(tagID))) {
      let post = posts.find((post) => post.id === postId);
      if (post) {
        taggedPosts.push(post);
      }
    }
  }

  taggedPosts
    .reverse()
    .forEach((post) => blogPosts.appendChild(createBlogPost(post)));
}

function fetchPosts() {
  return fetch(`${apiBaseUrl}/api/posts`)
    .then((response) => response.json())
    .then((fetchedPosts) => {
      posts = fetchedPosts;
    });
}

function fetchPostTags() {
  return fetch(`${apiBaseUrl}/api/post-tags`)
    .then((response) => response.json())
    .then((postTags) => {
      postTags.forEach((pt) => {
        if (!postTagMap.has(pt.id)) {
          postTagMap.set(pt.id, []);
        }
        postTagMap.get(pt.id).push(pt.tag_id);
      });
    });
}
