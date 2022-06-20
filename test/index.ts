import { expect } from "chai";
import { ethers } from "hardhat";

let contract :any = null;
const assetDone:any = {
  name: "Done",
  group: "Material Icons",
  category: "Action",
  parts:[{
      body: "M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z",
      mask: "", color: "black"
  }]
};
const assetSettings:any = {
  name: "Settings",
  group: "Material Icons",
  category: "Action",
  parts:[{
      body: "M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z",
      mask: "", color: "blue"
  }]
};
const assetAccount:any = {
  name: "Account Circle",
  group: "Material Icons 2",
  category: "Action",
  parts:[{
      body: "M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,6c1.93,0,3.5,1.57,3.5,3.5S13.93,13,12,13 s-3.5-1.57-3.5-3.5S10.07,6,12,6z M12,20c-2.03,0-4.43-0.82-6.14-2.88C7.55,15.8,9.68,15,12,15s4.45,0.8,6.14,2.12 C16.43,19.18,14.03,20,12,20z",
      mask: "", color: "red"
  }]
};
const assetHome:any = {
  name: "Home",
  group: "Material Icons 2",
  category: "Action 2",
  parts:[{
      body: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
      mask: "", color: "red"
  }]
};

before(async () => {
  const factory = await ethers.getContractFactory("AssetStore");    
  contract = await factory.deploy();
  await contract.deployed();
});

describe("Baisc", function () {
  let result;
  it("Done", async function () {
    await contract.registerAsset(assetDone);
    expect(await contract.getAssetCount()).equal(1);    
    expect(await contract.getGroupCount()).equal(1);    
    expect(await contract.getGroupNameAtIndex(0)).equal(assetDone.group);    
    expect(await contract.getCategoryCount(assetDone.group)).equal(1);    
    expect(await contract.getCategoryNameAtIndex(assetDone.group, 0)).equal(assetDone.category);   
    expect(await contract.getAssetCountInCategory(assetDone.group, assetDone.category)).equal(1);    
    expect(await contract.getAssetIdInCategory(assetDone.group, assetDone.category, 0)).equal(1);    
  });
  it("Settings", async function () {
    await contract.registerAsset(assetSettings);
    expect(await contract.getAssetCount()).equal(2);    
    expect(await contract.getGroupCount()).equal(1);    
    expect(await contract.getGroupNameAtIndex(0)).equal(assetSettings.group);    
    expect(await contract.getCategoryCount(assetSettings.group)).equal(1);    
    expect(await contract.getCategoryNameAtIndex(assetSettings.group, 0)).equal(assetSettings.category);    
    expect(await contract.getAssetCountInCategory(assetSettings.group, assetSettings.category)).equal(2);    
    expect(await contract.getAssetIdInCategory(assetSettings.group, assetSettings.category, 1)).equal(2);    
  });
  it("Account", async function () {
    await contract.registerAsset(assetAccount);
    expect(await contract.getAssetCount()).equal(3);    
    expect(await contract.getGroupCount()).equal(2);    
    expect(await contract.getGroupNameAtIndex(1)).equal(assetAccount.group);    
    expect(await contract.getCategoryCount(assetAccount.group)).equal(1);    
    expect(await contract.getCategoryNameAtIndex(assetAccount.group, 0)).equal(assetAccount.category);    
    expect(await contract.getAssetCountInCategory(assetAccount.group, assetAccount.category)).equal(1);    
    expect(await contract.getAssetIdInCategory(assetAccount.group, assetAccount.category, 0)).equal(3);    
  });
  it("Home", async function () {
    await contract.registerAsset(assetHome);
    expect(await contract.getAssetCount()).equal(4);    
    expect(await contract.getGroupCount()).equal(2);    
    expect(await contract.getCategoryCount(assetHome.group)).equal(2);    
    expect(await contract.getCategoryNameAtIndex(assetHome.group, 1)).equal(assetHome.category);    
    expect(await contract.getAssetCountInCategory(assetHome.group, assetHome.category)).equal(1);    
    expect(await contract.getAssetIdInCategory(assetHome.group, assetHome.category, 0)).equal(4);    
  });
});
