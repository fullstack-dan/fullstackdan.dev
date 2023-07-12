const apiBaseUrl =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "http://localhost:3000"
    : "https://fullstackdan-dev.onrender.com";

import { createBlogPost, populateTags } from "./global.js";

let posts = [];
let postTagsMap = new Map();

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
  document.querySelector("#blog-posts").dataset.tag = tagID;

  const tagElements = document.querySelectorAll(".tag");
  tagElements.forEach((tagElement) => {
    if (parseInt(tagElement.dataset.tagID) === tagID) {
      tagElement.classList.add("selected");
    } else {
      tagElement.classList.remove("selected");
    }
  });

  const blogPosts = document.querySelector("#blog-posts");
  blogPosts.innerHTML = "";

  if (tagID === 0) {
    const reversePosts = posts.slice().reverse();
    reversePosts.forEach((post) => blogPosts.appendChild(createBlogPost(post)));
    populateTags(postTagsMap, blogPosts);
    return;
  }

  var taggedPosts = [];

  for (let postId of postTagsMap.keys()) {
    let tagObjects = postTagsMap.get(postId);

    if (tagObjects.some((tagObj) => tagObj.tag_id === parseInt(tagID))) {
      let post = posts.find((post) => post.id === postId);
      if (post) {
        taggedPosts.push(post);
      }
    }
  }

  taggedPosts
    .sort((a, b) => a.id - b.id)
    .reverse()
    .forEach((post) => blogPosts.appendChild(createBlogPost(post)));

  populateTags(postTagsMap, blogPosts);
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
      return Promise.all(
        postTags.map((pt) =>
          fetch(`${apiBaseUrl}/api/tags/${pt.tag_id}`)
            .then((response) => response.json())
            .then((tag) => {
              pt.tag_name = tag[0].tag_name;
              if (postTagsMap.has(pt.id)) {
                postTagsMap.get(pt.id).push(pt);
              } else {
                postTagsMap.set(pt.id, [pt]);
              }
              return pt;
            })
        )
      );
    })
    .then((completedPostTags) => {
      // postTags.push(...completedPostTags);
    })
    .catch((error) => {
      console.log(`Failed to load post tags: ${error}`);
      return [];
    });
}
