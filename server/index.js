const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');
const { spawn } = require('child_process');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- GET SKILLS ---
app.get('/api/skills', async (req, res) => {
    const data = await db.read();
    res.json(data.skills);
});

// --- GET PROFILES ---
app.get('/api/profiles', async (req, res) => {
    const data = await db.read();
    res.json(data.profiles);
});

// --- DISPATCH JOB TO AI CLI ---
app.post('/api/jobs', async (req, res) => {
    const { skill, profile } = req.body;
    const data = await db.read();

    const jobId = `job_${Date.now()}`;
    const newJob = { id: jobId, skill, profile, status: 'running', logs: [] };
    data.jobs.push(newJob);
    await db.write(data);

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

    aiProcess.on('close', async (code) => {
        console.log(`[Dispatcher] CLI process exited with code ${code}`);
        const currentData = await db.read();
        const j = currentData.jobs.find(x => x.id === jobId);
        if (j) {
            j.status = code === 0 ? 'completed' : 'error';
            await db.write(currentData);
        }
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ CodyMaster Server is running on http://localhost:${PORT}`);
    console.log(`👉 Dispatcher ready to route tasks to AI Local CLIs.`);
});
