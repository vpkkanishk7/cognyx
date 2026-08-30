const fs = require('fs');
let code = fs.readFileSync('backend/routes/assessment.js', 'utf8');

const regex = /payload\.orientation = session\.userAnswers\.ORIENTATION \|\| \"Not answered\";[\s\S]*?payload\.change_concern = session\.userAnswers\.CHANGE_CONCERN \|\| \"Not answered\";/;

const replacement =     payload.comfort = session.userAnswers.COMFORT || "Not answered";
    payload.age = session.userAnswers.AGE || "Not answered";
    payload.orientation = session.userAnswers.ORIENTATION || "Not answered";
    payload.social_context = session.userAnswers.SOCIAL || "Not answered";
    payload.daily_routine = session.userAnswers.DAILY_ROUTINE || "Not answered";
    payload.activity_engagement = session.userAnswers.ACTIVITY || "Not answered";
    payload.memory_strategy = session.userAnswers.MEMORY_STRATEGY || "Not answered";
    payload.functional_executive = session.userAnswers.FUNCTIONAL || "Not answered";
    payload.open_observation = session.userAnswers.OPEN_OBSERVATION || "Not answered";;

if (regex.test(code)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('backend/routes/assessment.js', code);
    console.log('Updated assessment.js concepts mapping');
} else {
    console.log('Regex did not match');
}
