/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@mui/joy";
import { IconFileAlert, IconPhotoUp } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export const ImageUpload = ({
  setFile,
  errMsg,
}: {
  errMsg: string;
  setFile: (img: File | undefined) => void;
}) => {
  const [file, setFiles] = useState<File | undefined>(undefined);
  const [imgDataUrl, setImgDataUrl] = useState("");
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("accept", "image/*");

  const selectImage = () => {
    input.click();
  };

  input.onchange = async function () {
    // @ts-expect-error aaa
    setFiles(input.files[0]);
    // @ts-expect-error aaa
    setImgDataUrl(await fileToBase64(input.files[0]));
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to convert file to base64"));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    setFile(file);
  }, [file]);

  return (
    <section className="space-y-4">
      <section className="overflow-hidden rounded-lg">
        {file && <img src={imgDataUrl} alt={file.name} />}
      </section>
      <section className="md:flex gap-3 w-full">
        <IconPhotoUp className="hidden md:flex" />
        <p className="flex-1">
          Upload photo -{" "}
          {file?.name ? (
            file?.name.slice(0, 30)
          ) : (
            <p className="inline text-red-600">Required</p>
          )}
        </p>
        {file ? (
          <Button
            className=""
            onClick={() => setFiles(undefined)}
            size="sm"
            variant="soft"
            color="neutral"
          >
            clear
          </Button>
        ) : (
          <Button
            onClick={selectImage}
            size="sm"
            variant="soft"
            color="neutral"
          >
            Choose file
          </Button>
        )}
      </section>
      {errMsg && (
        <section className="flex gap-3 items-center bg-red-500 p-2 rounded text-white">
          <IconFileAlert />
          <p className="text-sm">{errMsg}</p>
        </section>
      )}
    </section>
  );
};
