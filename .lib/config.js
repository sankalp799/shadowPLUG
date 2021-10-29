let environments = {};

environments.staging = {
    title: 'shadowPLUG',
}

let selectedEnvironment = typeof(environments[process.env.SHADOW_PLUG_ENV]) == 'object' ? environments[process.env.SHADOW_PLUG_ENV] : environments.staging;

module.exports = selectedEnvironment;

