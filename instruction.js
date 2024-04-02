var getInstructFeedback = function() {
  return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
    '</p></div>'
}

var feedback_instruct_text =
  'Welcome to the experiment. This task will take about 8 minutes. Press <strong>enter</strong> to begin.'
var feedback_instruct_block = {
  type: 'poldrack-text',
  cont_key: [13],
  data: {
    trial_id: 'instruction'
  },
  text: getInstructFeedback,
  timing_post_trial: 0,
  timing_response: 180000
};

/// This ensures that the subject does not read through the instructions too quickly.  If they do it too quickly, then we will go over the loop again.
// TODO: Change the instruction text
var instructions_block = {
    type: 'poldrack-instructions',
    pages: [
      '<div class = centerbox><p class = block-text>In this experiment images of faces will appear on the screen. You will be told to respond to faces of females by pressing the "F" key and to faces of males by pressing the "J" key. </p>' +
      '<p class = block-text>We will begin with practice. If you see the <font color="orange">orange</font> square you should press the <strong>' +
      correct_responses[0][0] +
      '</strong> key. If you see the <font color="blue">blue</font> square you should press the <strong>' +
      correct_responses[1][0] +
      '</strong> key.</p><p class = block-text>You should respond as quickly and accurately as possible. You will get feedback telling you if you were correct. </p></div>'
    ],
    allow_keys: false,
    data: {
      trial_id: 'instruction'
    },
    show_clickable_nav: true,
    timing_post_trial: 1000
  };
  
var instruction_node = {
    timeline: [feedback_instruct_block, instructions_block],
    /* This function defines stopping criteria */
    loop_function: function(data) {
      for (i = 0; i < data.length; i++) {
        if ((data[i].trial_type == 'poldrack-instructions') && (data[i].rt != -1)) {
          rt = data[i].rt
          sumInstructTime = sumInstructTime + rt
        }
      }
      if (sumInstructTime <= instructTimeThresh * 1000) {
        feedback_instruct_text =
          'Read through instructions too quickly.  Please take your time and make sure you understand the instructions.  Press <strong>enter</strong> to continue.'
        return true
      } else if (sumInstructTime > instructTimeThresh * 1000) {
        feedback_instruct_text =
          'Done with instructions. Press <strong>enter</strong> to continue.'
        return false
      }
    }
}
  
var end_block = {
    type: 'poldrack-text',
    timing_response: 180000,
    data: {
      trial_id: 'end',
      exp_id: 'choice_reaction_time'
    },
    text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
    cont_key: [13],
    timing_post_trial: 0,
    on_finish: assessPerformance
};
  
var rest_block = {
    type: 'poldrack-text',
    data: {
      trial_id: "rest"
    },
    timing_response: 180000,
    text: '<div class = centerbox><p class = center-block-text>Take a break! Press <strong>enter</strong> to continue.</p></div>',
    cont_key: [13],
    timing_post_trial: 1000
};
  
var reset_block = {
    type: 'call-function',
    data: {
      trial_id: 'reset trial'
    },
    func: function() {
      current_trial = 0
    },
    timing_post_trial: 0
}
  
var start_practice_block = {
    type: 'poldrack-text',
    timing_response: 60000,
    data: {exp_id: 'choice_reaction_time', trial_id: 'practice_intro'},
    text: '<div class = centerbox><p class = block-text>We will begin with practice. If you see the <font color="orange">orange</font> square you should press the <strong>' + correct_responses[0][0] + '</strong> key. If you see the <font color="blue">blue</font> square you should press the <strong>' + correct_responses[1][0] + '</strong> key.</p><p class = block-text>You will receive feedback telling you if you were correct. Press <strong>enter</strong> to begin.</p></div>',
    cont_key: [13],
    timing_post_trial: 1000
};
  
var start_test_block = {
    type: 'poldrack-text',
    timing_response: 60000,
    data: {exp_id: 'choice_reaction_time', trial_id: 'test_intro'},
    text: '<div class = centerbox><p class = block-text>We will now begin the test. You will no longer receive feedback about your responses.</p><p class = block-text>If you see the <font color="orange">orange</font> square you should press the <strong>' + correct_responses[0][0] + '</strong> key. If you see the <font color="blue">blue</font> square you should press the <strong>' + correct_responses[1][0] + '</strong> key. There will be two breaks. Press <strong>enter</strong> to begin.</p></div>',
    cont_key: [13],
    timing_post_trial: 1000
};
  
  
/* define practice block */
var practice_block = {
    type: 'poldrack-categorize',
    timeline: practice_trials,
    is_html: true,
    data: {
      trial_id: 'stim',
      exp_stage: 'practice'
    },
    correct_text: '<div class = centerbox><div style="color:green"; class = center-text>Correct!</div></div>',
    incorrect_text: '<div class = centerbox><div style="color:red"; class = center-text>Incorrect</div></div>',
    timeout_message: '<div class = centerbox><div class = center-text>Respond Faster!</div></div>',
    choices: choices,
    timing_response: 2000,
    timing_stim: 2000,
    timing_feedback_duration: 1000,
    show_stim_with_feedback: false,
    timing_post_trial: post_trial_gap,
    on_finish: appendData
}
  
/* define test block */
  
var test_blocks = []
for (var b = 0; b < num_blocks; b++) {
      var test_block = {
        type: 'poldrack-single-stim',
        timeline: test_trials[b],
        is_html: true,
        data: {
          trial_id: 'stim',
          exp_stage: 'test'
        },
        choices: choices,
        timing_response: 2000,
        timing_post_trial: post_trial_gap,
        on_finish: function(data) {
          appendData()
          correct = false
          if (data.key_press === data.correct_response) {
            correct = true
          }
          jsPsych.data.addDataToLastTrial({correct: correct})
        }
      };
      test_blocks.push(test_block)
}