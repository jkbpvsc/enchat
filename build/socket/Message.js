"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Message {
    constructor(socketData) {
        this.message = "";
        this.en_check = "";
        this.author = "";
        this._valid = false;
        this.encoded = false;
        this.message = socketData.message;
        if (socketData.en_check) {
            this.en_check = socketData.en_check;
        }
    }
    get valid() {
        return this._valid;
    }
    encodeHTML() {
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
            return false;
        }
        if (this.author.length === 0) {
            this._valid = false;
            return false;
        }
        this.encodeHTML();
        this._valid = true;
        return this._valid;
    }
    setAuthor(author) {
        this.author = author;
        this._valid = false;
    }
    render() {
        return {
            message: this.message,
            author: this.author
        };
    }
}
exports.default = Message;
