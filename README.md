# Dynamic Impressions jsPsych Template

This is a template for a jsPsych study for researching dynamic impression formation. It features a plugin that allows participants to pause a video and write multiple single world responses.

[README under construction]

# Data Cleanup

A Python cleanup script (`cleanup.py`) is included in this repository. It will read **ALL** CSV files in the `data` folder and create 4 files:

### words.csv
| subject_id | word | timestamp | response_state | video | video_id | condition |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- | 
| mn3q7bp9pj73o6npr7 | happy | 26.862329 | during | v1.mp4 | 0 | control | 

### ratings.csv
| subject_id | trait | value | video | rt |
| :-- | :-- | :-- | :-- | :-- |
| mn3q7bp9pj73o6npr7 | warmth | 6 | v1.mp4 | 10940.0 |

### demographics.csv
| subject_id | age | gender | race | education | feedback |
| :-- | :-- | :-- | :-- | :-- | :-- |
| mn3q7bp9pj73o6npr7 | 22 | Female | White | Bachelor's Degree | Great study! |

### id_key.csv
| subject_id | prolific_id | start_time | end_time |
| :-- | :-- | :-- | :-- |
| mn3q7bp9pj73o6npr7 | 000 | 3/24/2026, 5:54:30 PM | 3/24/2026, 6:37:19 PM |


# Exclusive Index Mode

When Exclusive Index Mode is set to `true` in `config.js`, the program ensures that a participant never sees more than one version of the same video.

Let's say you have a set of original videos and a set of "disrupted" versions.

```js
export const videoLists = [
    {
        condition: "control",
        selectionNum: 2,
        shuffle: true,
        videos: [
            "v1.mp4", // Index 0
            "v2.mp4", // Index 1
            "v3.mp4", // Index 2
            "v4.mp4"  // Index 3
        ]
    },
    {
        condition: "disrupted",
        selectionNum: 2,
        shuffle: true,
        videos: [
            "v1_disrupted.mp4", // Index 0
            "v2_disrupted.mp4", // Index 1
            "v3_disrupted.mp4", // Index 2
            "v4_disrupted.mp4"  // Index 3
        ]
    },
];
``` 

A standard random selection might pick both `v1.mp4` and `v1_disrupted.mp4`, showing the participant two versions of the same video.

Exclusive Index Mode treats the position (index) of a video as its unique ID. If the program selects `v1.mp4`, it automatically excludes index 0 for all other lists, making it impossible to pick `v1_disrupted.mp4`.

For Exclusive Index Mode to function properly, **all lists must be the same length and in the same order**. Every video must have a counterpart with the same index in every other list.