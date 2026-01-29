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
            show_video_controls: {
                type: jspsych.ParameterType.BOOL,
                pretty_name: "Show video controls",
                default: false, // Default to false for strict control in experiments
                description: "If true, native video controls (like play/pause bar, fullscreen, context menu) will be visible.",
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

                // Conditionally add controls and oncontextmenu attributes based on parameter
                const controls_attr = trial.show_video_controls ? 'controls' : '';
                const contextmenu_attr = trial.show_video_controls ? '' : 'oncontextmenu="return false;"';

                // --- 1. RENDER THE HTML (Modified for conditional attributes) ---
                display_element.innerHTML = `
                <div class="page-container">
                    <div class="page-header">
                        <h3 id="video-notice" class="notice-text notice-text--warn">${trial.paused_notice_text}</h3>
                    </div>
                    <div class="video-wrapper">
                        <video id="main-video" ${controls_attr} ${contextmenu_attr}></video>
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

                // --- 2. GET ELEMENTS AND SET UP VIDEO ---
                const video_player = display_element.querySelector('#main-video');
                video_player.src = `${trial.video}`;

                // Ensure controls are removed if not explicitly requested, even if added by browser defaults
                if (!trial.show_video_controls) {
                    video_player.removeAttribute('controls');
                }

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

                // Set initial state for input and buttons (they should be available if video starts paused)
                descript_input.disabled = false;
                descript_add_form.querySelector('button').disabled = false;

                // Helper function to update video notice text
                const updateNotice = (type) => {
                    switch (type) {
                        case 'default':
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

                // --- 3. EVENT LISTENERS ---

                video_player.onerror = () => {
                    //TODO: update or remove error handlding
                    video_player.style.display = 'none';
                    descript_input.disabled = true;
                    descript_add_form.querySelector('button').disabled = true;
                    descript_submit_btn.disabled = true;
                    setTimeout(() => {
                        resolve({ video: trial.video, descriptors: [] });
                    }, 3000);
                };

                video_player.onended = () => {
                    const trial_data = {
                        video: trial.video,
                        descriptors: descriptors_data
                    };
                    resolve(trial_data);
                };

                video_player.onplay = function () {

                };

                video_player.onpause = function () {
                    updateNotice('paused')
                    if (video_player.ended) return;
                    else {
                        descript_input.disabled = false;
                        instructions.style.display = 'block';
                        descript_add_form.querySelector('button').disabled = false;
                        window.scrollTo({
                            top: document.body.scrollHeight,
                            behavior: 'smooth'
                        });
                    }
                };

                let is_disrupted = false;

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
                    descript_input.disabled = true;
                    descript_add_form.querySelector('button').disabled = true;
                    descript_submit_btn.disabled = true;
                    instructions.style.display = 'none';
                    updateNotice('default');
                    video_player.play();
                };

                // Video click logic: Only allow pausing if show_video_controls is false
                if (!trial.show_video_controls) {
                    video_player.onclick = () => {
                        if (is_disrupted) {
                            return;
                        } else if (!video_player.paused && video_player.currentTime - last_pause_time <= 2) {
                            updateNotice('early')
                            last_pause_time = video_player.currentTime;
                            setTimeout(() => {
                                updateNotice('default')
                            }, 1500);
                        } else {
                            video_player.play();
                            video_player.pause();
                        }
                    };
                }
                // If show_video_controls is true, the native controls and default click behavior will apply.

            });
        }
    }
    VideoDescriptionPlugin.info = info;

    return VideoDescriptionPlugin;
})(jsPsychModule);