document.querySelectorAll(".text-logo").forEach((item) => {
  item.style.cursor = "pointer";
  item.addEventListener("click", (event) => {
    window.location.href = "https://fullstackdan.dev";
  });
});
