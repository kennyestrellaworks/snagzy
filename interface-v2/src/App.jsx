import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { RootLayout } from "./layout/RootLayout";

export const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(<Route path="/" element={<RootLayout />}></Route>),
  );
  return <RouterProvider router={router} />;
};
