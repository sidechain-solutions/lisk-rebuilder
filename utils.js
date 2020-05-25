const axios = require("axios");
const { exec } = require("child_process");

const getReferenceData = async nodes => {
  const referenceHeights = [];
  const referenceVersions = [];

  for (let node of nodes) {
    const height = await getNodeHeight(node);
    referenceHeights.push(height);

    const version = await getNodeVersion(node);
    referenceVersions.push(version);

    console.log(
      `Data for node ${node} -- Height: ${
        height !== null ? height.toLocaleString() : "N/A"
      }, Version: ${version ? version : "N/A"}`
    );
  }

  return { referenceHeights, referenceVersions };
};

const getLocalNodeData = async localNode => {
  let attempts = 0;
  let nodeIsAlive = false;

  let localNodeHeight = null;
  let localNodeVersion = null;

  while (!nodeIsAlive && attempts < 5) {
    attempts += 1;
    localNodeHeight = await getNodeHeight(localNode);
    localNodeVersion = await getNodeVersion(localNode);
    nodeIsAlive = localNodeHeight && localNodeVersion ? true : false;
  }

  return { localNodeHeight, localNodeVersion };
};

const findMode = networkHeights => {
  let counted = networkHeights.reduce((acc, curr) => {
    if (curr in acc) {
      acc[curr]++;
    } else {
      acc[curr] = 1;
    }

    return acc;
  }, {});

  let mode = Object.keys(counted).reduce((a, b) => (counted[a] > counted[b] ? a : b));

  return mode;
};

const calculateDelta = (a, b) => Math.abs(a - b);

const getNodeHeight = node =>
  axios
    .get(`${node}/api/node/status`)
    .then(res => res.data.data.height)
    .catch(() => null);

const getNodeVersion = node =>
  axios
    .get(`${node}/api/node/constants`)
    .then(res => res.data.data.version)
    .catch(() => null);

const executeBashScript = type => {
  console.log(`Initiating ${type}.. (this can take up to 15 minutes)`);

  exec(`bash ${type === "rebuild" ? "rebuild.sh" : "upgrade.sh"}`, (error, stdout, stderr) => {
    if (error) {
      console.log(error.stack);
      console.log("\nError code: " + error.code);
      console.log("\nSignal received: " + error.signal);
    }

    console.log("\nScript STDOUT: " + stdout);
    console.log("\nScript STDERR: " + stderr);
  });
};

module.exports = {
  getReferenceData,
  getLocalNodeData,
  findMode,
  calculateDelta,
  executeBashScript
};
