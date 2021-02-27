import Image from '~/lib/classes/model/image';

export default class Note {
  private _itemID: string = '';
  private _id: string = '';
  private _images: Image[] = [];
  private _text: string = '';

  get itemID(): string {
    return this._itemID;
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get images(): Image[] {
    return this._images;
  }

  set images(value: Image[]) {
    this._images = value;
  }

  get text(): string {
    return this._text;
  }

  set text(value: string) {
    this._text = value;
  }

  fromData(itemID: string, data: any) {
    this._itemID = itemID;
    this.id = data['id'];
    this.images = data['images'];
    this.text = data['text'];
  }

  toObject(): any {
    return {
      id: this.id,
      text: this.text,
      images: this.images,
    };
  }
}
