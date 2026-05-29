import { MongoClient } from 'mongodb';

let cachedClient: MongoClient | null = null;

async function getDb() {
  if (!cachedClient) {
    cachedClient = new MongoClient(process.env.MONGODB_URI as string);
    await cachedClient.connect();
  }
  return cachedClient.db('atfacilities');
}

export default async function handler(req: any, res: any) {
  try {
    const db = await getDb();
    const collection = db.collection('enquiries');

    // ── POST — save a new enquiry ──────────────────────────────
    if (req.method === 'POST') {
      const data = req.body;

      if (!data?.name || !data?.phone || !data?.destination) {
        return res.status(400).json({ error: 'name, phone and destination are required' });
      }

      const doc = {
        name: String(data.name).slice(0, 80),
        phone: String(data.phone).slice(0, 20),
        email: data.email ? String(data.email).slice(0, 120) : '',
        destination: String(data.destination).slice(0, 80),
        travelDate: data.travelDate ? String(data.travelDate).slice(0, 40) : '',
        pax: data.pax ? String(data.pax).slice(0, 20) : '',
        service: data.service ? String(data.service).slice(0, 60) : '',
        notes: data.notes ? String(data.notes).slice(0, 800) : '',
        createdAt: new Date(),
      };

      await collection.insertOne(doc);
      return res.status(201).json({ success: true });
    }

    // ── GET — return all enquiries (admin only) ────────────────
    if (req.method === 'GET') {
      const password = req.headers['x-admin-password'];

      if (!password || password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const enquiries = await collection
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

      return res.status(200).json(enquiries);
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error: any) {
    console.error('Enquiries API error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
