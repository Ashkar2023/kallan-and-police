import { JoinPage } from "@/components/pages/join.page";
import { Lobby } from "@/components/pages/lobby.page";
import { Navigate, RouteObject } from "react-router-dom";

export const router: RouteObject = {
    path: "/",
    children: [
        {
            index: true,
            element: <><Navigate to={'/join'} replace></Navigate></>
        },
        {
            path: "/join",
            element: <JoinPage />
        },
        {
            path: '/lobby',
            element: <Lobby />
        },
        {
            // path: '/game',
            // element: <GamePage />
        }
    ]
}