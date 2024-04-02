/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var run_attention_checks = false
var attention_check_thresh = 0.65
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds
var credit_var = true

// task specific variables
var num_blocks = 3
var block_len = 50
var practice_len = 20
var gap = 0
var current_trial = 0
  //set stim/response mapping
var correct_responses = jsPsych.randomization.shuffle([
  ['"F"', 70], 
  ['"J"', 74]  
  ])

var choices = [correct_responses[0][1], correct_responses[1][1]]

//set up face stim. correct_responses indexed by [block][stim][type]
var practice_stimuli = [{
  stimulus: '<div class="centerbox" style="display: flex; justify-content: center; align-items: center; height: 100vh;"><img src="face_stim/men_face_1.png" style="width: 33.33vw; height: auto;" /></div>',
  data: {
    stim_id: 1,
    trial_id: 'stim',
    exp_stage: 'practice'
  },
  key_answer: correct_responses[0][1]
}, {
  stimulus: '<div class="centerbox" style="display: flex; justify-content: center; align-items: center; height: 100vh;"><img src="face_stim/women_face_1.png" style="width: 33.33vw; height: auto;" /></div>',
  data: {
    stim_id: 2,
    trial_id: 'stim',
    exp_stage: 'practice'
  },
  key_answer: correct_responses[1][1]
}];

var test_stimuli_block = [{
  stimulus: '<div class="centerbox" style="display: flex; justify-content: center; align-items: center; height: 100vh;"><img src="face_stim/men_face_1.png" style="width: 33.33vw; height: auto;" /></div>',
  data: {
    stim_id: 1,
    trial_id: 'stim',
    exp_stage: 'test',
    correct_response: correct_responses[0][1]
  }
}, {
  stimulus: '<div class="centerbox" style="display: flex; justify-content: center; align-items: center; height: 100vh;"><img src="face_stim/women_face_1.png" style="width: 33.33vw; height: auto;" /></div>',
  data: {
    stim_id: 2,
    trial_id: 'stim',
    exp_stage: 'test',
    correct_response: correct_responses[1][1]
  }
}];



var practice_trials = jsPsych.randomization.repeat(practice_stimuli, practice_len/2);
var test_trials = []
for (var b = 0; b < num_blocks; b++) {
  test_trials.push(jsPsych.randomization.repeat(test_stimuli_block, block_len/2));
}

/* create experiment definition array */
var choice_reaction_time_experiment = [];
choice_reaction_time_experiment.push(instruction_node);
choice_reaction_time_experiment.push(practice_block);
choice_reaction_time_experiment.push(reset_block)

choice_reaction_time_experiment.push(start_test_block);
for (var b = 0; b < num_blocks; b++) {
  choice_reaction_time_experiment.push(test_blocks[b]);
  choice_reaction_time_experiment.push(rest_block);
}
choice_reaction_time_experiment.push(attention_node)
choice_reaction_time_experiment.push(post_task_block)
choice_reaction_time_experiment.push(end_block)