// Set the base URL for the API based on the current hostname
const apiBaseUrl =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "http://localhost:3000"
    : "https://fullstackdan-dev.onrender.com";

// Import functions from global.js
import { createBlogPost, populateTags } from "./global.js";

// Initialize posts array and postTagsMap Map object
let posts = [];
let postTagsMap = new Map();

// Load tags, posts, and post tags from the API and display posts for the selected tag
window.onload = function () {
  Promise.all([fetchTagsAndPopulate(), fetchPosts(), fetchPostTags()])
    .then(() =>
      displayPostsForTag(document.querySelector("#blog-posts").dataset.tag)
    )
    .catch((error) => {
      console.log(`Failed to load data: ${error}`);
    });
};

/**
 * Fetches all tags from the API and populates the tag list in the DOM.
 * @returns {Promise} A Promise that resolves when the tags have been fetched and the tag list has been populated.
 */
function fetchTagsAndPopulate() {
  return fetch(`${apiBaseUrl}/api/tags`)
    .then((response) => response.json())
    .then((tags) => {
      const tagList = document.querySelector("#tag-list");

      // Append 'all' tag to tag list
      appendTagToTagList("all", 0, tagList);

      // Append each tag to tag list
      tags.forEach((tag) => {
        const divider = document.createElement("div");
        divider.textContent = "|";
        tagList.appendChild(divider);

        appendTagToTagList(tag.tag_name, tag.tag_id, tagList);
      });
    });
}

/**
 * Appends a tag to the tag list in the DOM.
 * @param {string} tagName - The name of the tag.
 * @param {number} tagID - The ID of the tag.
 * @param {HTMLElement} tagList - The tag list element in the DOM.
 */
function appendTagToTagList(tagName, tagID, tagList) {
  const tagElement = document.createElement("div");
  tagElement.classList.add("tag");
  tagElement.dataset.tagID = tagID;
  tagElement.textContent = tagName;
  tagElement.addEventListener("click", () => displayPostsForTag(tagID));
  tagList.appendChild(tagElement);
}

/**
 * Displays the posts for the specified tag in the DOM.
 * @param {number} tagID - The ID of the tag to display posts for.
 */
function displayPostsForTag(tagID) {
  // Set the selected tag in the DOM
  document.querySelector("#blog-posts").dataset.tag = tagID;

  // Highlight the selected tag in the tag list
  const tagElements = document.querySelectorAll(".tag");
  tagElements.forEach((tagElement) => {
    if (parseInt(tagElement.dataset.tagID) === tagID) {
      tagElement.classList.add("selected");
    } else {
      tagElement.classList.remove("selected");
    }
  });

  // Clear out old posts
  const blogPosts = document.querySelector("#blog-posts");
  blogPosts.innerHTML = "";

  // Display all posts if 'all' tag is selected
  if (tagID === 0) {
    const reversePosts = posts.slice().reverse();
    reversePosts.forEach((post) => blogPosts.appendChild(createBlogPost(post)));
    populateTags(postTagsMap, blogPosts);
    return;
  }

  // Filter posts by tag and display them
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

/**
 * Fetches all posts from the API and stores them in the posts array.
 * @returns {Promise} A Promise that resolves when the posts have been fetched and stored in the posts array.
 */
function fetchPosts() {
  return fetch(`${apiBaseUrl}/api/posts`)
    .then((response) => response.json())
    .then((fetchedPosts) => {
      posts = fetchedPosts;
    });
}

/**
 * Fetches all post tags from the API, fetches the associated tags for each post tag, and stores the results in the postTagsMap Map object.
 * @returns {Promise} A Promise that resolves when the post tags and associated tags have been fetched and stored in the postTagsMap Map object.
 */
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
      // All the code that depends on the completed postTagsMap goes here
    })
    .catch((error) => {
      console.log(`Failed to load post tags: ${error}`);
      return [];
    });
}
