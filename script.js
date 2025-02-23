let currentUser = null;
let usageLog = [];
let users = [];

document.addEventListener('DOMContentLoaded', () => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
        users = JSON.parse(storedUsers);
    }
});

function showSignIn() {
    document.getElementById('sign-in-form').style.display = 'block';
    document.getElementById('sign-up-form').style.display = 'none';
}

function showSignUp() {
    document.getElementById('sign-in-form').style.display = 'none';
    document.getElementById('sign-up-form').style.display = 'block';
}

function signUp() {
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    const email = document.getElementById('signup-email').value;
    if (!username || !password || !email) {
        alert('Please fill all fields');
        return;
    }
    if (users.some(user => user.username === username)) {
        alert('Username already exists');
        return;
    }
    const newUser = {
        username,
        password,
        email,
        createdAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    console.log('Current users:', users);
    alert('Registration successful! Please sign in.');
    showSignIn();
    document.getElementById('signup-username').value = '';
    document.getElementById('signup-password').value = '';
    document.getElementById('signup-email').value = '';
}

function signIn() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        localStorage.setItem('username', username);
        localStorage.setItem('isLoggedIn', 'true');
        currentUser = username;
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('converter-section').style.display = 'block';
        document.getElementById('converter-section').classList.add('active');
        updateUserDetails();
        loadUsageLog();
    } else {
        alert('Invalid credentials');
    }
}
function logout() {
    localStorage.removeItem('username');
    localStorage.removeItem('isLoggedIn');
    currentUser = null;
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('converter-section').style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

window.onload = function() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        const username = localStorage.getItem('username');
        currentUser = username;
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('converter-section').style.display = 'block';
        updateUserDetails();
        loadUsageLog();
    }
};

function updateUserDetails() {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const day = days[now.getDay()];
    const date = now.toLocaleDateString();
    const userInfo = `
        <p><strong>User:</strong> ${currentUser}</p>
        <p><strong>Day:</strong> ${day}</p>
        <p><strong>Date:</strong> ${date}</p>
    `;
    document.getElementById('user-details').innerHTML = userInfo;
}

function convertBothTimes() {
    if (!currentUser) return;
    const takeoffIstTime = document.getElementById('takeoff-ist-time').value;
    const takeoffAmPm = document.getElementById('takeoff-am-pm').value;
    const takeoffUtc = convertISTtoUTC(takeoffIstTime, takeoffAmPm);
    const landingIstTime = document.getElementById('landing-ist-time').value;
    const landingAmPm = document.getElementById('landing-am-pm').value;
    const landingUtc = convertISTtoUTC(landingIstTime, landingAmPm);
    document.getElementById('converted-time').textContent = 
        `Takeoff: ${takeoffUtc} UTC | Landing: ${landingUtc} UTC`;
    const now = new Date();
    document.getElementById('conversion-timestamp').textContent = 
        `Converted by ${currentUser} on ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`;
    logUsage('Flight Time Conversion', takeoffUtc, landingUtc);
}

