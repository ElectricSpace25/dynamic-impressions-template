import { jsPsych } from './init.js';
import { config } from './config.js'

// Function to build filepaths for videos/audio and create stimuli video list
export function setupMedia() {

    // List of base video names
    const videoBaseIds = [
        "P3",
        "P7",
        "P8",
        "P9",
        "P10",
        "P12",
        "P13",
        "P14",
        "P16",
        "P18",
    ];

    // Shuffle and split list
    const ShuffledIds = jsPsych.randomization.shuffle(videoBaseIds);
    let controlVideoIds;
    let disruptedVideoIds;
    let half = Math.floor(config.num_of_videos / 2);
    controlVideoIds = ShuffledIds.slice(0, half);
    disruptedVideoIds = ShuffledIds.slice(half, config.num_of_videos);
    if (config.DEBUG_LOGS) console.log(`${controlVideoIds.length} control videos, ${disruptedVideoIds.length} disrupted videos`)

    // Create timeline variables (and build filepaths)
    const controlVideos = controlVideoIds.map(id => ({
        video: `assets/video/stimuli/${id}.mp4`,
        condition: 'control',
        video_id: id
    }));

    const disruptedVideos = disruptedVideoIds.map(id => ({
        video: `assets/video/stimuli/${id}_split_early.mp4`,
        condition: 'disrupted',
        video_id: id
    }));

    // Concatenate lists
    const videoTimelineVariables = jsPsych.randomization.shuffle(
        [...controlVideos, ...disruptedVideos]
    );

    const videoPaths = videoTimelineVariables.map(t => t.video);

    return {
        videoTimelineVariables,
        videoPaths
    };
}

// Disruption (black screen) times
export const disruptionLookup = {
    "P3_split_early.mp4": { start: "00:28:43", end: "00:38:43" },
    "P7_split_early.mp4": { start: "00:28:06", end: "00:38:06" },
    "P8_split_early.mp4": { start: "00:34:74", end: "00:44:74" },
    "P9_split_early.mp4": { start: "00:40:00", end: "00:50:00" },
    "P10_split_early.mp4": { start: "00:32:66", end: "00:42:66" },
    "P12_split_early.mp4": { start: "00:40:20", end: "00:50:20" },
    "P13_split_early.mp4": { start: "00:38:06", end: "00:48:06" },
    "P14_split_early.mp4": { start: "00:35:18", end: "00:45:18" },
    "P16_split_early.mp4": { start: "00:36:56", end: "00:46:56" },
    "P18_split_early.mp4": { start: "00:35:78", end: "00:45:78" }
};

// Helper function to convert time code to seconds
export function parseTimeCode(timeString) {
    if (!timeString) return null;
    const parts = timeString.split(/[:.]/); // Split by colon or dot
    if (parts.length < 2) return null;

    const minutes = parseInt(parts[0], 10);
    const seconds = parseInt(parts[1], 10);
    // If the 3rd part exists (centiseconds), use it. Otherwise 0.
    const centiseconds = parts[2] ? parseInt(parts[2], 10) : 0;

    return (minutes * 60) + seconds + (centiseconds / 100);
}