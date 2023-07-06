//for any .text_logo class, when clicked, go to the home page. don't do anything if the user is already on the home page, don't use jquery
document.querySelectorAll(".text-logo").forEach((item) => {
  item.style.cursor = "pointer";
  item.addEventListener("click", (event) => {
    if (window.location.pathname !== "/") {
      window.location.href = "/";
    }
  });
});
