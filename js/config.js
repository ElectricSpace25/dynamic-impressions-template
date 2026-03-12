export const config = {

    // Video stimuli filepath
    VIDEO_PATH: "assets/video/stimuli",

    // When enabled, assumes video lists contain alternate versions of the same videos
    // See README for more information
    ALTERNATE_VIDEOS: true,

    // When enabled, logs debug messages to console
    DEBUG_LOGS: false,

    // When enabled, skips instructions and demographics
    DEBUG_QUICK: false,

    // When enabled, saves data locally
    DEBUG_SAVE: false
};

export const videoLists = [
    {
        condition: "control", // The condition name saved in data (not used if only 1 list)
        selectionNum: 1, // How many videos to select from this list
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
    // {
    //     condition: "early",
    //     selectionNum: 5,
    //     videos: [
    //         "P3_split_early.mp4",
    //         "P7_split_early.mp4",
    //         "P8_split_early.mp4",
    //         "P9_split_early.mp4",
    //         "P10_split_early.mp4",
    //         "P12_split_early.mp4",
    //         "P13_split_early.mp4",
    //         "P14_split_early.mp4",
    //         "P16_split_early.mp4",
    //         "P18_split_early.mp4",
    //     ]
    // },
];