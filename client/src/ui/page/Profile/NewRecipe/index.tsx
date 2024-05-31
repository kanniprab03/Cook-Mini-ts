/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Divider, IconButton, Input, Textarea } from "@mui/joy";
import { IconSquareRoundedPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../lib/context/AuthContext";
import { IAdvanced, useRecipe } from "../../../../lib/context/RecipeContext";
import { USER_ROLES } from "../../../../lib/context/types/AuthTypes";
import { AdditionalInformation } from "./AdvancedInformation";
import { ImageUpload } from "./ImageUpload";
import { Ingredient } from "./Ingriends";
import { Preparation } from "./Preparation";
import RecipeSubmitPage from "./SubmitPage";

export default function NewRecipe() {
  const [isLoading, setIsLoading] = useState(false);
  const { insertRecipe } = useRecipe();
  const [isSuccess, setSuccess] = useState(false);
  const [ingredients, setIngredients] = useState<{ ingredient: string }[]>([
    { ingredient: "" },
  ]);
  const [preparation, setPreparation] = useState<
    {
      name: string;
    }[]
  >([{ name: "" }]);
  const [advanced, setAdvanced] = useState<IAdvanced>({
    visibility: true,
    saveRecipe: true,
    likeRecipe: true,
    commentRecipe: true,
  });
  const [errMsg, setErrMsg] = useState<{
    title: string | undefined;
    description: string | undefined;
    ingredients: string | undefined;
    preparation: string | undefined;
    img: string | undefined;
    prepTime: string | undefined;
  }>();
  const { UserRole } = useAuth();

  const [data, setData] = useState<{
    title: string;
    description: string;
    ingredients: { ingredient: string; quantity: string }[];
    preparation: { name: string }[];
    prepTime: string;
    img: File;
    advanced: {
      visibility: boolean;
      saveRecipe: boolean;
      likeRecipe: boolean;
      commentRecipe: boolean;
    };
  }>();

  useEffect(() => {
    // @ts-expect-error aaa
    setData({ ...data, ingredients });
  }, [ingredients]);

  useEffect(() => {
    // @ts-expect-error aaa
    setData({
      ...data,
      advanced,
    });
  }, [advanced]);

  useEffect(() => {
    // @ts-expect-error aaa
    setData({ ...data, preparation });
  }, [preparation]);

  const setAdvance = () => {
    // @ts-expect-error aaa
    setData({
      ...data,
      advanced,
    });
  };

  const validateRecipe = () => {
    setAdvance();
    // @ts-expect-error aaa
    const err: {
      title: string | undefined;
      description: string | undefined;
      ingredients: string | undefined;
      preparation: string | undefined;
      img: string | undefined;
    } = {};
    // img
    // @ts-expect-error aaa
    if (!data.img) {
      err.img = "Image not found";
    } else {
      err.img = undefined;
    }

    // title
    if (!data?.title) {
      err.title = "Recipe title is required";
    } else {
      err.title = undefined;
    }

    // description
    if (!data?.description) {
      err.description = "Recipe description is required";
    } else {
      err.description = undefined;
    }

    // data
    if (data) {
      // ingredients
      if (data.ingredients && data.ingredients.length > 0) {
        const exc: { ingredient: string; quantity: string }[] =
          data?.ingredients.filter(
            (ing) => ing.ingredient !== "" || ing.quantity !== ""
          );
        setIngredients(exc);
        err.ingredients = undefined;
        if (data.ingredients && data.ingredients.length <= 0)
          err.ingredients = "Minimum 1 or more ingredients required";
      } else err.ingredients = "Minimum 1 or more ingredients required";

      // preparation
      if (data.preparation && data.preparation.length > 0) {
        const exc: { name: string }[] = data?.preparation.filter(
          (ing) => ing.name !== ""
        );
        setPreparation(exc);
        err.preparation = undefined;
        if (data.preparation && data.preparation.length < 0)
          err.preparation = "Minimum 1 or more steps required";
      } else {
        err.preparation = "Minimum 1 or more steps required";
      }
    }

    // @ts-expect-error aaa
    setErrMsg(err);
    handleSubmit();
  };

  const handleSubmit = async () => {
    // @ts-expect-error aaa
    const isPendingErr = Object.values(errMsg).filter((v) => v !== undefined);
    if (isPendingErr.length <= 0) {
      const payload = new FormData();
      payload.append("title", data?.title!);
      payload.append("description", data?.description!);
      payload.append("prepTime", data?.prepTime!);
      payload.append("preparation", JSON.stringify(data?.preparation));
      payload.append("ingredients", JSON.stringify(data?.ingredients!));
      payload.append("advanced", JSON.stringify(data?.advanced!));
      payload.append("img", data?.img!);

      setIsLoading(true);
      const res = await insertRecipe(payload);
      setSuccess(res.status);
      if (!res.status) {
        alert(res.message);
      }
      setIsLoading(false);
    }
  };

  const onChange = (e: any) => {
    // @ts-expect-error aaa
    setData({ ...data, [e.target.name]: e.target.value });
  };

  if (UserRole !== USER_ROLES.CREATOR) {
    return <h1>Not Found</h1>;
  }

  const changeImg = (f: File | undefined) => {
    // @ts-expect-error aaa
    setData({ ...data, img: f });
  };

  return (
    <div className="md:w-3/4 xl:w-3/6 md:border md:rounded-md font-semibold md:mt-2 md:mx-auto p-8 gap-4 flex flex-col">
      {isSuccess ? (
        <RecipeSubmitPage />
      ) : (
        <>
          <h1 className="text-xl md:text-3xl mb-3">Create a recipe</h1>
          {/* Upload Image */}
          <section className="">
            <ImageUpload errMsg={errMsg?.img!} setFile={changeImg} />
          </section>
          <Divider />
          {/* Title */}
          <section className="space-y-1">
            {errMsg?.title ? (
              <label className="text-sm bg-red-500 text-white p-1 rounded">
                {errMsg?.title}
              </label>
            ) : (
              <label className="">Title</label>
            )}
            <Input
              onChange={onChange}
              sx={{ padding: 1 }}
              placeholder="Recipe title"
              variant="soft"
              name="title"
            />
          </section>
          {/* Description */}
          <section className="space-y-1">
            {errMsg?.description ? (
              <label className="text-sm bg-red-500 text-white p-1 rounded">
                {errMsg?.description}
              </label>
            ) : (
              <label className="">Description</label>
            )}
            <Textarea
              onChange={onChange}
              name="description"
              minRows={3}
              sx={{ padding: 1 }}
              placeholder="Tell us about your recipe"
              variant="soft"
            />
          </section>
          {/* Preparation time */}
          <section className="space-y-1">
            <label className="text-gray-600">Total time</label>
            <Input
              sx={{ padding: 1 }}
              placeholder="e.g. 30 minutes"
              variant="soft"
              onChange={onChange}
              name="prepTime"
            />
          </section>
          {/* Ingredients */}
          <section className="space-y-2 mt-4">
            <section className="flex items-center gap-3">
              {errMsg?.ingredients ? (
                <label className="text-sm bg-red-500 text-white p-1 rounded">
                  {errMsg?.ingredients}
                </label>
              ) : (
                <label className="">Ingredient</label>
              )}
              <IconButton
                onClick={() =>
                  setIngredients((p) => [
                    ...p,
                    { ingredient: "", quantity: "" },
                  ])
                }
                size="sm"
              >
                <IconSquareRoundedPlus />
              </IconButton>
            </section>
            <section className="space-y-4">
              {ingredients.map((_ingredient, index) => (
                <Ingredient setIngredients={setIngredients} index={index} />
              ))}
            </section>
          </section>
          {/* Preparation */}
          <section className="space-y-2 mt-4">
            <section className="flex items-center gap-3">
              {errMsg?.preparation ? (
                <label className="text-sm bg-red-500 text-white p-1 rounded">
                  {errMsg?.preparation}
                </label>
              ) : (
                <label className="">Preparations</label>
              )}
              <IconButton
                onClick={() =>
                  setPreparation((p) => [...p, { name: "", time: "" }])
                }
                size="sm"
              >
                <IconSquareRoundedPlus />
              </IconButton>
            </section>
            <section className="space-y-4">
              {preparation.map((_step, index) => (
                <Preparation setPreparation={setPreparation} index={index} />
              ))}
            </section>
          </section>
          <Divider />
          {/* Additional Information */}
          <section>
            <AdditionalInformation
              advanced={advanced}
              setAdvanced={setAdvanced}
            />
          </section>
          <Divider />
          {/* Submit */}
          <section>
            <Button loading={isLoading} onClick={validateRecipe} fullWidth>
              Submit
            </Button>
          </section>{" "}
        </>
      )}
    </div>
  );
}
