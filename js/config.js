export const config = {

    // Video stimuli filepath
    VIDEO_PATH: "assets/videos/stimuli",

    // When enabled, shuffles order of all videos
    // Note: this overrides ALL other shuffle parameters
    SHUFFLE_ALL: true,

    // When enabled, shuffles the order of the video lists
    SHUFFLE_LIST_ORDER: false,

    // When enabled, ensures that if a participant sees a video from List A, they won't see the corresponding version at the same index in List B (or any other list)
    // See README for more information
    EXCLUSIVE_INDEX_MODE: false,

    // When enabled, logs debug messages to console
    DEBUG_LOGS: false,

    // When enabled, saves data locally
    DEBUG_SAVE: false
};

export const videoLists = [
    {
        condition: "control", // The condition name saved in data
        selectionNum: 3, // How many videos to select from this list
        shuffle: false, // Whether to shuffle the order of the videos or not (overriden by SHUFFLE_ALL)
        videos: [
            "video1.mp4",
            "video2.mp4",
            "video3.mp4"
        ]
    }
];