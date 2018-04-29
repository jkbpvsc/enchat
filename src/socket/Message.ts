interface SocketMessage {
  message: string
  en_check ?: string
}

export default class Message {
  private message: string = "";
  private en_check: string = "";
  private author: string = "";
  private _valid: boolean = false;
  private encoded: boolean = false;

  constructor(socketData: SocketMessage) {
    this.message = socketData.message;

    if (socketData.en_check) {
      this.en_check = socketData.en_check;
    }
  }

  get valid() {
    return this._valid;
  }

  encodeHTML(): void {
    if (!this.encoded) {
      this.message = this.message
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

      this.encoded = true;
    }
  }

  validate() {
    if (this.message.length === 0) {
      this._valid = false;
      return false
    }

    if (this.author.length === 0) {
      this._valid = false;
      return false
    }

    this.encodeHTML();
    this._valid = true;

    return this._valid
  }

  setAuthor(author: string) {
    this.author = author;
    this._valid = false;
  }

  render() {
    return {
      message: this.message,
      author: this.author
    }
  }
}