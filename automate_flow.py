import os

path = r'd:\VS CODE\EVOL\COGNYX\frontend\script.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace PHASE_MEMORY_REG manual click with an automated timer
replacement_case = '''      case "PHASE_MEMORY_REG":
        switchView(Views.chat, Views.memoryReg);
        State.biomarkers.registrationStartedAt = performance.now();
        document.getElementById("memory-reg-next-btn").style.display = "none";
        setTimeout(() => {
            State.biomarkers.registrationCompletedAt = performance.now();
            AssessmentController.nextPhase();
        }, 5000);
        break;'''
content = content.replace('''      case "PHASE_MEMORY_REG":
        switchView(Views.chat, Views.memoryReg);
        State.biomarkers.registrationStartedAt = performance.now();
        break;''', replacement_case)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated script.js test automation')
