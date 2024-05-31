/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Button, CircularProgress, IconButton } from "@mui/joy";
import { IconEdit } from "@tabler/icons-react";
import { useState } from "react";
import {
  IGlobalRecipe,
  useRecipe,
} from "../../../../lib/context/RecipeContext";

export default function UpdateImage({ recipe }: { recipe: IGlobalRecipe }) {
  const { updateImage } = useRecipe();
  const [file, setFiles] = useState<File | undefined>(undefined);
  const [isEdit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
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
    const src = await fileToBase64(input.files[0]);
    // @ts-expect-error aaa
    document.getElementById("edit-img").src = src;
    setEdit(!isEdit);
  };

  const handleSubmit = async () => {
    if (!file) {
      return;
    }

    const payload = new FormData();
    payload.append("img", file);
    payload.append("_id", recipe?._id!);

    setLoading(true);
    const res = await updateImage(payload);
    setLoading(false);
    if (!res.status) {
      alert(res.message);
    }
    setEdit(!isEdit);
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
  return (
    <section className="relative ">
      <Image img={recipe?.img!} />
      {isEdit ? (
        <Button
          sx={{ position: "absolute" }}
          className="top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-50"
          loading={loading}
          onClick={handleSubmit}
          size="sm"
        >
          Save
        </Button>
      ) : (
        <IconButton
          loading={loading}
          size="sm"
          variant="solid"
          color="primary"
          sx={{ position: "absolute" }}
          onClick={selectImage}
          className="top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-50"
        >
          <IconEdit />
        </IconButton>
      )}
    </section>
  );
}

const Image = ({ img }: { img: string }) => {
  const [isLoading, setLoading] = useState(true);
  return (
    <>
      <img
        id="edit-img"
        src={`http://localhost:5500/bucket/recipes/${img}`}
        className={`w-[100px] h-[100px] md:w-[130px] md:h-[135px] lg:w-[125px] lg:h-[125px] xl:w-[155px] xl:h-[155px] rounded-md ${
          isLoading ? "hidden" : "block"
        }`}
        alt=""
        onLoad={() => setLoading(false)}
      />
      {isLoading && (
        <section className="w-[100px] h-[100px] md:w-[130px] md:h-[135px] lg:w-[125px] lg:h-[125px] xl:w-[155px] xl:h-[155px] rounded-md flex items-center justify-center">
          <CircularProgress variant="plain" size="sm" />
        </section>
      )}
    </>
  );
};
