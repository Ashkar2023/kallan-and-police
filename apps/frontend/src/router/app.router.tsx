import { JoinPage } from "@/components/pages/join.page";
import { RouteObject } from "react-router-dom";

export const router: RouteObject = {
    path: "/",
    children: [
        {
            index: true,
            element: <JoinPage />
        }
    ]
}