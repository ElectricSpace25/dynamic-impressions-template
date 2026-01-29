import { config } from './config.js';

const sessionId = Date.now().toString(36) + Math.random().toString(36).substring(2);

// Function to save data to sserver
function saveData(id, data) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', './php/write_data.php');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({ id: id, filedata: data }));
    if (config.DEBUG_LOGS) console.log("Data saved to data/" + id);
}

// Initialize jsPsych and export it
export const jsPsych = initJsPsych({
    on_finish: function () {
        console.log("Finished")
        if (config.DEBUG_SAVE) {
            jsPsych.data.get().localSave("csv", "data.csv");
        } else {
            saveData(`data-${sessionId}`, jsPsych.data.get().csv());
            window.location.href = "https://app.prolific.com/submissions/complete?cc=C1HROM6I";
        }
    }
});