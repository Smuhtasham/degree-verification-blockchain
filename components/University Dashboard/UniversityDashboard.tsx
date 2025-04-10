"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState, useRef } from "react";
import { LuLoader } from "react-icons/lu";
import { createThirdwebClient } from "thirdweb";
import { upload } from "thirdweb/storage";
import QRCode from "react-qr-code";
import { PDFDocument, rgb } from "pdf-lib";
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
  // Add this near the other useState hooks
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState<StudentDataProps>({
    registrationNumber: "",
    universityName: "",
    universityCode: "",
    degreeImageIPFS: "",
    status: false,
    cnic: "",
  });

  const [error, setError] = useState<string>("");

  const qrCodeRef = useRef<HTMLDivElement>(null);

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
      setFormData({
        registrationNumber: "",
        universityName: "",
        universityCode: "",
        degreeImageIPFS: "",
        status: false,
        cnic: "",
      });
    },
    onError: (error: any) => {
      alert(error.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (isUploading) {
      alert("Please wait until the file is uploaded.");
      return;
    }

    if (!formData.degreeImageIPFS) {
      alert("File upload failed or still in progress.");
      return;
    }

    mutation.mutate(formData);
  };

  const handleChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true); // Start upload

    const reader = new FileReader();
    reader.onload = async (event) => {
      const pdfBytes = await new Uint8Array(
        event.target?.result as ArrayBuffer
      );
      const pdfDoc = await PDFDocument.load(pdfBytes);

      const pages = pdfDoc.getPages();
      const firstPage = pages[0];

      const { width, height } = firstPage.getSize();
      const qrSize = 100;
      const qrX = width - qrSize - 10;
      const qrY = 10;

      const qrCodeSVG = qrCodeRef.current;
      if (!qrCodeSVG) return;

      const svgElement = qrCodeSVG.querySelector("svg");
      if (!svgElement) return;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const svgString = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgString], { type: "image/svg+xml" });
      const svgURL = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(async (blob) => {
          const qrImageBuffer = await blob?.arrayBuffer();
          const qrImageEmbed = await pdfDoc.embedPng(qrImageBuffer!);

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
                new File([modifiedPdfBlob], file.name, {
                  type: "application/pdf",
                }),
              ],
              uploadWithoutDirectory: true,
            });

            if (uploadedFile && uploadedFile.length > 0) {
              const ipfsUrl = uploadedFile;
              setFormData((prev) => ({
                ...prev,
                degreeImageIPFS: ipfsUrl,
              }));
              console.log("Uploaded IPFS URL:", ipfsUrl);
            } else {
              console.error("Upload failed or returned an empty response.");
            }
          } catch (error) {
            console.log("File upload error:", error);
          } finally {
            setIsUploading(false); // Upload done
          }
        }, "image/png");
      };

      img.src = svgURL;
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
      <div className="w-[20%] border-r border-solid border-gray-200 h-[100vh] overflow-auto">
        <UniversityLeftDashboard
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />
      </div>
      <div className="w-[80%] h-full overflow-auto p-8">
        <div className="text-[24px] font-bold">Add Student Degree</div>
        <div className="border border-solid border-gray-300 rounded-[10px] w-full px-6 py-8 mt-5">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="text-[18px] font-medium">
                Registration Number:
              </label>
              <input
                type="text"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
                className="w-full p-2 border rounded-[10px]"
                required
              />
            </div>
            <div className="mb-4">
              <label className="text-[18px] font-medium">CNIC:</label>
              <input
                type="text"
                name="cnic"
                value={formData.cnic}
                onChange={handleChange}
                className="w-full p-2 border rounded-[10px]"
                required
              />
            </div>

            <div className="mb-4">
              <label className="text-[18px] font-medium">
                Degree Image IPFS:
              </label>
              <input
                type="file"
                name="degreeImageIPFS"
                onChange={handleChangeFile}
                accept="application/pdf"
                className="w-full p-2 border rounded-[10px]"
                required
              />
            </div>

            <div className="mb-4 flex items-center">
              <label className="text-[18px] font-medium">Status:</label>
              <input
                type="checkbox"
                name="status"
                checked={formData.status}
                onChange={handleChange}
                className="ml-2 mt-1"
              />
              <span className="ml-2">
                {formData.status ? "Active" : "Inactive"}
              </span>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={mutation.isPending || isUploading}
              className="w-[200px] flex gap-4 justify-center items-center font-bold hover:bg-[#043873a1] bg-[#033773] text-white p-2 rounded-[10px]"
            >
              {(mutation.isPending || isUploading) && (
                <LuLoader className="animate-spin" />
              )}
              {isUploading ? "Uploading..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
      <div style={{ display: "none" }}>
        <div ref={qrCodeRef}>
          <QRCode
            value={`https://degree-verification-frontend.vercel.app/degree-verification/${formData.cnic}`}
            size={100}
            bgColor="transparent"
            fgColor="#000000"
          />
        </div>
      </div>
    </div>
  );
};

export default UniversityDashboard;
