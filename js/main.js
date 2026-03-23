// Imports
import { jsPsych } from './init.js';
import { config } from './config.js';
import * as utils from './utils.js';
import * as content from './content.js';

let disruptionLookup;
async function loadDisruptions() {
    try {
        const module = await import('./disruptions.js');
        disruptionLookup = module.disruptionLookup;
    } catch (error) {
        if (config.DEBUG_LOGS) console.warn("disruptions.js not found");
        disruptionLookup = null;
    }
}
await loadDisruptions();

const startTime = new Date().toLocaleString();


// --- Get Prolific ID from URL ---

const urlParams = new URLSearchParams(window.location.search);
const prolificID = urlParams.get('participant_id') || 'unknown';


// --- Setup and preload videos/audio ---

const videoTimelineVariables = utils.setupMedia()
const videoPaths = videoTimelineVariables.map(t => t.video_path);
if (config.DEBUG_LOGS) {
    console.log('Final video timeline variables:')
    console.log(videoTimelineVariables);
}

const timeline = [];
timeline.push({
    type: jsPsychPreload,
    video: [...videoPaths],
    message: "Please wait while we load the study.",
});


// --- Screener ---

const screenerTrial = {
    type: jsPsychSurvey,
    survey_json: content.screenerContent,
    on_finish: function (data) {
        if (data.response.english == 'No' || data.response.attention_check != "Other") {
            // Not eligible
            // TODO: Handle failed screening
            jsPsych.abortExperiment("You did not meet the eligibility requirements.");
        }
    },
    data: { trial_name: 'screener' }
};


// --- Instructions ---

const instructionsTrial = {
    type: jsPsychSurvey,
    survey_json: content.instructionsContent,
    data: { trial_name: 'instructions' }
};


// --- Audio check ---

const audioCheckTrial = {
    type: jsPsychSurvey,
    survey_json: content.audioCheckContent,
    data: { trial_name: 'audo_check' }
};


// --- Fullscreen ---

const fullscreen = {
    type: jsPsychFullscreen,
    fullscreen_mode: true,
    message: `<p>The experiment will switch to full screen mode when you press the button below.</p>
              <p>Do not exit fullscreen until the study is complete.<p>`
}

function checkFullscreen() {
    var reFullscreen = {
        type: jsPsychFullscreen,
        fullscreen_mode: true,
        message: `<p>Please do not exit fullscreen mode.</p><p>Click the button below to return to fullscreen mode.</p>`
    };

    var fullscreenNode = {
        timeline: [reFullscreen],
        conditional_function: function () {
            if (!document.fullscreenElement) {
                return true;
            } else {
                return false;
            }
        }
    }
    return fullscreenNode;
}


// --- Video trial ---

const videoTrial = {
    type: jsPsychVideoDescription,
    video_path: jsPsych.timelineVariable('video_path'),
    video_name: jsPsych.timelineVariable('video_name'),
    video_id: jsPsych.timelineVariable('video_id'),
    condition: jsPsych.timelineVariable('condition'),
    debug_logs: config.DEBUG_LOGS,
    on_start: function (trial) {
        // Parses disruption time if possible
        if (disruptionLookup != null) {
            const entry = disruptionLookup[trial.video_name.split('/').pop()];
            if (entry) {
                trial.break_start = utils.parseTimeCode(entry.start);
                trial.break_end = utils.parseTimeCode(entry.end);
                if (config.DEBUG_LOGS) console.log(`Disruption added: ${trial.break_start} to ${trial.break_end}`);
            }
        }
    },
    data: { trial_name: 'video' }
};


// --- Rating trial ---

const ratingTrial = {
    type: jsPsychSurvey,
    survey_json: content.ratingContent,
    data: { trial_name: 'ratings' }
};


// --- Ending trials ---

const demographicsTrial = {
    type: jsPsychSurvey,
    survey_json: content.demographicsContent,
    data: { trial_name: 'demographics' }
};

const finishedTrial = {
    type: jsPsychSurvey,
    survey_json: content.finishedContent,
    data: { trial_name: 'info', prolific_id: prolificID, start_time: startTime},
    on_finish: function (data) {
        // Can't add end_time with data: {} because it will calculate time at start
        data.end_time = new Date().toLocaleString();
    }
};


// --- Main timeline ---

if (!config.DEBUG_QUICK) timeline.push(screenerTrial, instructionsTrial, audioCheckTrial, fullscreen);

const videoTimeline = {
    timeline: [
        checkFullscreen(),
        videoTrial,
        ratingTrial
    ],
    timeline_variables: videoTimelineVariables
};

timeline.push(videoTimeline);

if (!config.DEBUG_QUICK) timeline.push(demographicsTrial);

timeline.push(finishedTrial);

jsPsych.run(timeline);