const express = require('express');
const nodemailer = require('nodemailer');
const { PDFDocument } = require('pdf-lib');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.post('/api/sendContract', async (req, res) => {
  try {
    const { firstName, lastName, email, signatureDataUrl } = req.body;

    console.log('📥 Received contract request for:', email);

    // Check if env variables exist
    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
      console.error('❌ Missing Gmail credentials in environment variables');
      return res.status(500).send('Server email configuration error');
    }

    // Load contract PDF
    const pdfPath = path.resolve(__dirname, 'contract.pdf');
    console.log('📄 Loading contract from:', pdfPath);
    const existingPdfBytes = await fs.promises.readFile(pdfPath);

    // Prepare PDF
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const firstPage = pdfDoc.getPages()[0];

    const base64Signature = signatureDataUrl.split(',')[1];
    const signatureImage = await pdfDoc.embedPng(base64Signature);
    const { width, height } = signatureImage.scale(0.5);

    firstPage.drawImage(signatureImage, {
      x: 233,
      y: 45,
      width: 100,
      height: 50,
    });

    const pdfBytes = await pdfDoc.save();

    // Configure Gmail transport
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    console.log('📧 Sending email to:', email);

    const info = await transporter.sendMail({
      from: `"Wash4Kidz" <${process.env.GMAIL_USER}>`, // must match Gmail account
      to: email,
      subject: 'Your Signed Contract',
      html: `
        <p>Hi ${firstName},</p>
        <p>Thank you for signing the contract. Please find your signed copy attached.</p>
        <p><a href="https://yourwebsite.com/review">Leave a review here</a></p>
      `,
      attachments: [
        {
          filename: 'SignedContract.pdf',
          content: Buffer.from(pdfBytes),
          contentType: 'application/pdf',
        },
      ],
    });

    console.log('✅ Email sent:', info.messageId);
    res.status(200).send('Contract sent via email!');
  } catch (err) {
    console.error('❌ Error in /api/sendContract:', err);
    res.status(500).send('Error processing contract.');
  }
});

app.listen(3000, () => console.log('🚀 Server running on port 3000'));
