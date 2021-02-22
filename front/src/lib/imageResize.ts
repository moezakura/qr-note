export default class ImageResize {
  private image!: string;
  constructor(blob: string) {
    this.image = blob;
  }

  private imageLoad(): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const imageReader = new Image();

      imageReader.onload = () => {
        resolve(imageReader);
      };

      imageReader.onerror = () => {
        reject(imageReader);
      };

      imageReader.src = this.image;
    });
  }

  private canvas2JPEG(canvas: HTMLCanvasElement): Promise<Blob> {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        blob => {
          if (!blob) {
            reject();
            return;
          }
          resolve(blob);
        },
        'image/jpeg',
        0.85
      );
    });
  }

  async contain(size: number): Promise<File> {
    const image = await this.imageLoad();
    let width = image.width;
    let height = image.height;
    if (width > height) {
      const scale = size / width;
      width *= scale;
      height *= scale;
    } else {
      const scale = size / height;
      width *= scale;
      height *= scale;
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(image, 0, 0, width, height);

    const blob = await this.canvas2JPEG(canvas);
    return new File([blob], 'image.jpeg', { type: 'image/jpeg' });
  }
}
