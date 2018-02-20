// Setup your quiz text and questions here

var quizJSON = {
  "info": {
    "name":    "How much do you know about your back?",
    "main":    "<p>You probably take your back for granted—until it starts to hurt. Think about it—your back is a part of your body that's in nearly constant use. Whether you're sitting, standing, or moving, your back and its muscles are providing support all day, every day. Test your knowledge of the back by taking this quiz.</p>",
    "results": "<p>Are you a quiz wiz? Test your health knowledge with our <a href='http://healthlibrary.uwmedicine.org/InteractiveTools/Quizzes/'>other quizzes.</a></p>"
  },
  "questions": [
    { // Question 1
      "q": "How many bones are in your spine?",
      "a": [
        {"option": "A. 33",      "correct": true},
        {"option": "B. 50",     "correct": false},
        {"option": "C. 60",      "correct": false},
        {"option": "D. 70",     "correct": false} // no comma here
      ],
      "correct": "<p>Correct! There are 33 bones are in the spinal column, from the skull to the tailbone.</p>",
      "incorrect": "<p>Incorrect. There are 33 bones are in the spinal column, from the skull to the tailbone.</p>" // no comma here
    },
    { // Question 2
      "q": "What position is best for your back when you sleep?",
      "a": [
        {"option": "A. On your back",               "correct": false},
        {"option": "B. On your stomach",   "correct": false},
        {"option": "C. On one side",               "correct": false},
        {"option": "D. On one side with the knees flexed toward the chest", "correct": true} // no comma here
      ],
      "correct": "<p>Correct! The best position for sleeping is on one side with the knees flexed toward the chest.</p>",
      "incorrect": "<p>Incorrect. The best position for sleeping is on one side with the knees flexed toward the chest.</p>" // no comma here
    },
    { // Question 3
      "q": "Which of these sports can cause dangerous back injuries?",
      "a": [
        {"option": "A. Soccer",           "correct": false},
        {"option": "B. Volleyball",                  "correct": false},
        {"option": "C. Racquetball",  "correct": false},
        {"option": "D. All of the above",          "correct": true} // no comma here
      ],
      "correct": "<p>Correct! Rough contact, twisting, and sudden movements in these sports can cause back injury.</p>",
      "incorrect": "<p>Incorrect. The correct answer is All of the above. Rough contact, twisting, and sudden movements in these sports can cause back injury.</p>" // no comma here
    },
    { // Question 4
      "q": "How many Americans will suffer back pain at some time in their lives?",
      "a": [
        {"option": "A. 2 out of 5",    "correct": false},
        {"option": "B. 1 out of 2",     "correct": false},
        {"option": "C. 1 out of 3",      "correct": false},
        {"option": "D. 4 out of 5",   "correct": true} // no comma here
      ],
      "correct": "<p>Correct! Back pain is a frequent cause of short-term disability in people under age 45. Low back pain is the fifth leading reason that people visit their doctor.</p>",
      "incorrect": "<p>Incorrect. The correct answer is 4 out of 5. Back pain is a frequent cause of short-term disability in people under age 45. Low back pain is the fifth leading reason that people visit their doctor. </p>" // no comma here
    },
    { // Question 5
      "q": "What is the average recovery time for low-back pain?",
      "a": [
        {"option": "A. 2 weeks",    "correct": false},
        {"option": "B. 1 month",     "correct": true},
        {"option": "C. 3 months",     "correct": false},
        {"option": "D. Indefinite period",     "correct": false}
      ],
      "correct": "<p>Correct! The average is 1 month, but it can take up to 6 weeks.</p>",
      "incorrect": "<p>Incorrect. The average is 1 month, but it can take up to 6 weeks.\n</p>" // no comma here
    },
    { // Question 6
      "q": "Disks cushion vertebrae in the back. What are they made of?",
      "a": [
        {"option": "A. Bone",    "correct": false},
        {"option": "B. Tendon",     "correct": false},
        {"option": "C. Cartilage",      "correct": true},
        {"option": "D. Muscle",   "correct": false} // no comma here
      ],
      "correct": "<p>Correct! Ligaments encase the disk.</p>",
      "incorrect": "<p>Incorrect. The correct answer is Cartilage. Ligaments encase the disk.</p>" // no comma here
    },
    { // Question 7
      "q": "Which of these is a significant risk factor for backache?",
      "a": [
        {"option": "A. Being underweight",    "correct": false},
        {"option": "B. Being overweight",     "correct": true},
        {"option": "C. Being tall",      "correct": false},
        {"option": "D. Being short",   "correct": false} // no comma here
      ],
      "correct": "<p>Correct! Extra pounds strain muscles and joints.</p>",
      "incorrect": "<p>Incorrect. The correct answer is Being overweight. Extra pounds strain muscles and joints.</p>" // no comma here
    },
    { // Question 8
      "q": "Which of these measures will help a backache?",
      "a": [
        {"option": "A. Several days of bed rest",    "correct": false},
        {"option": "B. Massage",     "correct": false},
        {"option": "C. Ice pack",      "correct": false},
        {"option": "D. B and C",   "correct": true} // no comma here
      ],
      "correct": "<p>Correct! Apply ice or a cold pack the first 48 hours, then treat with heat. A massage by a certified massage therapist can help release tension and ease soreness. Staying in bed for long periods of time can make a backache worse because your muscles become stiff.</p>",
      "incorrect": "<p>Incorrect. The correct answer is B and C. Apply ice or a cold pack the first 48 hours, then treat with heat. A massage by a certified massage therapist can help release tension and ease soreness. Staying in bed for long periods of time can make a backache worse because your muscles become stiff.</p>" // no comma here
    },
    { // Question 9
      "q": "How should you lift a heavy object?",
      "a": [
        {"option": "A. Bend from the waist",    "correct": false},
        {"option": "B. Squat, then lift",     "correct": true},
        {"option": "C. Twist to set the object down",      "correct": false},
        {"option": "D. Lock your knees",   "correct": false} // no comma here
      ],
      "correct": "<p>Correct! Keep the back straight and use your knees to lift.</p>",
      "incorrect": "<p>Incorrect. The correct answer is Squat, then lift. Keep the back straight and use your knees to lift.</p>" // no comma here
    },
    { // Question 10
      "q": "What are the warning signs of a herniated disk?",
      "a": [
        {"option": "A. Pain",    "correct": false},
        {"option": "B. Numbness",     "correct": false},
        {"option": "C. Shooting back pain when you cough",      "correct": false},
        {"option": "D. All of the above",   "correct": true} // no comma here
      ],
      "correct": "<p>Correct! A herniated disk puts pressure on nerves resulting in pain. Herniated disks are most likely to occur in the lower back.</p>",
      "incorrect": "<p>Incorrect. The correct answer is All of the above. A herniated disk puts pressure on nerves resulting in pain. Herniated disks are most likely to occur in the lower back.</p>" // no comma here
    }
  ]
};
