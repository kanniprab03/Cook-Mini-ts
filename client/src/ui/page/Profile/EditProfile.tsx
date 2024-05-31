/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Button, CircularProgress, IconButton, Input } from "@mui/joy";
import { IconEdit } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../../lib/context/AuthContext";

export default function EditProfile() {
  const [nameEdit, setNameEdit] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const { User, updateUserName, updateImage } = useAuth();
  const [imgSrc, setImgSrc] = useState<string>(User?.profileImg!);
  const [ImgEdit, setImgEdit] = useState(false);
  const [nameLoading, setNameLoading] = useState(false);
  const [name, setName] = useState(User?.name.trim());

  const handleNameUpdate = async () => {
    setNameLoading(true);
    if (User?.name.trim() !== name?.trim()) {
      const res = await updateUserName({ _id: User?._id!, name: name!.trim() });
      if (!res.status) alert(res.message);
      setNameLoading(false);
      setNameEdit(false);
    } else {
      setNameEdit(false);
    }
  };

  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("accept", "image/*");

  const selectImage = () => {
    input.click();
  };

  input.onchange = async function () {
    // @ts-expect-error aaa
    const src = await fileToBase64(input.files[0]);
    setImgSrc(src);
    // @ts-expect-error aaa
    document.getElementById("edit-img").src = src;
    // @ts-expect-error aaa
    if (input?.files[0]) {
      handleImgUpdate(input.files[0]);
    } else setImgEdit(!ImgEdit);
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

  const handleImgUpdate = async (file: File) => {
    setImgLoading(true);
    if (file) {
      const payload = new FormData();
      payload.append("profileImg", file);
      payload.append("_id", User?._id!);

      const res = await updateImage(payload);
      if (!res.status) alert(res.message);
      setImgLoading(false);
      setImgEdit(false);
    } else {
      setImgEdit(false);
    }
  };

  return (
    <section className="space-y-2">
      <h1 className="text-xl font-medium">Edit Profile</h1>
      <section className="space-y-2">
        <section className="justify-center flex flex-col gap-2">
          <Image img={imgSrc ? imgSrc : User?.profileImg!} />
          {ImgEdit ? (
            <Button loading={imgLoading} onClick={selectImage}>
              Select
            </Button>
          ) : (
            <IconButton onClick={() => setImgEdit(true)}>
              <IconEdit />
            </IconButton>
          )}
        </section>
        <section className="flex gap-2">
          <section className="flex items-center gap-2">
            <p className="font-semibold">Name: </p>
            <Input
              placeholder="Name"
              value={name!}
              onChange={(e) => setName(e.target.value)}
              readOnly={!nameEdit}
            />
          </section>
          <section className="flex gap-2">
            {!nameEdit ? (
              <IconButton onClick={() => setNameEdit(true)} size="sm">
                <IconEdit />
              </IconButton>
            ) : (
              <Button loading={nameLoading} onClick={handleNameUpdate}>
                Save
              </Button>
            )}
          </section>
        </section>
      </section>
    </section>
  );
}

const Image = ({ img }: { img: string }) => {
  const [isLoading, setLoading] = useState(true);

  const [imgSrc, setImg] = useState(
    "http://localhost:5500/bucket/server/1708683893822-987438908-bg-2.jpg"
  );

  useEffect(() => {
    if (img) {
      if (img.includes("data")) {
        setImg(imgSrc);
      } else {
        setImg(`http://localhost:5500/api/user/bucket/${img}`);
      }
    } else {
      setImg(
        "http://localhost:5500/bucket/server/1708683893822-987438908-bg-2.jpg"
      );
    }
  }, [img]);


  return (
    <>
      <section className="flex items-center  justify-center">
        <img
          id="edit-img"
          src={imgSrc}
          className={`w-[100px] h-[100px] md:w-[130px] md:h-[135px] lg:w-[125px] lg:h-[125px] xl:w-[155px] xl:h-[155px] rounded-md ${isLoading ? "hidden" : "block"
            }`}
          alt=""
          onError={(e) => {
            // @ts-expect-error aaa
            e.onerror = null;
            // @ts-expect-error aaa
            e.src = img;
            e.preventDefault();
            setLoading(false);
          }}
          onLoad={() => setLoading(false)}
        />
      </section>
      {isLoading && (
        <section className="w-[100px] h-[100px] md:w-[130px] md:h-[135px] lg:w-[125px] lg:h-[125px] xl:w-[155px] xl:h-[155px] rounded-md flex items-center justify-center">
          <CircularProgress variant="plain" size="sm" />
        </section>
      )}
    </>
  );
};
