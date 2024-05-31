/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Chip, CircularProgress, Input, Textarea } from "@mui/joy";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../lib/context/AuthContext";
import {
  IGlobalRecipe,
  RECIPE_STATUS,
  useRecipe,
} from "../../../../lib/context/RecipeContext";
import { useNavigate } from "react-router-dom";
import { USER_ROLES } from "../../../../lib/context/types/AuthTypes";
export default function AllRecipes() {
  const [isLoading, setLoading] = useState(false);
  const { getAdminAllRecipes, adminRecipes } = useRecipe();

  const handleRequest = async () => {
    setLoading(true);
    const res = await getAdminAllRecipes();
    if (res.status) {
      setLoading(false);
    } else setLoading(false);
  };

  useEffect(() => {
    if (!adminRecipes) {
      handleRequest();
    }
  }, [adminRecipes]);

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
            <th>Status</th>
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
            adminRecipes?.map((recipes, i) => (
              <React.Fragment key={i}>
                <Row
                  handleRequest={handleRequest}
                  rec={recipes?.recipes}
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
  rec,
  creatorName,
  i,
}: {
  rec: IGlobalRecipe;
  creatorName: string;
  i: number;
  handleRequest: () => void;
}) => {
  const { updateRecipeStatus } = useRecipe();
  const [recipes, setRecipe] = useState(rec);
  const [modal, setModal] = useState(false);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setRecipe(rec);
  }, [rec]);

  const Img = (
    <img src={`http://localhost:5500/bucket/recipes/${recipes?.img}`} />
  );

  const approveRecipe = async (id: string, status: RECIPE_STATUS = RECIPE_STATUS.PUBLISHED) => {
    setLoading(true);
    const res = await updateRecipeStatus(id, status);
    if (res.status) {
      setRecipe(p => {return {...p, status }})
      setLoading(false);
    } else setLoading(false);
  };
  
  const unPublishRecipe = async (id: string, status: RECIPE_STATUS = RECIPE_STATUS.UNPUBLISHED) => {
    setLoading(true);
    const res = await updateRecipeStatus(id, status);
    if (res.status) {
      setRecipe(p => {return {...p, status }})
      setLoading(false);
    } else setLoading(false);
  };
  
  const rejectRecipe = async (id: string, status: RECIPE_STATUS = RECIPE_STATUS.removed) => {
    setLoading(true);
    const res = await updateRecipeStatus(id, status);
    if (res.status) {
      setRecipe(p => {return {...p, status }})
      setLoading(false);
    } else setLoading(false);
  };

  const viewModal = () => {
    setModal(!modal);
  };

  return (
    <>
      <tr key={i} className="border-t-2">
        <td>{i + 1}</td>
        <td className="w-10">{Img}</td>
        <td>{recipes?.title}</td>
        <td>
          {creatorName ? (
            creatorName
          ) : (
            <p className="text-red-500 font-semibold">Ghost</p>
          )}
        </td>
        <td>
          {recipes?.status === RECIPE_STATUS.PUBLISHED ? (
            <Chip color="success">Published</Chip>
          ) : recipes?.status === RECIPE_STATUS.removed ? (
            <Chip color="danger">Removed</Chip>
          ) : recipes?.status === RECIPE_STATUS.UNPUBLISHED ? (
            <Chip color="danger">UnPublished</Chip>
          ) : (
            <Chip color="warning">Pending</Chip>
          )}
        </td>
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
                    value={recipes?.title}
                    variant="soft"
                    size="sm"
                    readOnly
                  />
                </section>
                <section className="flex items-centers gap-2 md:w-[500px] overflow-y-auto lg:w-[750px] xl:w-[1055px] 2xl:w-auto">
                  <b>Description: </b>
                  <Textarea
                    sx={{ flex: 1 }}
                    value={recipes?.description}
                    variant="soft"
                    size="sm"
                    readOnly
                  />
                </section>
                <section className="flex items-centers gap-2">
                  <b>Ingredients: </b>
                  <section className="flex flex-row gap-2 md:w-[400px] overflow-y-auto lg:w-[650px] xl:w-[1055px] 2xl:w-[1150px]">
                    {recipes?.ingredients.map((ingredient) => (
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
                    {recipes?.preparation.map((prep) => (
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
                  {recipes?.status !== RECIPE_STATUS.removed && (
                    <Button
                      onClick={() => rejectRecipe(recipes?._id!)}
                      size="sm"
                      loading={isLoading}
                      color="danger"
                    >
                      Reject
                    </Button>
                  )}
                  <Button
                    onClick={() => unPublishRecipe(recipes?._id!)}
                    size="sm"
                    color="success"
                    loading={isLoading}
                  >
                    UnPublish
                  </Button>
                  {recipes?.status !== RECIPE_STATUS.PUBLISHED && (
                    <Button
                      onClick={() => approveRecipe(recipes?._id!)}
                      size="sm"
                      color="success"
                      loading={isLoading}
                    >
                      Publish
                    </Button>
                  )}
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
