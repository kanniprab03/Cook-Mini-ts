/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Chip, CircularProgress, Divider, IconButton } from "@mui/joy";
import { IconHeartFilled, IconHeart, IconMessage, IconPrinter } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../../lib/context/AuthContext";
import { IGlobalRecipe, useRecipe } from "../../../../lib/context/RecipeContext";
import Comments from "./Comments";
import { useComment } from "../../../../lib/context/CommentContext";

export default function RecipePage() {
  const { id } = useParams();
  const { globalComment } = useComment();
  const [recipe, setRecipe] = useState<IGlobalRecipe | undefined>();
  const [isLiked, setLiked] = useState(false);
  const [isSaved, setSaved] = useState<boolean>(false);
  const [notF, setNotF] = useState(false);

  const { likeRecipe, saveRecipe, singleRecipe } = useRecipe();
  const { isAuthenticated, User } = useAuth();
  const { getComments } = useComment();
  const navigate = useNavigate();

  useEffect(() => {
    if (singleRecipe) {
      console.log("first", singleRecipe)
      setRecipe(singleRecipe)
      setLiked(singleRecipe?.likeRecipe?.includes(User?._id!)!)
      // @ts-expect-error aaa
      setSaved(singleRecipe?.isSaved)
      getComments(recipe?.commentId!);
    }
  }, [singleRecipe])

  const handleSave = async () => {
    const res = await saveRecipe(id!);
    if (res.status) {
      setSaved(res.saved);
      setNotF(false);
    } else {
      setNotF(true);
    }
  };

  const handleLike = async () => {
    const res = await likeRecipe(recipe?._id!);
    if (res.status) {
      setRecipe(res.recipe);
      setLiked(res.recipe?.likeRecipe?.includes(User?._id!)!);
    }
  };

  useEffect(() => {
    setLiked(recipe?.likeRecipe?.includes(User?._id!)!);
  }, [User]);

  if (id === "undefined" || !id || notF) {
    navigate("/404");
  }

  if (singleRecipe === null) return navigate("/404")
  if (!singleRecipe) return <section className="flex items-center justify-center mt-10"> <CircularProgress /> </section>

  return (
    <div className="flex justify-center mb-5">
      {!singleRecipe ? (<section className="flex justify-center items-center mt-3"><CircularProgress /></section>
      ) : (
        <section className="flex gap-3">
          <section className="mt-2 border-2 p-3 rounded-md flex flex-1 flex-col">
            <section className="md:flex flex-row gap-3 w-full max-w-[800px] relative">
              <Image img={recipe?.img!} />
              <section className="space-y-2">
                <h1 className="text-2xl font-medium">{recipe?.title}</h1>
                <p className="">{recipe?.description}</p>
              </section>
              <p className={`absolute right-[-10px] top-[-10px] bg-orange-400 p-1 rounded-md text-sm text-white border ${recipe?.prepTime == "--" ? "hidden" : "block"}`}>{recipe?.prepTime}</p>
            </section>
            <section className="mt-2 flex p-2 gap-5 flex-wrap items-center">
              <p className="font-medium">
                Total Visits: {recipe?.visitCount?.length}
              </p>
              <section className="flex gap-3">
                <section>
                  <IconButton onClick={handleLike} disabled={isAuthenticated ? !recipe?.advanced?.likeRecipe : true} >
                    {isLiked ? (<IconHeartFilled className="text-red-500" />) : (<IconHeart />)}
                    {recipe?.likeRecipe.length}
                  </IconButton>
                </section>
                <section className="flex items-center">
                  <IconMessage /> {globalComment?.length}
                </section>
                <section>
                  <IconButton onClick={() => window.print()}>
                    <IconPrinter />
                  </IconButton>
                </section>
              </section>
              <Chip disabled={!isAuthenticated} onClick={handleSave} color={`${isSaved ? "success" : "neutral"}`} className={`ml-auto cursor-pointer `} sx={{ display: recipe?.advanced?.saveRecipe ? "inherit" : "none", }}>
                {isSaved ? "Saved" : "Save"}
              </Chip>
            </section>
            <section className="mt-2 border-2 p-3 rounded-md max-w-[800px] w-full md:flex md:gap-3 space-y-3 ">
              <section className="flex-1">
                <h1 className="text-lg font-semibold">Ingredients</h1>
                <section className="space-y-1">
                  {recipe?.ingredients.map((ingredient: any, i) => (
                    <p key={i}>
                      {ingredient?.ingredient}
                    </p>
                  ))}
                </section>
              </section>
              <section className="flex-[1.5]">
                <h1 className="text-lg font-medium">Preparation</h1>
                <section className="space-y-1">
                  {recipe?.preparation.map((prep: any, i: number) => (
                    <section key={i} className="flex gap-3">
                      <p className="font-bold text-slate-600">{i + 1}</p>
                      <p>{prep?.name}</p>
                    </section>
                  ))}
                </section>
              </section>
            </section>
          </section>
          <section className="flex-[0.6] mt-2 border rounded-lg shadow-sm p-3">
            <h1 className="text-lg font-medium">Tips</h1>
            <Divider />
            <Comments
              is={recipe?.advanced?.commentRecipe!}
              recipe_id={recipe?._id!}
              comment_id={recipe?.commentId!}
            />
          </section>
        </section>

      )}
    </div>
  );
}

const Image = ({ img }: { img: string }) => {
  const [isLoading, setLoading] = useState(true);
  return (
    <>
      <img
        src={`http://localhost:5500/bucket/recipes/${img}`}
        className={`w-[100px] h-[100px] md:w-[130px] md:h-[135px] lg:w-[125px] lg:h-[125px] xl:w-[155px] xl:h-[155px] rounded-md ${isLoading ? "hidden" : "block"
          }`}
        alt=""
        onLoad={() => setLoading(false)}
      />
      {isLoading && (
        <section className="w-[100px] h-[100px] md:w-[130px] md:h-[135px] lg:w-[125px] lg:h-[125px] xl:w-[155px] xl:h-[155px] rounded-md flex items-center justify-center">
          <CircularProgress variant="plain" size="sm" />
        </section>
      )}
    </>
  );
};
