// Imports
import { jsPsych } from './init.js';
import { config, videoLists } from './config.js';
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


// --- Setup and preload videos/audio ---

const videoTimelineVariables = utils.setupMedia()
const videoPaths = videoTimelineVariables.map(t => t.video_path);

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
    }
};


// --- Instructions ---

const instructionsTrial = {
    type: jsPsychSurvey,
    survey_json: content.instructionsContent
};


// --- Audio check ---

const audioCheckTrial = {
    type: jsPsychSurvey,
    survey_json: content.audioCheckContent
};


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
    }
};


// --- Rating and decision ---

const ratingTrial = {
    type: jsPsychSurvey,
    survey_json: content.ratingContent
};

const decisionTrial = {
    type: jsPsychSurvey,
    survey_json: content.decisionContent
};


// --- Ending trials ---

const demographicsTrial = {
    type: jsPsychSurvey,
    survey_json: content.demographicsContent
};

const feedbackTrial = {
    type: jsPsychSurvey,
    survey_json: content.feedbackContent
};

const finishedTrial = {
    type: jsPsychSurvey,
    survey_json: content.finishedContent
};


// --- Main timeline ---

if (!config.DEBUG_QUICK) timeline.push(screenerTrial, instructionsTrial, audioCheckTrial);

const videoTimeline = {
    timeline: [
        videoTrial,
        ratingTrial,
        decisionTrial
    ],
    timeline_variables: videoTimelineVariables
};

timeline.push(videoTimeline);

if (!config.DEBUG_QUICK) timeline.push(demographicsTrial, feedbackTrial, finishedTrial);

jsPsych.run(timeline);