export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  const isDigits = (str) => /^[0-9]+$/.test(String(str));
  const isLetters = (str) => /^[A-Za-z]+$/.test(String(str));
  const sanitizeFullName = (name) => {
    if (!name) return 'john_doe';
    return name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .replace(/_+/g, '_');
  };
  const extractLetters = (str) => {
    const match = String(str).match(/[A-Za-z]/g);
    return match ? match : [];
  };
  const alternatingCapsFromReversedLetters = (letters) => {
    const reversed = [...letters].reverse();
    return reversed
      .map((ch, idx) => (idx % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()))
      .join('');
  };

  const userIdBase = `${sanitizeFullName(process.env.FULL_NAME)}_${process.env.DOB_DDMMYYYY || '17091999'}`;
  const defaultEmail = process.env.EMAIL || 'john@xyz.com';
  const defaultRoll = process.env.ROLL_NUMBER || 'ABCD123';

  if (req.method !== 'POST') {
    return res.status(200).json({
      is_success: false,
      user_id: userIdBase,
      email: defaultEmail,
      roll_number: defaultRoll,
      odd_numbers: [],
      even_numbers: [],
      alphabets: [],
      special_characters: [],
      sum: "0",
      concat_string: "",
      error: "Only POST allowed. Send JSON with { \"data\": [...] }"
    });
  }

  const data = req.body?.data;

  if (!Array.isArray(data)) {
    return res.status(200).json({
      is_success: false,
      user_id: userIdBase,
      email: defaultEmail,
      roll_number: defaultRoll,
      odd_numbers: [],
      even_numbers: [],
      alphabets: [],
      special_characters: [],
      sum: "0",
      concat_string: "",
      error: "Request body must be JSON with a 'data' array."
    });
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

  return res.status(200).json({
    is_success: true,
    user_id: userIdBase,
    email: defaultEmail,
    roll_number: defaultRoll,
    odd_numbers,
    even_numbers,
    alphabets,
    special_characters,
    sum: String(sum),
    concat_string
  });
}
