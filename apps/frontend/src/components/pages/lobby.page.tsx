"use client"

import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSocket } from "@/context/socket.context"
import { socketEvents } from "common"

export const Lobby = () => {
    const { state } = useLocation()
    const [players, setPlayers] = useState<string[]>([])
    const { socket } = useSocket()

    useEffect(() => {
        if (socket) {
            socket.on(socketEvents.player_joined, (username: string) => {
                setPlayers((prev) => [...prev, username])
            })

            // socket.on(socketEvents.player_left, (username: string) => {
            //     setPlayers((prev) => prev.filter((player) => player !== username))
            // })

            // socket.on(socketEvents.players_list, (playersList: string[]) => {
            //     setPlayers(playersList)
            // })
        }

        return () => {
            if (socket) {
                socket.off(socketEvents.player_joined)
            }
        }
    }, [socket, state.roomId])

    const handleStartGame = () => {
        socket?.emit(socketEvents.start_game, state.roomId)
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-800 to-slate-300 to-70% flex flex-col items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Lobby</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="text-center">
                        <p className="text-lg font-semibold rounded bg-blue-300">{state.username}</p>
                        <p className="text-xl bg-primary/10 rounded-md p-2 font-mono bg-slate-200">
                            Room ID :&nbsp;
                            {
                                (state.roomId as string).match(/.{4}/g)?.join("-") || null
                            }
                        </p>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Players:</h3>
                    <div className="overflow-y-scroll max-h-56">
                        <ul className="space-y-2 text-center my-3">
                            {players.map((player, index) => (
                                <li key={index} className="bg-black/20 rounded-md p-2">
                                    {player}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <Button
                        className="w-full bg-green-500 hover:bg-green-600 text-white"
                        onClick={(e)=>handleStartGame()}
                    >
                        Start Game
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}