// Imports
import { config } from './config.js';
import { jsPsych } from './init.js';

import * as utils from './utils.js';
import { materials } from './materials.js';
import * as content from './content.js';

// --- Setup and preload videos/audio ---

const {
    videoTimelineVariables,
    videoPaths
} = utils.setupMedia()

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
    video: jsPsych.timelineVariable('video'),
    show_video_controls: false,
    DEBUG_LOGS: config.DEBUG_LOGS,
    on_start: function (trial) {
        // Parses disruption time if possible
        const entry = utils.disruptionLookup[trial.video.split('/').pop()];
        if (entry) {
            trial.break_start = utils.parseTimeCode(entry.start);
            trial.break_end = utils.parseTimeCode(entry.end);
            if (config.DEBUG_LOGS) console.log(`Disruption added: ${trial.break_start} to ${trial.break_end}`);
        }
    },
    data: {
        // Adds condition and video_id columns to data
        condition: jsPsych.timelineVariable("condition"),
        video_id: jsPsych.timelineVariable("video_id")
    }
};


// --- Final impression trial ---

const finalImpressionTrial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: materials.finalImpression,
    choices: "NO_KEYS",
    on_load: function () {
        const sorter = document.getElementById('final-sorter');
        const addForm = document.getElementById('final-descript-form');
        const input = document.getElementById('final-descript-input');
        const submitBtn = document.getElementById('final-submit');
        const notice = document.getElementById('final-cannot-add-notice');
        let finalTerms = [];

        function renderList() {
            sorter.innerHTML = '';
            finalTerms.forEach(word => {
                const listItem = document.createElement('div');
                listItem.className = 'list-group-item';
                listItem.innerText = word;
                const deleteBtn = document.createElement('button');
                deleteBtn.innerText = "x";
                deleteBtn.className = 'delete-btn'
                deleteBtn.onclick = function () {
                    finalTerms = finalTerms.filter(t => t !== word);
                    renderList();
                };
                listItem.appendChild(deleteBtn);
                sorter.appendChild(listItem);
            });
            submitBtn.disabled = finalTerms.length < 2;
        }

        addForm.onsubmit = function (e) {
            e.preventDefault();
            const newWord = input.value.trim();
            if (newWord === '') return;
            if (finalTerms.includes(newWord)) {
                notice.style.display = 'block';
                return;
            }
            notice.style.display = 'none';
            finalTerms.push(newWord);
            input.value = '';
            renderList();
        };

        submitBtn.onclick = function () {
            jsPsych.finishTrial({
                final_descriptors: finalTerms,
            });
        };

        renderList();
    },
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
        finalImpressionTrial,
        ratingTrial,
        decisionTrial
    ],
    timeline_variables: videoTimelineVariables
};

timeline.push(videoTimeline);

if (!config.DEBUG_QUICK) timeline.push(demographicsTrial, feedbackTrial, finishedTrial);

jsPsych.run(timeline);