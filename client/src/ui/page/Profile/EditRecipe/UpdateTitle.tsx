/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { IconEdit } from "@tabler/icons-react";
import {
  IGlobalRecipe,
  useRecipe,
} from "../../../../lib/context/RecipeContext";
import { Button, IconButton, Input } from "@mui/joy";
import { useState } from "react";

export default function UpdateTitle({ data }: { data: IGlobalRecipe }) {
  const [isEdit, setIsEdit] = useState(false);
  const [title, setTitle] = useState(data?.title);
  const [isLoading, setIsLoading] = useState(false);
  const { updateTitle } = useRecipe();

  const handleSubmit = async () => {
    if (data?.title.trim() !== title.trim()) {
      setIsLoading(true);
      const res = await updateTitle({ _id: data?._id!, title: title.trim() });
      if (res.status) {
        setIsEdit(!isEdit);
        setIsLoading(false);
      } else {
        setTitle(data?.title);
        setIsEdit(!isEdit);
        setIsLoading(false);
      }
    }
  };

  return (
    <section className="flex items-center gap-3 mr-20">
      {!isEdit ? (
        <h1 className="text-2xl font-medium flex items-center gap-3">
          {title}
        </h1>
      ) : (
        <Input
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          fullWidth
          size="sm"
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
