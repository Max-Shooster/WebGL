  'use strict';

  function gotKey (event) {
      
      var key = event.key;
      
      // Do something based on key press
      
      //  incremental rotation
      if (key == 'x') angles[0] -= angleInc;
      else if (key == 'y') angles[1] -= angleInc;
      else if (key == 'z') angles[2] -= angleInc;
      else if (key == 'X') angles[0] += angleInc;
      else if (key == 'Y') angles[1] += angleInc;
      else if (key == 'Z') angles[2] += angleInc;

      // reset to the orginal position
      else if (key == 'r' || key=='R') {
        angles[0] = anglesReset[0];
        angles[1] = anglesReset[1];
        angles[2] = anglesReset[2];
      }
      
      // create a new shape and do a redo a draw
      draw();
  }
  
