This implements the API described in the VIT Full Stack assignment.

- POST `/bfhl`
- Request JSON: `{ "data": [ ... ] }`
- Response includes:
  - `is_success`
  - `user_id` (format: `full_name_ddmmyyyy`, lowercase, underscores)
  - `email`
  - `roll_number`
  - `odd_numbers` (strings)
  - `even_numbers` (strings)
  - `alphabets` (uppercase)
  - `special_characters`
  - `sum` (as string)
  - `concat_string` (letters reversed, alternating caps)

## Run locally
```bash
npm install
cp .env.example .env
# edit .env with your own details
npm start
