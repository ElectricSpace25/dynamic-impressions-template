import { jsPsych } from './init.js';
import { config, videoLists } from './config.js';

// Function to build filepaths for videos and create stimuli video list
export function setupMedia() {

    let videoIndices = new Set();
    let videoTimelineVariables = [];

    for(let i = 0; i < videoLists.length; i++) {
        // Get list
        const originalList = videoLists[i].videos;
        let shuffledList = jsPsych.randomization.shuffle(originalList);
        const selectionNum = videoLists[i].selectionNum;
        const conditionName = videoLists[i].condition;

        if (config.ALTERNATE_VIDEOS && videoIndices.size > 0) {
            shuffledList = shuffledList.filter(video => {
                const index = originalList.indexOf(video);
                return !videoIndices.has(index);
            })
        }

        // Select from list
        if (config.DEBUG_LOGS) console.log(`Choosing ${selectionNum} ${conditionName} videos`)
        const chosenVideos = shuffledList.slice(0, selectionNum);

        // Add indices to set
        chosenVideos.forEach(video => {
            const index = originalList.indexOf(video);
            videoIndices.add(index);
        });

        // Timeline variables
        const timelineVariables = chosenVideos.map(video => ({
            video_path: `${config.VIDEO_PATH}/${video}`,
            video_id: originalList.indexOf(video),
            condition: conditionName
        }));

        videoTimelineVariables.push(...timelineVariables);
    }

    videoTimelineVariables = jsPsych.randomization.shuffle(videoTimelineVariables)

    return videoTimelineVariables;
}

// Helper function to convert disruption time code to seconds
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