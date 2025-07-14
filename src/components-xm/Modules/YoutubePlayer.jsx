import { useEffect, useRef } from "react";

const YouTubePlayer = ({ videoId, playerId = "player", playerRefresh, saveUserEnrollmentData }) => {
    const playerRef = useRef(null);
    const intervalRef = useRef(null);
    const watchedRef = useRef(false);

    // Initialize the YouTube Player
    useEffect(() => {
        if(videoId) {
            const initializePlayer = () => {
                if (!playerRef.current) {
                    playerRef.current = new window.YT.Player(playerId, {
                        videoId,
                        events: {
                            onReady: onPlayerReady,
                            onStateChange: onPlayerStateChange,
                        },
                        playerVars: {
                            enablejsapi: 1,
                            modestbranding: 1,
                            rel: 0,
                            showinfo: 0,
                        },
                    });
                }
            };

            if (!window.YT) {
                const tag = document.createElement("script");
                tag.src = "https://www.youtube.com/iframe_api";
                document.body.appendChild(tag);
                window.onYouTubeIframeAPIReady = initializePlayer;
            } else if (window.YT && window.YT.Player) {
                initializePlayer();
            }

            return () => {
                clearInterval(intervalRef.current);
                if (playerRef.current?.destroy) {
                    playerRef.current.destroy();
                    playerRef.current = null;
                }
            };
        }else{
            console.log("YouTubePlayer :: VideoId is invalid");
        }
    }, [playerId]);

    // Load new video if videoId changes
    useEffect(() => {
        if (playerRef.current?.loadVideoById) {
            playerRef.current.loadVideoById(videoId);
        }
        watchedRef.current = false;
    }, [videoId]);

    const onPlayerReady = () => {
        // Optional: handle player ready state
    };

    const onPlayerStateChange = (event) => {
        if (event.data === window.YT.PlayerState.PLAYING) {
            clearInterval(intervalRef.current);
            intervalRef.current = setInterval(() => {
                const duration = playerRef.current.getDuration();
                const currentTime = playerRef.current.getCurrentTime();
                const percentage = (currentTime / duration) * 100;

                if (percentage >= 90 && !watchedRef.current) {
                    watchedRef.current = true;
                    console.log(`🎯 Video (${videoId}) hit 90% watched`);
                    saveUserEnrollmentData();
                    clearInterval(intervalRef.current);
                }
            }, 1000);
        }

        if (
            event.data === window.YT.PlayerState.PAUSED ||
            event.data === window.YT.PlayerState.ENDED
        ) {
            clearInterval(intervalRef.current);
        }
    };

    return (
        <div
            id={playerId}
            className="w-full h-full shadow-md aspect-video"
        />
    );
};

export default YouTubePlayer;
