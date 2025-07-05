import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ClientToServerEvents, gameEvents, GameRoom, RoomStatus, ServerToClientEvents, socketEvents } from "common"
import { UUID } from "crypto"
import { useNavigate } from "react-router-dom"
import { Check, DoorOpen } from "lucide-react"
import clsx from "clsx"
import { useAtom, useAtomValue } from "jotai/react"
import { $gameRoom, $playerdData } from "@/atoms/global.atoms"
import { useSocketContext } from "@/hooks/useSocket"

export const Lobby = () => {
    const { socket } = useSocketContext();
    const [gameRoom, setGameRoom] = useAtom($gameRoom);
    const [playerData, setPlayerData] = useAtom($playerdData);
    const currentPlayer = gameRoom?.players[playerData?.playerId as UUID];
    const navigate = useNavigate();

    const ready = currentPlayer?.status === "READY";

    useEffect(() => {
        if (!gameRoom) {
            setPlayerData(null)
            setGameRoom(null)
            navigate("/join");
        }
    }, [gameRoom])

    useEffect(() => {
        const startGameHandler = () => {
            setGameRoom(pr => {
                if (!pr) return null;

                return {
                    ...pr,
                    status: RoomStatus.LOADING
                }
            })
            navigate("/game");
        }

        const playerJoinedHandler = (data: ServerToClientEvents["PLAYER_JOINED"]) => {
            setGameRoom(data.room);
        }

        const playerLeftHandler = (data: ServerToClientEvents["PLAYER_LEFT"]) => {
            setGameRoom(data);
        }

        const updatePlayerStatusHandler = (data: ServerToClientEvents["UPDATE_PLAYER_STATUS"]) => {

            setGameRoom((prevRoom) => {
                if (!prevRoom) return prevRoom;

                return {
                    ...prevRoom,
                    players: {
                        ...prevRoom.players,
                        [data.playerId]: {
                            ...prevRoom.players[data.playerId],
                            status: data.status
                        }
                    },
                };
            });
        }

        if (socket) {
            socket.on(socketEvents.PLAYER_JOINED, playerJoinedHandler)
            socket.on(socketEvents.PLAYER_LEFT, playerLeftHandler)
            socket.on(gameEvents.UPDATE_PLAYER_STATUS, updatePlayerStatusHandler)
            socket.on(gameEvents.START_GAME, startGameHandler);
        }

        return () => {
            if (socket) {
                socket.off(socketEvents.PLAYER_JOINED, playerJoinedHandler)
                socket.off(socketEvents.PLAYER_LEFT, playerLeftHandler)
                socket.off(gameEvents.UPDATE_PLAYER_STATUS, updatePlayerStatusHandler)
                socket.off(gameEvents.START_GAME, startGameHandler);
            }
        }
    }, [socket, setGameRoom])

    const handleToggleReady = () => {
        const newStatus = currentPlayer?.status === "READY" ? "NOT_READY" : "READY";

        const data: ClientToServerEvents["UPDATE_PLAYER_STATUS"] = {
            status: newStatus,
            roomId: gameRoom!.roomId,
            playerId: playerData?.playerId as UUID
        };
        socket?.emit(gameEvents.UPDATE_PLAYER_STATUS, data);
    }

    const handleStartGame = () => {
        socket?.emit(gameEvents.START_GAME, { roomId: gameRoom?.roomId });
    }

    const handleLeave = () => {
        socket?.emit(socketEvents.EXIT_ROOM, { playerId: playerData?.playerId, roomId: gameRoom?.roomId } as ClientToServerEvents["EXIT_ROOM"], (done: boolean) => {
            if (done){
                setGameRoom(null)
                setPlayerData(null)
                navigate("/");
            } 
        })
    }

    return gameRoom?.status === RoomStatus.LOADING ?
        (
            <div className="h-dvh w-full grid place-content-center bg-slate-200">
                <h3 className="">Starting game<span className="animate-ellipsis inline-block w-1"></span></h3>
            </div>
        ) :
        (
            <div className="flex flex-col h-dvh w-full bg-background">
                {/* Top Bar */}
                <div className="w-full bg-primary text-white py-2 px-4 flex justify-between items-center shadow">
                    <span className="font-bold"><span className="text-slate-300 font-normal">Room ID:&nbsp;</span>{gameRoom?.roomId?.toUpperCase()}</span>
                    {playerData?.playerId === gameRoom?.host && (
                        <span className="font-bold"><span className="text-slate-300 font-normal">Password:&nbsp;</span>{gameRoom?.password?.toUpperCase()}</span>
                    )}
                </div>
                {/* Content */}
                <div className="flex flex-col items-center justify-between max-w-[480px] w-full p-6 pb-2 gap-3 h-full mx-auto flex-grow">
                    <div className="min-h-6 w-full">
                        <Button
                            className="aspect-square bg-yellow-500 hover:bg-yellow-600 float-right"
                            onClick={handleLeave}
                        >
                            <p>Leave</p>
                            <DoorOpen />
                        </Button>
                    </div>
                    <div className="relative w-full flex-grow overflow-y-auto px-1">
                        <h4 className="text-sm font-extralight mb-1 w-full text-center text-foreground">Players</h4>
                        <ul className="flex flex-col gap-2 py-1">
                            {Object.keys(gameRoom?.players as GameRoom["players"]).map((pid) => (
                                <li
                                    key={pid}
                                    className={
                                        clsx(
                                            "flex flex-row items-center justify-between bg-white/90 rounded-lg px-4 py-2 shadow border border-slate-200",
                                            pid === playerData?.playerId ? "outline outline-slate-400" : ""
                                        )
                                    }
                                >
                                    <span className="font-medium text-slate-800">{gameRoom?.players[pid as UUID].name} {pid === gameRoom?.host ? "🎙️" : ""}</span>
                                    {gameRoom?.players[pid as UUID].status === "READY" ? (
                                        <Check size={20} color="mediumseagreen" />
                                    ) : (
                                        <span className="ml-2 w-[22px] h-[22px]"></span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <Button
                        className={clsx("w-full mt-2", ready ? "bg-red-700 hover:bg-red-800" : "bg-green-700 hover:bg-green-800")}
                        onClick={handleToggleReady}
                    >
                        {ready ? "Unready" : "Mark Ready"}
                    </Button>
                    {
                        Object.entries(gameRoom!.players).every(([_, player]) => player.status === "READY") && playerData?.playerId === gameRoom?.host &&
                        <Button
                            className="w-full min-h-12 bg-green-500 hover:bg-green-600"
                            onClick={handleStartGame}
                        >
                            Start game
                        </Button>
                    }
                </div>
            </div>
        )
}