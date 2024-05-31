/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Chip, IconButton } from "@mui/joy";
import {
  IconEye,
  IconHeart,
  IconMessage,
  IconTrash,
} from "@tabler/icons-react";
import {
  IAdvanced,
  IGlobalRecipe,
  useRecipe,
} from "../../../../lib/context/RecipeContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdvancedOptions({
  data,
  _id,
  recipe,
}: {
  data: IAdvanced;
  _id: string;
  recipe: IGlobalRecipe;
}) {
  const navigate = useNavigate();
  const {
    updateAdvancedSaveRecipe,
    updateAdvancedCommentRecipe,
    updateAdvancedLikeRecipe,
    updateAdvancedVisibilityRecipe,
    deleteRecipe,
  } = useRecipe();
  const [saveRecipe, setSaveRecipe] = useState(data?.saveRecipe);
  const [saveLoading, setSaveLoading] = useState(false);
  const [commentRecipe, setCommentRecipe] = useState(data?.commentRecipe);
  const [commentLoading, setCommentLoading] = useState(false);
  const [likeRecipe, setLikeRecipe] = useState(data?.likeRecipe);
  const [visibleRecipe, setVisibleRecipe] = useState(data?.visibility);
  const [likeLoading, setLikeLoading] = useState(false);
  const [visibleLoading, setVisibleLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleRecipeSave = async () => {
    setSaveLoading(true);
    const res = await updateAdvancedSaveRecipe({
      _id,
      save: !saveRecipe,
    });
    if (res.status) {
      setSaveRecipe(res.save);
      setSaveLoading(false);
    } else {
      setSaveLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    const res = await deleteRecipe(recipe?._id!);
    if (res.status) {
      setDeleteLoading(false);
      navigate("/");
    } else {
      alert(res.message)
    }
  };

  const handleRecipeLike = async () => {
    setLikeLoading(true);
    const res = await updateAdvancedLikeRecipe({
      _id,
      like: !likeRecipe,
    });
    if (res.status) {
      setLikeRecipe(res.like);
      setLikeLoading(false);
    } else {
      setLikeLoading(false);
    }
  };

  const handleRecipeComment = async () => {
    setCommentLoading(true);
    const res = await updateAdvancedCommentRecipe({
      _id,
      comment: !commentRecipe,
    });
    if (res.status) {
      setCommentRecipe(res.comment);
      setCommentLoading(false);
    } else {
      setCommentLoading(false);
    }
  };

  const handleRecipeVisibility = async () => {
    setVisibleLoading(true);
    const res = await updateAdvancedVisibilityRecipe({
      _id,
      visibility: !visibleRecipe,
    });
    if (res.status) {
      setVisibleRecipe(res.visibility);
      setVisibleLoading(false);
    } else {
      setVisibleLoading(false);
    }
  };

  return (
    <>
      <section className="mt-2 flex p-2 gap-5 flex-wrap items-center">
        {/* <p className="font-medium">
          Total Visits: {data?.visitCount?.length}
        </p> */}
        <section className="flex items-center gap-4">
          <section>
            <p className="font-medium">
              Total visits: {recipe?.visitCount?.length}
            </p>
          </section>
          <section className="flex items-center">
            <IconButton
              loading={visibleLoading}
              onClick={handleRecipeVisibility}
              sx={{ marginLeft: "auto" }}
            >
              <Chip
                className={`cursor-pointer`}
                color={visibleRecipe ? "success" : "danger"}
              >
                <IconEye />
              </Chip>
            </IconButton>
          </section>
          <section className="flex items-center">
            <IconButton
              loading={likeLoading}
              onClick={handleRecipeLike}
              sx={{ marginLeft: "auto" }}
            >
              <Chip
                className={`cursor-pointer`}
                color={likeRecipe ? "success" : "danger"}
              >
                <IconHeart />
              </Chip>
            </IconButton>
            <p className="font-medium">{recipe?.likeRecipe.length}</p>
          </section>
          <section className="flex gap-3">
            <IconButton
              loading={commentLoading}
              onClick={handleRecipeComment}
              sx={{ marginLeft: "auto" }}
            >
              <Chip
                className={`cursor-pointer`}
                color={commentRecipe ? "success" : "danger"}
              >
                <IconMessage />
              </Chip>
            </IconButton>
          </section>
          <section className="flex gap-3">
            <IconButton
              loading={saveLoading}
              onClick={handleRecipeSave}
              sx={{ marginLeft: "auto" }}
            >
              <Chip
                className={`ml-auto cursor-pointer flex`}
                color={saveRecipe ? "success" : "danger"}
              >
                Save
              </Chip>
            </IconButton>
          </section>
          <section>
            <IconButton
              loading={deleteLoading}
              onClick={handleDelete}
              color="danger"
            >
              <IconTrash />
            </IconButton>
          </section>
        </section>
      </section>
    </>
  );
}
