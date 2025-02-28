"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState, useRef } from "react";
import { LuLoader } from "react-icons/lu";
import { createThirdwebClient } from "thirdweb";
import { upload } from "thirdweb/storage";
import QRCode from "react-qr-code";
import { PDFDocument, rgb } from "pdf-lib";
import { Canvg, presets } from "canvg";
import {
  CreateStudentDegree,
  GettingSpecificUniversityData,
  StudentDataProps,
} from "./request";
import UniversityLeftDashboard from "./UniversityLeftDashboard";

const UniversityDashboard = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(
    "add-degree"
  );
  const [formData, setFormData] = useState<StudentDataProps>({
    registrationNumber: "",
    universityName: "",
    universityCode: "",
    degreeImageIPFS: "",
    status: false,
    cnic: "",
  });

  const [error, setError] = useState<string>("");
  const qrCodeRef = useRef<SVGSVGElement>(null);

  const {
    data: universityData,
    isPending,
    isError,
    error: universityError,
  } = useQuery({
    queryKey: ["getting-specific-universities-data"],
    queryFn: GettingSpecificUniversityData,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (name === "cnic") {
      const formattedValue = value.replace(/[^0-9-]/g, "");

      if (
        !/^\d{5}-\d{7}-\d{1}$/.test(formattedValue) &&
        formattedValue !== ""
      ) {
        setError("CNIC format must be xxxxx-xxxxxxx-x");
      } else {
        setError("");
      }

      setFormData({ ...formData, cnic: formattedValue });
      return;
    }

    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const client = createThirdwebClient({
    clientId: "31f54069360e98a8069548df9aedcdfe",
  });

  const mutation = useMutation({
    mutationFn: CreateStudentDegree,
    onSuccess: () => {
      alert("Added successfully!");
    },
    onError: (error: any) => {
      alert(error.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    console.log(formData);
    mutation.mutate(formData);
  };

  const handleChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const pdfBytes = await new Uint8Array(
        event.target?.result as ArrayBuffer
      );
      const pdfDoc = await PDFDocument.load(pdfBytes);

      const pages = pdfDoc.getPages();
      const firstPage = pages[0];

      const { width, height } = firstPage.getSize();

      const qrSize = 100; // Size of the QR code
      const qrX = width - qrSize - 10; // Position the QR code 10px from the right
      const qrY = 10; // Position the QR code 10px from the bottom

      const qrCodeSVG = qrCodeRef.current;
      if (!qrCodeSVG) return;

      const svgData = new XMLSerializer().serializeToString(qrCodeSVG);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const v = await Canvg.from(ctx, svgData, presets.offscreen());
      await v.render();

      const qrImage = canvas.toDataURL("image/png");
      const qrImageBytes = await fetch(qrImage).then((res) =>
        res.arrayBuffer()
      );
      const qrImageEmbed = await pdfDoc.embedPng(qrImageBytes);

      firstPage.drawImage(qrImageEmbed, {
        x: qrX,
        y: qrY,
        width: qrSize,
        height: qrSize,
      });

      const modifiedPdfBytes = await pdfDoc.save();
      const modifiedPdfBlob = new Blob([modifiedPdfBytes], {
        type: "application/pdf",
      });

      try {
        const uploadedFile = await upload({
          client,
          files: [
            new File([modifiedPdfBlob], file.name, { type: "application/pdf" }),
          ],
          uploadWithoutDirectory: true,
        });
        console.log(uploadedFile);
        if (uploadedFile && uploadedFile.length > 0) {
          const ipfsUrl = uploadedFile; // Assuming the first item is the IPFS URL or CID
          setFormData((prev) => ({
            ...prev,
            degreeImageIPFS: ipfsUrl,
          }));
          console.log("Uploaded IPFS URL:", ipfsUrl);
        } else {
          console.error("Upload failed or returned an empty response.");
        }
      } catch (error) {
        console.error("File upload error:", error);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  useEffect(() => {
    if (universityData)
      setFormData((prev) => ({
        ...prev,
        universityName: universityData.name,
        universityCode: universityData.code,
      }));
  }, [universityData]);

  if (isPending) {
    return (
      <div className="h-[70vh] flex justify-center items-center">
        <LuLoader className="animate-spin" />
      </div>
    );
  }

  if (isError) {
    return <div>Error: {universityError?.message}</div>;
  }

  return (
    <div className="flex h-[calc(100vh-62px)]">
      <div className="w-[20%] border-r border-solid border-gray-200 h-full overflow-auto p-5">
        <UniversityLeftDashboard
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />
      </div>
      <div className="w-[80%] h-full overflow-auto p-5">
        <div className="text-[24px] font-bold">Add Student Degree</div>
        <div className="border border-solid border-gray-300 rounded-[10px] w-[90%] p-5 h-[80%] mt-5">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label>Registration Number:</label>
              <input
                type="text"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label>CNIC:</label>
              <input
                type="text"
                name="cnic"
                value={formData.cnic}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label>Degree Image IPFS:</label>
              <input
                type="file"
                name="degreeImageIPFS"
                onChange={handleChangeFile}
                accept="application/pdf"
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="mb-4 flex items-center">
              <label>Status:</label>
              <input
                type="checkbox"
                name="status"
                checked={formData.status}
                onChange={handleChange}
                className="ml-2"
              />
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={mutation.isPending}
              className="bg-blue-500 text-white p-2 rounded flex gap-2 items-center justify-center"
            >
              {mutation.isPending && <LuLoader className="animate-spin" />}
              Submit
            </button>
          </form>
        </div>
      </div>
      <div style={{ display: "none" }}>
        <QRCode
          ref={qrCodeRef}
          value="https://viste-eta.vercel.app"
          size={100}
          bgColor="transparent"
          fgColor="#000000"
        />
      </div>
    </div>
  );
};

export default UniversityDashboard;
