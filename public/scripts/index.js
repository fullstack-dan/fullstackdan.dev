const apiBaseUrl =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "http://localhost:3000"
    : "https://fullstackdan-dev.onrender.com";

import { createBlogPost, populateTags } from "./global.js";

/**
 * Creates a typewriter effect on the home page.
 */
window.onload = function () {
  setTimeout(function () {
    var typewriter = document.querySelector(".typewriter");
    var helloWorld = "hello world";
    for (var i = 0; i < helloWorld.length; i++) {
      (function (i) {
        setTimeout(function () {
          typewriter.innerHTML += helloWorld[i];
          if (i === helloWorld.length - 1) {
            var cursor = document.createElement("span");
            cursor.classList.add("cursor");
            typewriter.appendChild(cursor);
          }
        }, 100 * i);
      })(i);
    }
  }, 2000);
};

const postTagsMap = new Map();
const blogPosts = document.querySelector("#blog-posts");

/**
 * Fetches post tags and their associated tags from the API, and populates the `postTagsMap` Map object with the results.
 * @returns {Promise} A Promise that resolves when all post tags have been fetched and processed.
 */
function fetchPostTags() {
  // Fetch post tags from the API
  return fetch(`${apiBaseUrl}/api/post-tags`)
    .then((response) => response.json())
    .then((postTags) => {
      // Fetch tags associated with each post tag
      return Promise.all(
        postTags.map((pt) =>
          fetch(`${apiBaseUrl}/api/tags/${pt.tag_id}`)
            .then((response) => response.json())
            .then((tag) => {
              // Add tag name to post tag object
              pt.tag_name = tag[0].tag_name;
              // Add post tag to postTagsMap
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
      // Do something with completed post tags if needed
    })
    .catch((error) => {
      console.log(`Failed to load post tags: ${error}`);
      return [];
    });
}

/**
 * Fetches posts from the API and populates the blog with the latest 3 posts.
 * @returns {Promise} A Promise that resolves when all posts have been fetched and processed.
 */
function fetchPosts() {
  // Fetch posts from the API
  return fetch(`${apiBaseUrl}/api/posts`)
    .then((response) => response.json())
    .then((posts) => {
      // Remove loading indicator
      document.querySelector("#posts-loading").remove();
      // Reverse order of posts and limit to latest 3
      posts.reverse();
      posts = posts.slice(0, 3);
      // Add each post to the blog
      for (let i = 0; i < posts.length; i++) {
        blogPosts.appendChild(createBlogPost(posts[i]));
      }
    })
    .catch((error) => {
      // Display error message if posts fail to load
      document.querySelector("#posts-loading").textContent =
        "posts aren't loading right now, sorry! please try again later.";
    });
}

// Fetch post tags and posts, and populate the blog with the latest 3 posts
Promise.all([fetchPostTags(), fetchPosts()]).then(() => {
  populateTags(postTagsMap, blogPosts);
});

let postsLoading = document.createElement("div");
postsLoading.id = "posts-loading";
postsLoading.textContent = "posts are loading...";
blogPosts.appendChild(postsLoading);
