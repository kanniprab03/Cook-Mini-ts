/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { IAddIngredientRow, IAddPreparationRow, IAdminGlobalRecipe, IGetADminRecipeResponse, IGetAllRecipeResponse, IGetSingleRecipeResponse, IGlobalRecipe, IIngredient, IInsertRecipeResponse, ILikeRecipeResponse, IRecipeContext, ISavedResponse, IUpdateAdvancedCommentRecipeResponse, IUpdateAdvancedLikeRecipe, IUpdateAdvancedLikeRecipeResponse, IUpdateAdvancedSaveRecipeResponse, IUpdateAdvancedVisibilityRecipe, IUpdateAdvancedVisibilityRecipeResponse, IUpdatePrepTIme, IUpdatePreparationRow, IUpdatePreparationRowDelete, RecipeContext as RecipeContext_1 } from "../../lib/context/RecipeContext";
import { RECIPE_STATUS } from "../page/Profile";

export default function RecipeContextProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const [recipes, setRecipes] = useState<IGlobalRecipe[]>();
  const [recipe, setRecipe] = useState<IGlobalRecipe | undefined>()
  const [adminRecipes, setAdminRecipe] = useState<IAdminGlobalRecipe[]>();

  const location = useLocation()

  useEffect(() => {
    if (location.pathname.match("/" || "/search")) {
      (async () => await getAllRecipes())()
    } else {
      if (recipes) setRecipes(undefined)
    }
    if (location.pathname.match(/\/recipes\/[0-9a-z_-]{24}/)) {
      (async () => await getRecipe(location.pathname.split("/")[2]))()
    } else {
      if (recipe) setRecipe(undefined)
    }

  }, [location.pathname])


  const getAllRecipes = (): Promise<IGetAllRecipeResponse> => {
    return new Promise((resolve) => {
      recipeInstance.get("/user/all").then((res) => {
        console.log(res.data)
        if (res.data.status) {
          setRecipes(res.data.recipes);
          resolve({
            message: res.data.message,
            status: res.data.status,
            recipes: res.data.recipes,
          })
        } else {
          setRecipe(undefined);
          resolve({
            message: res.data.message,
            status: res.data.status,
            recipes: [],
          })
        }
      }).catch(err =>
        resolve({
          message: err.message,
          status: false,
          recipes: [],
        })
      );
    })
  };

  const getSearchRecipe = (query: string): Promise<IGetAllRecipeResponse> => {
    return new Promise((resolve) => {
      recipeInstance
        .get("/user/search?query=" + query)
        .then((res) => {
          if (res.data.status) {
            resolve({
              message: res.data.message,
              status: res.data.status,
              recipes: res.data.recipes,
            });
          } else {
            resolve({
              message: res.data.message,
              status: res.data.status,
              recipes: [],
            });
          }
        })
        .catch(() => {
          resolve({
            message: "Something went wrong",
            status: false,
            recipes: [],
          });
        });
    });
  };

  const getAdminAllRecipes = (): Promise<IGetADminRecipeResponse> => {
    return new Promise((resolve) => {
      recipeInstance
        .get("/admin/all")
        .then((res) => {
          if (res.data.status) {
            setAdminRecipe(res.data.recipes);
            resolve({
              message: res.data.message,
              status: res.data.status,
              creatorName: res.data.creatorName,
              recipes: res.data.recipes,
            });
          } else {
            setAdminRecipe(undefined);
            resolve({
              message: res.data.message,
              status: res.data.status,
              creatorName: "Ghost",
              recipes: [],
            });
          }
        })
        .catch(() => {
          setAdminRecipe(undefined);
          resolve({
            message: "Something went wrong",
            status: false,
            creatorName: "Ghost",
            recipes: [],
          });
        });
    });
  };

  const getRecipe = (id: string): Promise<IGetSingleRecipeResponse> => {
    return new Promise((resolve) => {
      recipeInstance
        .get("/" + id)
        .then((res) => {
          if (res.data.status) {
            setRecipe(res.data.recipe)
            resolve({
              message: res.data.message,
              status: res.data.status,
              recipe: res.data.recipe,
              isSaved: res.data.isSaved,
            });
          } else {
            // @ts-expect-error null
            setRecipe(null)
            resolve({
              message: res.data.message,
              status: res.data.status,
              recipe: undefined,
              isSaved: false,
            });
          }
        })
        .catch(() => {
          resolve({
            message: "Something went wrong",
            status: false,
            recipe: undefined,
            isSaved: false,
          });
        });
    });
  };

  const getCreatorRecipe = (id: string): Promise<IGetSingleRecipeResponse> => {
    return new Promise((resolve) => {
      recipeInstance
        .get("/creator/view/" + id)
        .then((res) => {
          if (res.data.status) {
            resolve({
              message: res.data.message,
              status: res.data.status,
              recipe: res.data.recipe,
              isSaved: res.data.isSaved,
            });
          } else {
            resolve({
              message: res.data.message,
              status: res.data.status,
              recipe: undefined,
              isSaved: false,
            });
          }
        })
        .catch(() => {
          resolve({
            message: "Something went wrong",
            status: false,
            recipe: undefined,
            isSaved: false,
          });
        });
    });
  };

  const updateRecipeStatus = (
    id: string,
    status: RECIPE_STATUS
  ): Promise<IInsertRecipeResponse> => {
    return new Promise((resolve) => {
      if (!id || !status) resolve({ message: "Invalid Params", status: false });
      recipeInstance
        .put(`/admin/update/recipe/${id}/${status}`)
        .then((res) => {
          resolve({ message: res.data.message, status: res.data.status });
        })
        .catch(() => {
          resolve({ message: "Something went wrong", status: false });
        });
    });
  };

  const updateTitle = (payload: {
    _id: string;
    title: string;
  }): Promise<IInsertRecipeResponse> => {
    return new Promise((resolve) => {
      recipeInstance
        .put("/creator/edit/title", payload)
        .then((res) => {
          resolve({
            message: res.data.message,
            status: res.data.status,
          });
        })
        .catch((err) => {
          resolve({
            message: err.message,
            status: false,
          });
        });
    });
  };

  const updateImage = (payload: FormData): Promise<IInsertRecipeResponse> => {
    return new Promise((resolve) => {
      recipeInstance
        .put("/creator/edit/img", payload)
        .then((res) => {
          resolve({
            message: res.data.message,
            status: res.data.status,
          });
        })
        .catch((err) => {
          resolve({
            message: err.message,
            status: false,
          });
        });
    });
  };

  const updatePrepTime = (
    payload: IUpdatePrepTIme
  ): Promise<IInsertRecipeResponse> => {
    return new Promise((resolve) => {
      recipeInstance
        .put("/creator/edit/prepTime", payload)
        .then((res) => {
          resolve({
            message: res.data.message,
            status: res.data.status,
          });
        })
        .catch((err) => {
          resolve({
            message: err.message,
            status: false,
          });
        });
    });
  };

  const updateDescription = (payload: {
    _id: string;
    description: string;
  }): Promise<IInsertRecipeResponse> => {
    return new Promise((resolve) => {
      recipeInstance
        .put("/creator/edit/description", payload)
        .then((res) => {
          resolve({
            message: res.data.message,
            status: res.data.status,
          });
        })
        .catch((err) => {
          resolve({
            message: err.message,
            status: false,
          });
        });
    });
  };

  const updateIngredientRow = (payload: {
    _id: string;
    ingredient: IIngredient;
  }): Promise<IInsertRecipeResponse> => {
    return new Promise((resolve) => {
      recipeInstance
        .put("/creator/edit/ingredient/row", payload)
        .then((res) => {
          resolve({
            message: res.data.message,
            status: res.data.status,
          });
        })
        .catch((err) => {
          resolve({
            message: err.message,
            status: false,
          });
        });
    });
  };

  const updateIngredientRowDelete = (payload: {
    _id: string;
    ingredient: { _id: string };
  }): Promise<IInsertRecipeResponse> => {
    return new Promise((resolve) => {
      recipeInstance
        .put("/creator/edit/ingredient/row/delete", payload)
        .then((res) => {
          resolve({
            message: res.data.message,
            status: res.data.status,
          });
        })
        .catch((err) => {
          resolve({
            message: err.message,
            status: false,
          });
        });
    });
  };

  const updatePreparationRow = (
    payload: IUpdatePreparationRow
  ): Promise<IInsertRecipeResponse> => {
    return new Promise((resolve) => {
      recipeInstance
        .put("/creator/edit/preparation/row", payload)
        .then((res) => {
          resolve({
            message: res.data.message,
            status: res.data.status,
          });
        })
        .catch((err) => {
          resolve({
            message: err.message,
            status: false,
          });
        });
    });
  };

  const updatePreparationRowDelete = (
    payload: IUpdatePreparationRowDelete
  ): Promise<IInsertRecipeResponse> => {
    return new Promise((resolve) => {
      recipeInstance
        .put("/creator/edit/preparation/row/delete", payload)
        .then((res) => {
          resolve({
            message: res.data.message,
            status: res.data.status,
          });
        })
        .catch((err) => {
          resolve({
            message: err.message,
            status: false,
          });
        });
    });
  };

  const updateAdvancedSaveRecipe = (payload: {
    _id: string;
    save: boolean;
  }): Promise<IUpdateAdvancedSaveRecipeResponse> => {
    return new Promise((resolve) => {
      recipeInstance
        .put(`/creator/edit/advanced/${payload._id}/saveRecipe`)
        .then((res) => {
          resolve({
            message: res.data.message,
            status: res.data.status,
            save: res.data.saveRecipe,
          });
        })
        .catch((err) => {
          resolve({
            message: err.message,
            status: false,
            save: false,
          });
        });
    });
  };

  const updateAdvancedCommentRecipe = (payload: {
    _id: string;
    comment: boolean;
  }): Promise<IUpdateAdvancedCommentRecipeResponse> => {
    return new Promise((resolve) => {
      recipeInstance
        .put(`/creator/edit/advanced/${payload._id}/commentRecipe`)
        .then((res) => {
          resolve({
            message: res.data.message,
            status: res.data.status,
            comment: res.data.commentRecipe,
          });
        })
        .catch((err) => {
          resolve({
            message: err.message,
            status: false,
            comment: false,
          });
        });
    });
  };

  const updateAdvancedLikeRecipe = (
    payload: IUpdateAdvancedLikeRecipe
  ): Promise<IUpdateAdvancedLikeRecipeResponse> => {
    return new Promise((resolve) => {
      recipeInstance
        .put(`/creator/edit/advanced/${payload._id}/likeRecipe`)
        .then((res) => {
          resolve({
            message: res.data.message,
            status: res.data.status,
            like: res.data.like,
          });
        })
        .catch((err) => {
          resolve({
            message: err.message,
            status: false,
            like: false,
          });
        });
    });
  };

  const updateAdvancedVisibilityRecipe = (
    payload: IUpdateAdvancedVisibilityRecipe
  ): Promise<IUpdateAdvancedVisibilityRecipeResponse> => {
    return new Promise((resolve) => {
      recipeInstance
        .put(`/creator/edit/advanced/${payload._id}/visibility`)
        .then((res) => {
          resolve({
            message: res.data.message,
            status: res.data.status,
            visibility: res.data.visibility,
          });
        })
        .catch((err) => {
          resolve({
            message: err.message,
            status: false,
            visibility: false,
          });
        });
    });
  };

  const likeRecipe = (id: string): Promise<ILikeRecipeResponse> => {
    return new Promise((resole) => {
      recipeInstance
        .post("/user/advanced/likeRecipe/" + id)
        .then((res) => {
          resole({
            message: res.data.message,
            status: res.data.status,
            recipe: res.data.recipe,
            isSaved: res.data.isSaved,
          });
        })
        .catch((err) => {
          resole({
            message: err.message,
            status: false,
            recipe: undefined,
            isSaved: false,
          });
        });
    });
  };

  const saveRecipe = (id: string): Promise<ISavedResponse> => {
    return new Promise((resole) => {
      axios
        .post(
          "http://localhost:5500/api/user/recipe/save/" + id,
          {},
          {
            headers: {
              "auth-token": localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          resole({
            message: res.data.message,
            status: res.data.status,
            saved: res.data.saved,
          });
        })
        .catch((err) => {
          resole({
            message: err.message,
            status: false,
            saved: false,
          });
        });
    });
  };

  const addIngredientRow = (
    payload: IAddIngredientRow
  ): Promise<IInsertRecipeResponse> => {
    return new Promise((resolve) => {
      recipeInstance
        .put("/creator/edit/ingredient/row/insert", payload)
        .then((res) => {
          resolve({
            message: res.data.message,
            status: res.data.status,
          });
        })
        .catch((err) => {
          resolve({
            message: err.message,
            status: false,
          });
        });
    });
  };

  const addPreparationRow = (
    payload: IAddPreparationRow
  ): Promise<IInsertRecipeResponse> => {
    return new Promise((resolve) => {
      recipeInstance
        .put("/creator/edit/preparation/row/insert", payload)
        .then((res) => {
          resolve({
            message: res.data.message,
            status: res.data.status,
          });
        })
        .catch((err) => {
          resolve({
            message: err.message,
            status: false,
          });
        });
    });
  };

  const insertRecipe = (payload: FormData): Promise<IInsertRecipeResponse> => {
    return new Promise((resolve) => {
      recipeInstance
        .post("/creator/insert", payload)
        .then((res) => {
          resolve({
            message: res.data.message,
            status: res.data.status,
          });
        })
        .catch((err) => {
          resolve({
            message: err.message,
            status: false,
          });
        });
    });
  };

  const getCreatorAllRecipes = (): Promise<IGetAllRecipeResponse> => {
    return new Promise((resolve) => {
      recipeInstance
        .get("/creator/all")
        .then((res) => {
          resolve({
            message: res.data.message,
            status: res.data.status,
            recipes: res.data.recipes,
          });
        })
        .catch((err) => {
          resolve({
            message: err.message,
            status: false,
            recipes: [],
          });
        });
    });
  };

  const getUserLikedRecipe = (): Promise<IGetAllRecipeResponse> => {
    return new Promise((resolve) => {
      recipeInstance
        .get("/user/liked")
        .then((res) => {
          resolve({
            message: res.data.message,
            status: res.data.status,
            recipes: res.data.recipes,
          });
        })
        .catch((err) => {
          resolve({
            message: err.message,
            status: false,
            recipes: [],
          });
        });
    });
  };

  const getUserSavedRecipe = (): Promise<IGetAllRecipeResponse> => {
    return new Promise((resolve) => {
      axios
        .get("http://localhost:5500/api/user/recipe/saved", {
          headers: { "auth-token": localStorage.getItem("token") },
        })
        .then((res) => {
          resolve({
            message: res.data.message,
            status: res.data.status,
            recipes: res.data.recipes,
          });
        })
        .catch((err) => {
          resolve({
            message: err.message,
            status: false,
            recipes: [],
          });
        });
    });
  };

  const getUserHistory = (): Promise<IGetAllRecipeResponse> => {
    return new Promise((resolve) => {
      axios
        .get("http://localhost:5500/api/recipe/user/history", {
          headers: { "auth-token": localStorage.getItem("token") },
        })
        .then((res) => {
          resolve({
            message: res.data.message,
            status: res.data.status,
            recipes: res.data.recipes,
          });
        })
        .catch((err) => {
          resolve({
            message: err.message,
            status: false,
            recipes: [],
          });
        });
    });
  };

  const deleteRecipe = (id: string): Promise<IInsertRecipeResponse> => {
    return new Promise((resolve) => {
      recipeInstance
        .delete("/creator/delete/recipe/" + id)
        .then((res) => {
          resolve({
            message: res.data.message,
            status: res.data.status,
          });
        })
        .catch((err) => {
          resolve({
            message: err.message,
            status: false,
          });
        });
    });
  };

  useEffect(() => {
    getAllRecipes();
  }, []);

  const value: IRecipeContext = {
    globalRecipe: recipes!,
    adminRecipes: adminRecipes!,
    singleRecipe: recipe!,
    getAllRecipes,
    getSearchRecipe,
    getAdminAllRecipes,
    getRecipe,
    getCreatorRecipe,
    updateTitle,
    updatePrepTime,
    updateDescription,
    updateIngredientRow,
    updateIngredientRowDelete,
    updatePreparationRow,
    updatePreparationRowDelete,
    updateAdvancedSaveRecipe,
    updateAdvancedCommentRecipe,
    updateAdvancedLikeRecipe,
    likeRecipe,
    saveRecipe,
    addIngredientRow,
    addPreparationRow,
    insertRecipe,
    getCreatorAllRecipes,
    updateAdvancedVisibilityRecipe,
    getUserLikedRecipe,
    getUserSavedRecipe,
    getUserHistory,
    updateImage,
    deleteRecipe,
    updateRecipeStatus,
  };

  return (
    <RecipeContext_1.Provider value={value}>{children}</RecipeContext_1.Provider>
  );
}

const recipeInstance = axios.create({
  baseURL: "http://localhost:5500/api/recipe",
  headers: {
    "auth-token": localStorage.getItem("token"),
  },
});
