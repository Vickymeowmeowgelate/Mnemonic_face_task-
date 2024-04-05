class MemoryTest {
  constructor(numBlocks, blockLength, correctResponses) {
    this.numBlocks = numBlocks;
    this.blockLength = blockLength;
    this.correctResponses = correctResponses;
    this.testTrials = [];
    this.choices = [correctResponses[0][1], correctResponses[1][1]];
    this.currentTrial = 0;
  }

  generateTestStimuli() {
    let testStimuliBlock = [{
      stimulus: '<div class="centerbox" style="display: flex; justify-content: center; align-items: center; height: 100vh;"><img src="face_stim/men_face_1.png" style="width: 33.33vw; height: auto;" /></div>',
      data: {
        stim_id: 1,
        trial_id: 'stim',
        exp_stage: 'test',
        correct_response: this.correctResponses[0][1]
      }
    }, {
      stimulus: '<div class="centzerbox" style="display: flex; justify-content: center; align-items: center; height: 100vh;"><img src="face_stim/women_face_1.png" style="width: 33.33vw; height: auto;" /></div>',
      data: {
        stim_id: 2,
        trial_id: 'stim',
        exp_stage: 'test',
        correct_response: this.correctResponses[1][1]
      }
    }];

    for (let b = 0; b < this.numBlocks; b++) {
      this.testTrials.push(jsPsych.randomization.repeat(testStimuliBlock, this.blockLength / 2));
    }
  }

  setupTestBlock() {
    let testBlocks = [];
    for (let b = 0; b < this.numBlocks; b++) {
        let testBlock = {
            type: 'poldrack-single-stim',
            timeline: this.testTrials[b], // Assume this.testTrials is correctly populated
            is_html: true,
            choices: this.choices,
            timing_response: 2000,
            timing_post_trial: post_trial_gap,
            on_finish: function(data) {
                appendData();
                let correct = data.key_press === data.correct_response;
                jsPsych.data.addDataToLastTrial({ correct: correct });
            }
        };
        testBlocks.push(testBlock);
    }
    return testBlocks;
}

setupStartTestBlock() {
    return {
        type: 'poldrack-text',
        timing_response: 60000,
        data: { exp_id: 'choice_reaction_time', trial_id: 'test_intro' },
        text: '<div class = centerbox><p class = block-text>We will now begin the test...</p></div>',
        cont_key: [13],
        timing_post_trial: 1000
    };
}

setupRestBlock() {
    return {
        type: 'poldrack-text',
        data: {
            trial_id: "rest"
        },
        timing_response: 180000,
        text: '<div class = centerbox><p class = center-block-text>Take a break! Press <strong>enter</strong> to continue.</p></div>',
        cont_key: [13],
        timing_post_trial: 1000
    };
}

setupAttentionNode() {
    return {
        timeline: [{
            type: 'attention-check',
            data: {
                trial_id: 'attention_check'
            },
            timing_response: 180000,
            response_ends_trial: true,
            timing_post_trial: 200
        }],
        conditional_function: function() {
            return run_attention_checks;
        }
    };
}
}