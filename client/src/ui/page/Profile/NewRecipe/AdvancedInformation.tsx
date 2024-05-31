/* eslint-disable @typescript-eslint/no-explicit-any */
import { IconButton, Switch, Typography } from "@mui/joy";
import { IconCheck } from "@tabler/icons-react";
import {
  IconBookmark,
  IconEye,
  IconHeart,
  IconMinus,
} from "@tabler/icons-react";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";

export const AdditionalInformation = ({
  setAdvanced,
  advanced,
}: {
  setAdvanced: React.Dispatch<
    React.SetStateAction<{
      visibility: boolean;
      saveRecipe: boolean;
      likeRecipe: boolean;
      commentRecipe: boolean;
    }>
  >;
  advanced: {
    visibility: boolean;
    saveRecipe: boolean;
    likeRecipe: boolean;
    commentRecipe: boolean;
  };
}) => {
  const [isVisible, setVisible] = useState(false);

  return (
    <section className="">
      <h1 className="md:text-xl flex items-center gap-3">
        Additional information (optional){" "}
        <IconButton size="sm" onClick={() => setVisible(!isVisible)}>
          {!isVisible ? <IconPlus /> : <IconMinus />}
        </IconButton>
      </h1>
      <section
        className={`rounded-lg border p-5 space-y-4 mt-3 ${
          isVisible ? "block" : "hidden"
        }`}
      >
        <section className="flex gap-3">
          <IconEye className="hidden md:flex" />{" "}
          <p className="flex-1">Recipe visibility</p>{" "}
          <Typography endDecorator={"Guest"} startDecorator={"User"}>
            <Switch
              onChange={(e) =>
                setAdvanced({
                  ...advanced,
                  // @ts-expect-error aaa
                  visibility: e.nativeEvent.target?.checked,
                })
              }
              checked={advanced.visibility}
            />
          </Typography>
        </section>
        <section className="flex gap-3">
          <IconBookmark className="hidden md:flex" />{" "}
          <p className="flex-1">Save Recipe</p>{" "}
          <Typography endDecorator={"Enable"} startDecorator={"Disable"}>
            <Switch
              onChange={(e) =>
                setAdvanced({
                  ...advanced,
                  // @ts-expect-error aaa
                  saveRecipe: e.nativeEvent.target?.checked,
                })
              }
              checked={advanced.saveRecipe}
            />
          </Typography>
        </section>
        <section className="flex gap-3">
          <IconHeart className="hidden md:flex" />{" "}
          <p className="flex-1">Like Recipe</p>{" "}
          <Typography endDecorator={"Enable"} startDecorator={"Disable"}>
            <Switch
              onChange={(e) =>
                setAdvanced({
                  ...advanced,
                  // @ts-expect-error aaa
                  likeRecipe: e.nativeEvent.target?.checked,
                })
              }
              checked={advanced.likeRecipe}
            />
          </Typography>
        </section>
        <section className="flex gap-3">
          <IconCheck className="hidden md:flex" />{" "}
          <p className="flex-1">Comment Recipe</p>{" "}
          <Typography endDecorator={"Enable"} startDecorator={"Disable"}>
            <Switch
              onChange={(e) =>
                setAdvanced({
                  ...advanced,
                  // @ts-expect-error aaa
                  commentRecipe: e.nativeEvent.target?.checked,
                })
              }
              checked={advanced.commentRecipe}
            />
          </Typography>
        </section>
      </section>
    </section>
  );
};
