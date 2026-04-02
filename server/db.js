const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');

const adapter = new FileSync(path.join(__dirname, 'db.json'));
const db = low(adapter);

// Set some defaults
db.defaults({ skills: [], profiles: [], jobs: [] }).write();

// Provide mocked existing data just for UI testing in the beginning
if (db.get('skills').value().length === 0) {
  db.get('skills')
    .push({ id: 's1', name: 'TikTok Creator Invite', successRate: 98, status: 'Active', createdAt: new Date().toISOString() })
    .push({ id: 's2', name: 'Shopee Competitor Scraper', successRate: 85, status: 'Active', createdAt: new Date().toISOString() })
    .write();
    
  db.get('profiles')
    .push({ id: 'p1', name: 'shop_1', enabled: true })
    .push({ id: 'p2', name: 'shop_2', enabled: true })
    .push({ id: 'p3', name: 'personal_account', enabled: false })
    .write();
}

const getSkills = () => db.get('skills').value();
const addSkill = (skill) => {
  const newObj = { id: `s_${Date.now()}`, ...skill };
  db.get('skills').push(newObj).write();
  return newObj;
};

const getProfiles = () => db.get('profiles').value();

const getJobs = () => db.get('jobs').value();
const addJob = (job) => {
  const newObj = { id: `j_${Date.now()}`, ...job };
  db.get('jobs').push(newObj).write();
  return newObj;
};

module.exports = {
  getSkills,
  addSkill,
  getProfiles,
  getJobs,
  addJob
};