function logUsage(action, takeoffUtc, landingUtc) {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const day = days[now.getDay()];
    const traineeName = document.getElementById('trainee-name').value;
    const traineeUIN = document.getElementById('trainee-uin').value;
    const exercise = document.getElementById('exercise-select').value;
    
    const logEntry = {
        user: currentUser,
        traineeName: traineeName,
        traineeUIN: traineeUIN,
        exercise: exercise,
        action: action,
        takeoffTime: takeoffUtc,
        landingTime: landingUtc,
        day: day,
        date: now.toLocaleDateString(),
        timestamp: now.toLocaleString()
    };
    usageLog.push(logEntry);
    updateUsageDisplay();
}
function updateUsageDisplay() {
    const tableHeader = `
        <table class="history-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Trainer</th>
                    <th>Trainee Name</th>
                    <th>UIN Number</th>
                    <th>Exercise</th>
                    <th>Takeoff (UTC)</th>
                    <th>Landing (UTC)</th>
                    <th>Flight Duration</th>
                    <th>Cumulative Time</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;

    let totalMinutes = 0;
    const tableRows = usageLog
        .filter(entry => entry.user === currentUser)
        .map((entry, index) => {
            const duration = calculateTimeDifference(entry.takeoffTime, entry.landingTime);
            if (duration) {
                const [hours, minutes] = duration.split(':').map(Number);
                totalMinutes += hours * 60 + minutes;
            }
            const cumulativeHours = Math.floor(totalMinutes / 60);
            const cumulativeMinutes = totalMinutes % 60;
            const cumulativeTime = `${cumulativeHours.toString().padStart(2, '0')}:${cumulativeMinutes.toString().padStart(2, '0')}`;
            
            return `
                <tr class="history-row" data-index="${index}">
                    <td>${entry.date}</td>
                    <td>${entry.user}</td>
                    <td>${entry.traineeName || 'N/A'}</td>
                    <td>${entry.traineeUIN || 'N/A'}</td>
                    <td>${entry.exercise || 'N/A'}</td>
                    <td>${entry.takeoffTime || 'N/A'}</td>
                    <td>${entry.landingTime || 'N/A'}</td>
                    <td>${duration || 'N/A'}</td>
                    <td>${cumulativeTime}</td>
                    <td><button onclick="editEntry(${index})" class="edit-btn">Edit</button></td>
                </tr>
            `;
        })
        .join('');

    const tableFooter = `
            </tbody>
        </table>
    `;
    document.getElementById('usage-log').innerHTML = tableHeader + tableRows + tableFooter;
}
function convertISTtoUTC(istTime, amPm) {
    let [hours, minutes] = istTime.split(':');
    hours = parseInt(hours);
    if (amPm === 'PM' && hours !== 12) {
        hours += 12;
    }
    if (amPm === 'AM' && hours === 12) {
        hours = 0;
    }
    hours = hours - 5;
    minutes = parseInt(minutes) - 30;
    if (minutes < 0) {
        minutes += 60;
        hours -= 1;
    }
    if (hours < 0) {
        hours += 24;
    }
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function updateCurrentTime() {
    const now = new Date();
    const istOptions = { 
        timeZone: 'Asia/Kolkata',
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    document.getElementById('ist-display').textContent = now.toLocaleTimeString('en-US', istOptions);
    const utcOptions = {
        timeZone: 'UTC',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    document.getElementById('utc-display').textContent = now.toLocaleTimeString('en-US', utcOptions);
}

setInterval(updateCurrentTime, 1000);
updateCurrentTime();

function clearUsageHistory() {
    usageLog = usageLog.filter(entry => entry.user !== currentUser);
    updateUsageDisplay();
    
    // Clear all input fields
    document.getElementById('trainee-name').value = '';
    document.getElementById('trainee-uin').value = '';
    document.getElementById('exercise-select').value = '';
    document.getElementById('takeoff-ist-time').value = '';
    document.getElementById('landing-ist-time').value = '';
    document.getElementById('takeoff-am-pm').value = 'AM';
    document.getElementById('landing-am-pm').value = 'AM';
    
    // Clear conversion results
    document.getElementById('converted-time').textContent = '';
    document.getElementById('conversion-timestamp').textContent = '';
}
function loadUsageLog() {
    updateUsageDisplay();
}

function calculateTimeDifference(takeoff, landing) {
    if (!takeoff || !landing) return null;
    
    const [takeoffHours, takeoffMinutes] = takeoff.split(':').map(Number);
    const [landingHours, landingMinutes] = landing.split(':').map(Number);
    
    let diffHours = landingHours - takeoffHours;
    let diffMinutes = landingMinutes - takeoffMinutes;
    
    if (diffMinutes < 0) {
        diffMinutes += 60;
        diffHours -= 1;
    }
    
    if (diffHours < 0) {
        diffHours += 24;
    }
    
    // Format hours and minutes with leading zeros
    const formattedHours = diffHours.toString().padStart(2, '0');
    const formattedMinutes = diffMinutes.toString().padStart(2, '0');
    
    return `${formattedHours}:${formattedMinutes}`;
}
function downloadHistoryAsExcel() {
    let totalMinutes = 0;
    const data = usageLog
        .filter(entry => entry.user === currentUser)
        .map(entry => {
            const duration = calculateTimeDifference(entry.takeoffTime, entry.landingTime);
            if (duration) {
                const [hours, minutes] = duration.split(':').map(Number);
                totalMinutes += hours * 60 + minutes;
            }
            const cumulativeHours = Math.floor(totalMinutes / 60);
            const cumulativeMinutes = totalMinutes % 60;
            const cumulativeTime = `${cumulativeHours.toString().padStart(2, '0')}:${cumulativeMinutes.toString().padStart(2, '0')}`;
            
            return {
                User: entry.user,
                'Trainee Name': entry.traineeName || 'N/A',
                'UIN Number': entry.traineeUIN || 'N/A',
                'Takeoff (UTC)': entry.takeoffTime || 'N/A',
                'Landing (UTC)': entry.landingTime || 'N/A',
                'Flight Duration': duration || 'N/A',
                'Cumulative Time': cumulativeTime,
                Date: entry.date
            };
        });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Flight Log');
    
    const colWidths = [
        {wch: 15}, // User
        {wch: 20}, // Trainee Name
        {wch: 15}, // UIN
        {wch: 15}, // Takeoff
        {wch: 15}, // Landing
        {wch: 15}, // Duration
        {wch: 15}, // Cumulative Time
        {wch: 15}  // Date
    ];
    ws['!cols'] = colWidths;
    XLSX.writeFile(wb, `Flight_Log_${currentUser}.xlsx`);
}

document.addEventListener('DOMContentLoaded', () => {
    const downloadBtn = document.getElementById('downloadHistory');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadHistoryAsExcel);
    }
});

document.getElementById('enable-exercise').addEventListener('change', function() {
    const exerciseSelect = document.getElementById('exercise-select');
    exerciseSelect.disabled = !this.checked;
    
    if (!this.checked) {
        exerciseSelect.value = '';
        // Update history to show "Not Required" for exercise field only
        const historyEntries = document.querySelectorAll('.exercise-cell');
        historyEntries.forEach(entry => {
            if (!entry.dataset.originalValue) {
                entry.dataset.originalValue = entry.textContent;
            }
            entry.textContent = 'Not Required';
        });
    } else {
        // Restore original exercise values in history
        const historyEntries = document.querySelectorAll('.exercise-cell');
        historyEntries.forEach(entry => {
            if (entry.dataset.originalValue) {
                entry.textContent = entry.dataset.originalValue;
            }
        });
    }
});

function editEntry(index) {
    const entry = usageLog.find((e, i) => i === index && e.user === currentUser);
    if (!entry) return;

    // Populate form fields with entry data
    document.getElementById('trainee-name').value = entry.traineeName || '';
    document.getElementById('trainee-uin').value = entry.traineeUIN || '';
    document.getElementById('exercise-select').value = entry.exercise || '';

    // Parse takeoff time
    if (entry.takeoffTime) {
        const [takeoffHours, takeoffMinutes] = entry.takeoffTime.split(':');
        const takeoffHour = parseInt(takeoffHours);
        const istTakeoff = convertUTCtoIST(takeoffHour, parseInt(takeoffMinutes));
        document.getElementById('takeoff-ist-time').value = istTakeoff.time;
        document.getElementById('takeoff-am-pm').value = istTakeoff.ampm;
    }

    // Parse landing time
    if (entry.landingTime) {
        const [landingHours, landingMinutes] = entry.landingTime.split(':');
        const landingHour = parseInt(landingHours);
        const istLanding = convertUTCtoIST(landingHour, parseInt(landingMinutes));
        document.getElementById('landing-ist-time').value = istLanding.time;
        document.getElementById('landing-am-pm').value = istLanding.ampm;
    }

    // Remove the old entry
    usageLog = usageLog.filter((e, i) => !(i === index && e.user === currentUser));
    updateUsageDisplay();
}

function convertUTCtoIST(hours, minutes) {
    hours = hours + 5;
    minutes = minutes + 30;
    
    if (minutes >= 60) {
        minutes -= 60;
        hours += 1;
    }
    
    if (hours >= 24) {
        hours -= 24;
    }

    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;

    return {
        time: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
        ampm: ampm
    };
}
