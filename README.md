# Dynamic Impressions jsPsych Template

[Insert ReadMe stuff]

# Data


# Alternate Video Mode

Let's say you have 4 videos, but you also have an alternate version of each of those same videos. You want the participant to see 2 of the videos in their original form and 2 of the videos in their altered form. 

If you just made a list of control videos and a list of altered videos, the participant might see the same video in both its original and altered form. To prevent this, you can enable `ALTERNATE_VIDEOS` in `config.js`.

This will prevent participants from seeing videos with the same index across different lists. For example, if a participant saw the third video in the first list, they will not see the third video in the second list.

Here is an example:
```js
export const videoLists = [
    {
        condition: "control",
        selectionNum: 2,
        videos: [
            "v1.mp4",
            "v2.mp4",
            "v3.mp4",
            "v4.mp4"
        ]
    },
    {
        condition: "altered",
        selectionNum: 2,
        videos: [
            "v1a.mp4",
            "v2a.mp4",
            "v3a.mp4",
            "v4a.mp4"
        ]
    },
];
``` 
If alternate video mode was not enabled, the program would simply choose 2 random videos from the control list and 2 random videos from the altered list, not caring about overlap.

With alternate video mode enabled, the program will first randomly choose 2 videos from the control list, then will choose 2 videos from the altered list that don't match the indices already chosen. For example, it could chose [v1, v3, v2a, v4a] but it would never chose [v1, v3, v1a, v4a] because that would include two versions of v1. The final list of chosen videos will be shuffled before shown to the participant.

If using alternate video mode, **all lists must be the same length and in the same order**.
