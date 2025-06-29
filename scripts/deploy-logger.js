// scripts/deploy-logger.js
import pkg from "hardhat";
import fs from "fs";

const { ethers } = pkg;

async function main() {
  const Logger = await ethers.getContractFactory("Logger");
  const logger = await Logger.deploy();
  await logger.waitForDeployment();

  const address = logger.target;
  console.log("✅ Logger deployed to:", address);

  fs.writeFileSync("deployed.json", JSON.stringify({ address }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
