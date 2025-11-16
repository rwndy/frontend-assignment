import { VercelRequest, VercelResponse } from '@vercel/node';

// Sample locations data from the mock file
const locations = [
  { "id": 1, "name": "Jakarta" },
  { "id": 2, "name": "Depok" },
  { "id": 3, "name": "Surabaya" }
];

// For demonstration, we'll use a smaller subset of the details data
// In a real scenario, you'd store this in a database
let detailsData = [
  {
    "photo": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2NjYyIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5QaG90bzwvdGV4dD48L3N2Zz4=",
    "fullName": "Sample Employee",
    "email": "sample@company.com",
    "department": "Engineering",
    "employeeId": "ENG-001",
    "role": "Software Engineer",
    "location": "Jakarta",
    "phoneNumber": "123-456-7890",
    "id": 1
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
    const { path } = req.query;
    
    if (path && path[0] === 'locations') {
      res.status(200).json(locations);
    } else {
      res.status(200).json(detailsData);
    }
  } else if (req.method === 'POST') {
    const newDetail = {
      ...req.body,
      id: Math.max(...detailsData.map(item => item.id)) + 1
    };
    detailsData.push(newDetail);
    res.status(201).json(newDetail);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}