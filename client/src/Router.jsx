import { useRoutes } from "react-router-dom";
import Home from "./Layouts/Home"; 
import Login from "./Layouts/Login"

export default function Router() {
  const routes = useRoutes([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/home",
      element: <Home />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    // {
    //   path: "/login",
    //   element: <Login />,
    // }
  ]);

  return routes;
}
