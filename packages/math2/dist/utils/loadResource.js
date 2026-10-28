async function loadImage(url) {
  const image = new Image();
  image.src = url;
  await new Promise((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error(`Failed to load image: ${url}`));
  });
  return image;
}
async function loadJSON(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load JSON: ${url} (${response.status})`);
  }
  return response.json();
}
async function loadText(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load text: ${url} (${response.status})`);
  }
  return response.text();
}
async function loadBlob(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load blob: ${url} (${response.status})`);
  }
  return response.blob();
}
async function loadArrayBuffer(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load array buffer: ${url} (${response.status})`);
  }
  return response.arrayBuffer();
}
async function loadAudio(url) {
  const audio = new Audio();
  audio.src = url;
  await new Promise((resolve, reject) => {
    audio.oncanplaythrough = () => resolve();
    audio.onerror = () => reject(new Error(`Failed to load audio: ${url}`));
  });
  return audio;
}
async function loadVideo(url) {
  const video = document.createElement("video");
  video.src = url;
  await new Promise((resolve, reject) => {
    video.oncanplaythrough = () => resolve();
    video.onerror = () => reject(new Error(`Failed to load video: ${url}`));
  });
  return video;
}
async function loadResources(urls, loader) {
  return Promise.all(urls.map(loader));
}
export {
  loadArrayBuffer,
  loadAudio,
  loadBlob,
  loadImage,
  loadJSON,
  loadResources,
  loadText,
  loadVideo
};
