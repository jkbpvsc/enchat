"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeMessage = (payload) => {
    payload.message = payload.message.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    return payload;
};
