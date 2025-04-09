import React, { useState, useRef } from "react";
import {Trash2} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";

const AudioRecorder = () => {

    const [audioList, setAudioList] = useState([]);
    const mediaRecorderRef = useRef(null);
    const audioChunks = useRef([]);
    const streamRef = useRef(null);

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunks.current = [];

        mediaRecorderRef.current.ondataavailable = event => {
            audioChunks.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
            const newAudioUrl = URL.createObjectURL(audioBlob);

            // Push new audio to the list
            setAudioList(prevList => [...prevList, newAudioUrl]);

            // Close mic
            streamRef.current.getTracks().forEach(track => track.stop());
        };

        mediaRecorderRef.current.start();
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop();
        }
    };


    const handleDelete = (indexToRemove) => {
        setAudioList(prevList => prevList.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div className="">
            <div className=" justify-items-center items-center flex gap-3">
                <Button onClick={startRecording}  >Start Audio</Button>
                <Button onClick={stopRecording} variant="destructive" >Stop</Button>

            </div>
            {audioList.length != 0 ? <div className="mt-6">
                <h2 className="text-lg font-semibold mb-2">Your Recordings:</h2>

                {audioList.map((url, index) => (

                    <div key={index} className="flex items-center gap-4 my-4 w-full">
                        <p className="text-sm text-gray-600 w-24 shrink-0">Recording {index + 1}</p>

                        <div className="flex-grow min-w-0">
                            <audio controls src={url} className="w-full"/>
                        </div>

                        <Button variant="destructive" onClick={() => handleDelete(index)}>
                            <Trash2 className="w-4 h-4"/>
                        </Button>
                    </div>
                ))}

            </div>: <></>}
        </div>
    );
};

export default AudioRecorder;
