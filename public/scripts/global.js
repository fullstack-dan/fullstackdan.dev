document.querySelectorAll(".text-logo").forEach((item) => {
  item.style.cursor = "pointer";
  item.addEventListener("click", (event) => {
    window.location.href = "https://fullstackdan.dev";
  });
});

document
  .querySelector(".hamburger-menu")
  .addEventListener("click", function () {
    var navLinks = document.querySelector(".nav-links");
    if (navLinks.style.display === "none") {
      navLinks.style.display = "flex";
      navLinks.style.flexDirection = "column";
    } else {
      navLinks.style.display = "none";
    }
  });
