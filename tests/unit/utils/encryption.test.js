const { encrypt, decrypt } = require('../../../utils/encryption');

describe('Encryption Utils', () => {
  const testKey = 'test-encryption-key-32-bytes-long!';
  const testText = 'Sensitive medical information';

  it('should encrypt and decrypt text correctly', () => {
    const encrypted = encrypt(testText, testKey);
    expect(encrypted).toHaveProperty('content');
    expect(encrypted).toHaveProperty('iv');

    const decrypted = decrypt(encrypted.content, testKey, encrypted.iv);
    expect(decrypted).toBe(testText);
  });

  it('should generate different IVs for same content', () => {
    const encrypted1 = encrypt(testText, testKey);
    const encrypted2 = encrypt(testText, testKey);
    expect(encrypted1.iv).not.toBe(encrypted2.iv);
  });
});