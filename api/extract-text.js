const mammoth = require('mammoth');
const formidable = require('formidable');
const fs = require('fs');

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
      keepExtensions: true
    });
    
    const [fields, files] = await form.parse(req);
    const file = files.file?.[0];

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('File received:', file.originalFilename, 'Size:', file.size, 'Mimetype:', file.mimetype);

    // Validate file type
    if (!file.originalFilename?.toLowerCase().endsWith('.docx') && 
        file.mimetype !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return res.status(400).json({ error: 'Invalid file type. Please upload a .docx file.' });
    }

    // Read file buffer
    let buffer;
    try {
      buffer = fs.readFileSync(file.filepath);
    } catch (readError) {
      console.error('Failed to read file:', readError);
      return res.status(500).json({ error: 'Failed to read uploaded file' });
    }
    
    // Extract text using mammoth
    let result;
    try {
      result = await mammoth.extractRawText({ buffer });
    } catch (mammothError) {
      console.error('Mammoth extraction failed:', mammothError);
      return res.status(500).json({ error: 'Failed to extract text from DOCX file. The file may be corrupted.' });
    }
    
    console.log('Extraction successful, characters:', result.value.length);
    
    // Clean up temp file
    try {
      fs.unlinkSync(file.filepath);
    } catch (cleanupError) {
      console.warn('Failed to cleanup temp file:', cleanupError);
    }
    
    res.json({ text: result.value });
  } catch (error) {
    console.error('Error extracting text:', error);
    res.status(500).json({ error: `Failed to extract text: ${error.message || 'Unknown server error'}` });
  }
}
