const CryptoJS = require('crypto-js');

const encrypt = (text, key) => {
  const iv = CryptoJS.lib.WordArray.random(16);
  const encrypted = CryptoJS.AES.encrypt(text, key, {
    iv: iv
  });
  return {
    content: encrypted.toString(),
    iv: iv.toString()
  };
};

const decrypt = (encryptedData, key, iv) => {
  const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
    iv: CryptoJS.enc.Hex.parse(iv)
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
};

module.exports = { encrypt, decrypt };