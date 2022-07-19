
const puppeteer = require('puppeteer-extra');
// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require("puppeteer-extra-plugin-stealth")();

// puppeteer usage as normal
const fs = require('fs-extra')
const chromepath = require("./chromepath.js");

const acc = require("./acc");


["chrome.runtime", "navigator.languages"].forEach(a =>
    StealthPlugin.enabledEvasions.delete(a)
);

puppeteer.use(StealthPlugin);

async function start() {
    try {


        console.log('Running tests..');

        const browser = await puppeteer.launch({
            //defaultViewport: null,
            // devtools: true,
            headless: false,
            executablePath: chromepath.chrome,
            args: [
                "--log-level=3", // fatal only

                "--no-default-browser-check",
                "--disable-infobars",
                "--disable-web-security",
                "--disable-site-isolation-trials",
                "--no-experiments",
                "--ignore-gpu-blacklist",
                "--ignore-certificate-errors",
                "--ignore-certificate-errors-spki-list",
                "--mute-audio",
                "--disable-extensions",
                "--no-sandbox",

                "--no-first-run",
                "--no-zygote"
            ],
            // unccoment ini jika ingin menggunakan save data

        //   userDataDir: acc.data[0].username,

        })
        const page = await browser.newPage();
        for (let i = 0; i < acc.data.length; i++) {
            const dirname = `${process.cwd()}/${acc.data[i].path}`
            const fileNames = await fs.readdir(dirname)
            // read text file
            const name = fs.readFileSync('./info.txt', 'utf8');
            await page.goto("https://accounts.google.com/signin/v2/identifier?service=youtube&hl=en-GB");

            try {
                let checklogin = await page.$('#yDmH0d > c-wiz > div > div:nth-child(2) > div > c-wiz > c-wiz > div > div.s7iwrf.gMPiLc.Kdcijb > div > div > header > h1');
                await page.evaluate(el => el.textContent, checklogin)
            } catch(e) {
                console.log("not logged in")
       
              
                await page.waitForSelector("#identifierId");
                await page.type("#identifierId", acc.data[i].username, { delay: 100 });
                await page.waitForTimeout(1000);
                await page.keyboard.press("Enter");
                await page.waitForTimeout(5000);
                await page.type("input", acc.data[i].password, { delay: 100 });
                await page.keyboard.press("Enter");
               try {
                 await page.$("#view_container > div > div > div.pwWryf.bxPAYd > div > div.WEQkZc > div > form > span > section > header > figure > div > img");
                    console.log("Veryfy Phone")
                    await page.waitForTimeout(10000);
               } catch (error) {
                
                console.log("Veryfy Phone")
               }

            }
            console.log("=========== Start Uploading ==============")
            const splitname = name.split(',');
            console.log(fileNames)
            if(await page.url().indexOf("/v2/challenge/")){
                console.log("Verify Phone")
            }
            await page.goto('https://www.youtube.com/')
          
            for (let i = 0; i < fileNames.length; i++) {
                let terpotong = splitname[i].split("|")
                try {

                    await page.goto("https://studio.youtube.com/",{
                        waitUntil: 'networkidle2'
                    })
                    const upload = await page.$x(`/html/body/ytcp-app/ytcp-entity-page/div/ytcp-header/header/div/ytcp-button/tp-yt-iron-icon`);
                    await upload[0].click();
                    const uploadvideo = await page.$x(`/html/body/ytcp-app/ytcp-entity-page/div/ytcp-header/header/div/ytcp-text-menu/tp-yt-paper-dialog/tp-yt-paper-listbox/tp-yt-paper-item[1]/ytcp-ve/div/div/yt-formatted-string` );
                    await uploadvideo[0].click();
                
                    // await  page.waitForTimeout(2000)
                    // await  page.evaluate(()=>{
                    //     document.querySelector("#upload-button").click();
                    // });
                    // await  page.waitForTimeout(3000);
                    await page.waitForSelector("input[name=Filedata]")
                    const elementHandle = await page.$("input[name=Filedata]");
                    await elementHandle.uploadFile(dirname + fileNames[i]);
                    await page.waitForTimeout(5000);
                    await page.evaluate(async () => {
                        function sleep(ms) {
                            return new Promise(resolve => setTimeout(resolve, ms));
                        }

                        while (!document.querySelector('#next-button')) {
                            await sleep(1000);
                        }
                        return true;

                    });
                    console.log(" UPLOADING " + fileNames[i])
                    await page.waitForTimeout(2000);
                    await page.type('#title-textarea > #container > #outer > #child-input > #container-content #textbox', terpotong[0]);
                    await page.waitForTimeout(2000);
                    await page.waitForSelector("#description-textarea > #container > #outer > #child-input > #container-content #textbox");
                    await page.type("#description-textarea > #container > #outer > #child-input > #container-content #textbox", terpotong[1]);
                    await page.waitForTimeout(2000);
                    await page.click("#toggle-button > .label");
                    await page.waitForTimeout(2000)
      
                
                    // // entertainment
                    await page.focus(`.ytcp-video-metadata-editor-advanced > #chip-bar #text-input`)
                    await page.type(`.ytcp-video-metadata-editor-advanced > #chip-bar #text-input`, terpotong[2].substring(0, 495) + ', ')
           
             
                    await page.waitForTimeout(2000);
                    // get text from progress label
                    // wait until 100%
                    let progress = await page.$x(`//*[@id="progress-label"]`);
                    while (progress[0].textContent.indexOf("100%") == -1) {
                        await page.waitForTimeout(1000);
                        progress = await page.$x(`//*[@id="progress-label"]`);
                    }
                    await page.waitForTimeout(2000);
                    
                    await page.waitForSelector("#checks-badge");
                    const nextbtn1 = await page.$x('/html/body/ytcp-uploads-dialog/tp-yt-paper-dialog/div/ytcp-animatable[2]/div/div[2]/ytcp-button[2]/div')
                    await nextbtn1[0].click()
                   
                    const nextbtn2 = await page.$x('/html/body/ytcp-uploads-dialog/tp-yt-paper-dialog/div/ytcp-animatable[2]/div/div[2]/ytcp-button[2]')
                    await nextbtn2[0].click()
        
                    const nextbtn3 = await page.$x('/html/body/ytcp-uploads-dialog/tp-yt-paper-dialog/div/ytcp-animatable[2]/div/div[2]/ytcp-button[2]')
                    await nextbtn3[0].click()
        
                   
                    await page.waitForSelector("#done-button",{
                        waitUntil: 'domcontentloaded'
                    })
                    const donebtn = await page.$x('/html/body/ytcp-uploads-dialog/tp-yt-paper-dialog/div/ytcp-animatable[2]/div/div[2]/ytcp-button[3]/div')
                    await donebtn[0].click()
                   
                } catch (error) {
                    console.log(error);
                }
            }
            await browser.close();
        }
    } catch (error) {

    }
}

start()
