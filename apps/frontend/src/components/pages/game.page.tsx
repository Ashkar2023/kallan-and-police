import { useEffect, useState } from "react";

type Participant = {
    id: string;
    name: string;
    avatar: string;
};

export const GamePage = () => {
    const [participants, setParticipants] = useState<Participant[]>([]);

    useEffect(() => {
        const fetchParticipants = async () => {
            try {
                const res = await fetch("https://randomuser.me/api/?results=8");
                const data = await res.json();
                const formatted = data.results.map((user: any) => ({
                    id: user.login.uuid,
                    name: `${user.name.first} ${user.name.last}`,
                    avatar: user.picture.thumbnail,
                }));
                setParticipants(formatted);
            } catch (err) {
                console.error("Failed to fetch participants", err);
            }
        };

        fetchParticipants();
    }, []);

    return (
        <div className="w-full h-dvh p-6 bg-background overflow-auto content-center">
            <div className="flex flex-wrap justify-center items-center gap-4 h-max">
                {participants.map((user) => (
                    <div
                        key={user.id}
                        className="flex-grow min-w-[70px] max-w-[120px] aspect-square bg-white rounded-xl shadow-md flex flex-col items-center justify-center text-muted-foreground transition-all duration-300"
                    >
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-12 h-12 rounded-full mb-2 shadow"
                        />
                        <span className="text-sm font-medium">{user.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}