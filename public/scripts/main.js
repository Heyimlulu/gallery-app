const gallery = document.getElementById("imageGallery");
const perPage = 25;

// Function to fetch and append images
function fetchImages() {
  fetch(`/random-images?perPage=${perPage}`)
    .then((response) => response.json())
    .then((data) => {
      renderGallery(data.images);
    })
    .catch((error) => console.error("Error fetching images:", error));
}

// Function to render images in the gallery
function renderGallery(images) {
  images.forEach((image, idx) => {
    const img = document.createElement("img");
    img.onclick = () => showEnlarged(img);
    img.src = image.url;
    img.classList.add("w-full", "h-auto");
    gallery.appendChild(img);
  });
}

// Function to check if scroll reached bottom of the page
// function isBottom() {
//   return (
//     window.innerHeight + window.scrollY >= document.body.offsetHeight - 100
//   );
// }

function showEnlarged(image) {
  const enlargedImage = document.getElementById("enlargedImage");
  enlargedImage.src = image.src;
  document.getElementById("enlargedImageContainer").classList.remove("hidden");

  // Disable scrolling
  document.body.classList.add("overflow-hidden");
}

// Function to reload the page with a random image
function refreshPage() {
  location.reload();
}

document
  .getElementById("enlargedImageContainer")
  .addEventListener("click", function (event) {
    if (event.target === this) {
      this.classList.add("hidden");
      document.body.classList.remove("overflow-hidden"); // Re-enable scrolling
    }
  });

// window.addEventListener("scroll", function () {
//   if (isBottom()) {
//     fetchImages();
//   }
// });

// check for session
fetch("/check-session")
  .then((response) => response.json())
  .then((data) => {
    if (!data.success) {
      alert("You need to enter the passcode to access the gallery.");
      window.location.replace("/login");
    } else {
      document
        .getElementById("refreshButton")
        .addEventListener("click", refreshPage);
      fetchImages();
    }
  })
  .catch((error) => console.error("Error checking session:", error));
