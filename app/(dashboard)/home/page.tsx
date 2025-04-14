"use client";
import Link from "next/link";
import { useCallback, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, UploadCloud, HelpCircle, FolderPlus, Search, Import, X, } from "lucide-react";
import { GrSchedule } from "react-icons/gr";
import HomeHeader from "@/components/HomeHeader";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const [videosOpen, setVideosOpen] = useState(false);
  const [folderOpen, setFolderOpen] = useState(false);
  const [popUpOpen, setPopUpOpen] = useState(false);
  const [importVideo, setImportVideo] = useState(false);
  const [youtubeLink, setYoutubeLink] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [clipsList, setClipsList] = useState<string[]>([]);
  const [subtitlesList, setSubtitlesList] = useState<string[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploadedVideo, setUploadedVideo] = useState<{
    file: File | null;
    url: string;
    status: "processing" | "completed" | "failed" | null;
    name?: string;
    size?: number;
  }>({ file: null, url: "", status: null });
  const router = useRouter();

  const clearStorage = () => {
    localStorage.removeItem('clipsList');
    localStorage.removeItem('subtitlesList');
    localStorage.removeItem('uploadedVideo');
    setClipsList([]);
    setSubtitlesList([]);
    setUploadedVideo({ file: null, url: "", status: null });
  };

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedClips = localStorage.getItem('clipsList');
    const savedSubtitles = localStorage.getItem('subtitlesList');
    const savedVideo = localStorage.getItem('uploadedVideo');
    
    if (savedClips) {
      setClipsList(JSON.parse(savedClips));
    }
    if (savedSubtitles) {
      setSubtitlesList(JSON.parse(savedSubtitles));
    }
    if (savedVideo) {
      const videoData = JSON.parse(savedVideo);
      setUploadedVideo({
        file: null,
        url: videoData.url,
        status: videoData.status,
        name: videoData.name,
        size: videoData.size
      });
      setVideosOpen(true);
    }
  }, []);

  // Save to localStorage whenever clips or subtitles change
  useEffect(() => {
    if (clipsList.length > 0) {
      localStorage.setItem('clipsList', JSON.stringify(clipsList));
    }
    if (subtitlesList.length > 0) {
      localStorage.setItem('subtitlesList', JSON.stringify(subtitlesList));
    }
  }, [clipsList, subtitlesList]);

  useEffect(() => {
    if (uploadedVideo.url) {
      const videoData = {
        url: uploadedVideo.url,
        status: uploadedVideo.status,
        name: uploadedVideo.file?.name,
        size: uploadedVideo.file?.size
      };
      localStorage.setItem('uploadedVideo', JSON.stringify(videoData));
    }
  }, [uploadedVideo]);

  // Handle YouTube link import
  const handleImportYoutube = () => {
    if (youtubeLink.trim() !== "") {
      router.push(`/edit?video=${encodeURIComponent(youtubeLink)}`);
    }
  };

  // Upload video to backend API
  const uploadVideo = async (file: File) => {
    setIsUploading(true);
    
    const preview = URL.createObjectURL(file);
    
    setImportVideo(false);
    setUploadedVideo({ 
      file, 
      url: preview, 
      status: "processing",
      name: file.name,
      size: file.size
    });
    setVideosOpen(true);
    
    const formData = new FormData();
    formData.append("video", file);
    formData.append("num_clips", "3");
    
    try {
      const response = await fetch("http://localhost:8000/api/v1/process-video", {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();
      console.log("API Response:", data);

      if (data.status === "completed" && Array.isArray(data.clips)) {
        setUploadedVideo(prev => ({ ...prev, status: "completed" }));
        setClipsList(data.clips);
        if (Array.isArray(data.subtitles)) {
          console.log("Setting subtitles list:", data.subtitles);
          setSubtitlesList(data.subtitles);
        } else {
          console.log("No subtitles array in response");
        }
      } else {
        setUploadedVideo(prev => ({ ...prev, status: "failed" }));
      }
    } catch (error) {
      console.error("Error:", error);
      setUploadedVideo(prev => ({ ...prev, status: "failed" }));
    } finally {
      setIsUploading(false);
    }
  };

  // Handle File Drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      uploadVideo(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "video/*": [] },
    multiple: false,
  });

  const createBtns = [
    {
      image: <img src="/short_to_short.webp" alt="Short to Short" className="w-40 mx-auto" />,
      altText: "Short to Short",
      label: "Subtitle and edit my Short",
    },
    {
      image: <img src="/video_to_short.webp" alt="Short to Short" className="w-40 mx-auto" />,
      altText: "Video to Short",
      label: "Long videos to Short",
    },
    {
      image: <img src="/faceless.webp" alt="Short to Short" className="h-32 -mt-1 mx-auto rounded-md" />,
      altText: "Faceless Short",
      label: "Create Faceless video",
    },
  ];

  return (
    <div className="">
      <HomeHeader pageName={"Home"}/>

      <main className="p-10 w-full bg-bgWhite">
        <div className="">
          <div className="bg-yellow px-14 py-7 text-center rounded-3xl">
            <h6 className="text-4xl font-semibold">What do you want to create today?</h6>
            <p className="text-black font-semibold pt-3 pb-12 mt-2">Import/upload a long-form video and let AI take care of the rest. Or upload an existing Short for AI editing!</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mx-auto gap-1 -mt-10 px-0 sm:px-7">
            {createBtns.map((btn, index) => (
              <div key={index} className="relative text-center overflow-hidden" >
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="relative px-10 py-1 bg-bgWhite rounded-lg shadow-lg shadow-gray-700/10 border text-center cursor-pointer overflow-hidden h-36 w-64"
              >
                <motion.p
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute top-0 left-0 right-0 bottom-0 bg-yellow bg-opacity-85 flex items-center justify-center text-gray-900 font-semibold text-lg"
                >
                  Start
                </motion.p>
              {btn.image}
              </motion.button>

              <p className="mt-4">{btn.label}</p>
            </div>
            ))}
          </div>
        </div>

        <hr className="my-6 border-gray-300" />

        <div className="">
          <div className="flex items-center justify-between mt-4">
            <div>
              <h6 className="text-lg font-medium">My Shorts</h6>
              <p className="text-sm mt-1">These are shorts created from your imported videos (section below).</p>
            </div>

            <div className="flex gap-3">
              <div className="relative">
                <Search size={18} className="absolute top-2 text-gray-500 left-2" />
                <input type="text" placeholder="Search" className="w-full p-1 pl-8 border rounded-md" />
              </div>
              <Link href="/home/schedule" className="flex gap-2 items-center border px-3 py-1 rounded-md"><GrSchedule /> Schedule</Link>
              <button 
                onClick={clearStorage}
                className="flex gap-2 items-center border px-3 py-1 rounded-md text-red-500 hover:bg-red-50"
              >
                Clear All
              </button>
            </div>

          </div>

          {clipsList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
              {clipsList.map((clipFilename, index) => {
                const videoUrl = `http://localhost:8000/api/v1/videos/${encodeURIComponent(clipFilename)}`;
                const subtitleUrl = subtitlesList[index] ? 
                  `http://localhost:8000/api/v1/subtitles/${encodeURIComponent(subtitlesList[index])}` : 
                  null;
                return (
                <div key={index} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative aspect-[9/16] bg-black">
                    <video 
                      className="w-full h-full object-cover"
                      controls
                      src={videoUrl}
                      onError={(e) => {
                        console.error("Video loading error for:", clipFilename, e);
                      }}
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm">Short Clip {index + 1}</h3>
                    <p className="text-xs text-gray-500 mt-1 truncate">{clipFilename}</p>
                    <div className="flex justify-between items-center mt-2">
                      <a 
                        href={videoUrl}
                        download={clipFilename}
                        className="text-blue-500 hover:text-blue-600 text-xs font-medium"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download
                      </a>
                      <button 
                        onClick={() => {
                          // Get the video filename without the "final_" prefix
                          const originalVideoName = clipFilename.replace('final_', '');
                          // Get the corresponding subtitle filename
                          const subtitleFile = subtitlesList[index];
                          console.log("Subtitle file in home:", subtitleFile);
                          
                          // Construct the URLs
                          const videoUrl = `http://localhost:8000/api/v1/videos/${encodeURIComponent(clipFilename)}`;
                          const srtUrl = subtitleFile ? 
                            `http://localhost:8000/api/v1/subtitles/${encodeURIComponent(subtitleFile)}` : '';
                          
                          console.log("Constructed srtUrl:", srtUrl);
                          
                          // Navigate to edit page with both video and subtitle parameters
                          const editUrl = `/edit?videoUrl=${encodeURIComponent(videoUrl)}&videoName=${encodeURIComponent(originalVideoName)}`;
                          const finalUrl = srtUrl ? `${editUrl}&srtUrl=${encodeURIComponent(srtUrl)}` : editUrl;
                          console.log("Final navigation URL:", finalUrl);
                          
                          router.push(finalUrl);
                        }}
                        className="text-blue-500 hover:text-blue-600 text-xs font-medium"
                      >
                        Edit
                      </button>
                      <button className="text-green-500 hover:text-green-600 text-xs font-medium">
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              )})}
            </div>
          ) : (
            <button 
              onClick={() => setImportVideo(true)}
              className="w-full h-72 mt-6 p-6 flex flex-col gap-3 items-center justify-center border-2 border-dashed border-gray-300 bg-slate50 hover:bg-slateHover50 rounded-xl text-gray-400 cursor-pointer"
            >
              <UploadCloud size={24} className="font-semibold" /> No Shorts found, click here to import a Short
            </button>
          )}
        </div>

        <hr className="my-6 border-gray-300" />

        <div className="">
          <div className="flex items-center justify-between mt-4">
            <div className="flex gap-3 items-center">
              <div className="bg-slate50 hover:bg-slateHover50 p-1 rounded-full">
                <ChevronDown size={20} className={`${videosOpen ? "rotate-180" : "rotate-0"} transition-transform`} onClick={() => setVideosOpen(prev => !prev)} />
              </div>
              <div>
                <h6 className="text-lg font-medium">Imported Videos</h6>
                <p className="text-sm mt-1">Out of your imported videos, you can create shorts</p>
              </div>

            </div>

            <button onClick={() => setImportVideo(true)} className="flex gap-2 items-center border px-3 py-1 rounded-md"><Import size={19} /> Import Videos</button>


          </div>

          {videosOpen && (
            <>
              {uploadedVideo.url ? (
                <div className="mt-6 border rounded-lg overflow-hidden">
                  <div className="flex items-center p-4 gap-4">
                    <div className="w-48 h-32 bg-black rounded-lg overflow-hidden">
                      <video 
                        src={uploadedVideo.url}
                        className="w-full h-full object-cover"
                        controls
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{uploadedVideo.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {uploadedVideo.size ? (uploadedVideo.size / (1024 * 1024)).toFixed(2) : 0} MB
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        {uploadedVideo.status === "processing" && (
                          <>
                            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-blue-500">Processing...</span>
                          </>
                        )}
                        {uploadedVideo.status === "completed" && (
                          <span className="text-green-500">Processing complete</span>
                        )}
                        {uploadedVideo.status === "failed" && (
                          <span className="text-red-500">Processing failed</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setImportVideo(true)} 
                  className="w-full h-72 mt-6 p-6 flex flex-col gap-3 items-center justify-center border-2 border-dashed border-gray-300 bg-slate50 hover:bg-slateHover50 rounded-xl text-gray-400 cursor-pointer"
                >
                  <UploadCloud size={24} className="font-semibold" /> No videos found, click here to import a video
                </button>
              )}
            </>
          )}
        </div>

        <hr className="my-6 border-gray-300" />

        <div className="">
          <div className="flex items-center justify-between mt-4">
            <div className="flex gap-3 items-center">
              <div className="bg-slate50 hover:bg-slateHover50 p-1 rounded-full">
                <ChevronDown size={20} className={`${folderOpen ? "rotate-180" : "rotate-0"} transition-transform`} onClick={() => setFolderOpen(prev => !prev)} />
              </div>
              <h6 className="text-lg font-medium">Folders</h6>
            </div>

            <button className="flex gap-2 items-center border px-3 py-1 rounded-md"
              onClick={() => setPopUpOpen(prev => !prev)}
            ><FolderPlus size={18} /> New Folder</button>


          </div>

          {folderOpen && (
            <button className="w-full h-72 mt-6 p-6 flex flex-col gap-3 items-center justify-center border-2 border-dashed border-gray-300 bg-slate50 hover:bg-slateHover50 rounded-xl text-gray-400 cursor-pointer">
              <FolderPlus className="font-semibold" />Click here to create your first folder
            </button>
          )}
        </div>
      </main>

      {/* Import Video Modal */}
      {importVideo && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white shadow-md rounded-lg p-6 w-[400px]">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Import Video</h3>
              <button onClick={() => setImportVideo(false)} disabled={isUploading}>
                <X size={20} className="text-gray-500 hover:text-gray-800" />
              </button>
            </div>

            {isUploading ? (
              <div className="mt-4">
                {previewUrl && (
                  <div className="relative w-full aspect-[9/16] mb-4 bg-black rounded-lg overflow-hidden">
                    <video 
                      src={previewUrl}
                      className="w-full h-full object-contain"
                      controls={false}
                      autoPlay
                      muted
                      loop
                    />
                  </div>
                )}
                <div className="text-center">
                  <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-gray-700 font-medium">{uploadStatus}</p>
                </div>
              </div>
            ) : (
              <>
                {/* YouTube Import Section */}
                <div className="mt-4">
                  <label className="text-gray-600 font-medium">Paste YouTube Link</label>
                  <input
                    type="text"
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full border p-2 mt-2 rounded-md"
                    value={youtubeLink}
                    onChange={(e) => setYoutubeLink(e.target.value)}
                  />
                  <button
                    onClick={handleImportYoutube}
                    className="w-full bg-blue-500 text-white mt-2 py-2 rounded-md hover:bg-blue-600 transition"
                  >
                    Import from YouTube
                  </button>
                </div>

                {/* OR Divider */}
                <div className="flex items-center my-4">
                  <hr className="flex-grow border-gray-300" />
                  <span className="mx-2 text-gray-500">OR</span>
                  <hr className="flex-grow border-gray-300" />
                </div>

                {/* Drag & Drop Upload Section */}
                <div
                  {...getRootProps()}
                  className="border-2 border-dashed border-gray-400 p-6 rounded-md text-center cursor-pointer hover:bg-gray-100 transition"
                >
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p className="text-gray-700">Drop the file here...</p>
                  ) : (
                    <div>
                      <UploadCloud size={40} className="mx-auto text-gray-500" />
                      <p className="text-gray-700">Drag & Drop a video file</p>
                      <p className="text-gray-500">or click to select a file</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}


      {/* pop up */}
      {popUpOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-slate-50 shadow-md rounded-lg p-4">
            <div className="mb-2">
              <p className="text-base text-slate-600 mb-2">create new folder</p>
              <input type="text" placeholder="Folder Name" className="px-2 py-1 border"/>
            </div>
            <div className="flex justify-between">
              <button>Create Folder</button>
              <button className="bg-red-400 text-white px-3 py-1 rounded" onClick={() => setPopUpOpen(prev => !prev)} >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
