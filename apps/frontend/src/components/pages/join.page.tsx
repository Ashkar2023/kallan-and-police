"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSocket } from "@/context/socket.context"
import { type IRoom, type IUserInfo, socketEvents } from "common"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

export const JoinPage = () => {
    const { socket } = useSocket()
    const navigate = useNavigate();

    const [roomCode, setRoomCode] = useState("")
    const [username, setUsername] = useState("")
    const [isJoining, setIsJoining] = useState(true)
    const [maxUsers, setMaxUsers] = useState(10)
    const [thiefAmount, setThiefAmount] = useState(1)


    const handleCreateRoom = () => {
        socket?.emit(socketEvents.create_room,
            {
                username,
                config: {
                    maxUsers,
                    thiefAmount,
                },
            } as {
                username: string
                config: IRoom["config"]
            },
            (response: any) => {
                navigate("/lobby",{
                    state:{
                        roomId:response.roomId,
                        username
                    }
                })
                toast(response.status);
            }
        )
    }

    const handleJoinRoom = () => {
        socket?.emit(socketEvents.join_room, {
            roomID: roomCode,
            username,
        } as IUserInfo)
    }

    const handleSubmit = () => {
        if (isJoining) {
            handleJoinRoom()
        } else {
            handleCreateRoom()
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-800 to-slate-300 to-70% flex flex-col items-center justify-center p-4">
            <header className="mb-8 text-center">
                <h4 className="text-2xl font-thin text-primary-foreground mb-2">The modern</h4>
                {/* <h1 className="text-4xl font-extrabold mb-2">കള്ളനും പോലീസും</h1> */}
            </header>

            <main className="w-full max-w-md">
                <div className="bg-card rounded-lg shadow-xl overflow-hidden">
                    <div className="relative h-48 overflow-hidden">
                        <img
                            src="https://c8.alamy.com/comp/E6N0EM/3d-white-people-police-arresting-a-thief-isolated-white-background-E6N0EM.jpg"
                            alt="Police arresting a thief"
                            className="h-full w-full object-cover object-top"
                        />
                    </div>
                    <div className="p-6 space-y-4">
                        <Input
                            type="text"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full"
                        />
                        <div className="flex items-center space-x-2">
                            <Switch id="room-toggle" checked={isJoining} onCheckedChange={setIsJoining} />
                            <Label htmlFor="room-toggle">{isJoining ? "Join Room" : "Create Room"}</Label>
                        </div>
                        {isJoining ? (
                            <Input
                                type="text"
                                placeholder="Enter room code"
                                value={roomCode}
                                onChange={(e) => setRoomCode(e.target.value)}
                                className="w-full"
                            />
                        ) : (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="max-users">Max Users: {maxUsers}</Label>
                                    <Slider
                                        id="max-users"
                                        min={2}
                                        max={25}
                                        step={1}
                                        value={[maxUsers]}
                                        onValueChange={(value) => setMaxUsers(value[0])}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="thief-amount">Thief Amount: {thiefAmount}</Label>
                                    <Slider
                                        id="thief-amount"
                                        min={1}
                                        max={Math.max(1, Math.floor(maxUsers / 6))}
                                        step={1}
                                        value={[thiefAmount]}
                                        onValueChange={(value) => setThiefAmount(value[0])}
                                    />
                                </div>
                            </>
                        )}
                        <Button
                            className={`w-full text-white ${isJoining ? "bg-blue-500 hover:bg-blue-600" : "bg-green-500 hover:bg-green-600"}`}
                            onClick={handleSubmit}
                        >
                            {isJoining ? "Join Room" : "Create Room"}
                        </Button>
                    </div>
                </div>
            </main>

            <footer className="mt-8 text-primary-foreground/80 text-sm">© Ashkar All rights reserved.</footer>
        </div>
    )
}