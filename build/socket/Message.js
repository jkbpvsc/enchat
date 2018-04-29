"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function encodeString(s) {
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
class Message {
    constructor(socketData) {
        this.message = "";
        this.en_check = "";
        this.author = "";
        this._valid = false;
        this.encoded = false;
        this.message = encodeString(socketData.message);
        if (socketData.en_check) {
            this.en_check = socketData.en_check;
        }
    }
    get valid() {
        return this._valid;
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
        this._valid = true;
        return this._valid;
    }
    setAuthor(author) {
        this.author = encodeString(author);
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
