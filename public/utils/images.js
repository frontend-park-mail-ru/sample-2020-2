export const imgsFromImagesURLs = (images) => {
    return images.map((imageSrc) => {
        return `<div><img src="${imageSrc}"/></div>`;
    }).join('\n');
}
