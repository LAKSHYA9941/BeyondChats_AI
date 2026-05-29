import { MongoClient, ObjectId } from 'mongodb';

let cachedClient: MongoClient | null = null;

async function getDb() {
  if (!cachedClient) {
    cachedClient = new MongoClient(process.env.MONGODB_URI as string);
    await cachedClient.connect();
  }
  return cachedClient.db('atfacilities');
}

const TEN_MINUTES = 10 * 60 * 1000;

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
        resolvedAt: null,
        createdAt: new Date(),
      };

      await collection.insertOne(doc);
      return res.status(201).json({ success: true });
    }

    // ── Auth check for all admin methods ───────────────────────
    const password = req.headers['x-admin-password'];
    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // ── GET — return all enquiries (auto-cleanup stale resolved) ─
    if (req.method === 'GET') {
      // Delete enquiries resolved for 10+ minutes
      await collection.deleteMany({
        resolvedAt: { $ne: null, $lte: new Date(Date.now() - TEN_MINUTES) },
      });

      const enquiries = await collection
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

      return res.status(200).json(enquiries);
    }

    // ── PATCH — toggle resolvedAt timestamp ────────────────────
    if (req.method === 'PATCH') {
      const { id, resolved } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'id is required' });
      }

      await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { resolvedAt: resolved ? new Date() : null } },
      );

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error: any) {
    console.error('Enquiries API error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
