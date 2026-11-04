export function compressImage(file: File, maxSize = 640): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("Could not read the image."));

    reader.onload = () => {
      const image = new Image();

      image.onerror = () => reject(new Error("That file is not a valid image."));

      image.onload = () => {
        const scale = Math.min(
          1,
          maxSize / Math.max(image.width, image.height)
        );

        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);

        const context = canvas.getContext("2d");

        if (!context) {
          reject(new Error("Could not process the image."));
          return;
        }

        context.fillStyle = "#090A09";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };

        if (typeof reader.result !== "string") {
          reject(new Error("Could not read the image."));
          return;
        }

        image.src = reader.result;
    };

    reader.readAsDataURL(file);
  });
}