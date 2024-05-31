/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Button, IconButton, Input } from "@mui/joy";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import {
  IGlobalRecipe,
  IIngredient,
  IPreparation,
  useRecipe,
} from "../../../../lib/context/RecipeContext";
import NewIngredientModal from "./NewIngredient";
import NewPreparationModal from "./NewPreparation";

export default function UpdateIngredient({ data }: { data: IGlobalRecipe }) {
  const [ingredient, setIngredient] = useState(data?.ingredients);
  const [preparation, setPreparation] = useState(data?.preparation);
  const [newIngredientModal, setNewIngredientModal] = useState(false);
  const [newPreparationModal, setNewPreparationModal] = useState(false);
  return (
    <section className="mt-2 border-2 p-3 rounded-md max-w-[800px] w-full md:gap-3 space-y-3 ">
      <section className="flex-1">
        <section className="flex gap-3 items-center">
          <h1 className="text-lg font-semibold">Ingredients</h1>
          <IconButton
            size="sm"
            onClick={() => setNewIngredientModal(!newIngredientModal)}
          >
            <IconPlus />
          </IconButton>
          {newIngredientModal && (
            <NewIngredientModal
              _id={data?._id!}
              ingredient={ingredient.length}
              open={newIngredientModal}
              setOpen={setNewIngredientModal}
            />
          )}
        </section>
        <section className="space-y-1">
          <table className="w-full">
            <thead>
              <tr>
                <th>Sl No</th>
                <th>Ingredient</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {ingredient.map((ing, i) => (
                <UpdateIngRow
                  update={setIngredient}
                  key={ing?.ingredient}
                  index={i}
                  data={{ _id: data?._id!, ingredient: ing }}
                />
                // <p key={ingredient?.ingredient}>{ingredient?.ingredient}</p>
              ))}
            </tbody>
          </table>
        </section>
      </section>
      <section className="flex-[1.5]">
        <section className="flex items-center">
          <h1 className="text-lg font-medium">Preparation</h1>
          <IconButton
            size="sm"
            onClick={() => setNewPreparationModal(!newPreparationModal)}
          >
            <IconPlus />
          </IconButton>
          {
            newPreparationModal && (
              <NewPreparationModal
                _id={data?._id!}
                preparation={preparation.length}
                open={newPreparationModal}
                setOpen={setNewPreparationModal}
              />
            )
          }
        </section>
        <section className="space-y-1">
          <table className="w-full">
            <thead>
              <tr>
                <th>Sl No</th>
                <th>Steps</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {preparation.map((prep, i) => (
                <UpdatePrepRow
                  update={setPreparation}
                  key={prep?._id}
                  data={{ _id: data?._id!, preparation: prep }}
                  index={i}
                />
              ))}
            </tbody>
          </table>
        </section>
      </section>
    </section>
  );
}

function UpdateIngRow({
  data,
  update,
  index,
}: {
  data: {
    ingredient: IIngredient;
    _id: string;
  };
  update: React.Dispatch<React.SetStateAction<IIngredient[]>>;
  index: number;
}) {
  const [isEdit, setIsEdit] = useState(false);
  const [title, setTitle] = useState(data?.ingredient?.ingredient);
  const [isLoading, setIsLoading] = useState(false);
  const { updateIngredientRow, updateIngredientRowDelete } = useRecipe();

  const handleSubmit = async () => {
    if (data?.ingredient.ingredient?.trim() !== title?.trim()) {
      setIsLoading(true);
      const res = await updateIngredientRow({
        _id: data?._id!,
        ingredient: {
          ingredient: title?.trim(),
          _id: data?.ingredient?._id,
        },
      });
      if (res.status) {
        setIsEdit(!isEdit);
        setIsLoading(false);
      } else {
        setTitle(data?.ingredient.ingredient);
        setIsEdit(!isEdit);
        setIsLoading(false);
      }
    } else {
      setIsEdit(!isEdit);
    }
  };

  const handleDelete = async () => {
    const res = await updateIngredientRowDelete({
      _id: data?._id!,
      ingredient: {
        _id: data?.ingredient?._id,
      },
    });
    if (res.status) {
      update((p) => p.filter((x) => x._id !== data?.ingredient?._id));
    }
  };

  return (
    // <section className="flex items-center gap-3 mr-20">
    <tr>
      <td className="text-center border px-5 font-bold text-slate-600">
        {index + 1}
      </td>
      <td className="border pl-2 w-full">
        {!isEdit ? (
          <p className="">{title}</p>
        ) : (
          <Input
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            fullWidth
            size="sm"
          />
        )}
      </td>
      {isEdit ? (
        <td className="text-center ">
          <Button loading={isLoading} size="sm" onClick={handleSubmit}>
            Save
          </Button>
        </td>
      ) : (
        <>
          <td className="text-center ">
            <IconButton onClick={() => setIsEdit(!isEdit)} loading={isLoading}>
              <IconEdit />
            </IconButton>
          </td>
          <td className="text-center">
            <IconButton
              color="danger"
              onClick={handleDelete}
              loading={isLoading}
            >
              <IconTrash />
            </IconButton>
          </td>
        </>
      )}
    </tr>
    // </section>
  );
}
function UpdatePrepRow({
  data,
  update,
  index,
}: {
  data: {
    preparation: IPreparation;
    _id: string;
  };
  update: React.Dispatch<React.SetStateAction<IPreparation[]>>;
  index: number;
}) {
  const [isEdit, setIsEdit] = useState(false);
  const [title, setTitle] = useState(data?.preparation.name);
  const [isLoading, setIsLoading] = useState(false);
  const { updatePreparationRow, updatePreparationRowDelete } = useRecipe();

  const handleSubmit = async () => {
    if (data?.preparation.name.trim() !== title.trim()) {
      setIsLoading(true);
      const res = await updatePreparationRow({
        _id: data?._id!,
        preparation: {
          name: title.trim(),
          _id: data?.preparation?._id,
        },
      });
      if (res.status) {
        setIsEdit(!isEdit);
        setIsLoading(false);
      } else {
        setTitle(data?.preparation.name);
        setIsEdit(!isEdit);
        setIsLoading(false);
      }
    } else {
      setIsEdit(!isEdit);
    }
  };

  const handleDelete = async () => {
    const res = await updatePreparationRowDelete({
      _id: data?._id!,
      preparation: {
        _id: data?.preparation?._id,
      },
    });
    if (res.status) {
      update((p) => p.filter((x) => x._id !== data?.preparation?._id));
    }
  };

  return (
    // <section className="flex items-center gap-3 mr-20">
    <tr>
      <td className="text-center border px-5 font-bold text-slate-600">
        {index + 1}
      </td>
      <td className="border pl-2 w-full">
        {!isEdit ? (
          <p className="">{title}</p>
        ) : (
          <Input
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            fullWidth
            size="sm"
          />
        )}
      </td>
      {isEdit ? (
        <td className="text-center ">
          <Button loading={isLoading} size="sm" onClick={handleSubmit}>
            Save
          </Button>
        </td>
      ) : (
        <>
          <td className="text-center ">
            <IconButton onClick={() => setIsEdit(!isEdit)} loading={isLoading}>
              <IconEdit />
            </IconButton>
          </td>
          <td className="text-center">
            <IconButton
              color="danger"
              onClick={handleDelete}
              loading={isLoading}
            >
              <IconTrash />
            </IconButton>
          </td>
        </>
      )}
    </tr>
    // </section>
  );
}
