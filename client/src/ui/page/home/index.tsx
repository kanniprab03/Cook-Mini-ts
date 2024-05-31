/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, CircularProgress } from "@mui/joy";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecipe } from "../../../lib/context/RecipeContext";
import { useView } from "../../../lib/context/ViewContext";
import { Greetings } from "../../../lib/greetings";

export default function Home() {
  const { setHeader } = useView();
  const navigate = useNavigate();
  const { globalRecipe } = useRecipe();

  setHeader(true);

  return (
    <div className="w-full h-screen flex items-center flex-col">
      <header className="mt-5 relative h-fit w-fit">
        <img
          className="w-screen md:w-[700px] lg:w-[900px] h-[350px] 2xl:w-[1100px] object-cover rounded-md"
          src="http://localhost:5500/bucket/server/1708683839066-690214283-bg-1.jpg"
          alt=""
        />
        <section className="absolute bottom-10 left-10 text-white space-y-2">
          <h1 className="text-3xl font-semibold">
            {Greetings()}! <br />
            Let's make a Full course meal.
          </h1>
          <Button onClick={() => navigate("/search")}>Get Started</Button>
        </section>
      </header>
      {!globalRecipe ? (
        <>
          <h1 className="w-screen md:w-[700px] 2xl:w-[1100px] lg:w-[900px] text-2xl font-medium mt-2">
            All Recipes
          </h1>
          <section className="p-3">
            <CircularProgress />
          </section>
        </>
      ) : (
        <>
          <h1 className="w-screen md:w-[700px] 2xl:w-[1100px] lg:w-[900px] text-2xl font-medium mt-2">
            All Recipes
          </h1>
          <section className="w-screen md:w-[700px] 2xl:w-[1100px] lg:w-[900px] flex flex-row md:gap-3 gap-2 overflow-ellipsis mt-3 flex-wrap">
            {globalRecipe.map((recipe, i) => (
              <section
                key={i}
                onClick={() => navigate(`/recipes/${recipe?._id}`)}
                className="w-fit cursor-pointer"
              >
                <Image img={recipe?.img} />
                <p className="pl-1 font-medium line-clamp-2  w-[100px]">
                  {recipe.title}
                </p>
              </section>
            ))}
          </section>
        </>
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
        className={`w-[100px] h-[100px] md:w-[165px] md:h-[165px] lg:w-[170px] lg:h-[170px] 2xl:w-[173px] hover:scale-105 rounded-md transition-all ${isLoading ? "hidden" : "block"
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
