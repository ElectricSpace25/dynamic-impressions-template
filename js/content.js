// --- Screener ---
export const screenerContent = {
    title: 'Welcome to the experiment!',
    showQuestionNumbers: false,
    elements:
        [
            {
                type: 'html',
                html: '<p>Please answer the following questions to determine your eligibility.</p>'
            },
            {
                type: 'text',
                name: 'prolific_id',
                title: 'Please enter your Prolific ID accurately.',
                isRequired: true
            },
            {
                type: 'radiogroup',
                name: "english",
                title: 'Are you fluent in English?',
                choices: ['Yes', 'No'],
                isRequired: true
            },
            {
                type: 'radiogroup',
                name: "attention_check",
                title: 'Please read the following instructions carefully',
                description: 'Recent research on decision making has shown that choices are affected by political party affiliation. To help us understand how people from different backgrounds make decisions, we are interested in information about you. Specifically, we want to know if you actually read any of the instructions we give at the beginning of our survey; if not, some results may not tell us very much about decision making and perception in the real world. To show that you have read the instructions, please ignore the questions about political party affiliation below and simply select "Other" at the bottom.',
                choices: ['Democratic', 'Republican', 'Independent', 'Libertarian', 'Green Party', 'Other'],
                isRequired: true
            }
        ]
};

// --- Instructions ---
export const instructionsContent = {
    title: 'Instructions',
    pages: [
        {
            title: 'Welcome to the Experiment',
            elements: [
                {
                    type: 'html',
                    html: `
                        <p>Thank you for participating in our experiment!</p>
                        <p>We are researchers interested in how we understand other people in professional settings.</p>
                        <p>Your job today is simple. <b>There are four parts to our task.</b></p>
                        <ol>
                            <li>View professional video introductions and write down impressions of the speaker.</li>
                            <li>Form a final impression of the speaker in the video.</li>
                            <li>Rate the job candidate on several attributes.</li>
                            <li>Decide whether to offer the job candidate an interview at the company.</li>
                        </ol>
                        <p>You will repeat these steps for each video.</p>
                        <p>Today, you will take on the role of a professional recruiter. A set of companies (i.e., your clients) have tasked you with reviewing professional video introductions by job candidates. While viewing each video, you should form impressions about the person. Once you have watched the video and formed your impressions, you will make a decision about whether or not the candidate should be offered an interview at the company they applied to.</p>
                        <p>In the next few panels, you will learn more about each step of the experiment.</p>
                    `
                }
            ]
        },
        {
            title: 'Step 1: Watch and describe the job candidate in the video',
            elements: [
                {
                    type: 'html',
                    html: `
                        <video width="100%" autoplay loop muted src="assets/video/instruct/submitting.mp4"></video>
                        <p>Pause the video whenever you <b>notice a new characteristic</b> about the person or think of a <b>new way to describe them.</b> Pause by clicking anywhere on the video.</p>
                        <p><b>Enter one word at a time</b>, but you can enter multiple words each time you pause (see video). For example, if you feel like the person is being an annoying student, pause and enter “annoying” and “student” separately. Order does not matter.</p>
                        <p>Enter whatever comes to mind spontaneously. There are no limits on what you enter! We only ask that you <b>pause and describe the person multiple times.</b></p>
                        <p>Based on past experience, <b>we expect you will pause 2-5 times per video.</b> Please note there is a minimum amount of time that needs to pass between each time you pause the video (2 seconds).</p>
                    `
                }
            ]
        },
        {
            title: 'Step 2: Form a final impression',
            elements: [
                {
                    type: 'html',
                    html: `
                        <video width="100%" autoplay loop muted src="assets/video/instruct/final.mp4"></video>
                        <p>Form your final impression of the speaker. <b>Think of this as a list of words you'd use to describe this person to someone else, your summary impression of a person.</b> Once again, enter one word at a time, for as many words as you'd like.</p>
                    `
                }
            ]
        },
        {
            title: 'Step 3: Rate the speaker on several attributes',
            elements: [
                {
                    type: 'html',
                    html: `
                        <video width="100%" autoplay loop muted src="assets/video/instruct/rating.mp4"></video>
                        <p>Once you finish watching the video, you will rate the candidate in the video on several attributes using a slider. <strong>Please go with your gut feelings, and don't overthink it.</strong> You will be evaluating the candidate on these attributes:</p>
                        <p><b>Please read the category descriptions carefully below:</b></p>
                        <ul class="instructions-list">
                            <li><b>Openness to new experiences:</b> willingness to try new things and to explore new ideas</li>
                            <li><b>Conscientiousness:</b> extent to which the candidate seems organized, hardworking, and goal-oriented</li>
                            <li><b>Extroversion:</b> extent to which the candidate seems energized by social interaction and enjoys being around other people</li>
                            <li><b>Agreeableness:</b> extent to which the candidate seems cooperative, kind, and trusting</li>
                            <li><b>Neuroticism:</b> extent to which the candidate seems prone to negative emotions such as anxiety, anger, and sadness</li>
                            <li><b>Warmth:</b> extent to which the candidate seems friendly, approachable, and likeable</li>
                            <li><b>Competence:</b> extent to which the candidate seems capable, skilled, and knowledgeable</li>
                            <li><b>Confidence:</b> extent to which the candidate displays self-assurance, decisiveness, and belief in their own abilities</li>
                            <li><b>Leadership capacity:</b> extent to which the candidate seems like someone who can guide, inspire, and manage others effectively</li>
                            <li><b>Ambitiousness:</b> extent to which the candidate displays a strong desire for achievement, advancement, and success</li>
                            <li><b>Trustworthiness:</b> extent to which the candidate is seems reliable, honest, and dependable in their actions and communications</li>
                        </ul>
                    `
                }
            ]
        },
        {
            title: 'Step 4: Make a recruitment decision',
            elements: [
                {
                    type: 'html',
                    html: `
                        <video width="100%" autoplay loop muted src="assets/video/instruct/decision.mp4"></video>
                        <p>After evaluating the candidate on all attributes, decide whether to invite them for an interview at the company they applied to.</p>
                        <p>You will repeat these 4 steps for 10 videos. We encourage you to have fun with this task. Writing more is better than writing less!</p>
                        <p>After completing all videos, there will be a textbox to provide feedback. We welcome any of your thoughts about ways to improve the task and appreciate your time and effort.</p>
                    `
                }
            ]
        },
        {
            title: 'Important Note',
            elements: [
                {
                    type: 'html',
                    html: `
                        <p>Some of the videos may briefly pause and display a black screen due to technical issues during recording or uploading. If this occurs, simply wait for the video to resume and continue with the task as usual. When the video continues, you may keep watching and pausing to describe the person in the video as you have been doing.</p>
                    `
                }
            ]
        },
    ]
};

