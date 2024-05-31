import { Button, CircularProgress, Input, Textarea } from "@mui/joy";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../lib/context/AuthContext";
import { useRecipe } from "../../../../lib/context/RecipeContext";
import { USER_ROLES } from "../../../../lib/context/types/AuthTypes";
import { RECIPE_STATUS } from "..";

export default function PendingDashboard() {
  const [isLoading, setLoading] = useState(false);
  const [pendingRecipes, setPendingRecipes] = useState<
    {
      recipes: {
        title: string;
        description: string;
        img: string;
        ingredients: { ingredient: string }[];
        preparation: { name: string }[];
        _id: string;
      };
      creatorName: string;
    }[]
  >([]);

  const fetchAllPendingRecipes = () => {
    setLoading(true);
    axios
      .get("http://localhost:5500/api/recipe/admin/allPending", {
        headers: {
          "auth-token": localStorage.getItem("token")
        }
      })
      .then((res) => {
        setLoading(false);
        setPendingRecipes(res.data);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchAllPendingRecipes();
  }, []);

  const { isAuthenticated, User } = useAuth();

  const navigate = useNavigate();

  if (!isAuthenticated || User?.role !== USER_ROLES.ADMIN) {
    navigate("/404");
  }
  return (
    <div className="p-3 flex flex-1">
      <table className="table-auto text-center rounded-md overflow-hidden border-2 border-black border-collapse w-full">
        <thead className="bg-black text-white">
          <tr>
            <th>Sl No</th>
            <th>Image</th>
            <th>Recipe Name</th>
            <th>Author Name</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={10} className="p-2">
                <CircularProgress />
              </td>
            </tr>
          ) : (
            pendingRecipes.map((recipes, i) => (
              <React.Fragment key={i}>
                <Row
                  remove={(i) => {
                    setPendingRecipes((p) => p.filter((_r, ind) => i !== ind));
                  }}
                  recipes={recipes?.recipes}
                  creatorName={recipes?.creatorName}
                  i={i}
                />
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

const Row = ({
  recipes,
  creatorName,
  i,
}: {
  recipes: {
    title: string;
    description: string;
    img: string;
    ingredients: { ingredient: string }[];
    preparation: { name: string }[];
    _id: string;
  };
  creatorName: string;
  i: number;
  remove: (index: number) => void;
}) => {
  const [modal, setModal] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [rec, setRec] = useState(recipes);
  const { updateRecipeStatus } = useRecipe();

  useEffect(() => {
    setRec(recipes);
  }, [recipes]);

  const Img = <img src={`http://localhost:5500/bucket/recipes/${rec?.img}`} />;

  const handleRecipeStatus = async (status: RECIPE_STATUS) => {
    setLoading(true);
    const res = await updateRecipeStatus(recipes?._id, status);
    setLoading(false);
    if (!res.status) alert(res.message);
  };

  const viewModal = () => {
    setModal(!modal);
  };

  return (
    <>
      <tr key={i} className="border-t-2">
        <td>{i + 1}</td>
        <td className="w-10">{Img}</td>
        <td>{rec?.title}</td>
        <td>{creatorName!}</td>
        <td>
          <Button onClick={viewModal} size="sm" variant="plain">
            {modal ? "Close" : "View"}
          </Button>
        </td>
      </tr>
      {modal ? (
        <tr className="bg-gray-500 w-full">
          <td colSpan={10} className="rounded-md overflow-hidden">
            <div className="flex p-1">
              <section className="w-52">{Img}</section>
              <section className="bg-white flex-1 rounded-r-lg p-2 space-y-2">
                <section className="flex items-centers gap-2 md:w-[500px] overflow-y-auto lg:w-[750px] xl:w-[1055px] 2xl:w-auto ">
                  <b>Title: </b>
                  <Input
                    sx={{ flex: 1 }}
                    value={rec.title}
                    variant="soft"
                    size="sm"
                    readOnly
                  />
                </section>
                <section className="flex items-centers gap-2 md:w-[500px] overflow-y-auto lg:w-[750px] xl:w-[1055px] 2xl:w-auto">
                  <b>Description: </b>
                  <Textarea
                    sx={{ flex: 1 }}
                    value={rec.description}
                    variant="soft"
                    size="sm"
                    readOnly
                  />
                </section>
                <section className="flex items-centers gap-2">
                  <b>Ingredients: </b>
                  <section className="flex flex-row gap-2 md:w-[400px] overflow-y-auto lg:w-[650px] xl:w-[1055px] 2xl:w-[1150px]">
                    {rec.ingredients.map((ingredient) => (
                      <section>
                        <Textarea
                          sx={{ flex: 1 }}
                          value={ingredient?.ingredient}
                          variant="soft"
                          size="sm"
                          readOnly
                        />
                      </section>
                    ))}
                  </section>
                </section>
                <section className="flex items-centers gap-2">
                  <b>Preparations: </b>
                  <section className="flex flex-row gap-2 md:w-[400px] overflow-y-auto lg:w-[650px] xl:w-[1055px] 2xl:w-[1150px]">
                    {rec.preparation.map((prep) => (
                      <section>
                        <Textarea
                          sx={{ flex: 1 }}
                          value={prep?.name}
                          variant="soft"
                          size="sm"
                          readOnly
                        />
                      </section>
                    ))}
                  </section>
                </section>
                <section className="flex gap-3 float-right">
                  <Button
                    onClick={() => handleRecipeStatus(RECIPE_STATUS.removed)}
                    size="sm"
                    loading={isLoading}
                    color="danger"
                  >
                    Remove
                  </Button>
                  <Button
                    onClick={() => handleRecipeStatus(RECIPE_STATUS.PUBLISHED)}
                    size="sm"
                    color="success"
                    loading={isLoading}
                  >
                    Publish
                  </Button>
                </section>
              </section>
            </div>
          </td>
        </tr>
      ) : (
        <></>
      )}
    </>
  );
};
