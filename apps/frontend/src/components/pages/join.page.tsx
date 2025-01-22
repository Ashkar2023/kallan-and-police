import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const JoinPage = ()=> {
    const [roomCode, setRoomCode] = useState("");
    const [showJoinInput, setShowJoinInput] = useState(false);

    const handleCreateRoom = () => {
        // TODO: Implement room creation logic
        console.log("Creating a new room...");
    };

    const handleJoinRoom = () => {
        if (showJoinInput) {
            // TODO: Implement room joining logic
            console.log(`Joining room with code: ${roomCode}`);
        } else {
            setShowJoinInput(true);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-800 to-slate-300 to-70% flex flex-col items-center justify-center p-4">
            <header className="mb-8 text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-2">
                    Kallan And Police
                </h1>
               
            </header>

            <main className="w-full max-w-md">
                <div className="bg-card rounded-lg shadow-xl overflow-hidden">
                    <div className="relative h-48 overflow-hidden">
                        <img src="https://c8.alamy.com/comp/E6N0EM/3d-white-people-police-arresting-a-thief-isolated-white-background-E6N0EM.jpg" alt="" />
                    </div>
                    <div className="p-6 space-y-4">
                        <p className="text-card-foreground">
                            Ready to dive into the action? Join an existing room or create
                            your own to start playing!
                        </p>
                        <div className="space-y-4">
                            <Button
                                className="w-full bg-green-500 hover:bg-green-600 text-white"
                                onClick={handleCreateRoom}
                            >
                                Create Room
                            </Button>
                            {showJoinInput ? (
                                <div className="flex space-x-2">
                                    <Input
                                        type="text"
                                        placeholder="Enter room code"
                                        value={roomCode}
                                        onChange={(e) => setRoomCode(e.target.value)}
                                        className="flex-grow"
                                    />
                                    <Button
                                        className="bg-blue-500 hover:bg-blue-600 text-white"
                                        onClick={handleJoinRoom}
                                    >
                                        Join
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                                    onClick={handleJoinRoom}
                                >
                                    Join Room
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <footer className="mt-8 text-primary-foreground/80 text-sm">
                © Ashkar.dev All rights reserved.
            </footer>
        </div>
    );
}
