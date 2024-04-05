class Practice {
    constructor(correctResponses, practiceLen) {
        this.correctResponses = correctResponses;
        this.practiceLen = practiceLen;
        this.choices = correctResponses.map(response => response[1]);
    }

    setupStartPracticeBlock() {
        return {
            type: 'poldrack-text',
            timing_response: 60000,
            data: {exp_id: 'choice_reaction_time', trial_id: 'practice_intro'},
            text: '<div class = centerbox><p class = block-text>We will begin with practice. If you see the <font color="orange">orange</font> square you should press the <strong>' + this.correctResponses[0][0] + '</strong> key. If you see the <font color="blue">blue</font> square you should press the <strong>' + this.correctResponses[1][0] + '</strong> key.</p><p class = block-text>You will receive feedback telling you if you were correct. Press <strong>enter</strong> to begin.</p></div>',
            cont_key: [13],
            timing_post_trial: 1000
        };
    }

    generatePracticeStimuli() {
        return [{
            stimulus: '<div class="centerbox" style="display: flex; justify-content: center; align-items: center; height: 100vh;"><img src="face_stim/men_face_1.png" style="width: 33.33vw; height: auto;" /></div>',
            data: {
                stim_id: 1,
                trial_id: 'stim',
                exp_stage: 'practice'
            },
            key_answer: this.correctResponses[0][1]
        }, {
            stimulus: '<div class="centerbox" style="display: flex; justify-content: center; align-items: center; height: 100vh;"><img src="face_stim/women_face_1.png" style="width: 33.33vw; height: auto;" /></div>',
            data: {
                stim_id: 2,
                trial_id: 'stim',
                exp_stage: 'practice'
            },
            key_answer: this.correctResponses[1][1]
        }];
    }

    setupPracticeBlock() {
        const practiceStimuli = this.generatePracticeStimuli();
        return {
            type: 'poldrack-categorize',
            timeline: jsPsych.randomization.repeat(practiceStimuli, this.practiceLen / 2),
            is_html: true,
            data: {
                trial_id: 'stim',
                exp_stage: 'practice'
            },
            correct_text: '<div class = centerbox><div style="color:green"; class = center-text>Correct!</div></div>',
            incorrect_text: '<div class = centerbox><div style="color:red"; class = center-text>Incorrect</div></div>',
            timeout_message: '<div class = centerbox><div class = center-text>Respond Faster!</div></div>',
            choices: this.choices,
            timing_response: 2000,
            timing_stim: 2000,
            timing_feedback_duration: 1000,
            show_stim_with_feedback: false,
            timing_post_trial: post_trial_gap,
            on_finish: appendData
        };
    }
}
