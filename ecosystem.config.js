module.exports = {
  apps : [{
    name: 'Covidstate API',
    script: 'index.js',
    instances: 1,
    autorestart: true,
    watch: false
  }]
};
