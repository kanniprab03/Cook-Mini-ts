import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
const NotFound = lazy(() => import("../components/NotFound"));
const Profile = lazy(() => import("../page/Profile"));
const AllRecipes = lazy(() => import("../page/Profile/Dashboard/AllRecipes"));
const AllUsers = lazy(() => import("../page/Profile/Dashboard/AllUsers"));
const PendingDashboard = lazy(() => import("../page/Profile/Dashboard/PendingDashboard"));
const EditRecipe = lazy(() => import("../page/Profile/EditRecipe"));
const NewRecipe = lazy(() => import("../page/Profile/NewRecipe"));
const Auth = lazy(() => import("../page/auth"));
const LoginAuth = lazy(() => import("../page/auth/login"));
const RegisterAuth = lazy(() => import("../page/auth/regitser"));
const Home = lazy(() => import("../page/home"));
// @ts-expect-error aaa
const RecipePage = lazy(() => import("../page/home/Recipe"));
const Search = lazy(() => import("../page/home/Search"));
const Header = lazy(() => import("../page/home/header"));
const CommentProvider = lazy(() => import("./CommentProvider"));
const RecipeContextProvider = lazy(() => import("./RecipeContextProvider"));
const ViewContextProvider = lazy(() => import("./ViewContext"));

const Loading = () => <section className="h-screen w-screen items-center justify-center flex text-xl font-semibold"><h1>Loading...</h1></section>

export default function RouteProvider() {
  return (
    <Suspense fallback={<Loading />}>
      <BrowserRouter>
        <ViewContextProvider>
          <RecipeContextProvider>
            <CommentProvider>
              <>
                <Header />
                <Routes>
                  <Route index path="/" element={<Home />} />
                  <Route index path="/search" element={<Search />} />
                  <Route index path="/recipes/:id" element={<RecipePage />} />
                  <Route path="/auth" element={<Auth />}>
                    <Route path="login" element={<LoginAuth />} />
                    <Route path="register" element={<RegisterAuth />} />
                  </Route>
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/profile/recipes/create" element={<NewRecipe />} />
                  <Route
                    path="/profile/recipes/edit/:id"
                    element={<EditRecipe />}
                  />
                  {/* <Route
            path="/profile/recipes/Dashboard"
            element={<RecipeDashboard />}
          ></Route> */}
                  <Route
                    path="/profile/recipes/Dashboard/pending"
                    element={<PendingDashboard />}
                  />
                  <Route
                    path="/profile/recipes/Dashboard/all"
                    element={<AllRecipes />}
                  />
                  <Route
                    path="/profile/recipes/Dashboard/user/all"
                    element={<AllUsers />}
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </>
            </CommentProvider>
          </RecipeContextProvider>
        </ViewContextProvider>
      </BrowserRouter>
    </Suspense >
  );
}
