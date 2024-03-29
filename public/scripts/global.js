let footer = document.querySelector("footer");

let content = `
<div class="footer-grid">
  <div>
    <h1 class="text-logo">FLSTKDN_</h1>
  </div>
  <div>
    <h1 class="footer-info">aouloudan@icloud.com</h1>
  </div>
  <div>
    <h1 class="footer-info">Atlanta, GA</h1>
  </div>
  <div>
    <h1 class="footer-info">+1 (470) 461-3820</h1>
  </div>
  <div>Copyright 2023 Daniel Aoulou</div>
  <div>
  <a
      class="icon"
      href="https://blog.fullstackdan.dev/changelog"
      target="_blank"
    >
    <svg 
      class="icon link"
    xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="100px" height="100px"><path d="M 7 2 L 7 48 L 43 48 L 43 14.59375 L 42.71875 14.28125 L 30.71875 2.28125 L 30.40625 2 Z M 9 4 L 29 4 L 29 16 L 41 16 L 41 46 L 9 46 Z M 31 5.4375 L 39.5625 14 L 31 14 Z M 15 22 L 15 24 L 35 24 L 35 22 Z M 15 28 L 15 30 L 31 30 L 31 28 Z M 15 34 L 15 36 L 35 36 L 35 34 Z"/></svg>
    </a>
    <a
      class="icon"
      href="https://github.com/fullstack-dan"
      target="_blank"
    >
      <svg
        class="icon link"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          class="icon"
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
          fill="#24292f"
        />
      </svg>
    </a>
    <a href="https://twitter.com/flstkdn_" target="_blank">
      <svg
        class="icon link"
        xmlns="http://www.w3.org/2000/svg"
        xml:space="preserve"
        viewBox="0 0 248 204"
      >
        <path
          class="icon"
          d="M221.95 51.29c.15 2.17.15 4.34.15 6.53 0 66.73-50.8 143.69-143.69 143.69v-.04c-27.44.04-54.31-7.82-77.41-22.64 3.99.48 8 .72 12.02.73 22.74.02 44.83-7.61 62.72-21.66-21.61-.41-40.56-14.5-47.18-35.07 7.57 1.46 15.37 1.16 22.8-.87-23.56-4.76-40.51-25.46-40.51-49.5v-.64c7.02 3.91 14.88 6.08 22.92 6.32C11.58 63.31 4.74 33.79 18.14 10.71c25.64 31.55 63.47 50.73 104.08 52.76-4.07-17.54 1.49-35.92 14.61-48.25 20.34-19.12 52.33-18.14 71.45 2.19 11.31-2.23 22.15-6.38 32.07-12.26-3.77 11.69-11.66 21.62-22.2 27.93 10.01-1.18 19.79-3.86 29-7.95-6.78 10.16-15.32 19.01-25.2 26.16z"
        />
      </svg>
    </a>
  </div>
</div>
`;

footer.innerHTML = content;

let navbar = document.querySelector("nav");

let navbarContent = `
<h1 class="text-logo">FLSTKDN_</h1>
<ul class="nav-links">
  <li class="link"><a href="https://blog.fullstackdan.dev">blog</a></li>
</ul>
`;

//  <li class="link"><a href="">about</a></li>
//  <li class="link"><a href="">contact</a></li>

navbar.innerHTML = navbarContent;

document.querySelectorAll(".text-logo").forEach((item) => {
  item.style.cursor = "pointer";
  item.addEventListener("click", (event) => {
    window.location.href = "https://fullstackdan.dev";
  });
});

const blogPosts = document.querySelector("#blog-posts");

export function createBlogPost(post) {
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

export function populateTags(postTagsMap, blogPosts) {
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
