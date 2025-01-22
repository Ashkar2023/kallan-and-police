import { RouterProvider } from "react-router-dom"
import { AppRouter } from "./router/index.router"

export const App = () => {
    return (
        <RouterProvider router={AppRouter}>

        </RouterProvider>
    )
}
