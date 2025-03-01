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



// "use client";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import React, { useEffect, useState, useRef } from "react";
// import { LuLoader } from "react-icons/lu";
// import { createThirdwebClient } from "thirdweb";
// import { upload } from "thirdweb/storage";
// import QRCode from "react-qr-code";
// import {
//   CreateStudentDegree,
//   GettingSpecificUniversityData,
//   StudentDataProps,
// } from "./request";

// import UniversityLeftDashboard from "./UniversityLeftDashboard";

// const UniversityDashboard = () => {
//   const [selectedOption, setSelectedOption] = useState<string | null>(
//     "add-degree"
//   );
//   const [formData, setFormData] = useState<StudentDataProps>({
//     registrationNumber: "",
//     universityName: "",
//     universityCode: "",
//     degreeImageIPFS: "",
//     status: false,
//     cnic: "",
//   });

//   const [error, setError] = useState<string>("");
//   const qrCodeRef = useRef<SVGSVGElement>(null);

//   const {
//     data: universityData,
//     isPending,
//     isError,
//     error: universityError,
//   } = useQuery({
//     queryKey: ["getting-specific-universities-data"],
//     queryFn: GettingSpecificUniversityData,
//   });

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value, type } = e.target;

//     if (name === "cnic") {
//       const formattedValue = value.replace(/[^0-9-]/g, "");

//       if (
//         !/^\d{5}-\d{7}-\d{1}$/.test(formattedValue) &&
//         formattedValue !== ""
//       ) {
//         setError("CNIC format must be xxxxx-xxxxxxx-x");
//       } else {
//         setError("");
//       }

//       setFormData({ ...formData, cnic: formattedValue });
//       return;
//     }

//     setFormData({
//       ...formData,
//       [name]:
//         type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
//     });
//   };

//   const client = createThirdwebClient({
//     clientId: "31f54069360e98a8069548df9aedcdfe",
//   });

//   const mutation = useMutation({
//     mutationFn: CreateStudentDegree,
//     onSuccess: () => {
//       alert("Added successfully!");
//     },
//     onError: (error: any) => {
//       alert(error.message);
//     },
//   });

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setError("");
//     console.log(formData);
//     mutation.mutate(formData);
//   };

//   const handleChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
  
//     const reader = new FileReader();
//     reader.onload = async (event) => {
//       const img = new Image();
//       img.src = event.target?.result as string;
  
//       img.onload = () => {
//         const canvas = document.createElement('canvas');
//         canvas.width = img.width;
//         canvas.height = img.height;
  
//         const ctx = canvas.getContext('2d');
//         if (!ctx) return;
  
//         // Draw the uploaded image on the canvas
//         ctx.drawImage(img, 0, 0, img.width, img.height);
  
//         // Generate the QR code and overlay it on the image
//         const qrSize = 100; // Size of the QR code
//         const qrCodeSVG = qrCodeRef.current;
//         if (!qrCodeSVG) return;
  
//         const svgData = new XMLSerializer().serializeToString(qrCodeSVG);
//         const qrImage = new Image();
//         qrImage.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  
//         qrImage.onload = () => {
//           ctx.drawImage(
//             qrImage,
//             img.width - qrSize - 10, // Position the QR code 10px from the right
//             img.height - qrSize - 10, // Position the QR code 10px from the bottom
//             qrSize,
//             qrSize
//           );
  
//           // Convert the canvas to a Blob and upload it to Thirdweb
//           canvas.toBlob(async (blob) => {
//             console.log(blob)
//             if (!blob) return;

  
//             try {
//               const uploadedFile = await upload({
//                 client,
//                 files: [new File([blob], file.name, { type: "image/png" })],
//                 uploadWithoutDirectory: true,
//               });
//               console.log(uploadedFile)
  
//               // Check if the upload was successful and extract the IPFS URL or CID
//               if (uploadedFile && uploadedFile.length > 0) {
//                 const ipfsUrl = uploadedFile; // Assuming the first item is the IPFS URL or CID
//                 setFormData((prev) => ({
//                   ...prev,
//                   degreeImageIPFS: ipfsUrl, // Update the formData with the IPFS URL or CID
//                 }));
//                 console.log("Uploaded IPFS URL:", ipfsUrl); // Debugging
//               } else {
//                 console.error("Upload failed or returned an empty response.");
//               }
//             } catch (error) {
//               console.error("File upload error:", error);
//             }
//           }, "image/png");
//         };
//       };
//     };
  
//     reader.readAsDataURL(file);
//   };

//   useEffect(() => {
//     if (universityData)
//       setFormData((prev) => ({
//         ...prev,
//         universityName: universityData.name,
//         universityCode: universityData.code,
//       }));
//   }, [universityData]);

//   if (isPending) {
//     return (
//       <div className="h-[70vh] flex justify-center items-center">
//         <LuLoader className="animate-spin" />
//       </div>
//     );
//   }