// --- Audio Check ---
export const audioCheckContent = {
    title: 'Audio Check',
    completeText: 'Submit',
    elements: [
        {
            type: 'panel',
            elements: [
                {
                    type: 'html',
                    html: '<p>In the audio clip below, you will hear a sequence of five numbers. Please type those numbers in the box to continue.<p style="color: red">Please make sure your sound is on.</p><audio controls src="assets/audiocheck.wav"></audio>'
                },
                {
                    type: 'text',
                    name: 'audio_check',
                    title: 'Press play and enter the numbers you hear.',
                    inputType: 'number',
                    isRequired: true,
                    validators: [
                        {
                            type: 'expression',
                            text: 'Incorrect. Please listen carefully and try again.',
                            expression: '{audio_check} == 42359'
                        }
                    ]
                },
            ]
        }
    ]
};

// --- Trait Rating ---
const traits = [
    { name: "openness", title: "Open to new experiences" },
    { name: "conscientiousness", title: "Conscientious" },
    { name: "extraversion", title: "Extroverted" },
    { name: "agreeableness", title: "Agreeable" },
    { name: "neuroticism", title: "Neurotic" },
    { name: "warmth", title: "Warm" },
    { name: "competence", title: "Competent" },
    { name: "confidence", title: "Confident" },
    { name: "leadership", title: "Capable of leadership" },
    { name: "ambitiousness", title: "Ambitious" },
    { name: "trustworthiness", title: "Trustworthy" },
];

const traitSliders = traits.map(trait => ({
    type: 'slider',
    name: trait.name,
    title: trait.title,
    min: 0,
    max: 10,
    defaultValue: 5,
    customLabels: [
        {
            value: 0,
            text: "Least"
        },
        {
            value: 10,
            text: "Most"
        }
    ]
}));

export const ratingContent = {
    title: 'Rating Impressions',
    completeText: 'Submit',
    elements:
        [
            {
                type: 'html',
                html: '<p>Rate the candidate in the video on the following parameters.</p>'
            },
            ...traitSliders
        ]
};

// --- Decision ---
export const decisionContent = {
    title: 'Recruitment Decision',
    completeText: 'Submit',
    elements:
        [
            {
                type: 'radiogroup',
                name: 'interview',
                title: 'Please decide whether to invite this candidate for an interview.',
                choices: ['Invite for interview', 'Do not invite for interview'],
                isRequired: true
            }
        ]
};

// --- Demographics ---
export const demographicsContent = {
    title: 'Demographics',
    completeText: 'Submit',
    elements:
        [
            {
                type: 'number',
                name: 'age',
                title: 'What is your age?',
                isRequired: true
            },
            {
                type: 'checkbox',
                name: 'gender',
                title: 'What gender do you identify with? (Select all that apply)',
                choices: ['Male', 'Female', 'Transgender', 'Non-binary', 'Not otherwise specified', 'I do not wish to provide this information'],
                isRequired: true
            },
            {
                type: 'checkbox',
                name: 'race',
                title: 'What race/ethnicity do you identify with? (Select all that apply)',
                choices: ['American Indian or Alaska Native', 'Asian', 'Black or African-American', 'Native Hawaiian or Other Pacific Islander', 'White', 'Latino', 'Other'],
                isRequired: true
            },
            {
                type: 'radiogroup',
                name: 'education',
                title: 'What is the highest level of education you have received?',
                choices: ['Less than High School', 'High School Diploma', 'Some College', 'Associate\'s Degree', 'Bachelor\'s Degree', 'Some Graduate School', 'Master\'s Degree', 'Doctoral Degree'],
                isRequired: true
            }
        ]
};

// --- Feedback ---
export const feedbackContent = {
    title: 'Feedback',
    completeText: 'Submit',
    elements:
        [
            {
                type: 'comment',
                name: 'feedback',
                title: 'Please let us know if any part of the study was confusing, unclear, or in need of improvement. We appreciate your feedback greatly!',
            }
        ]
};

// --- Finished ---
export const finishedContent = {
    title: 'Study Completed',
    completeText: 'Click here to return to Prolific',
    elements:
        [
            {
                type: 'html',
                html: '<p>Thank you for participating in the study!</p>',
            }
        ]
};