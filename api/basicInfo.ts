import { VercelRequest, VercelResponse } from '@vercel/node';

let basicInfoData = [
  {
    "fullName": "riwandi",
    "email": "wandi@gmail.com",
    "department": "Engineering",
    "employeeId": "ENG-001",
    "role": "Engineer",
    "id": 1
  },
  {
    "fullName": "riwandi",
    "email": "wandi@gmail.com",
    "department": "Engineering",
    "employeeId": "ENG-001",
    "role": "Engineer",
    "id": 2
  },
  {
    "fullName": "wandi",
    "email": "wandi@gmail.com",
    "department": "Lending",
    "employeeId": "LEN-001",
    "role": "Engineer",
    "id": 3
  },
  {
    "fullName": "wandi",
    "email": "wandi@gmail.com",
    "department": "Lending",
    "employeeId": "LEN-001",
    "role": "Engineer",
    "id": 4
  },
  {
    "fullName": "riwandi",
    "email": "wandy@gmail.com",
    "department": "Engineering",
    "employeeId": "ENG-001",
    "role": "Engineer",
    "id": 5
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
    res.status(200).json(basicInfoData);
  } else if (req.method === 'POST') {
    const newItem = {
      ...req.body,
      id: Math.max(...basicInfoData.map(item => item.id)) + 1
    };
    basicInfoData.push(newItem);
    res.status(201).json(newItem);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}