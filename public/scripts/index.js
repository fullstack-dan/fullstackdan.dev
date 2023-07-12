const apiBaseUrl =
  location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://fullstackdan-dev.onrender.com";

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

const blogPosts = document.querySelector("#blog-posts");

const postTagsMap = new Map();
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

  const blogTags = document.createElement("div");
  blogTags.classList.add("blog-tags");
  blogExtraInfo.appendChild(blogTags);

  const blogNumber = document.createElement("div");
  blogNumber.classList.add("blog-number");
  blogNumber.textContent = `[${id.toString().padStart(2, "0")}]`;
  blogPost.appendChild(blogNumber);

  if (blogPosts.children.length > 0) {
    blogPost.style.borderTop = "none";
  }

  return blogPost;
}

function populateTags() {
  for (let i = 0; i < blogPosts.children.length; i++) {
    const blogPost = blogPosts.children[i];
    const blogTags = blogPost.querySelector(".blog-tags");
    const postId = blogPost.querySelector("h1").dataset.postId;

    // Get the tags related to this post
    const postTagsArr = postTagsMap.get(parseInt(postId));

    for (let j = 0; j < postTagsArr.length; j++) {
      const tag = document.createElement("a");
      tag.href = `https://blog.fullstackdan.dev/tags/${postTagsArr[j].tag_name}`;
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

let postsLoading = document.createElement("div");
postsLoading.id = "posts-loading";
postsLoading.textContent = "posts are loading...";
blogPosts.appendChild(postsLoading);
