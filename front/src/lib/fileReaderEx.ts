export default class FileReaderEx {
  static async readAsDataURL(blob: Blob): Promise<FileReader> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.addEventListener('load', p => {
        resolve(p.target!);
      });

      reader.addEventListener('error', e => {
        reject(e.target?.error ?? new Error('unknown error'));
      });

      reader.readAsDataURL(blob);
    });
  }
}
