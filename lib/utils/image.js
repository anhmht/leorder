import atob from 'atob';

export const getBase64String = (file, dimension = { width: 180, height: 180 }, callback) => {
  const reader = new FileReader();

  reader.onloadend = () => {
    const tempImg = new Image();

    tempImg.src = reader.result;
    tempImg.onload = () => {
      let tempH; let tempW;
      const MAX_WIDTH = dimension.width;
      const MAX_HEIGHT = dimension.height;
      const canvas = document.createElement('canvas');

      tempW = tempImg.width;
      tempH = tempImg.height;
      if (tempW > tempH) {
        if (tempW > MAX_WIDTH) {
          tempH *= MAX_WIDTH / tempW;
          tempW = MAX_WIDTH;
        }
      } else if (tempH > MAX_HEIGHT) {
        tempW *= MAX_HEIGHT / tempH;
        tempH = MAX_HEIGHT;
      }
      canvas.width = tempW;
      canvas.height = tempH;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(tempImg, 0, 0, tempW, tempH);
      const dataURL = canvas.toDataURL(file.type || 'image/png');

      callback(dataURL);
    };
  };

  reader.readAsDataURL(file);
};

export const convertToBuffer = (data) => {
  // convert resized canvas to file object
  const blobBin = atob(data.split(',')[1]);
  const array = [];
  for (let i = 0; i < blobBin.length; i += 1) {
    array.push(blobBin.charCodeAt(i));
  }
  return Buffer.from(array);
};
