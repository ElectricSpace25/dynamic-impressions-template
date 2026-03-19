var jsPsychVideoDescription = (function (jspsych) {
    "use strict";

    const info = {
        name: "video-description-trial",
        version: 1.0,
        parameters: {
            video_path: {
                type: jspsych.ParameterType.VIDEO,
                pretty_name: "Video",
                default: undefined,
            },
            video_name: {
                type: jspsych.ParameterType.STRING,
                pretty_name: "Video Name",
                default: null,
            },
            video_id: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Video ID",
                default: null,
            },
            condition: {
                type: jspsych.ParameterType.STRING,
                pretty_name: "Condition",
                default: null,
            },
            instruction_text: {
                type: jspsych.ParameterType.HTML_STRING,
                pretty_name: "Instruction Text",
                default: "Enter one word at a time, using as many words as would be helpful.",
            },
            default_notice_text: {
                type: jspsych.ParameterType.HTML_STRING,
                pretty_name: "Pause Notice Text",
                default: "Click anywhere on the video to pause and make an entry.",
            },
            too_early_notice_text: {
                type: jspsych.ParameterType.HTML_STRING,
                pretty_name: "Too Early Notice Text",
                default: "Please wait slightly longer before pausing again.",
            },
            paused_notice_text: {
                type: jspsych.ParameterType.HTML_STRING,
                pretty_name: "Cannot Unpause Notice Text",
                default: "You cannot unpause until you submit your list of words.",
            },
            repeat_word_notice_text: {
                type: jspsych.ParameterType.HTML_STRING,
                pretty_name: "Repeat Word Notice Text",
                default: "You cannot add a word already in the list.",
            },
            video_error_text: {
                type: jspsych.ParameterType.HTML_STRING,
                pretty_name: "Video Error Text",
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
        data: {
            response: {
                type: jspsych.ParameterType.COMPLEX,
                array: true,
                nested: {
                    /* The word entered */
                    word: {
                        type: jspsych.ParameterType.STRING
                    },
                    /* The timestamp of the video when the word was entered */
                    timestamp: {
                        type: jspsych.ParameterType.FLOAT
                    },
                    /* When the word was entered
                       - 'inital' - before playing the video
                       - 'during' - during the video
                       - 'final' - after the video ended */
                    response_state: {
                        type: jspsych.ParameterType.STRING
                    },
                    /* The name of the video played.
                       Will be video_path if video_name was not provided */
                    video: {
                        type: jspsych.ParameterType.STRING
                    },
                    /* The index of the video in the order given before shuffling.
                       Will be null if video_id not provided */
                    video_id: {
                        type: jspsych.ParameterType.STRING
                    },
                    /* The condition the video is assigned to.
                       Will be null if condition not provided */
                    condition: {
                        type: jspsych.ParameterType.STRING
                    },
                }
            },
            /* The response time in milliseconds for the participant to complete the trial */
            rt: {
                type: jspsych.ParameterType.INT
            }
        }
    };

    class VideoDescriptionPlugin {
        constructor(jsPsych) {
            this.jsPsych = jsPsych;
        }

        async trial(display_element, trial) {
            return new Promise((resolve) => {
                var startTime = performance.now();

                // Set up HTML
                display_element.innerHTML = `
                <div class="trial-container">
                    <div>
                        <video class="video-player" oncontextmenu="return false;"></video>
                        <div>
                            <h3 id="video-notice" class="notice-text notice-text--warn">${trial.paused_notice_text}</h3>
                        </div>
                    </div>
                    <div>
                        <div class="word-list">
                        </div>
                        <h4 id="instructions">${trial.instruction_text}</h4>
                        <h4 id="repeat-word-notice" class="notice-text notice-text--warn" style="display: none;">${trial.repeat_word_notice_text}</h4>
                        <form class="word-entry-form">
                            <input type="text" class="word-input-box" placeholder="e.g. 'happy', 'trustworthy'" autocomplete="off" onkeydown="return /[a-z\-]/i.test(event.key)" maxlength="19" disabled>
                            <button type="submit" class="jspsych-btn add-word-btn" disabled>+</button>
                        </form>
                        <button id="submit-btn" class="jspsych-btn" disabled>Submit Word List</button>
                    </div>
                </div>`;

                // Set up video
                const videoPlayer = display_element.querySelector('.video-player');
                videoPlayer.src = `${trial.video_path}`;
                videoPlayer.removeAttribute('controls'); //TODO: Is this necessary??

                // Get elements
                const trialContainer = document.querySelector('.trial-container');
                const wordInputBox = display_element.querySelector('.word-input-box');
                const wordEntryForm = display_element.querySelector('.word-entry-form');
                const submitBtn = display_element.querySelector('#submit-btn');
                const wordList = display_element.querySelector('.word-list');
                const repeatWordNotice = display_element.querySelector('#repeat-word-notice');
                const videoNotice = display_element.querySelector('#video-notice');
                const instructions = display_element.querySelector('#instructions')

                let descriptorsData = [];
                let currentTerms = [];
                let lastPauseTime = -2;
                let isDisrupted = false;
                let response_state = 'initial'; // initial, during, final

                // Helper function to update video notice text
                const updateNotice = (type) => {
                    switch (type) {
                        case 'playing':
                            videoNotice.textContent = trial.default_notice_text;
                            videoNotice.className = 'notice-text';
                            break;
                        case 'paused':
                            videoNotice.textContent = trial.paused_notice_text;
                            videoNotice.className = 'notice-text notice-text--warn';
                            break;
                        case 'early':
                            videoNotice.textContent = trial.too_early_notice_text;
                            videoNotice.className = 'notice-text notice-text--warn';
                            break;
                    }
                };

                const changeState = (state, scroll = false) => {
                    switch (state) {
                        case 'playing':
                            // Change notice
                            updateNotice('playing');

                            // Disable input
                            wordInputBox.disabled = true;
                            wordEntryForm.querySelector('button').disabled = true;
                            submitBtn.disabled = true;

                            // Hide instructions
                            instructions.style.display = 'none';
                            repeatWordNotice.style.display = 'none';

                            // Play video
                            videoPlayer.play();

                            // Clicking video pauses
                            videoPlayer.onclick = () => {
                                if (isDisrupted) {
                                    // Don't pause if disrupted
                                    return;
                                } else if (videoPlayer.currentTime - lastPauseTime <= 2) {  // Paused too early
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
                            wordInputBox.disabled = false;
                            wordEntryForm.querySelector('button').disabled = false;

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
                            videoPlayer.pause();

                            // Clicking video scrolls down
                            videoPlayer.onclick = () => {
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

                // On video end, hide video and request final 2+ words
                videoPlayer.onended = () => {
                    response_state = 'final';

                    videoPlayer.style.display = 'none';
                    videoNotice.style.display = 'none';
                    instructions.style.display = 'block';
                    instructions.textContent = 'Please add any final words that you feel describe this candidate. You must include at least two.'

                    // Enable input
                    trialContainer.classList.add('is-centered');
                    wordInputBox.disabled = false;
                    wordEntryForm.querySelector('button').disabled = false;
                };

                videoPlayer.ontimeupdate = () => {
                    if (trial.break_start !== null && trial.break_end !== null) {
                        const t = videoPlayer.currentTime;
                        // Check if current time is inside the disruption window
                        if (t >= trial.break_start && t < trial.break_end) {
                            if (trial.debug_logs) console.log("Disruption occuring")
                            isDisrupted = true;
                        } else {
                            isDisrupted = false;
                        }
                    }
                };

                // Add words to list
                wordEntryForm.onsubmit = (e) => {
                    e.preventDefault();
                    const newWord = wordInputBox.value.trim();
                    if (newWord === '') return;
                    if (currentTerms.includes(newWord)) {
                        repeatWordNotice.style.display = 'block';
                        return;
                    }
                    repeatWordNotice.style.display = 'none';
                    currentTerms.push(newWord);
                    const listItem = document.createElement('div');
                    listItem.className = 'word-list-item';
                    listItem.innerText = newWord;
                    const deleteBtn = document.createElement('button');
                    deleteBtn.innerText = 'x';
                    deleteBtn.className = 'delete-btn'
                    deleteBtn.onclick = function () {
                        currentTerms = currentTerms.filter(word => word !== newWord);
                        listItem.remove();
                        if (currentTerms.length === 0 || (response_state === 'final' && currentTerms.length < 2)) {
                            submitBtn.disabled = true;
                        }
                    };
                    listItem.appendChild(deleteBtn);
                    wordList.appendChild(listItem);
                    wordInputBox.value = '';
                    if (response_state === 'final') {
                        submitBtn.disabled = currentTerms.length < 2;
                    } else {
                        submitBtn.disabled = false;
                    }
                };

                // Submit words and resume video
                submitBtn.onclick = () => {
                    const currentTimestamp = videoPlayer.currentTime;
                    lastPauseTime = currentTimestamp;
                    const newData = currentTerms.map(word => ({ 
                        word: word, 
                        timestamp: currentTimestamp, 
                        response_state: response_state,
                        video: trial.video_name ?? trial.video_path,
                        video_id: trial.video_id,
                        condition: trial.condition
                        }));
                    descriptorsData = descriptorsData.concat(newData);
                    currentTerms = [];
                    wordList.innerHTML = '';
                    wordInputBox.value = '';
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                    if (response_state === 'initial') {
                        response_state = 'during';
                    }
                    if (response_state === 'final') {
                        // End the trial
                        let rt = Math.round(performance.now() - startTime);
                        const trial_data = {
                            response: descriptorsData,
                            rt: rt
                        };
                        resolve(trial_data);
                    } else {
                        changeState('playing');
                    }
                };

            });
        }
    }
    VideoDescriptionPlugin.info = info;

    return VideoDescriptionPlugin;
})(jsPsychModule);