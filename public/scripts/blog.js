const apiBaseUrl =
  location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://fullstackdan-dev.onrender.com";

const blogPosts = document.querySelector("#blog-posts");

const postsPerPage = 5;
let currentPage = 1;
let allPosts = [];

function createBlogPost(post) {
  const title = post.title,
    author = post.author,
    description = post.description,
    date = post.created_at.slice(0, 10),
    id = post.id;

  const blogPost = document.createElement("div");
  blogPost.classList.add("blog-post");

  const blogInfo = document.createElement("div");
  blogInfo.classList.add("blog-info");
  blogPost.appendChild(blogInfo);

  const blogTitle = document.createElement("h1");
  const blogLink = document.createElement("a");
  blogLink.href = "https://blog.fullstackdan.dev/posts/" + id;
  blogLink.textContent = title;
  blogTitle.appendChild(blogLink);
  blogInfo.appendChild(blogTitle);
  blogTitle.dataset.postId = id;

  const blogExtraInfo = document.createElement("div");
  blogExtraInfo.classList.add("blog-extra-info");
  blogInfo.appendChild(blogExtraInfo);

  const blogDescription = document.createElement("h2");
  blogDescription.textContent = description;
  blogExtraInfo.appendChild(blogDescription);

  const blogAuthor = document.createElement("h2");
  blogAuthor.textContent = author;
  blogExtraInfo.appendChild(blogAuthor);

  const blogDate = document.createElement("h2");
  blogDate.textContent = date;
  blogExtraInfo.appendChild(blogDate);

  const blogNumber = document.createElement("div");
  blogNumber.classList.add("blog-number");
  blogNumber.textContent = `[${id.toString().padStart(2, "0")}]`;
  blogPost.appendChild(blogNumber);

  if (blogPosts.children.length > 0) {
    blogPost.style.borderTop = "none";
  }

  return blogPost;
}

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