//   if (isError) {
//     return <div>Error: {universityError?.message}</div>;
//   }

//   return (
//     <div className="flex h-[calc(100vh-62px)]">
//       <div className="w-[20%] border-r border-solid border-gray-200 h-full overflow-auto p-5">
//         <UniversityLeftDashboard
//           selectedOption={selectedOption}
//           setSelectedOption={setSelectedOption}
//         />
//       </div>
//       <div className="w-[80%] h-full overflow-auto p-5">
//         <div className="text-[24px] font-bold">Add Student Degree</div>
//         <div className="border border-solid border-gray-300 rounded-[10px] w-[90%] p-5 h-[80%] mt-5">
//           <form onSubmit={handleSubmit}>
//             <div className="mb-4">
//               <label>Registration Number:</label>
//               <input
//                 type="text"
//                 name="registrationNumber"
//                 value={formData.registrationNumber}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded"
//                 required
//               />
//             </div>
//             <div className="mb-4">
//               <label>CNIC:</label>
//               <input
//                 type="text"
//                 name="cnic"
//                 value={formData.cnic}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded"
//                 required
//               />
//             </div>

//             <div className="mb-4">
//               <label>Degree Image IPFS:</label>
//               <input
//                 type="file"
//                 name="degreeImageIPFS"
//                 onChange={handleChangeFile}
//                 accept="image/*"
//                 className="w-full p-2 border rounded"
//                 required
//               />
//             </div>

//             <div className="mb-4 flex items-center">
//               <label>Status:</label>
//               <input
//                 type="checkbox"
//                 name="status"
//                 checked={formData.status}
//                 onChange={handleChange}
//                 className="ml-2"
//               />
//             </div>

//             {error && <p className="text-red-500">{error}</p>}

//             <button
//               type="submit"
//               disabled={mutation.isPending}
//               className="bg-blue-500 text-white p-2 rounded flex gap-2 items-center justify-center"
//             >
//               {mutation.isPending && <LuLoader className="animate-spin" />}
//               Submit
//             </button>
//           </form>
//         </div>
//       </div>
//       <div style={{ display: 'none' }}>
//         <QRCode
//           ref={qrCodeRef}
//           value="https://viste-eta.vercel.app"
//           size={100}
//           bgColor="transparent"
//           fgColor="#000000"
//         />
//       </div>
//     </div>
//   );
// };

// export default UniversityDashboard;"use client";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import React, { useEffect, useState, useRef } from "react";
// import { LuLoader } from "react-icons/lu";
// import { createThirdwebClient } from "thirdweb";
// import { upload } from "thirdweb/storage";
// import QRCode from "react-qr-code";
// import {
//   CreateStudentDegree,
//   GettingSpecificUniversityData,
//   StudentDataProps,
// } from "./request";

// import UniversityLeftDashboard from "./UniversityLeftDashboard";

// const UniversityDashboard = () => {
//   const [selectedOption, setSelectedOption] = useState<string | null>(
//     "add-degree"
//   );
//   const [formData, setFormData] = useState<StudentDataProps>({
//     registrationNumber: "",
//     universityName: "",
//     universityCode: "",
//     degreeImageIPFS: "",
//     status: false,
//     cnic: "",
//   });

//   const [error, setError] = useState<string>("");
//   const qrCodeRef = useRef<SVGSVGElement>(null);

//   const {
//     data: universityData,
//     isPending,
//     isError,
//     error: universityError,
//   } = useQuery({
//     queryKey: ["getting-specific-universities-data"],
//     queryFn: GettingSpecificUniversityData,
//   });

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value, type } = e.target;

//     if (name === "cnic") {
//       const formattedValue = value.replace(/[^0-9-]/g, "");

//       if (
//         !/^\d{5}-\d{7}-\d{1}$/.test(formattedValue) &&
//         formattedValue !== ""
//       ) {
//         setError("CNIC format must be xxxxx-xxxxxxx-x");
//       } else {
//         setError("");
//       }

//       setFormData({ ...formData, cnic: formattedValue });
//       return;
//     }

//     setFormData({
//       ...formData,
//       [name]:
//         type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
//     });
//   };

//   const client = createThirdwebClient({
//     clientId: "31f54069360e98a8069548df9aedcdfe",
//   });

//   const mutation = useMutation({
//     mutationFn: CreateStudentDegree,
//     onSuccess: () => {
//       alert("Added successfully!");
//     },
//     onError: (error: any) => {
//       alert(error.message);
//     },
//   });

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setError("");
//     console.log(formData);
//     mutation.mutate(formData);
//   };

//   const handleChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
  
//     const reader = new FileReader();
//     reader.onload = async (event) => {
//       const img = new Image();
//       img.src = event.target?.result as string;
  
