/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Button, IconButton, Textarea } from "@mui/joy";
import { IconEdit } from "@tabler/icons-react";
import { useState } from "react";
import {
  IGlobalRecipe,
  useRecipe,
} from "../../../../lib/context/RecipeContext";

export default function UpdateDescription({ data }: { data: IGlobalRecipe }) {
  const [isEdit, setIsEdit] = useState(false);
  const [description, setDescription] = useState(data?.description);
  const [isLoading, setIsLoading] = useState(false);
  const { updateDescription } = useRecipe();

  const handleSubmit = async () => {
    if (data?.description.trim() !== description.trim()) {
      setIsLoading(true);
      const res = await updateDescription({
        _id: data?._id!,
        description: description.trim(),
      });
      if (res.status) {
        setIsEdit(!isEdit);
        setIsLoading(false);
      } else {
        setDescription(data?.title);
        setIsEdit(!isEdit);
        setIsLoading(false);
      }
    } else setIsEdit(!isEdit);
  };

  return (
    <section className="flex items-center gap-3 mr-20">
      {!isEdit ? (
        <p className="">{description}</p>
      ) : (
        <Textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          size="sm"
          sx={{
            width: "100%",
          }}
        />
      )}
      {isEdit ? (
        <Button loading={isLoading} size="sm" onClick={handleSubmit}>
          Save
        </Button>
      ) : (
        <IconButton onClick={() => setIsEdit(!isEdit)} loading={isLoading}>
          <IconEdit />
        </IconButton>
      )}
    </section>
  );
}
