import { config } from "./config.js";
import { complete } from "./main.js";


const sessionId = Date.now().toString(36) + Math.random().toString(36).substring(2);

// Function to save data to server
function saveData(id, data) {
    var dataToSend = JSON.stringify({ id: id, filedata: data });
    var success = navigator.sendBeacon("./php/write_data.php", dataToSend);
    if (config.DEBUG_LOGS) console.log("Data saved to data/" + id + ": " + success);
}

// Initialize jsPsych and export it
export const jsPsych = initJsPsych({
    on_finish: function () {
        if (complete) {
            if (config.DEBUG_SAVE) {
                jsPsych.data.get().localSave("csv", "data.csv");
            } else {
                saveData(`data-${sessionId}`, jsPsych.data.get().csv());
                jsPsych.abortExperiment("You will be redirected to Prolific shortly!");
                setTimeout(() => {
                    // Completion code
                    window.location.href = "https://app.prolific.co/submissions/complete?cc=C1HROM6I";
                }, 2000);
            }
        } else {
            jsPsych.abortExperiment("<p>Sorry, you are not eligible for the study.</p><p>You will be redirected to Prolific shortly.</p>");
            setTimeout(() => {
                // Failure code
                window.location.href = "https://app.prolific.co/submissions/complete?cc=FAILURE";
            }, 2000);
        }
    }
});