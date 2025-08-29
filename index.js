const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const PORT = process.env.PORT || 3000;

// Helpers
function isDigits(str) {
  return /^[0-9]+$/.test(str);
}
function isLetters(str) {
  return /^[A-Za-z]+$/.test(str);
}
function sanitizeFullName(name) {
  if (!name) return 'john_doe';
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/_+/g, '_');
}
function extractLetters(str) {
  const match = String(str).match(/[A-Za-z]/g);
  return match ? match : [];
}
function alternatingCapsFromReversedLetters(letters) {
  const reversed = [...letters].reverse();
  return reversed
    .map((ch, idx) => (idx % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()))
    .join('');
}

app.post('/bfhl', (req, res) => {
  try {
    const body = req.body || {};
    const data = body.data;

    if (!Array.isArray(data)) {
      return res.status(200).send(JSON.stringify({
        is_success: false,
        user_id: `${sanitizeFullName(process.env.FULL_NAME)}_${process.env.DOB_DDMMYYYY || '17091999'}`,
        email: process.env.EMAIL || 'john@xyz.com',
        roll_number: process.env.ROLL_NUMBER || 'ABCD123',
        odd_numbers: [],
        even_numbers: [],
        alphabets: [],
        special_characters: [],
        sum: "0",
        concat_string: "",
        error: "Request body must be JSON with a 'data' array."
      }, null, 2));
    }

    const odd_numbers = [];
    const even_numbers = [];
    const alphabets = [];
    const special_characters = [];
    let sum = 0;
    const allLettersInOrder = [];

    for (const item of data) {
      const s = String(item);

      if (isDigits(s)) {
        const n = parseInt(s, 10);
        if (n % 2 === 0) even_numbers.push(s);
        else odd_numbers.push(s);
        sum += n;
      } else if (isLetters(s)) {
        alphabets.push(s.toUpperCase());
      } else {
        special_characters.push(s);
      }

      allLettersInOrder.push(...extractLetters(s));
    }

    const concat_string = alternatingCapsFromReversedLetters(allLettersInOrder);

    const response = {
      is_success: true,
      user_id: `${sanitizeFullName(process.env.FULL_NAME)}_${process.env.DOB_DDMMYYYY || '17091999'}`,
      email: process.env.EMAIL || 'john@xyz.com',
      roll_number: process.env.ROLL_NUMBER || 'ABCD123',
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum: String(sum),
      concat_string
    };

    return res.status(200).send(JSON.stringify(response, null, 2));
  } catch (err) {
    console.error(err);
    return res.status(200).send(JSON.stringify({
      is_success: false,
      user_id: `${sanitizeFullName(process.env.FULL_NAME)}_${process.env.DOB_DDMMYYYY || '17091999'}`,
      email: process.env.EMAIL || 'john@xyz.com',
      roll_number: process.env.ROLL_NUMBER || 'ABCD123',
      odd_numbers: [],
      even_numbers: [],
      alphabets: [],
      special_characters: [],
      sum: "0",
      concat_string: "",
      error: "Internal server error"
    }, null, 2));
  }
});

app.listen(PORT, () => {
  console.log(`BFHL API listening on port ${PORT}`);
});
