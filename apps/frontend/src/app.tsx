import { RouterProvider } from "react-router-dom"
import { AppRouter } from "./router/index.router"
import { SocketProvider } from "@/context/providers/socket.provider";
import { Toaster } from "sonner";

export const App = () => {
    return (
        <SocketProvider>
            <Toaster toastOptions={{
                classNames: {
                    toast: "bg-card text-cardForeground border border-border shadow-md rounded-lg px-4 py-3",
                    title: "text-foreground font-semibold",
                    description: "text-muted-foreground text-sm",
                    actionButton: "bg-primary text-primaryForeground px-3 py-1.5 rounded-md hover:bg-primary/90",
                    cancelButton: "bg-muted text-foreground px-3 py-1.5 rounded-md hover:bg-muted/80",
                    closeButton: "text-muted-foreground hover:text-foreground",
                },
            }} />
            <RouterProvider router={AppRouter} />
        </SocketProvider>
    )
}
