const apiBaseUrl =
  location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://fullstackdan-dev.onrender.com";

//on load, get the typewriter effect going
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

// fetch("http://localhost:5000/api")
//   .then((response) => response.json())
//   .then((data) => console.log(data))
//   .catch((error) => console.error("Error:", error));

//find the element with the blog-posts id
const blogPosts = document.querySelector("#blog-posts");

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
  blogLink.href = "#";
  blogLink.textContent = title;
  blogTitle.appendChild(blogLink);
  blogInfo.appendChild(blogTitle);
  blogTitle.dataset.postId = id;

  blogTitle.addEventListener("click", function () {
    updateLocalStorage(this.dataset.postId);
    window.location.href = "public/post.html";
  });

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

  //if the blogPosts element has any children, do not render a top border. Manipulate the style ditrectly
  if (blogPosts.children.length > 0) {
    blogPost.style.borderTop = "none";
  }

  return blogPost;
}

fetch(`${apiBaseUrl}/blog`)
  .then((response) => response.json())
  .then((posts) => {
    posts.reverse();
    for (let i = 0; i < posts.length; i++) {
      blogPosts.appendChild(createBlogPost(posts[i]));
    }
  })
  .catch((error) => console.error(error));

//create a function that updates the local storage with the post id
function updateLocalStorage(postId) {
  localStorage.setItem("postId", postId);
}
