import { Button, Input, Modal, ModalDialog, Option, Select } from "@mui/joy";
import { useEffect, useState } from "react";
import { useRecipe } from "../../../../lib/context/RecipeContext";

export default function NewPreparationModal({
  open,
  setOpen,
  preparation: preparation,
  _id,
}: {
  _id: string;
  preparation: number;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [index, setIndex] = useState(preparation + 1);
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { addPreparationRow } = useRecipe();
  const [arr, setArr] = useState<number[]>([]);

  useEffect(() => {
    const a = [];
    for (let i = 0; i <= preparation; i++) {
      a.push(i);
    }
    setArr(a);
  }, [preparation]);

  const handleSubmit = async () => {
    if (index != 0 && value !== "") {
      setIsLoading(true);
      const res = await addPreparationRow({
        _id,
        index: index - 1,
        preparation: value,
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
          onChange={(_e) =>
            setIndex(
              parseInt(
                // @ts-expect-error aaa
                _e?.target?.textContent ? _e?.target?.textContent : index
              )
            )
          }
          defaultValue={index}
          placeholder="Insert new Step at"
        >
          {arr.map((_y, i) => (
            <Option key={i} value={i}>
              {i + 1}
            </Option>
          ))}
        </Select>
        <Input
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. Cut Vegetables"
        />
        <Button onClick={handleSubmit} loading={isLoading}>
          Submit
        </Button>
      </ModalDialog>
    </Modal>
  );
}
