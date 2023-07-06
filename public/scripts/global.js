document.querySelectorAll(".text-logo").forEach((item) => {
  item.style.cursor = "pointer";
  item.addEventListener("click", (event) => {
    if (window.location.pathname !== "/") {
      window.location.href = "/";
    }
  });
});
