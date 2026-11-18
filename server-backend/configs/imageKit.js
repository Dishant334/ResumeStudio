import ImageKit from '@imagekit/nodejs';

// Lazily created so the server still boots when ImageKit isn't configured.
let client = null;
export const getImageKit = () => {
  if (!process.env.IMAGEKIT_PRIVATE_KEY) return null;
  if (!client) client = new ImageKit({ privateKey: process.env.IMAGEKIT_PRIVATE_KEY });
  return client;
};

export default getImageKit;
