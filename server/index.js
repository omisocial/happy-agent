const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');
const { spawn } = require('child_process');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- GET SKILLS ---
app.get('/api/skills', (req, res) => {
    res.json(db.getSkills());
});

// --- GET PROFILES ---
app.get('/api/profiles', (req, res) => {
    res.json(db.getProfiles());
});

// --- DISPATCH JOB TO AI CLI ---
app.post('/api/jobs', (req, res) => {
    const { skill, profile } = req.body;
    
    // Exception mapping for tests
    if (!skill || !profile) {
        return res.status(400).json({ success: false, message: 'Missing skill or profile id' });
    }

    const jobId = `job_${Date.now()}`;
    const newJob = { skill, profile, status: 'running', logs: [] };
    
    db.addJob(newJob);

    res.json({ success: true, jobId, message: 'AI CLI Job dispatched successfully in background.' });

    // === THE MAGIC: Spawning the AI CLI ===
    console.log(`[Dispatcher] Spawning AI Agent for Skill: ${skill} on Profile: ${profile}`);
    
    // In a real scenario, this would be:
    // spawn('agent-browser', ['--script', `skills/${skill}.md`, '--profile', profile])
    // or spawn('claude', ['--task', 'Follow SOP...'])

    // For demonstration, we spawn a dummy Node process that just echoes output
    const aiProcess = spawn('node', ['-e', `
        let p = 0;
        setInterval(() => {
            p += 10;
            console.log("Navigating... " + p + "%");
            if(p >= 100) { console.log("Done"); process.exit(0); }
        }, 1000);
    `]);

    aiProcess.stdout.on('data', (d) => {
        const text = d.toString().trim();
        console.log(`[CLI-${profile}] ${text}`);
        // Here we would push this clean text via WebSockets to the UI
    });

    aiProcess.stderr.on('data', (d) => {
        console.error(`[CLI-${profile} ERR] ${d.toString().trim()}`);
    });

    aiProcess.on('close', (code) => {
        console.log(`[Dispatcher] CLI process exited with code ${code}`);
        // To strictly update the job state, we would need an updateJob function in db.js
        // For demonstration, we simply log the event.
    });
});

if (require.main === module) {
    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`✅ CodyMaster Server is running on http://localhost:${PORT}`);
        console.log(`👉 Dispatcher ready to route tasks to AI Local CLIs.`);
    });
}

module.exports = app;
