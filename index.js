const {
  getReferenceData,
  getLocalNodeData,
  findMode,
  calculateDelta,
  executeBashScript
} = require("./utils");

const {
  localNode, //
  referenceNodes,
  allowedHeightDelta,
  enableUpgrades
} = require("./config.json");

const main = async () => {
  console.log(`Starting script..\n`);

  if (!enableUpgrades) console.log("Skipping upgrades..\n");

  const { referenceHeights, referenceVersions } = await getReferenceData(referenceNodes);
  const networkHeightMode = findMode(referenceHeights);
  const versionMode = findMode(referenceVersions);

  console.log(
    `\nReference nodes consensus -- Network Height: ${networkHeightMode.toLocaleString()}, Version: ${versionMode}\n`
  );

  const { localNodeHeight, localNodeVersion } = await getLocalNodeData(localNode);

  console.log(
    `Local node network height is: ${
      localNodeHeight !== null ? localNodeHeight.toLocaleString() : "N/A (unreachable)"
    }`
  );

  console.log(
    `Local node version is: ${
      localNodeVersion !== null ? `${localNodeVersion}\n` : "N/A (unreachable)\n"
    }`
  );

  const heightDelta = calculateDelta(networkHeightMode, localNodeHeight);

  if (enableUpgrades && (!localNodeVersion || localNodeVersion !== versionMode)) {
    console.log(
      `Local node version ${localNodeVersion} does not match version consensus of ${versionMode}`
    );

    executeBashScript("upgrade");
  } else if (heightDelta > allowedHeightDelta) {
    console.log(
      `Network height delta of ${heightDelta} exceeds allowed value of ${allowedHeightDelta}`
    );

    executeBashScript("rebuild");
  } else {
    console.log(
      `${enableUpgrades ? "Network height and version" : "Network height"} OK ✓\nExiting now..`
    );

    process.exit(0);
  }
};

if (typeof module !== "undefined" && !module.parent) main();
