// Set the base URL for the API based on the current hostname
const apiBaseUrl =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "http://localhost:3000"
    : "https://fullstackdan-dev.onrender.com";

// Import functions from global.js
import { createBlogPost, populateTags } from "./global.js";

// Get the blog posts container and create a new Map object to store post tags
const blogPosts = document.querySelector("#blog-posts");
const postTagsMap = new Map();

// Set the number of posts to display per page and initialize the current page and allPosts array
const postsPerPage = 5;
let currentPage = 1;
let allPosts = [];

/**
 * Loads posts from the API and displays them on the specified page.
 * @param {number} page - The page number to display.
 */
function loadPosts(page) {
  if (allPosts.length === 0) {
    // Fetch all posts from the API if allPosts array is empty
    fetch(`${apiBaseUrl}/api/posts`)
      .then((response) => response.json())
      .then((posts) => {
        // Reverse the order of the posts and display them on the specified page
        allPosts = posts.reverse();
        displayPosts(page);
      })
      .catch((error) => console.error(error));
  } else {
    // Display the posts on the specified page if allPosts array is not empty
    displayPosts(page);
  }
}

/**
 * Displays the specified page of posts.
 * @param {number} page - The page number to display.
 */
function displayPosts(page) {
  // Clear out old posts
  blogPosts.innerHTML = "";

  // Calculate the start and end indices for the posts to display on the specified page
  const start = (page - 1) * postsPerPage;
  const end = page * postsPerPage;
  const postsForPage = allPosts.slice(start, end);

  // Add each post to the blog
  for (let i = 0; i < postsForPage.length; i++) {
    blogPosts.appendChild(createBlogPost(postsForPage[i]));
  }

  // Display the page buttons
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

  // Populate the post tags
  populateTags(postTagsMap, blogPosts);
}

// Fetch post tags and their associated tags from the API, and populate the postTagsMap Map object with the results
fetch(`${apiBaseUrl}/api/post-tags`)
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
    // All the code that depends on the completed postTagsMap goes here
    // Load the initial page of posts and add event listeners to the page buttons
    loadPosts(currentPage);
    document.querySelector("#next-page").addEventListener("click", () => {
      currentPage++;
      loadPosts(currentPage);
    });
    document.querySelector("#prev-page").addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        loadPosts(currentPage);
      }
    });
  })
  .catch((error) => {
    console.log(`Failed to load post tags: ${error}`);
    return [];
  });
