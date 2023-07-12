const apiBaseUrl =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "http://localhost:3000"
    : "https://fullstackdan-dev.onrender.com";

import { createBlogPost, populateTags } from "./global.js";

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

Promise.all([
  fetch(`${apiBaseUrl}/api/post-tags`)
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
    }),
  fetch(`${apiBaseUrl}/api/posts`)
    .then((response) => response.json())
    .then((posts) => {
      document.querySelector("#posts-loading").remove();
      posts.reverse();
      posts = posts.slice(0, 3);
      for (let i = 0; i < posts.length; i++) {
        blogPosts.appendChild(createBlogPost(posts[i]));
      }
    })
    .catch((error) => {
      document.querySelector("#posts-loading").textContent =
        "posts aren't loading right now, sorry! please try again later.";
    }),
]).then(() => {
  populateTags(postTagsMap, blogPosts);
});

let postsLoading = document.createElement("div");
postsLoading.id = "posts-loading";
postsLoading.textContent = "posts are loading...";
blogPosts.appendChild(postsLoading);
