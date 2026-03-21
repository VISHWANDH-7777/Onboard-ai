import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export async function extractTextFromFile(file) {
  if (!file) {
    return '';
  }

  const fileName = file.originalname.toLowerCase();
  if (file.mimetype === 'text/plain' || fileName.endsWith('.txt')) {
    return file.buffer.toString('utf-8');
  }

  if (file.mimetype === 'application/pdf' || fileName.endsWith('.pdf')) {
    const parsed = await pdfParse(file.buffer);
    return parsed.text || '';
  }

  if (
    file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    fileName.endsWith('.docx')
  ) {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    return result.value || '';
  }

  return '';
}
