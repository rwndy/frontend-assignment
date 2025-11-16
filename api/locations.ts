import { VercelRequest, VercelResponse } from '@vercel/node';

const locations = [
  {
    "id": 1,
    "name": "Jakarta"
  },
  {
    "id": 2,
    "name": "Depok"
  },
  {
    "id": 3,
    "name": "Surabaya"
  }
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    res.status(200).json(locations);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}