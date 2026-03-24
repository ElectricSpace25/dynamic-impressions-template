export const config = {

    // Video stimuli filepath
    VIDEO_PATH: "assets/video/stimuli",

    // When enabled, shuffles order of all videos
    // Note: this overrides ALL other shuffle parameters
    SHUFFLE_ALL: true,

    // When enabled, shuffles the order of the video lists
    SHUFFLE_LIST_ORDER: false,

    // When enabled, ensures that if a participant sees a video from List A, they won't see the corresponding version at the same index in List B (or any other list)
    // See README for more information
    EXCLUSIVE_INDEX_MODE: true,

    // When enabled, logs debug messages to console
    DEBUG_LOGS: false,

    // When enabled, skips instructions and demographics
    DEBUG_QUICK: false,

    // When enabled, saves data locally
    DEBUG_SAVE: false
};

export const videoLists = [
    // {
    //     condition: "test",
    //     selectionNum: 1,
    //     shuffle: false,
    //     videos: [
    //         "Placeholder10.mp4",
    //         "Placeholder15.mp4"
    //     ]
    // },
    {
        condition: "control", // The condition name saved in data
        selectionNum: 5, // How many videos to select from this list
        shuffle: false, // Whether to shuffle the order of the videos or not
        videos: [
            "P3.mp4",
            "P7.mp4",
            "P8.mp4",
            "P9.mp4",
            "P10.mp4",
            "P12.mp4",
            "P13.mp4",
            "P14.mp4",
            "P16.mp4",
            "P18.mp4"
        ]
    },
    {
        condition: "early",
        selectionNum: 5,
        shuffle: false,
        videos: [
            "P3_split_early.mp4",
            "P7_split_early.mp4",
            "P8_split_early.mp4",
            "P9_split_early.mp4",
            "P10_split_early.mp4",
            "P12_split_early.mp4",
            "P13_split_early.mp4",
            "P14_split_early.mp4",
            "P16_split_early.mp4",
            "P18_split_early.mp4",
        ]
    },
];