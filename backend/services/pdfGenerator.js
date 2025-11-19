import PDFDocument from 'pdfkit';

export function generateBookingPDF(bookingData) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        size: 'A4',
        margin: 0, // Custom margins
        info: {
          Title: 'Buchungsbestätigung',
          Author: 'DSK-UG',
          Subject: `Buchung #${bookingData.bookingId}`
        }
      });

      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Colors
      const primaryColor = '#1e40af'; // Darker blue
      const accentColor = '#2563eb'; // Brand blue
      const darkGray = '#1f2937';
      const lightGray = '#6b7280';
      const bgGray = '#f3f4f6';

      // --- Header ---
      doc.rect(0, 0, doc.page.width, 120).fill(primaryColor);
      
      // Logo (SVG Path)
      doc.save();
      doc.translate(50, 30);
      doc.scale(0.4); // Scale down the 100x100 SVG
      
      // Roof
      doc.path('M50 15 L75 35 L75 40 L25 40 L25 35 Z')
         .fillColor('#ffffff')
         .fill();
      
      // Building body
      doc.rect(30, 40, 40, 45)
         .fillOpacity(0.3)
         .fill('#ffffff');
      
      // Windows
      doc.fillOpacity(0.6);
      doc.rect(35, 45, 8, 8).fill();
      doc.rect(57, 45, 8, 8).fill();
      doc.rect(35, 58, 8, 8).fill();
      doc.rect(57, 58, 8, 8).fill();
      
      // Door
      doc.fillOpacity(0.8);
      doc.rect(46, 70, 8, 15).fill();
      
      doc.restore();

      // Company Name next to Logo
      doc.fillColor('#ffffff')
         .fontSize(32)
         .font('Helvetica-Bold')
         .text('DSK-UG', 100, 40);
      
      doc.fontSize(14)
         .font('Helvetica')
         .text('Monteurunterkünfte Leipzig', 100, 80);

      // Right side of header (Contact)
      doc.fontSize(10)
         .text('dsk-ug.de', doc.page.width - 150, 45, { align: 'right' })
         .text('info@dsk-ug.de', doc.page.width - 150, 60, { align: 'right' })
         .text('+49 151 71421923', doc.page.width - 150, 75, { align: 'right' });

      // --- Content ---
      let yPos = 160;
      const leftMargin = 50;
      const contentWidth = doc.page.width - 100;

      // Title
      doc.fillColor(darkGray)
         .fontSize(24)
         .font('Helvetica-Bold')
         .text('Buchungsbestätigung', leftMargin, yPos);
      
      yPos += 40;

      // Greeting
      doc.fontSize(11)
         .font('Helvetica')
         .text(`Sehr geehrte/r ${bookingData.guestName},`, leftMargin, yPos)
         .moveDown(0.5)
         .text('vielen Dank für Ihre Buchung. Nachfolgend finden Sie alle Details zu Ihrem Aufenthalt.', { width: contentWidth });
      
      yPos = doc.y + 30;

      // --- Booking Details Box ---
      const boxTop = yPos;
      
      // Draw box background
      doc.rect(leftMargin, boxTop, contentWidth, 180) // Approximate height, will adjust
         .fill(bgGray);
      
      yPos += 20;

      // Box Header
      doc.fillColor(primaryColor)
         .fontSize(14)
         .font('Helvetica-Bold')
         .text('Buchungsdetails', leftMargin + 20, yPos);
      
      yPos += 25;

      // Grid for details
      const col1X = leftMargin + 20;
      const col2X = leftMargin + 200;
      const rowHeight = 20;

      const details = [
        { label: 'Buchungs-Nr.:', value: `#${bookingData.bookingId}` },
        { label: 'Unterkunft:', value: bookingData.accommodationName },
        { label: 'Check-in:', value: bookingData.checkIn },
        { label: 'Check-out:', value: bookingData.checkOut },
        { label: 'Dauer:', value: `${bookingData.nights} ${bookingData.nights === 1 ? 'Nacht' : 'Nächte'}` },
        { label: 'Gäste:', value: `${bookingData.guests} ${bookingData.guests === 1 ? 'Person' : 'Personen'}` }
      ];

      doc.fontSize(10).font('Helvetica');

      details.forEach(detail => {
        doc.fillColor(lightGray).text(detail.label, col1X, yPos);
        doc.fillColor(darkGray).font('Helvetica-Bold').text(detail.value, col2X, yPos);
        yPos += rowHeight;
      });

      // Divider line
      yPos += 10;
      doc.moveTo(col1X, yPos).lineTo(leftMargin + contentWidth - 20, yPos).stroke(lightGray);
      yPos += 15;

      // Total Price
      doc.fontSize(12)
         .fillColor(darkGray)
         .font('Helvetica-Bold')
         .text('Gesamtpreis:', col1X, yPos);
      
      doc.fontSize(16)
         .fillColor(accentColor)
         .text(`EUR ${bookingData.totalPrice.toFixed(2)}`, col2X, yPos - 2);

      // --- Special Requests ---
      if (bookingData.specialRequests) {
        yPos = boxTop + 200; // Below the main box
        
        doc.fillColor(darkGray)
           .fontSize(11)
           .font('Helvetica-Bold')
           .text('Besondere Wünsche:', leftMargin, yPos);
        
        yPos += 15;
        
        doc.fontSize(10)
           .font('Helvetica')
           .fillColor('#4b5563')
           .text(bookingData.specialRequests, leftMargin, yPos, { width: contentWidth, align: 'justify' });
        
        yPos = doc.y + 30;
      } else {
        yPos = boxTop + 200 + 20;
      }

      // --- Footer / Legal ---
      // Position at bottom
      const footerTop = doc.page.height - 120;
      
      // Ensure we don't overlap if content is long (unlikely with this layout)
      if (yPos > footerTop) {
        doc.addPage();
        yPos = 50;
      }

      doc.rect(0, doc.page.height - 100, doc.page.width, 100).fill('#f8fafc');
      
      let footerY = doc.page.height - 80;
      
      doc.fillColor(darkGray)
         .fontSize(10)
         .font('Helvetica-Bold')
         .text('DSK UG (haftungsbeschränkt)', leftMargin, footerY);
      
      footerY += 15;
      
      doc.fontSize(8)
         .font('Helvetica')
         .fillColor(lightGray)
         .text('Engertstraße 6a, 04177 Leipzig', leftMargin, footerY)
         .text('Geschäftsführerin: Petra Scheffler', leftMargin + 200, footerY)
         .text('Amtsgericht Leipzig, HRB 36406', leftMargin + 400, footerY);
         
      footerY += 12;
      
      doc.text('Telefon: +49 151 71421923', leftMargin, footerY)
         .text('Sitz der Gesellschaft: Leipzig', leftMargin + 200, footerY)
         .text('USt-ID: DE324735122', leftMargin + 400, footerY);

      footerY += 12;
      doc.text('Webseite: dsk-ug.de', leftMargin, footerY);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
