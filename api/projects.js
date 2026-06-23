import { ObjectId } from 'mongodb';
import { connectToDatabase } from './db.js';

const defaultProjects = [
  {
    title: 'Robo Face Emotion Detection',
    description: 'AI-powered robotic face capable of detecting and displaying human emotions using DeepFace and OpenCV.',
    tech: ['Python', 'DeepFace', 'OpenCV', 'React'],
    videoPlaceholder: 'https://cdn.pixabay.com/video/2021/08/11/84687-587212049_large.mp4',
    link: '#',
    color: 'from-blue-600 to-indigo-600'
  },
  {
    title: 'AI Voice Chatbot',
    description: 'Voice-enabled AI chatbot using speech recognition and text-to-speech technology.',
    tech: ['HTML', 'CSS', 'JavaScript', 'Web Speech API'],
    videoPlaceholder: 'https://cdn.pixabay.com/video/2023/04/13/158766-817631558_large.mp4',
    link: 'https://friendlychatbot.vercel.app',
    color: 'from-emerald-600 to-teal-600'
  },
  {
    title: 'Diet Telegram Bot',
    description: 'Telegram bot providing diet guidance and automated responses.',
    tech: ['Python', 'Telegram API'],
    videoPlaceholder: 'https://cdn.pixabay.com/video/2020/05/25/40131-426003290_large.mp4',
    link: '#',
    color: 'from-orange-600 to-red-600'
  },
  {
    title: 'Animated Website',
    description: 'Modern responsive animated website with premium UI interactions.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    videoPlaceholder: 'https://cdn.pixabay.com/video/2022/11/22/139967-774026369_large.mp4',
    link: 'https://dfc-flax.vercel.app/',
    color: 'from-purple-600 to-pink-600'
  }
];

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'auth-praveen-token-2026';

function isAuthorized(req) {
  const authHeader = req.headers.authorization;
  return authHeader === `Bearer ${ADMIN_TOKEN}`;
}

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('projects');

    // GET
    if (req.method === 'GET') {
      // Ensure all default projects are present in the database
      for (const proj of defaultProjects) {
        const exists = await collection.findOne({ title: proj.title });
        if (!exists) {
          await collection.insertOne({ ...proj, createdAt: new Date() });
        }
      }
      const projects = await collection.find({}).toArray();
      return res.status(200).json(projects);
    }

    // AUTH REQUIRED FOR WRITE METHODS
    if (!isAuthorized(req)) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // POST
    if (req.method === 'POST') {
      const { title, description, tech, videoPlaceholder, link, color } = req.body;
      if (!title) {
        return res.status(400).json({ success: false, message: 'Project title is required' });
      }
      const newProject = {
        title,
        description: description || '',
        tech: Array.isArray(tech) ? tech : (tech ? tech.split(',').map(t => t.trim()) : []),
        videoPlaceholder: videoPlaceholder || 'https://cdn.pixabay.com/video/2022/11/22/139967-774026369_large.mp4',
        link: link || '#',
        color: color || 'from-blue-600 to-indigo-600',
        createdAt: new Date()
      };
      const result = await collection.insertOne(newProject);
      return res.status(201).json({ success: true, project: { ...newProject, _id: result.insertedId } });
    }

    // PUT
    if (req.method === 'PUT') {
      const { id, title, description, tech, videoPlaceholder, link, color } = req.body;
      if (!id) {
        return res.status(400).json({ success: false, message: 'Project ID is required' });
      }
      const updatedFields = {
        title,
        description: description || '',
        tech: Array.isArray(tech) ? tech : (tech ? tech.split(',').map(t => t.trim()) : []),
        videoPlaceholder: videoPlaceholder || 'https://cdn.pixabay.com/video/2022/11/22/139967-774026369_large.mp4',
        link: link || '#',
        color: color || 'from-blue-600 to-indigo-600',
        updatedAt: new Date()
      };
      await collection.updateOne({ _id: new ObjectId(id) }, { $set: updatedFields });
      return res.status(200).json({ success: true, project: { ...updatedFields, _id: id } });
    }

    // DELETE
    if (req.method === 'DELETE') {
      const id = req.query.id || req.body.id;
      if (!id) {
        return res.status(400).json({ success: false, message: 'Project ID is required' });
      }
      await collection.deleteOne({ _id: new ObjectId(id) });
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });

  } catch (error) {
    console.error('Projects API Error:', error);
    if (req.method === 'GET') {
      return res.status(200).json(defaultProjects);
    }
    return res.status(500).json({ success: false, message: 'Database operation failed', error: error.message });
  }
}
