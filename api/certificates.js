/* global process */
import { ObjectId } from 'mongodb';
import fs from 'fs';
import path from 'path';
import { connectToDatabase } from './db.js';

const defaultCertificates = [
  { title: 'Frontend Web Development', pdfUrl: '' },
  { title: 'Artificial Intelligence Workshop', pdfUrl: '' },
  { title: 'Quantum Computing', pdfUrl: '' },
  { title: 'Python Essentials 1', pdfUrl: '' },
  { title: 'Python Essentials 2', pdfUrl: '' },
  { title: 'C Programming', pdfUrl: '' },
  { title: 'C++ Programming', pdfUrl: '' }
];

const ADMIN_TOKEN = 'auth-praveen-token-2026';

function isAuthorized(req) {
  const authHeader = req.headers.authorization;
  return authHeader === `Bearer ${ADMIN_TOKEN}`;
}

// Helper to save Base64 PDF data to public/certificates/ (local only) and return BSON-safe base64DataUrl
function saveBase64Pdf(title, base64DataUrl) {
  if (!base64DataUrl || !base64DataUrl.startsWith('data:application/pdf;base64,')) {
    return base64DataUrl; // Return as-is if already a URL or Google Drive link
  }
  
  // Try to save local file for development convenience, but do not fail if read-only
  try {
    const base64Data = base64DataUrl.replace(/^data:application\/pdf;base64,/, "");
    const fileName = `${title.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.pdf`;
    const targetDir = path.resolve(process.cwd(), 'public/certificates');
    
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    fs.writeFileSync(path.join(targetDir, fileName), base64Data, 'base64');
  } catch (err) {
    console.warn('[Certificates] Failed to write local file (expected on Vercel):', err.message);
  }
  
  // Return the base64 string to be stored directly in MongoDB so it is available on Vercel
  return base64DataUrl;
}

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('certificates');

    // GET
    if (req.method === 'GET') {
      const certificates = await collection.find({}).toArray();
      if (certificates.length === 0) {
        return res.status(200).json(defaultCertificates);
      }
      return res.status(200).json(certificates);
    }

    // AUTH REQUIRED FOR WRITE METHODS
    if (!isAuthorized(req)) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // POST
    if (req.method === 'POST') {
      const { title, pdfUrl } = req.body;
      if (!title) {
        return res.status(400).json({ success: false, message: 'Certificate title is required' });
      }
      
      const finalPdfUrl = saveBase64Pdf(title, pdfUrl);

      const newCertificate = {
        title,
        pdfUrl: finalPdfUrl || '',
        createdAt: new Date()
      };
      const result = await collection.insertOne(newCertificate);
      return res.status(201).json({ success: true, certificate: { ...newCertificate, _id: result.insertedId } });
    }

    // PUT
    if (req.method === 'PUT') {
      const { id, title, pdfUrl } = req.body;
      if (!id) {
        return res.status(400).json({ success: false, message: 'Certificate ID is required' });
      }
      
      const finalPdfUrl = saveBase64Pdf(title, pdfUrl);

      const updatedFields = {
        title,
        pdfUrl: finalPdfUrl || '',
        updatedAt: new Date()
      };
      await collection.updateOne({ _id: new ObjectId(id) }, { $set: updatedFields });
      return res.status(200).json({ success: true, certificate: { ...updatedFields, _id: id } });
    }

    // DELETE
    if (req.method === 'DELETE') {
      const id = req.query.id || req.body.id;
      if (!id) {
        return res.status(400).json({ success: false, message: 'Certificate ID is required' });
      }
      await collection.deleteOne({ _id: new ObjectId(id) });
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });

  } catch (error) {
    console.error('Certificates API Error:', error);
    if (req.method === 'GET') {
      return res.status(200).json(defaultCertificates);
    }
    return res.status(500).json({ success: false, message: 'Database operation failed', error: error.message });
  }
}
