var jsPsychVideoDescription = (function (jspsych) {
    "use strict";

    const info = {
        name: "video-description-trial",
        parameters: {
            video: {
                type: jspsych.ParameterType.VIDEO,
                pretty_name: "Video",
                default: undefined,
            },
            instruction_text: {
                type: jspsych.ParameterType.HTML_STRING,
                pretty_name: "Instruction text",
                default: "Enter one word at a time, using as many words as would be helpful.",
            },
            default_notice_text: {
                type: jspsych.ParameterType.HTML_STRING,
                pretty_name: "Pause notice text",
                default: "Click anywhere on the video to pause and make an entry.",
            },
            too_early_notice_text: {
                type: jspsych.ParameterType.HTML_STRING,
                pretty_name: "Too early notice text",
                default: "Please wait slightly longer before pausing again.",
            },
            paused_notice_text: {
                type: jspsych.ParameterType.HTML_STRING,
                pretty_name: "Cannot unpause notice text",
                default: "You cannot unpause until you submit your list of words.",
            },
            cannot_add_notice_text: {
                type: jspsych.ParameterType.HTML_STRING,
                pretty_name: "Cannot add notice text",
                default: "You cannot add a word already in the list.",
            },
            video_error_text: {
                type: jspsych.ParameterType.HTML_STRING,
                pretty_name: "Video error text",
                default: "<p>Error: Could not load video. Please inform the experimenter.</p>",
            },
            break_start: {
                type: jspsych.ParameterType.FLOAT,
                pretty_name: "Break Start Time (Seconds)",
                default: null, // If null, no disruption logic runs
                description: "Time in seconds when the disruption starts."
            },
            break_end: {
                type: jspsych.ParameterType.FLOAT,
                pretty_name: "Break End Time (Seconds)",
                default: null,
                description: "Time in seconds when the disruption ends."
            },
            debug_logs: {
                type: jspsych.ParameterType.BOOL,
                pretty_name: "Debug Logs",
                default: false,
                description: "If true, display prints useful for debugging"
            }
        },
    };

    class VideoDescriptionPlugin {
        constructor(jsPsych) {
            this.jsPsych = jsPsych;
        }

        async trial(display_element, trial) {
            return new Promise((resolve) => {

                // Set up HTML
                display_element.innerHTML = `
                <div class="page-container">
                    <div class="page-header">
                        <h3 id="video-notice" class="notice-text notice-text--warn">${trial.paused_notice_text}</h3>
                    </div>
                    <div class="video-wrapper">
                        <video id="main-video" oncontextmenu="return false;"></video>
                    </div>
                    <div class="video-trial-response-area">
                        <div id="desc-sorter" class="word-list"></div>
                        <h4 id="instructions">${trial.instruction_text}</h4>
                        <h4 id="cannot-add-notice" class="notice-text notice-text--warn" style="display: none;">${trial.cannot_add_notice_text}</h4>
                        <form id="add-descript-form" class="word-entry-form">
                            <input id="descript-input" type="text" class="text-input" placeholder="e.g. 'happy', 'trustworthy'" autocomplete="off" onkeydown="return /[a-z\-]/i.test(event.key)" disabled>
                            <button id="descript-add" type="submit" class="jspsych-btn word-entry-form__add-btn" disabled>+</button>
                        </form>
                        <button id="descript-submit" class="jspsych-btn" disabled>Submit Word List</button>
                    </div>
                </div>`;

                // Set up video
                const video_player = display_element.querySelector('#main-video');
                video_player.src = `${trial.video}`;
                video_player.removeAttribute('controls'); //TODO: Is this necessary??

                // Get elements
                const descript_input = display_element.querySelector('#descript-input');
                const descript_add_form = display_element.querySelector('#add-descript-form');
                const descript_submit_btn = display_element.querySelector('#descript-submit');
                const desc_sorter = display_element.querySelector('#desc-sorter');
                const cannot_add_notice = display_element.querySelector('#cannot-add-notice');
                const video_notice = display_element.querySelector('#video-notice');
                const instructions = display_element.querySelector('#instructions')

                let descriptors_data = [];
                let current_terms = [];
                let last_pause_time = -2;
                let is_disrupted = false;

                // Helper function to update video notice text
                const updateNotice = (type) => {
                    switch (type) {
                        case 'playing':
                            video_notice.textContent = trial.default_notice_text;
                            video_notice.className = 'notice-text';
                            break;
                        case 'paused':
                            video_notice.textContent = trial.paused_notice_text;
                            video_notice.className = 'notice-text notice-text--warn';
                            break;
                        case 'early':
                            video_notice.textContent = trial.too_early_notice_text;
                            video_notice.className = 'notice-text notice-text--warn';
                            break;
                    }
                };

                const changeState = (state, scroll = false) => {
                    console.log(state);
                    switch (state) {
                        case 'playing':
                            // Change notice
                            updateNotice('playing');

                            // Disable input
                            descript_input.disabled = true;
                            descript_add_form.querySelector('button').disabled = true;
                            descript_submit_btn.disabled = true;

                            // Hide instructions
                            instructions.style.display = 'none';

                            // Play video
                            video_player.play();

                            // Clicking video pauses
                            video_player.onclick = () => {
                                if (is_disrupted) {
                                    // Don't pause if disrupted
                                    return;
                                } else if (video_player.currentTime - last_pause_time <= 2) {  // Paused too early
                                    // Don't pause if too early
                                    updateNotice('early');
                                    // last_pause_time = video_player.currentTime;
                                    setTimeout(() => {
                                        updateNotice('playing');
                                    }, 1500);
                                    return;
                                } else {
                                    // Change to paused state and scroll down
                                    changeState('paused', true);
                                }
                            };
                            break;
                        case 'paused':
                            // Change notice
                            updateNotice('paused');

                            // Enable input
                            descript_input.disabled = false;
                            descript_add_form.querySelector('button').disabled = false;

                            // Show instructions
                            instructions.style.display = 'block';

                            // Scroll down
                            if (scroll) {
                                window.scrollTo({
                                    top: document.body.scrollHeight,
                                    behavior: 'smooth'
                                });
                            }

                            // Pause video
                            video_player.pause();

                            // Clicking video scrolls down
                            video_player.onclick = () => {
                                window.scrollTo({
                                    top: document.body.scrollHeight,
                                    behavior: 'smooth'
                                });
                            }
                            break;
                    }
                }

                // Set initial state
                changeState('paused');

                video_player.onended = () => {
                    const trial_data = {
                        video: trial.video,
                        descriptors: descriptors_data
                    };
                    resolve(trial_data);
                };

                video_player.ontimeupdate = () => {
                    if (trial.break_start !== null && trial.break_end !== null) {
                        const t = video_player.currentTime;
                        // Check if current time is inside the disruption window
                        if (t >= trial.break_start && t < trial.break_end) {
                            if (trial.debug_logs) console.log("Disruption occuring")
                            is_disrupted = true;
                        } else {
                            is_disrupted = false;
                        }
                    }
                };

                // Add words to list
                descript_add_form.onsubmit = (e) => {
                    e.preventDefault();
                    const new_word = descript_input.value.trim();
                    if (new_word === '') return;
                    if (current_terms.includes(new_word)) {
                        cannot_add_notice.style.display = 'block';
                        return;
                    }
                    cannot_add_notice.style.display = 'none';
                    current_terms.push(new_word);
                    const list_item = document.createElement('div');
                    list_item.className = 'list-group-item';
                    list_item.innerText = new_word;
                    const delete_btn = document.createElement('button');
                    delete_btn.innerText = 'x';
                    delete_btn.className = 'delete-btn'
                    delete_btn.onclick = function () {
                        current_terms = current_terms.filter(word => word !== new_word);
                        list_item.remove();
                        if (current_terms.length === 0) {
                            descript_submit_btn.disabled = true;
                        }
                    };
                    list_item.appendChild(delete_btn);
                    desc_sorter.appendChild(list_item);
                    descript_input.value = '';
                    descript_submit_btn.disabled = false;
                };

                // Submit words and resume video
                descript_submit_btn.onclick = () => {
                    const current_timestamp = video_player.currentTime;
                    last_pause_time = current_timestamp;
                    const new_data = current_terms.map(word => ({ word: word, timestamp: current_timestamp }));
                    descriptors_data = descriptors_data.concat(new_data);
                    current_terms = [];
                    desc_sorter.innerHTML = '';
                    descript_input.value = '';
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                    changeState('playing');
                };

            });
        }
    }
    VideoDescriptionPlugin.info = info;

    return VideoDescriptionPlugin;
})(jsPsychModule);