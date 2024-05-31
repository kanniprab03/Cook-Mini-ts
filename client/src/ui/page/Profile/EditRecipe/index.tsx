/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, CircularProgress, IconButton, Input } from "@mui/joy";
import { IconEdit } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../../lib/context/AuthContext";
import {
  IGlobalRecipe,
  useRecipe,
} from "../../../../lib/context/RecipeContext";
import { USER_ROLES } from "../../../../lib/context/types/AuthTypes";
import Comments from "../../home/Recipe/Comments";
import AdvancedOptions from "./AdvancedOptions";
import UpdateDescription from "./UpdateDescription";
import UpdateImage from "./UpdateImage";
import UpdateIngredient from "./UpdateIngredient";
import UpdateTitle from "./UpdateTitle";

export default function EditRecipe() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<IGlobalRecipe | undefined>();
  const [loading, setLoading] = useState(true);
  const [err, setError] = useState(false);
  const { getCreatorRecipe } = useRecipe();

  const handleFetch = async () => {
    setLoading(true);
    setError(false);
    const res = await getCreatorRecipe(id!);
    if (res.status) {
      setRecipe(res.recipe);
      setLoading(false);
      setError(false);
    } else {
      setRecipe(undefined);
      setLoading(false);
      setError(true);
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);
  const { isAuthenticated, User } = useAuth();
  const navigate = useNavigate();

  if (
    !isAuthenticated ||
    User?.role !== USER_ROLES.CREATOR ||
    id == undefined ||
    !id ||
    err
  ) {
    navigate("/404");
  }

  return (
    <div className="flex justify-center mb-5">
      {loading ? (
        <>
          <section className="flex justify-center items-center mt-3">
            <CircularProgress />
          </section>
        </>
      ) : (
        <>
          <section className="flex gap-1">
            <section className="flex-1 mt-2 border-2 p-3 rounded-md flex flex-col">
              <section className="md:flex flex-row gap-3 w-full max-w-[800px] relative">
                <section className="">
                  <UpdateImage recipe={recipe!} />
                </section>
                <section className="flex-1 space-y-2">
                  <UpdateTitle data={recipe!} />
                  <UpdateDescription data={recipe!} />
                </section>
                <UpdatePrepTime recipe={recipe!} />
              </section>
              <AdvancedOptions
                data={recipe?.advanced!}
                _id={recipe?._id!}
                recipe={recipe!}
              />
              <UpdateIngredient data={recipe!} />
            </section>
            <section className="flex-[0.6] mt-2 border rounded-lg shadow-sm p-3">
              <h1 className="text-lg font-medium">Tips</h1>
              {/* <Divider /> */}
              <Comments
                is={true}
                recipe_id={recipe?._id!}
                comment_id={recipe?.commentId!}
              />
            </section>
          </section>
        </>
      )}
    </div>
  );
}

const UpdatePrepTime = ({ recipe }: { recipe: IGlobalRecipe }) => {
  const { updatePrepTime } = useRecipe();
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [value, setValue] = useState(recipe?.prepTime);

  const handleUpdate = async () => {
    if (recipe?.prepTime !== value) {
      setLoading(true);
      const res = await updatePrepTime({
        _id: recipe?._id!,
        prepTime: value!,
      });
      if (!res.status) {
        alert(res.message);
      }
      setIsEdit(!isEdit);
      setLoading(false);
    }
  };

  return (
    <section
      className={`flex gap-2 px-2 items-center absolute right-[-10px] top-[-10px] bg-orange-400 p-1 rounded-md text-sm text-white border   `}
    >
      {!isEdit ? (
        <>
          <p className={``}>{value}</p>
          <IconButton size="sm" onClick={() => setIsEdit(!isEdit)}>
            <IconEdit color="#fff" size={16} />
          </IconButton>
        </>
      ) : (
        <>
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Preparation Time"
          />
          <Button loading={loading} size="sm" onClick={handleUpdate}>
            Save
          </Button>
        </>
      )}
    </section>
  );
};
