// "use client"
// import React, { useState, useRef } from 'react';
// import QRCode from 'react-qr-code';
// import { PDFDocument, rgb } from 'pdf-lib';
// import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
// import { Canvg, presets } from 'canvg';

// GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

// const PDFWithQRCode = () => {
//   const [pdfFile, setPdfFile] = useState<File | null>(null);
//   const [finalPdf, setFinalPdf] = useState<string | null>(null);
//   const qrCodeRef = useRef<SVGSVGElement>(null);

//   const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setPdfFile(file);
//     }
//   };

//   const handleGeneratePdf = async () => {
//     if (!pdfFile || !qrCodeRef.current) return;

//     const qrCodeSVG = qrCodeRef.current;
//     const svgData = new XMLSerializer().serializeToString(qrCodeSVG);

//     // Convert SVG to PNG using canvg
//     const canvas = document.createElement('canvas');
//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;

//     const v = await Canvg.from(ctx, svgData, {
//       ...presets.offscreen(),
//       createCanvas: (width: number, height: number) => {
//         const canvas = document.createElement('canvas');
//         canvas.width = width;
//         canvas.height = height;
//         return canvas;
//       },
//       createImage: (url: string) => {
//         return new Promise((resolve, reject) => {
//           const img = new Image();
//           img.onload = () => resolve(img);
//           img.onerror = reject;
//           img.src = url;
//         });
//       },
//     });

//     await v.render();

//     const qrImage = canvas.toDataURL('image/png');

//     const reader = new FileReader();
//     reader.onload = async () => {
//       const pdfBytes = reader.result as ArrayBuffer;
//       const pdfDoc = await PDFDocument.load(pdfBytes);

//       const pages = pdfDoc.getPages();
//       const firstPage = pages[0];

//       const { width, height } = firstPage.getSize();

//       const qrSize = 100; // Size of the QR code
//       const qrX = width - qrSize - 10; // Position the QR code 10px from the right
//       const qrY = 10; // Position the QR code 10px from the bottom

//       const qrImageBytes = await fetch(qrImage).then((res) => res.arrayBuffer());
//       const qrImageEmbed = await pdfDoc.embedPng(qrImageBytes);

//       firstPage.drawImage(qrImageEmbed, {
//         x: qrX,
//         y: qrY,
//         width: qrSize,
//         height: qrSize,
//       });

//       const modifiedPdfBytes = await pdfDoc.save();
//       const modifiedPdfBlob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
//       const modifiedPdfUrl = URL.createObjectURL(modifiedPdfBlob);

//       setFinalPdf(modifiedPdfUrl);
//     };

//     reader.readAsArrayBuffer(pdfFile);
//   };

//   return (
//     <div className="p-4 space-y-4">
//       <input type="file" accept="application/pdf" onChange={handlePdfUpload} />
//       <div style={{ display: 'none' }}>
//         <QRCode
//           ref={qrCodeRef}
//           value="https://viste-eta.vercel.app"
//           size={100}
//           bgColor="transparent"
//           fgColor="#000000"
//         />
//       </div>
//       <button
//         onClick={handleGeneratePdf}
//         className="p-2 bg-blue-500 text-white rounded"
//       >
//         Generate PDF with QR Code
//       </button>
//       {finalPdf && (
//         <iframe src={finalPdf} width="100%" height="500px" title="Final PDF with QR Code" />
//       )}
//     </div>
//   );
// };

// export default PDFWithQRCode;