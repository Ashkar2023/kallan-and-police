import { useSocket } from "@/context/socket.context"
import { useEffect } from "react"

export const SocketMounter = () => {
    const { socket } = useSocket();

    useEffect(() => {
        if(socket){
            
        }

        return ()=>{
            if(socket){

            }
        }
    }, [socket])

    return (
        <div>

        </div>
    )
}
