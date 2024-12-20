export const getCroppedImg = (imageSrc, crop) => {
    const canvas = document.createElement("canvas");
    const img = document.createElement("img");
    img.src = imageSrc;
  
    return new Promise((resolve, reject) => {
      img.onload = () => {
        const ctx = canvas.getContext("2d");
        canvas.width = crop.width;
        canvas.height = crop.height;
  
        ctx.drawImage(
          img,
          crop.x,
          crop.y,
          crop.width,
          crop.height,
          0,
          0,
          crop.width,
          crop.height
        );
  
        canvas.toBlob((blob) => {
          resolve(blob);
        }, "image/jpeg");
      };
      img.onerror = (error) => reject(error);
    });
  };
  