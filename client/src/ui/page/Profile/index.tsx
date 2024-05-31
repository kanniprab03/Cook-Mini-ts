/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  CircularProgress,
  Modal,
  ModalClose,
  ModalDialog,
} from "@mui/joy";
import { Divider } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../lib/context/AuthContext";
import { IGlobalRecipe, useRecipe } from "../../../lib/context/RecipeContext";
import { useView } from "../../../lib/context/ViewContext";
import { USER_ROLES } from "../../../lib/context/types/AuthTypes";
import EditProfile from "./EditProfile";

export default function Profile() {
  const { User, UserRole, isAuthenticated } = useAuth();
  const [currentTab, setCurrentTab] = useState("saved");
  const [open, setOpen] = useState(false);

  const { setHeader } = useView();
  setHeader(true);

  if (!isAuthenticated) {
    window.location.pathname = "/404";
  }

  return (
    <>
      <Modal open={open} onClose={() => setOpen(!open)}>
        <ModalDialog>
          <ModalClose />
          <EditProfile />
        </ModalDialog>
      </Modal>
      <div className="mx-auto w-screen lg:w-5/6 xl:w-3/5 border h-fit ">
        <div className="w-full">
          <div className="flex items-center flex-col gap-2 mt-2">
            <img
              src={
                User?.profileImg
                  ? `http://localhost:5500/api/user/bucket/${User.profileImg} `
                  : "http://localhost:5500/bucket/server/1708683893822-987438908-bg-2.jpg"
              }
              className="md:w-24 w-20 h-20 md:h-24 rounded-full border"
            />
            <h1 className="text-xl font-medium">{User?.name}</h1>
            <div className="space-x-3">
              <Button
                onClick={() => setOpen(!open)}
                variant="soft"
                sx={{
                  backgroundColor: "white",
                  ":hover": {
                    backgroundColor: "white",
                  },
                  color: "#ffa500",
                }}
              >
                Edit Profile
              </Button>
              {/* <Button
                sx={{
                  backgroundColor: "#FB8C00",
                  ":hover": {
                    backgroundColor: "#ffa500",
                  },
                }}
              >
                Settings
              </Button> */}
            </div>
            <Divider className="mb-0" />
            <div className="w-full flex justify-center gap-2">
              <Button
                onClick={() => setCurrentTab("saved")}
                variant={currentTab === "saved" ? "outlined" : "plain"}
                color="primary"
              >
                Saved
              </Button>
              <Button
                onClick={() => setCurrentTab("liked")}
                variant={currentTab === "liked" ? "outlined" : "plain"}
                color="primary"
              >
                Liked
              </Button>
              <Button
                onClick={() => setCurrentTab("history")}
                variant={currentTab === "history" ? "outlined" : "plain"}
                color="primary"
              >
                History
              </Button>
              {UserRole === USER_ROLES.CREATOR && (
                <Button
                  onClick={() => setCurrentTab("recipe")}
                  variant={currentTab === "recipe" ? "outlined" : "plain"}
                  color="primary"
                >
                  Recipe
                </Button>
              )}
            </div>
            <Divider className="my-0" />
          </div>
          <div className="w-full h-fit flex justify-center">
            {User?.role === USER_ROLES.CREATOR && (
              <section
                className={`${currentTab === "recipe" ? "block" : "hidden"}`}
              >
                <Recipe />
              </section>
            )}
            <section
              className={`${currentTab === "history" ? "block" : "hidden"}`}
            >
              <History />
            </section>
            <section
              className={`${currentTab === "saved" ? "block" : "hidden"}`}
            >
              <Saved />
            </section>
            <section
              className={`${currentTab === "liked" ? "block" : "hidden"}`}
            >
              <Liked />
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

const Liked = () => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState<IGlobalRecipe[]>([]);
  const { getUserLikedRecipe } = useRecipe();

  const fetchLiked = async () => {
    const res = await getUserLikedRecipe();
    if (res.status) {
      setLiked(res.recipes);
    } else {
      alert(res.message);
    }
  };

  useEffect(() => {
    fetchLiked();
  }, []);

  return (
    <>
      <section className="flex flex-wrap items-center ">
        {liked.map((recipe) => (
          <section
            key={recipe?.title}
            onClick={() => navigate(`/recipes/${recipe._id}`)}
            className="w-fit overflow-hidden cursor-pointe max-w-[100px] md:max-w-[212px] p-2 cursor-pointer relative"
          >
            <section className="relative">
              <Image img={recipe?.img} />
            </section>
            <p className="pl-1 font-medium line-clamp-2 w-[100px]">
              {recipe.title}
            </p>
          </section>
        ))}
      </section>
    </>
  );
};

const History = () => {
  const [history, setHistory] = useState<IGlobalRecipe[]>([]);
  const navigate = useNavigate();
  const { getUserHistory } = useRecipe();

  const fetchHistory = async () => {
    const res = await getUserHistory();
    if (res.status) {
      setHistory(res.recipes);
    } else {
      alert(res.message);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <section className="flex flex-wrap items-center ">
      {history.map((recipe) => (
        <section
          key={recipe?.title}
          onClick={() => navigate(`/recipes/${recipe._id}`)}
          className="w-fit overflow-hidden cursor-pointe max-w-[100px] md:max-w-[212px] p-2 cursor-pointer relative"
        >
          <section className="relative">
            <Image img={recipe?.img} />
          </section>
          <p className="pl-1 font-medium line-clamp-2 w-[100px]">
            {recipe.title}
          </p>
        </section>
      ))}
    </section>
  );
};

const Saved = () => {
  const [savedRecipe, setSavedRecipe] = useState<IGlobalRecipe[]>([]);
  const navigate = useNavigate();
  const { getUserSavedRecipe } = useRecipe();

  const fetchSaved = async () => {
    const res = await getUserSavedRecipe();
    if (res.status) {
      setSavedRecipe(res.recipes);
    } else {
      alert(res.message);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  return (
    <section className="flex flex-wrap items-center ">
      {savedRecipe.map((recipe,i) => (
        <section
          key={i}
          onClick={() => navigate(`/recipes/${recipe._id}`)}
          className={`w-fit overflow-hidden cursor-pointe max-w-[100px] md:max-w-[212px] p-2 cursor-pointer relative ${
            !recipe?._id && "hidden"
          } `}
        >
          <section className="relative">
            <Image img={recipe?.img} />
          </section>
          <p className="pl-1 font-medium line-clamp-2 w-[100px]">
            {recipe?.title}
          </p>
        </section>
      ))}
    </section>
  );
};

export enum RECIPE_STATUS {
  PUBLISHED = "published",
  UNPUBLISHED = "unpublished",
  PENDING = "pending",
  removed = "removed",
}

export const Recipe = () => {
  const navigate = useNavigate();
  const { getCreatorAllRecipes } = useRecipe();
  const [isLoading, setIsLoading] = useState(true);
  const [recipes, setRecipes] = useState<any[]>([]);

  const fetchCreatorRecipes = async () => {
    setIsLoading(true);
    const res = await getCreatorAllRecipes();
    if (res.status) setRecipes(res.recipes);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCreatorRecipes();
  }, []);

  if (isLoading) {
    return (
      <section className="flex justify-center items-center p-4">
        <CircularProgress />
      </section>
    );
  }

  return (
    <section className="flex flex-wrap items-center ">
      {recipes.map((recipe) => (
        <section
          key={recipe?.title}
          onClick={() => navigate(`/profile/recipes/edit/${recipe._id}`)}
          className="w-fit overflow-hidden cursor-pointe max-w-[100px] md:max-w-[212px] p-2 cursor-pointer relative"
        >
          <section className="relative">
            <Image img={recipe?.img} />
          </section>
          <p className="pl-1 font-medium line-clamp-2 w-[100px]">
            {recipe.title}
          </p>

          {recipe.status === RECIPE_STATUS.PUBLISHED && (
            // <p className="text-sm text-green-500">Published</p>
            <span className="absolute bg-green top-1 right-2 animate">
              <span className="inline-flex bg-green-500 w-4 h-4 rounded-full border-white border-2"></span>
            </span>
          )}
          {recipe.status === RECIPE_STATUS.PENDING && (
            // <p className="text-sm text-yellow-500">Pending</p>
            <span className="absolute bg-green top-1 right-2 animate">
              <span className="inline-flex bg-yellow-500 w-4 h-4 rounded-full border-white border-2"></span>
            </span>
          )}
          {recipe.status === RECIPE_STATUS.removed && (
            // <p className="text-sm text-red-500">Removed</p>
            <span className="absolute bg-green top-1 right-2 animate">
              <span className="inline-flex bg-red-500 w-4 h-4 rounded-full border-white border-2"></span>
            </span>
          )}
          {recipe.status === RECIPE_STATUS.UNPUBLISHED && (
            // <p className="text-sm text-red-500">Removed</p>
            <span className="absolute bg-green top-1 right-2 animate">
              <span className="inline-flex bg-slate-700 animate-pulse w-4 h-4 rounded-full border-white border-2">
                <span className="w-full h-full bg-slate-700 rounded-full"></span>
              </span>
            </span>
          )}
        </section>
      ))}
    </section>
  );
};

const Image = ({ img }: { img: string }) => {
  const [isLoading, setLoading] = useState(true);
  const [isErr, setIsErr] = useState(false);
  return (
    <>
      <img
        src={`http://localhost:5500/bucket/recipes/${img}`}
        className={`${
          isErr ? "hidden" : "block"
        } w-[100px] h-[100px] md:w-[130px] md:h-[135px] lg:w-[125px] lg:h-[125px] transition-all hover:scale-105 xl:w-[155px] xl:h-[155px] rounded-md ${
          isLoading ? "hidden" : "block"
        }`}
        alt=""
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setIsErr(false);
        }}
      />
      {isLoading && (
        <section className="w-[100px] h-[100px] md:w-[130px] md:h-[135px] lg:w-[125px] lg:h-[125px] xl:w-[155px] xl:h-[155px] rounded-md flex items-center justify-center">
          <CircularProgress variant="plain" size="sm" />
        </section>
      )}
    </>
  );
};
