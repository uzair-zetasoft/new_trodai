'use client';

import { Eye, ZoomIn, Scissors, Sliders, Shuffle } from 'lucide-react';
import { RefObject } from 'react';

interface VideoPreviewProps {
    videoSrc: string;
    isYoutube: boolean;
    videoRef: RefObject<HTMLVideoElement>;
  }

export default function VideoPreview({ videoSrc, isYoutube, videoRef }: VideoPreviewProps) {
    return (
        <div className=" ">
            {/* Video Preview */}
            <div className="flex-1 flex flex-col items-center justify-center p-4">
                <div className="relative w-[235px] h-[25rem] bg-black rounded-2xl overflow-hidden flex items-center justify-center">
                    {/* Placeholder for video */}
                    <div className="absolute inset-0 flex items-center justify-center text-white text-2xl">
                        {videoSrc ? (
                            <div className="flex flex-col items-center w-full h-full">
                                {/* Render YouTube Video or Local Video */}
                                {isYoutube ? (
                                    <iframe
                                        className="w-full h-full object-cover"
                                        src={`https://www.youtube.com/embed/${videoSrc.split("v=")[1]}`}
                                        frameBorder="0"
                                        allowFullScreen
                                    />
                                ) : (
                                    <video 
                                        ref={videoRef} 
                                        className="w-full h-full object-cover"
                                        playsInline
                                    >
                                        <source src={videoSrc} type="video/mp4"/>
                                        Your browser does not support the video tag.
                                    </video>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-500">No video selected. Please upload a video.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Editing Options */}
            {/* <div className="absolute right-4 top-1/4 space-y-1 bg-white p-1 border rounded-lg shadow-lg">
                <button className="w-[50px] flex flex-col items-center rounded-lg hover:bg-slate-100 p-1">
                    <Eye size={20} />
                    <span className="text-[10px]">Show overlay</span>
                </button>
                <button className="w-[50px] flex flex-col items-center rounded-lg hover:bg-slate-100 p-1">
                    <ZoomIn size={20} />
                    <span className="text-[10px]">Zoom</span>
                </button>
                <button className="w-[50px] flex flex-col items-center rounded-lg hover:bg-slate-100 p-1">
                    <Scissors size={20} />
                    <span className="text-[10px]">Cut silent parts</span>
                </button>
                <button className="w-[50px] flex flex-col items-center rounded-lg hover:bg-slate-100 p-1">
                    <Sliders size={20} />
                    <span className="text-[10px]">Playback speed</span>
                </button>
                <button className="w-[50px] flex flex-col items-center rounded-lg hover:bg-slate-100 p-1">
                    <Shuffle size={20} />
                    <span className="text-[10px]">Transitions</span>
                </button>
            </div> */}
        </div>
    );
}
