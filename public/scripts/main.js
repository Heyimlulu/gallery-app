const gallery = document.getElementById("imageGallery");
const perPage = 30;

// Function to fetch and append images
function fetchImages() {
  fetch(`/many?perPage=${perPage}`)
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
    this.classList.add("hidden");
    document.body.classList.remove("overflow-hidden"); // Re-enable scrolling
    if (event.target === this) {
    }
  });

document.getElementById("refreshButton").addEventListener("click", refreshPage);
fetchImages();
