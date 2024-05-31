import { IconButton, Input } from "@mui/joy";
import { IconSquareRoundedX } from "@tabler/icons-react";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const Ingredient = ({
  index,
  setIngredients,
}: {
  index: number;
  setIngredients: React.Dispatch<
    React.SetStateAction<
      {
        ingredient: string;
      }[]
    >
  >;
}) => {
  const onChange = (e: any) => {
    const obj = { ingredient: e.target.value.trim() };

    setIngredients((p) =>
      p.map((ing, i) => (i === index ? { ...ing, ...obj } : ing))
    );
  };

  const onRemove = () => {
    setIngredients((p) => p.filter((ing, i) => i !== index && ing));
  };

  return (
    <section className="md:flex gap-3 items-center">
      <section className="flex items-center gap-3 flex-1">
        {/* <label className="">Ingredient</label> */}
        <label>{index + 1}.</label>
        <Input
          sx={{ padding: 1 }}
          name="ingredient"
          onChange={onChange}
          placeholder="e.g. floor"
          variant="soft"
          fullWidth={true}
        />
        <section className="flex items-center justify-center h-full">
          <IconButton onClick={onRemove}>
            <IconSquareRoundedX />
          </IconButton>
        </section>
      </section>
    </section>
  );
};
