
export function GameActions() {
    const [roomCode, setRoomCode] = useState("")
    const [showJoinInput, setShowJoinInput] = useState(false)

    const handleCreateRoom = () => {
        // TODO: Implement room creation logic
        console.log("Creating a new room...")
    }

    const handleJoinRoom = () => {
        if (showJoinInput) {
            // TODO: Implement room joining logic
            console.log(`Joining room with code: ${roomCode}`)
        } else {
            setShowJoinInput(true)
        }
    }

    return (
        <div className="space-y-4">
            <Button className="w-full bg-green-500 hover:bg-green-600 text-white" onClick={handleCreateRoom}>
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
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={handleJoinRoom}>
                        Join
                    </Button>
                </div>
            ) : (
                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white" onClick={handleJoinRoom}>
                    Join Room
                </Button>
            )}
        </div>
    )
}

