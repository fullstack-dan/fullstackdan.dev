const apiBaseUrl =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "http://localhost:3000"
    : "https://fullstackdan-dev.onrender.com";

import { createBlogPost } from "./global.js";

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

function populateTags() {
  for (let i = 0; i < blogPosts.children.length; i++) {
    const blogPost = blogPosts.children[i];
    const blogTags = blogPost.querySelector(".blog-tags");
    const postId = blogPost.querySelector("h1").dataset.postId;

    const postTagsArr = postTagsMap.get(parseInt(postId));

    for (let j = 0; j < postTagsArr.length; j++) {
      const tag = document.createElement("a");
      tag.href = `https://blog.fullstackdan.dev/tags/${postTagsArr[j].tag_id}`;
      tag.classList.add("blog-tag");
      tag.classList.add("link");
      tag.textContent = postTagsArr[j].tag_name;

      if (j < postTagsArr.length - 1) {
        tag.textContent += ", ";
      }

      blogTags.appendChild(tag);
    }
  }
}

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
  populateTags();
});

let postsLoading = document.createElement("div");
postsLoading.id = "posts-loading";
postsLoading.textContent = "posts are loading...";
blogPosts.appendChild(postsLoading);
