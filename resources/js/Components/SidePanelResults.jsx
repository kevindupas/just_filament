import { AlertCircle, Clock, Image as ImageIcon, Music } from "lucide-react";
import React, { useEffect, useState } from "react";
import SpeechToText from "./SpeechToText";
import clsx from "clsx";

function SidePanelResults({
    isOpen,
    groups = [],
    onGroupsChange,
    elapsedTime,
    onSubmit,
    onEditModeChange,
    actionsLog = [],
    sessionId,
}) {
    const [localGroups, setLocalGroups] = useState(groups);
    const [feedback, setFeedback] = useState("");
    const [errors, setErrors] = useState([]);
    const [editingGroupIndex, setEditingGroupIndex] = useState(null);
    const [showEmptyGroups, setShowEmptyGroups] = useState(false);

    console.log(elapsedTime);

    const formatTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        let timeString = "";

        if (hours > 0) {
            timeString = `${hours} heure${hours > 1 ? "s" : ""}`;
            if (minutes > 0)
                timeString += `, ${minutes} minute${minutes > 1 ? "s" : ""}`;
            if (seconds > 0)
                timeString += `, ${seconds} seconde${seconds > 1 ? "s" : ""}`;
        } else if (minutes > 0) {
            timeString = `${minutes} minute${minutes > 1 ? "s" : ""}`;
            if (seconds > 0)
                timeString += `, ${seconds} seconde${seconds > 1 ? "s" : ""}`;
        } else {
            timeString = `${seconds} seconde${seconds > 1 ? "s" : ""}`;
        }

        return timeString;
    };

    const imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".bmp"];
    const soundExtensions = [".wav", ".mp3", ".ogg", ".m4a", ".aac"];

    const isImageUrl = (url) =>
        imageExtensions.some((ext) => url.toLowerCase().endsWith(ext));
    const isSoundUrl = (url) =>
        soundExtensions.some((ext) => url.toLowerCase().endsWith(ext));

    const defaultColors = [
        "#FF0000",
        "#00FF00",
        "#0000FF",
        "#FFFF00",
        "#FF00FF",
        "#00FFFF",
        "#FFA500",
        "#800080",
        "#008000",
        "#000080",
        "#808000",
        "#800000",
    ];

    useEffect(() => {
        // Ne filtre plus les groupes vides si on vient d'en ajouter un
        const filteredGroups = showEmptyGroups
            ? groups
            : groups.filter((group) => group.elements.length > 0);

        const updatedGroups = filteredGroups.map((group) => ({
            ...group,
            comment: group.comment || "",
        }));
        setLocalGroups(updatedGroups);
    }, [groups, showEmptyGroups]);

    const handleGroupChange = (index, field, value) => {
        const updatedGroups = localGroups.map((group, i) => {
            if (i === index) {
                return { ...group, [field]: value };
            }
            return group;
        });
        setLocalGroups(updatedGroups);

        // Reconstruit l'array complet des groupes en préservant les groupes vides
        const allGroups = groups.map((originalGroup) => {
            const updatedGroup = updatedGroups.find(
                (g) => g.elements[0]?.id === originalGroup.elements[0]?.id
            );
            return updatedGroup || originalGroup;
        });

        onGroupsChange(allGroups);
    };

    const handleAddGroup = () => {
        const usedColors = new Set(groups.map((g) => g.color));
        const availableColor =
            defaultColors.find((color) => !usedColors.has(color)) ||
            "#" + Math.floor(Math.random() * 16777215).toString(16);

        // Trouver le prochain numéro de groupe disponible
        const existingNumbers = groups
            .map((g) => parseInt(g.name.match(/\d+/)?.[0] || "0"))
            .sort((a, b) => a - b);

        let nextNumber = 1;
        for (const num of existingNumbers) {
            if (num !== nextNumber) break;
            nextNumber++;
        }

        const newGroup = {
            name: `Groupe ${nextNumber}`,
            color: availableColor,
            elements: [],
            comment: "",
        };

        setShowEmptyGroups(true);
        onGroupsChange([
            ...groups.filter(
                (g) => g.elements.length > 0 || g.name !== newGroup.name
            ),
            newGroup,
        ]);
        setEditingGroupIndex(groups.length);
        onEditModeChange(groups.length);
    };

    useEffect(() => {
        if (!showEmptyGroups) {
            setLocalGroups(groups.filter((group) => group.elements.length > 0));
        } else {
            setLocalGroups(groups);
        }
    }, [groups, showEmptyGroups]);

    const handleEditGroup = (index) => {
        if (editingGroupIndex === index) {
            setEditingGroupIndex(null);
            onEditModeChange(null);
            setShowEmptyGroups(false);
            // Nettoyer les groupes vides après l'édition
            onGroupsChange(groups.filter((g) => g.elements.length > 0));
        } else {
            setEditingGroupIndex(index);
            onEditModeChange(index);
        }
    };

    const handleSubmit = () => {
        if (onSubmit) {
            onSubmit({
                groups: localGroups,
                feedback,
                errors,
                elapsedTime,
                actionsLog,
                sessionId,
            });
        }
    };

    return (
        <div className="border-l border-gray-500 bg-slate-50 flex-shrink-0 flex flex-col h-screen">
            <div className="p-6 border-b border-gray-200 bg-white">
                <h2 className="text-xl font-bold">
                    {!isOpen ? "Session en cours" : "Résultats de la session"}
                </h2>
                {isOpen && (
                    <div className="flex flex-col items-center justify-between gap-4 text-gray-600 mt-2">
                        <div className="flex items-center gap-2">
                            <Clock size={16} />
                            <p>Durée totale: {formatTime(elapsedTime)}</p>
                        </div>
                        <button
                            onClick={handleAddGroup}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Ajouter un groupe
                        </button>
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="p-4">
                    {!isOpen ? (
                        <div className="flex flex-col items-center justify-center text-center p-6">
                            <AlertCircle className="h-20 w-20 text-gray-400 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                Session en cours
                            </h3>
                            <p className="text-gray-500">
                                Regroupez les éléments puis cliquez sur
                                "Terminer"
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {localGroups.map((group, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-lg shadow-md border overflow-hidden"
                                >
                                    <div className="p-4 border-b bg-gray-50">
                                        <div className="flex items-center gap-4 mb-4">
                                            <input
                                                type="text"
                                                value={group.name}
                                                onChange={(e) =>
                                                    handleGroupChange(
                                                        index,
                                                        "name",
                                                        e.target.value
                                                    )
                                                }
                                                className="flex-1 border rounded-lg px-3 py-2 text-lg font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Nom du groupe"
                                            />
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
                                                className="w-12 h-12 rounded-lg border-2 cursor-pointer transition-transform hover:scale-105"
                                            />
                                        </div>
                                        <SpeechToText
                                            value={group.comment}
                                            onChange={(value) =>
                                                handleGroupChange(
                                                    index,
                                                    "comment",
                                                    value
                                                )
                                            }
                                            placeholder="Commentaire sur ce groupe..."
                                            className="border rounded-lg h-20 text-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div className="px-4 py-3 bg-white border-b flex items-center justify-between">
                                        <button
                                            onClick={() =>
                                                handleEditGroup(index)
                                            }
                                            className={clsx(
                                                "px-4 py-2 rounded-lg transition-all flex items-center gap-2",
                                                editingGroupIndex === index
                                                    ? "bg-blue-500 text-white shadow-lg transform scale-105"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            )}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                className="w-5 h-5"
                                            >
                                                {editingGroupIndex === index ? (
                                                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm3.293-7.707a1 1 0 00-1.414-1.414L9 9.586 7.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l3-3z" />
                                                ) : (
                                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-2.207 2.207L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                )}
                                            </svg>
                                            {editingGroupIndex === index
                                                ? "Terminer"
                                                : "Modifier"}
                                        </button>
                                        <span className="text-sm text-gray-500">
                                            {group.elements.length} élément
                                            {group.elements.length > 1
                                                ? "s"
                                                : ""}
                                        </span>
                                    </div>

                                    <div className="p-4">
                                        <div className="grid grid-cols-3 gap-3">
                                            {group.elements.map(
                                                (item, elemIndex) => {
                                                    const isImage = isImageUrl(
                                                        item.url
                                                    );
                                                    const isSound = isSoundUrl(
                                                        item.url
                                                    );

                                                    return (
                                                        <div
                                                            key={elemIndex}
                                                            className="aspect-square rounded-lg overflow-hidden border flex items-center justify-center relative group"
                                                            style={{
                                                                backgroundColor:
                                                                    isSound
                                                                        ? group.color
                                                                        : "transparent",
                                                            }}
                                                        >
                                                            {isSound && (
                                                                <div className="absolute top-2 right-2">
                                                                    <Music className="w-4 h-4 text-white" />
                                                                </div>
                                                            )}

                                                            {isImage ? (
                                                                <div className="relative w-full h-full">
                                                                    <img
                                                                        src={
                                                                            item.url
                                                                        }
                                                                        alt=""
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-xs">
                                                                        p
                                                                        {elemIndex +
                                                                            1}
                                                                    </div>
                                                                </div>
                                                            ) : isSound ? (
                                                                <div className="flex flex-col items-center justify-center text-white">
                                                                    <span className="text-sm font-medium">
                                                                        s
                                                                        {elemIndex +
                                                                            1}
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                <div className="flex flex-col items-center justify-center text-gray-400 gap-2">
                                                                    <AlertCircle className="w-6 h-6" />
                                                                    <span className="text-xs">
                                                                        Type non
                                                                        reconnu
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="bg-white rounded-lg shadow-md border overflow-hidden">
                                <div className="px-4 py-3 bg-gray-50 border-b flex items-center gap-3">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 text-gray-600"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-8-5a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1zm0 8a1 1 0 100 2 1 1 0 000-2z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <h3 className="text-lg font-semibold">
                                        Commentaire global
                                    </h3>
                                </div>
                                <div className="p-4">
                                    <div className="relative">
                                        <SpeechToText
                                            value={feedback}
                                            onChange={setFeedback}
                                            placeholder="Décrivez votre expérience, vos observations ou toute autre remarque pertinente..."
                                            className="min-h-[8rem] w-full rounded-lg border border-gray-200 p-3 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow-md border p-4">
                                <h3 className="text-lg font-semibold mb-3">
                                    Problèmes techniques
                                </h3>
                                <div className="flex gap-3 mb-4">
                                    <button
                                        onClick={() =>
                                            setErrors([
                                                ...errors,
                                                {
                                                    time: Date.now(),
                                                    type: "audio",
                                                },
                                            ])
                                        }
                                        className="flex items-center justify-center gap-2 flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                                    >
                                        <Music className="w-4 h-4" />
                                        Problème Audio
                                    </button>
                                    <button
                                        onClick={() =>
                                            setErrors([
                                                ...errors,
                                                {
                                                    time: Date.now(),
                                                    type: "visual",
                                                },
                                            ])
                                        }
                                        className="flex items-center justify-center gap-2 flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                                    >
                                        <ImageIcon className="w-4 h-4" />
                                        Problème Visuel
                                    </button>
                                </div>

                                {errors.length > 0 && (
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="font-medium mb-2">
                                            Problèmes signalés :
                                        </h4>
                                        <ul className="space-y-1 text-sm text-gray-600">
                                            {errors.map((error, index) => (
                                                <li
                                                    key={index}
                                                    className="flex items-center gap-2"
                                                >
                                                    <span className="w-2 h-2 rounded-full bg-red-500" />
                                                    <span>
                                                        Problème {error.type}
                                                    </span>
                                                    <span className="text-gray-400">
                                                        à{" "}
                                                        {new Date(
                                                            error.time
                                                        ).toLocaleTimeString()}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {isOpen && (
                <div className="p-4 border-t border-gray-500 bg-white">
                    <button
                        onClick={handleSubmit}
                        className="w-full bg-green-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-600 transition-colors"
                    >
                        Terminer l'expérience
                    </button>
                </div>
            )}
        </div>
    );
}

export default SidePanelResults;
