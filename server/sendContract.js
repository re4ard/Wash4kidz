const express = require('express');
const nodemailer = require('nodemailer');
const { PDFDocument, rgb } = require('pdf-lib');
const cors = require('cors');
const fs = require('fs');


const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.post('/api/sendContract', async (req, res) => {
  try {
    const { firstName, lastName, email, signatureDataUrl } = req.body;

    // Load your existing PDF file (load it from disk or URL)
    const pdfPath = path.resolve(__dirname, 'contract.pdf');
    const existingPdfBytes = await fs.promises.readFile(pdfPath);

    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // Convert signatureDataUrl (base64) to Uint8Array
    const base64Signature = signatureDataUrl.split(',')[1];
    const signatureImage = await pdfDoc.embedPng(base64Signature);

    // Decide where to place the signature (x, y coordinates and size)
    const { width, height } = signatureImage.scale(0.5);

    // Example position, change according to your contract layout:
    firstPage.drawImage(signatureImage, {
        x: 100,
        y: 150,
        width: 200,
        height: 100,
      });

    const pdfBytes = await pdfDoc.save();

    // Set up nodemailer
    const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      

    // Send email with signed PDF attached
    await transporter.sendMail({
      from: '"wash4kidz" <91864b002@smtp-brevo.com>',
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
    
    console.log('Email sent');
    res.status(200).send('Contract sent via email!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error processing contract.');
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
