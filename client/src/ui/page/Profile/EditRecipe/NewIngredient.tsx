/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Button, Input, Modal, ModalDialog, Option, Select } from "@mui/joy";
import { useEffect, useState } from "react";
import { useRecipe } from "../../../../lib/context/RecipeContext";

export default function NewIngredientModal({
  open,
  setOpen,
  ingredient,
  _id,
}: {
  _id: string;
  ingredient: number;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [index, setIndex] = useState(ingredient + 1);
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { addIngredientRow } = useRecipe();
  const [arr, setArr] = useState<number[]>([]);

  useEffect(() => {
    const a = [];
    for (let i = 0; i <= ingredient; i++) {
      a.push(i);
    }
    setArr(a);
  }, [ingredient]);

  const handleSubmit = async () => {
    if (index != 0 && value !== "") {
      setIsLoading(true);
      const res = await addIngredientRow({
        _id,
        index: index - 1,
        ingredient: value,
      });
      if (res.status) {
        setOpen(false);
      } else {
        alert(res.message);
      }
      setIsLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog>
        <h1 className="text-lg font-medium">Add New Ingredient</h1>
        <Select
          defaultValue={index}
          onChange={(_e) =>
            setIndex(
              parseInt(
                // @ts-expect-error aaa
                _e?.target?.textContent ? _e?.target?.textContent : index
              )
            )
          }
          placeholder="Insert new Ingredient at"
        >
          {arr.map((_y, i) => (
            <Option key={i} value={i}>
              {i + 1}
            </Option>
          ))}
        </Select>
        <Input
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. floor 200g"
        />
        <Button onClick={handleSubmit} loading={isLoading}>
          Submit
        </Button>
      </ModalDialog>
    </Modal>
  );
}
