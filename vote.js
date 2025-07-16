// vote.js

function getRandomPair(images) {
  if (images.length < 2) return [];

  let index1 = Math.floor(Math.random() * images.length);
  let index2;
  do {
    index2 = Math.floor(Math.random() * images.length);
  } while (index2 === index1);

  return [images[index1], images[index2]];
}

function displayImages(img1, img2, allImages) {
  const container = document.getElementById("vote-container");
  container.innerHTML = "";

  const createImageCard = (imgData, index) => {
    const img = document.createElement("img");
    img.src = imgData.url;
    img.alt = "Face";
    img.className = "vote-img";
    img.onclick = () => {
      const realIndex = allImages.findIndex(
        (i) => i.url === imgData.url && i.name === imgData.name
      );
      backend.voteImage(realIndex);
      fetchVoteImages();
    };
    return img;
  };

  container.appendChild(createImageCard(img1, 0));
  container.appendChild(createImageCard(img2, 1));
}

function fetchVoteImages() {
  const approvedImages = backend.getApprovedImages();
  if (approvedImages.length < 2) {
    document.getElementById("vote-container").innerHTML =
      "<p>Not enough images to vote. Please upload more!</p>";
    return;
  }

  const [img1, img2] = getRandomPair(approvedImages);
  displayImages(img1, img2, approvedImages);
}

document.addEventListener("DOMContentLoaded", fetchVoteImages);
