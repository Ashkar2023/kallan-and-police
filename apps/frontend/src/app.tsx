import { RouterProvider } from "react-router-dom"
import { AppRouter } from "./router/index.router"
import { SocketProvider } from "@/context/socket.context";
import { Toaster } from "./components/ui/sonner";

export const App = () => {
    return (
        <SocketProvider>
            <Toaster/>
            <RouterProvider router={AppRouter}/>
        </SocketProvider>
    )
}
