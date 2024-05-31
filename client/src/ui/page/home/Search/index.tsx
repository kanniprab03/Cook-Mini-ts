/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, CircularProgress, Input } from "@mui/joy";
import { IconSearch } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecipe } from "../../../../lib/context/RecipeContext";
import { useView } from "../../../../lib/context/ViewContext";

export default function Search() {
  const { setHeader } = useView();
  const navigate = useNavigate();
  const [recipeLoading, setRecipeLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchRecipes, setSearchRecipes] = useState<any[]>([]);
  const [query, setQuery] = useState("All");

  const { globalRecipe, getAllRecipes, getSearchRecipe } = useRecipe();

  setHeader(true);

  useEffect(() => {
    (async () => {
      if (!globalRecipe) {
        const res = await getAllRecipes();
        if (res.status) {
          setRecipeLoading(false);
        } else {
          setRecipeLoading(true);
        }
      } else {
        setRecipeLoading(false);
      }
    })
  }, [globalRecipe]);

  const handleSearch = async () => {
    setSearchLoading(true);
    const res = await getSearchRecipe(query);
    if (res.status) {
      console.log(res.recipes)
      setSearchRecipes(res.recipes);
    } else {
      setSearchRecipes([]);
    }
    setSearchLoading(false);
  };

  useEffect(() => {
    if (query.length <= 0) {
      setSearchRecipes([]);
      setQuery("All")
    }
  }, [query]);

  return (
    <div className="w-full h-screen flex items-center flex-col">
      <header className="mt-5 relative h-fit w-fit">
        <img
          className="relative w-screen md:w-[700px] lg:w-[900px] h-[350px] 2xl:w-[1100px] object-cover rounded-md"
          src="http://localhost:5500/bucket/server/1708683839066-690214283-bg-1.jpg"
          alt=""
        />

        <section className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-white space-y-3">
          <h1 className="text-3xl font-semibold">What's for dinner?</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="bg-white rounded-md flex p-2 gap-2"
            title="Search recipes by name, ingredient..."
          >
            <Input
              size="sm"
              onChange={(e) => setQuery(e.target.value)}
              value={query === "All" ? "" : query}
              variant="plain"
              type="search"
              startDecorator={<IconSearch size={18} />}
              placeholder="Search recipes by name, ingredient..."
            />
            <Button type="submit" loading={searchLoading} size="sm">
              Search
            </Button>
          </form>
        </section>
      </header>
      {/* Search Result */}

      {searchLoading ? (
        <>
          <h1 className="w-screen md:w-[700px] 2xl:w-[1100px] lg:w-[900px] text-2xl font-medium mt-2">
            Search Result
          </h1>
          <section className="p-3">
            <CircularProgress />
          </section>
        </>
      ) : query !== "All" && searchRecipes ? (
        <>
          <h1 className="w-screen md:w-[700px] 2xl:w-[1100px] lg:w-[900px] text-2xl font-medium mt-2">
            Search Result
          </h1>
          {searchRecipes.length <= 0 ? <section className="text-xl font-semibold mt-3">Not Found</section> :
            <section className="w-screen md:w-[700px] 2xl:w-[1100px] lg:w-[900px] flex flex-row md:gap-3 gap-2 overflow-ellipsis mt-3 flex-wrap">
              {searchRecipes.map((recipe) => (
                <section
                  key={recipe?.title}
                  onClick={() => navigate(`/recipes/${recipe?._id}`)}
                  className="w-fit cursor-pointer"
                >
                  <Image img={recipe?.img} />
                  <p className="pl-1 font-medium text-wrap w-[100px]">
                    {recipe.title.slice(0, 25)}...
                  </p>
                </section>
              ))}
            </section>}
        </>
      ) : !recipeLoading ? (
        <>
          <h1 className="w-screen md:w-[700px] 2xl:w-[1100px] lg:w-[900px] text-2xl font-medium mt-2">
            All Recipes
          </h1>
          <section className="p-3">
            <CircularProgress />
          </section>
        </>
      ) : (
        globalRecipe && globalRecipe.length > 0 && (
          <>
            <h1 className="w-screen md:w-[700px] 2xl:w-[1100px] lg:w-[900px] text-2xl font-medium mt-2">
              All Recipes
            </h1>
            <section className="w-screen md:w-[700px] 2xl:w-[1100px] lg:w-[900px] flex flex-row md:gap-3 gap-2 overflow-ellipsis mt-3 flex-wrap">
              {globalRecipe.map((recipe) => (
                <section
                  key={recipe?.title}
                  onClick={() => navigate(`/recipes/${recipe?._id}`)}
                  className="w-fit cursor-pointer"
                >
                  <Image img={recipe?.img} />
                  <p className="pl- font-medium line-clamp-2  w-[100px]">
                    {recipe.title}
                  </p>
                </section>
              ))}
            </section>
          </>
        )
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
        className={`w-[100px] h-[100px] md:w-[165px] md:h-[165px] lg:w-[170px] lg:h-[170px] 2xl:w-[173px] transition-all hover:scale-105 rounded-md ${isLoading ? "hidden" : "block"
          }`}
        alt=""
        onLoad={() => setLoading(false)}
      />
      {isLoading && (
        <section className="w-[100px] h-[100px] md:w-[165px] md:h-[165px] lg:w-[170px] lg:h-[170px] 2xl:w-[173px] rounded-md flex items-center justify-center">
          <CircularProgress variant="plain" size="sm" />
        </section>
      )}
    </>
  );
};
