import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

export async function generateAnalysisPdf(analysis) {
  const outDir = path.resolve('backend', 'exports');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const fileName = `${analysis.analysisId}.pdf`;
  const filePath = path.join(outDir, fileName);

  await new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    doc.fontSize(20).text('NEBULA AI - Adaptive Onboarding Report', { underline: true });
    doc.moveDown();
    doc.fontSize(12).text(`Analysis ID: ${analysis.analysisId}`);
    doc.text(`User ID: ${analysis.userId}`);
    doc.text(`Target Role: ${analysis.targetRole || '-'}`);
    doc.text(`Match Score: ${analysis.matchScore}%`);
    doc.moveDown();

    doc.fontSize(14).text('Matched Skills');
    doc.fontSize(11).text((analysis.skills?.matchedSkills || []).join(', ') || '-');
    doc.moveDown();

    doc.fontSize(14).text('Missing Skills');
    doc.fontSize(11).text((analysis.skills?.missingSkills || []).join(', ') || '-');
    doc.moveDown();

    doc.fontSize(14).text('Learning Path');
    (analysis.learningPath || []).forEach((module, index) => {
      doc.fontSize(11).text(`${index + 1}. ${module.skill} (${module.duration})`);
      (module.steps || []).forEach((step) => doc.text(`   - ${step}`));
    });

    doc.end();

    stream.on('finish', resolve);
    stream.on('error', reject);
  });

  return {
    filePath,
    fileName,
  };
}
