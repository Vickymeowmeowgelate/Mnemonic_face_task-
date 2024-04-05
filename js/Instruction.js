/// This ensures that the subject does not read through the instructions too quickly.  If they do it too quickly, then we will go over the loop again.
// TODO: Change the instruction text 

class Instruction {
    constructor() {
      // Initialize any properties here, such as instruction texts or conditions
      this.feedbackInstructText = 'Welcome to the experiment. This task will take about 8 minutes. Press <strong>enter</strong> to begin.';
      this.instructions = [
        '<div class = centerbox><p class = block-text>In this experiment blue and orange squares will appear on the screen. You will be told to respond to one of the colored squares by pressing the "M" key and to the other by pressing the "Z" key. </p>' +
        '<p class = block-text>We will begin with practice. If you see the <font color="orange">orange</font> square you should press the <strong>' +
        '{correctResponse0}' +
        '</strong> key. If you see the <font color="blue">blue</font> square you should press the <strong>' +
        '{correctResponse1}' +
        '</strong> key.</p><p class = block-text>You should respond as quickly and accurately as possible. You will get feedback telling you if you were correct. </p></div>'
      ];
      this.sumInstructTime = 0; //ms
      this.instructTimeThresh = 0; //in seconds
    }
  
    getInstructFeedback() {
      return '<div class = centerbox><p class = center-block-text>' + this.feedbackInstructText +
        '</p></div>';
    }
  
    generateInstructionNode(correct_responses) {
      let feedbackBlock = {
        type: 'poldrack-text',
        cont_key: [13],
        data: {
          trial_id: 'instruction'
        },
        text: this.getInstructFeedback(),
        timing_post_trial: 0,
        timing_response: 180000
      };
  
      let instructionsBlock = {
        type: 'poldrack-instructions',
        pages: this.instructions.map(page => 
          page.replace('{correctResponse0}', correct_responses[0][0])
              .replace('{correctResponse1}', correct_responses[1][0])),
        allow_keys: false,
        data: {
          trial_id: 'instruction'
        },
        show_clickable_nav: true,
        timing_post_trial: 1000
      };
  
      return {
        timeline: [feedbackBlock, instructionsBlock],
        loop_function: data => this.checkInstructions(data)
      };
    }
  
    checkInstructions(data) {
      for (let i = 0; i < data.length; i++) {
        if ((data[i].trial_type == 'poldrack-instructions') && (data[i].rt != -1)) {
          let rt = data[i].rt;
          this.sumInstructTime += rt;
        }
      }
      if (this.sumInstructTime <= this.instructTimeThresh * 1000) {
        this.feedbackInstructText =
          'Read through instructions too quickly. Please take your time and make sure you understand the instructions. Press <strong>enter</strong> to continue.';
        return true; // Loop again
      } else if (this.sumInstructTime > this.instructTimeThresh * 1000) {
        this.feedbackInstructText =
          'Done with instructions. Press <strong>enter</strong> to continue.';
        return false; // Don't loop
      }
    }
  }
  