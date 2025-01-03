import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Result() {
    const location = useLocation();
    const navigate = useNavigate();
    const { groups, elapsedTime, actionsLog } = location.state || {};
    const sessionData = JSON.parse(localStorage.getItem("session"));
    const sessionId = sessionData ? sessionData.id : null;

    const [updatedGroups, setUpdatedGroups] = useState(groups);
    const [feedback, setFeedback] = useState("");
    const [errors, setErrors] = useState([]);

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return minutes > 0
            ? `${minutes} minute${
                  minutes > 1 ? "s" : ""
              } et ${seconds} seconde${seconds > 1 ? "s" : ""}`
            : `${seconds} seconde${seconds > 1 ? "s" : ""}`;
    };

    const handleGroupChange = (index, key, value) => {
        setUpdatedGroups((prevGroups) => {
            const newGroups = prevGroups.map((group, i) =>
                i === index ? { ...group, [key]: value } : group
            );
            return newGroups.filter((group) => group.elements.length > 0);
        });
    };

    const findNextGroupNumber = (groups) => {
        const existingNumbers = groups
            .map((g) => parseInt(g.name.match(/\d+/)?.[0] || "0"))
            .sort((a, b) => a - b);

        for (let i = 1; i <= existingNumbers.length + 1; i++) {
            if (!existingNumbers.includes(i)) {
                return i;
            }
        }
        return existingNumbers.length + 1;
    };

    const addNewGroup = () => {
        const nextNumber = findNextGroupNumber(updatedGroups);
        setUpdatedGroups([
            ...updatedGroups,
            {
                name: `C ${nextNumber}`,
                color: "#" + Math.floor(Math.random() * 16777215).toString(16),
                elements: [],
            },
        ]);
    };

    const handleSendData = async () => {
        const dataToSend = {
            group_data: updatedGroups,
            actions_log: actionsLog,
            duration: elapsedTime,
            feedback: feedback,
            errors_log: errors,
        };

        try {
            const response = await fetch(`/api/experiment/save/${sessionId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSend),
            });

            if (response.ok) {
                localStorage.removeItem("isRegistered");
                localStorage.removeItem("participantEmail");
                localStorage.removeItem("participantName");
                localStorage.removeItem("session");
                navigate("/");
            }
        } catch (error) {
            console.error("Error sending data:", error);
        }
    };

    if (!groups || !elapsedTime || !actionsLog) {
        return <p className="text-center text-red-500">Error: Missing data</p>;
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Experiment Summary</h2>
            <p className="text-lg mb-6">
                Total Time: {formatTime(Math.floor(elapsedTime / 1000))}
            </p>

            {updatedGroups.map((group, index) => (
                <div
                    key={index}
                    className="mb-8 border p-4 rounded-lg shadow-md"
                >
                    <label className="block text-lg font-semibold mb-2">
                        Group Name:
                        <input
                            type="text"
                            value={group.name}
                            onChange={(e) =>
                                handleGroupChange(index, "name", e.target.value)
                            }
                            className="ml-2 p-2 border rounded-md w-full"
                        />
                    </label>

                    <label className="block text-lg font-semibold mb-4">
                        Group Color:
                        <input
                            type="color"
                            value={group.color}
                            onChange={(e) =>
                                handleGroupChange(
                                    index,
                                    "color",
                                    e.target.value
                                )
                            }
                            className="ml-2 p-2"
                        />
                    </label>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">
                            Media in this group:
                        </h4>
                        <div className="flex space-x-4">
                            {group.elements.map((item) => (
                                <div key={item.id}>
                                    {item.type === "sound" ? (
                                        <div
                                            className="flex items-center justify-center w-24 h-24 border-2 border-black"
                                            style={{
                                                backgroundColor: group.color,
                                            }}
                                        >
                                            <button
                                                onClick={() =>
                                                    new Audio(item.url).play()
                                                }
                                                className="text-white font-bold"
                                            >
                                                Play Sound
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex w-24 h-24 border-2 border-black">
                                            <img src={item.url} alt="" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}

            <div className="mt-8 border p-4 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold mb-4">Your Feedback</h3>
                <div className="mb-4">
                    <label className="block text-lg font-semibold mb-2">
                        Please share your experience with this experiment:
                    </label>
                    <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="w-full p-2 border rounded-md h-32"
                        placeholder="Share your thoughts, difficulties, or suggestions..."
                    />
                </div>
            </div>

            <div className="mt-8 border p-4 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold mb-4">Technical Issues</h3>
                <div className="mb-4">
                    <label className="block text-lg font-semibold mb-2">
                        Did you encounter any technical issues?
                    </label>
                    <div className="flex gap-2 mb-2">
                        <button
                            onClick={() =>
                                setErrors([
                                    ...errors,
                                    { time: Date.now(), type: "audio" },
                                ])
                            }
                            className="bg-red-500 text-white px-4 py-2 rounded-md"
                        >
                            Report Audio Issue
                        </button>
                        <button
                            onClick={() =>
                                setErrors([
                                    ...errors,
                                    { time: Date.now(), type: "visual" },
                                ])
                            }
                            className="bg-red-500 text-white px-4 py-2 rounded-md"
                        >
                            Report Visual Issue
                        </button>
                    </div>
                    {errors.length > 0 && (
                        <div className="mt-2">
                            <h4 className="font-semibold">Reported Issues:</h4>
                            <ul className="list-disc list-inside">
                                {errors.map((error, index) => (
                                    <li key={index}>
                                        {error.type} issue at{" "}
                                        {new Date(
                                            error.time
                                        ).toLocaleTimeString()}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8">
                <button
                    onClick={handleSendData}
                    className="bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-green-600 transition duration-200"
                >
                    Envoyer
                </button>
            </div>
        </div>
    );
}

export default Result;
