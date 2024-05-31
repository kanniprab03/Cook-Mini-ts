/* eslint-disable react-hooks/exhaustive-deps */
import { IconButton, Textarea } from "@mui/joy";
import { IconSquareRoundedX } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export const Preparation = ({
  index,
  setPreparation,
}: {
  index: number;
  setPreparation: React.Dispatch<
    React.SetStateAction<
      {
        name: string;
      }[]
    >
  >;
}) => {
  const [name, setName] = useState("");

  useEffect(() => {
    setPreparation((p) =>
      p.map((prepx, i) => (i === index ? { name } : prepx))
    );
  }, [name]);

  const onRemove = () => {
    setPreparation((p) => p.filter((ing, i) => i !== index && ing));
  };

  return (
    <section className="md:flex gap-3">
      <section className="flex-1">
        <label className="">Step {index + 1}</label>
        <Textarea
          minRows={3}
          sx={{ padding: 1 }}
          placeholder="Write preparation steps here"
          variant="soft"
          onChange={(e) => setName(e.target.value.trim())}
          name="name"
        />
      </section>
      {/* <section className="space-x-3 md:space-x-0 md:w-1/6 hidden ">
        <label className="">Time HH:mm</label>
        <TimePicker
          onChange={setValue}
          variant="filled"
          defaultValue={value}
          format={"HH:mm"}
          name="time"
          allowClear={false}
        />
      </section> */}
      <section className="flex items-center justify-center h-full">
        <IconButton onClick={onRemove}>
          <IconSquareRoundedX />
        </IconButton>
      </section>
    </section>
  );
};