//       img.onload = () => {
//         const canvas = document.createElement('canvas');
//         canvas.width = img.width;
//         canvas.height = img.height;
  
//         const ctx = canvas.getContext('2d');
//         if (!ctx) return;
  
//         // Draw the uploaded image on the canvas
//         ctx.drawImage(img, 0, 0, img.width, img.height);
  
//         // Generate the QR code and overlay it on the image
//         const qrSize = 100; // Size of the QR code
//         const qrCodeSVG = qrCodeRef.current;
//         if (!qrCodeSVG) return;
  
//         const svgData = new XMLSerializer().serializeToString(qrCodeSVG);
//         const qrImage = new Image();
//         qrImage.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  
//         qrImage.onload = () => {
//           ctx.drawImage(
//             qrImage,
//             img.width - qrSize - 10, // Position the QR code 10px from the right
//             img.height - qrSize - 10, // Position the QR code 10px from the bottom
//             qrSize,
//             qrSize
//           );
  
//           // Convert the canvas to a Blob and upload it to Thirdweb
//           canvas.toBlob(async (blob) => {
//             console.log(blob)
//             if (!blob) return;

  
//             try {
//               const uploadedFile = await upload({
//                 client,
//                 files: [new File([blob], file.name, { type: "image/png" })],
//                 uploadWithoutDirectory: true,
//               });
//               console.log(uploadedFile)
  
//               // Check if the upload was successful and extract the IPFS URL or CID
//               if (uploadedFile && uploadedFile.length > 0) {
//                 const ipfsUrl = uploadedFile; // Assuming the first item is the IPFS URL or CID
//                 setFormData((prev) => ({
//                   ...prev,
//                   degreeImageIPFS: ipfsUrl, // Update the formData with the IPFS URL or CID
//                 }));
//                 console.log("Uploaded IPFS URL:", ipfsUrl); // Debugging
//               } else {
//                 console.error("Upload failed or returned an empty response.");
//               }
//             } catch (error) {
//               console.error("File upload error:", error);
//             }
//           }, "image/png");
//         };
//       };
//     };
  
//     reader.readAsDataURL(file);
//   };

//   useEffect(() => {
//     if (universityData)
//       setFormData((prev) => ({
//         ...prev,
//         universityName: universityData.name,
//         universityCode: universityData.code,
//       }));
//   }, [universityData]);

//   if (isPending) {
//     return (
//       <div className="h-[70vh] flex justify-center items-center">
//         <LuLoader className="animate-spin" />
//       </div>
//     );
//   }

//   if (isError) {
//     return <div>Error: {universityError?.message}</div>;
//   }

//   return (
//     <div className="flex h-[calc(100vh-62px)]">
//       <div className="w-[20%] border-r border-solid border-gray-200 h-full overflow-auto p-5">
//         <UniversityLeftDashboard
//           selectedOption={selectedOption}
//           setSelectedOption={setSelectedOption}
//         />
//       </div>
//       <div className="w-[80%] h-full overflow-auto p-5">
//         <div className="text-[24px] font-bold">Add Student Degree</div>
//         <div className="border border-solid border-gray-300 rounded-[10px] w-[90%] p-5 h-[80%] mt-5">
//           <form onSubmit={handleSubmit}>
//             <div className="mb-4">
//               <label>Registration Number:</label>
//               <input
//                 type="text"
//                 name="registrationNumber"
//                 value={formData.registrationNumber}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded"
//                 required
//               />
//             </div>
//             <div className="mb-4">
//               <label>CNIC:</label>
//               <input
//                 type="text"
//                 name="cnic"
//                 value={formData.cnic}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded"
//                 required
//               />
//             </div>

//             <div className="mb-4">
//               <label>Degree Image IPFS:</label>
//               <input
//                 type="file"
//                 name="degreeImageIPFS"
//                 onChange={handleChangeFile}
//                 accept="image/*"
//                 className="w-full p-2 border rounded"
//                 required
//               />
//             </div>

//             <div className="mb-4 flex items-center">
//               <label>Status:</label>
//               <input
//                 type="checkbox"
//                 name="status"
//                 checked={formData.status}
//                 onChange={handleChange}
//                 className="ml-2"
//               />
//             </div>

//             {error && <p className="text-red-500">{error}</p>}

//             <button
//               type="submit"
//               disabled={mutation.isPending}
//               className="bg-blue-500 text-white p-2 rounded flex gap-2 items-center justify-center"
//             >
//               {mutation.isPending && <LuLoader className="animate-spin" />}
//               Submit
//             </button>
//           </form>
//         </div>
//       </div>
//       <div style={{ display: 'none' }}>
//         <QRCode
//           ref={qrCodeRef}
//           value="https://viste-eta.vercel.app"
//           size={100}
//           bgColor="transparent"
//           fgColor="#000000"
//         />
//       </div>
//     </div>
//   );
// };

// export default UniversityDashboard;