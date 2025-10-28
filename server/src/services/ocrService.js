import Tesseract from 'tesseract.js';
import { parseCandidateExpiry } from '../utils/expiryUtils.js';

export const parseExpiryFromBuffer = async (buffer) => {
  const { data } = await Tesseract.recognize(buffer, 'eng', { logger: m => console.log(m) });
  const text = data.text;
  const parsed = parseCandidateExpiry(text); // implement regex parser in utils
  return parsed; // date string or null
};

export default { parseExpiryFromBuffer };
