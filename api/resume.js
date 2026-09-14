/* global process */
import { connectToDatabase } from './db.js';
import fs from 'fs';
import path from 'path';

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'auth-praveen-token-2026';

function isAuthorized(req) {
  const authHeader = req.headers.authorization;
  return authHeader === `Bearer ${ADMIN_TOKEN}`;
}

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('resume');

    // GET
    if (req.method === 'GET') {
      const resumeDoc = await collection.findOne({ key: 'main' });

      // If download parameter requested, serve PDF directly or redirect
      if (req.query.download === 'true') {
        if (resumeDoc?.pdfUrl) {
          if (resumeDoc.pdfUrl.startsWith('data:application/pdf;base64,')) {
            const base64Data = resumeDoc.pdfUrl.replace(/^data:application\/pdf;base64,/, '');
            const pdfBuffer = Buffer.from(base64Data, 'base64');
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename="Chennuboyina_Durga_Praveen__Resume.pdf"');
            return res.send(pdfBuffer);
          } else if (resumeDoc.pdfUrl.startsWith('http://') || resumeDoc.pdfUrl.startsWith('https://')) {
            return res.redirect(resumeDoc.pdfUrl);
          }
        }

        // Fallback to local default static file if available
        const defaultPath = path.resolve(process.cwd(), 'public/Chennuboyina_Durga_Praveen__Resume.pdf');
        if (fs.existsSync(defaultPath)) {
          const defaultBuffer = fs.readFileSync(defaultPath);
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', 'inline; filename="Chennuboyina_Durga_Praveen__Resume.pdf"');
          return res.send(defaultBuffer);
        }

        return res.status(404).json({ success: false, message: 'Resume PDF not found' });
      }

      return res.status(200).json({
        success: true,
        resume: resumeDoc || { pdfUrl: '/Chennuboyina_Durga_Praveen__Resume.pdf', updatedAt: null }
      });
    }

    // AUTH REQUIRED FOR WRITE METHODS
    if (!isAuthorized(req)) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // POST / PUT — Upload / Update Resume
    if (req.method === 'POST' || req.method === 'PUT') {
      const { pdfUrl } = req.body;
      if (!pdfUrl) {
        return res.status(400).json({ success: false, message: 'PDF URL or Base64 data is required' });
      }

      // Check size limit for base64 uploads (Must be under 2MB = 2,097,152 bytes)
      if (pdfUrl.startsWith('data:application/pdf;base64,')) {
        const base64String = pdfUrl.replace(/^data:application\/pdf;base64,/, '');
        const sizeInBytes = (base64String.length * 3) / 4;
        const MAX_SIZE = 2 * 1024 * 1024; // 2MB

        if (sizeInBytes > MAX_SIZE) {
          return res.status(400).json({
            success: false,
            message: `PDF size exceeds 2MB limit (Uploaded size: ${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB). Please select a PDF file smaller than 2MB.`
          });
        }

        // Attempt to save to public folder for local fallback
        try {
          const targetPath = path.resolve(process.cwd(), 'public/Chennuboyina_Durga_Praveen__Resume.pdf');
          fs.writeFileSync(targetPath, base64String, 'base64');
        } catch (err) {
          console.warn('[Resume] Could not update local static file (expected on Vercel):', err.message);
        }
      }

      const updatedDoc = {
        key: 'main',
        pdfUrl,
        updatedAt: new Date()
      };

      await collection.updateOne({ key: 'main' }, { $set: updatedDoc }, { upsert: true });

      return res.status(200).json({ success: true, message: 'Resume updated successfully', resume: updatedDoc });
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });

  } catch (error) {
    console.error('Resume API Error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating resume', error: error.message });
  }
}
