import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ClientToServerEvents, ServerToClientEvents, socketEvents } from "common"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { Input } from "../ui/input"
import logoPng from "../../assets/images/tmkp.logo.webp";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { useSocketContext } from "@/hooks/useSocket"
import { useSetAtom } from "jotai/react"
import { $gameRoom, $playerdData } from "@/atoms/global.atoms"

export const JoinPage = () => {
    const { socket } = useSocketContext();
    const setGameRoom = useSetAtom($gameRoom);
    const setPlayerData = useSetAtom($playerdData);
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [roomId, setRoomId] = useState("");
    const [roomPassword, setRoomPassword] = useState("");

    useEffect(() => {
        const handleError = (message: string) => {
            toast.error(message);
            return
        };
        const handleRoomInfo = (data: ServerToClientEvents["ROOM_INFO"]) => {
            setGameRoom(data.room)

            setPlayerData({
                playerId: data.playerId,
                sid: data.room.players[data.playerId].sid,
                name: data.room.players[data.playerId].name
            })

            setRoomPassword(data.roomId)
            navigate("/lobby");
        };

        socket?.on(socketEvents.ERROR, handleError);
        socket?.on(socketEvents.ROOM_INFO, handleRoomInfo);

        return () => {
            socket?.off(socketEvents.ERROR, handleError);
            socket?.off(socketEvents.ROOM_INFO, handleRoomInfo);
        };
    }, [socket]);

    const handleJoinRoom = () => {
        const trimmedRoomId = roomId.trim();
        const trimmedRoomPassword = roomPassword.trim();
        const trimmedUsername = username.trim();

        if (trimmedRoomId.length !== 6) {
            toast.error("Room ID must be 6 characters long");
            return;
        }
        if (trimmedRoomPassword.length !== 4) {
            toast.error("Room password must be 4 characters long");
            return;
        }
        if (trimmedUsername.length < 3) {
            toast.error("Username must be 3 characters long");
            return;
        }
        socket?.emit(socketEvents.JOIN_ROOM, {
            player_name: username,
            password: trimmedRoomPassword,
            roomId: trimmedRoomId
        } as ClientToServerEvents["JOIN_ROOM"])
    }

    const createRoom = () => {
        socket?.emit(socketEvents.CREATE_ROOM, {
            player_name: username
        } as ClientToServerEvents["CREATE_ROOM"])
    }

    return (
        <div className="flex items-center justify-center h-dvh w-full bg-background to-70%">
            <div className="flex flex-col items-center justify-between max-w-[480px] w-full p-6 pb-2 gap-8 h-full">
                {/* Logo */}
                <div className="flex flex-col items-center w-full">
                    <img
                        src={logoPng}
                        alt="Police arresting a thief"
                        className="w-8/12 object-cover drop-shadow-xl"
                    />
                </div>
                {/* Form */}
                <Tabs className="w-full h-full flex flex-col" defaultValue="join">
                    <TabsList className="w-max self-center mb-4">
                        <TabsTrigger value="join" className="data-[state=active]:bg-primary data-[state=active]:text-white">Join room</TabsTrigger>
                        <TabsTrigger value="create" className="data-[state=active]:bg-primary data-[state=active]:text-white">Create room</TabsTrigger>
                    </TabsList>
                    <TabsContent value="join">
                        <form className="flex flex-col w-full gap-4 items-center text-slate-400" onSubmit={e => { e.preventDefault(); handleJoinRoom(); }}>
                            <Input
                                type="text"
                                placeholder="Room ID"
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value)}
                                className="w-full rounded-lg"
                                spellCheck={false}
                            />
                            <Input
                                type="text"
                                placeholder="Password"
                                value={roomPassword}
                                onChange={(e) => setRoomPassword(e.target.value)}
                                className="w-full rounded-lg"
                                spellCheck={false}
                            />
                            <Input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full rounded-lg"
                                spellCheck={false}
                            />
                            <Button
                                className={`w-full button-primary`}
                                type="submit"
                            >
                                Join
                            </Button>
                        </form>
                    </TabsContent>
                    <TabsContent value="create" className="text-slate-400">
                        <Input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full rounded-lg"
                            spellCheck={false}
                        />
                        <Button
                            className={`w-full button-primary mt-4`}
                            type="button"
                            onClick={createRoom}
                        >
                            Create
                        </Button>
                    </TabsContent>
                </Tabs>
                {/* Footer */}
                <footer className="text-xs text-slate-400 text-center w-full">© ashkar.dev All rights reserved.</footer>
            </div>
        </div>
    )
}