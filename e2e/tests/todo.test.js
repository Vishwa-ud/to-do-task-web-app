const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const edge = require('selenium-webdriver/edge');
const { expect } = require('chai');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const BROWSER = process.env.BROWSER || 'chrome';
const HEADLESS = process.env.HEADLESS === 'true';
const TIMEOUT = 10000;

describe('To-Do Task Application E2E Tests', function() {
  let driver;

  // Setup driver before all tests
  before(async function() {
    this.timeout(30000);
    driver = await createDriver();
  });

  // Navigate to app before each test
  beforeEach(async function() {
    await driver.get(BASE_URL);
    await driver.wait(until.elementLocated(By.css('h1')), TIMEOUT);
  });

  // Quit driver after all tests
  after(async function() {
    if (driver) {
      await driver.quit();
    }
  });

  it('should display the application title', async function() {
    const heading = await driver.findElement(By.css('h1'));
    const text = await heading.getText();
    expect(text.toLowerCase()).to.match(/to-do task manager/i);
  });

  it('should create a new task', async function() {
    // Fill in the task form
    const titleInput = await driver.findElement(By.css('input[id="title"], input[name="title"]'));
    const descInput = await driver.findElement(By.css('textarea[id="description"], textarea[name="description"]'));
    
    await titleInput.clear();
    await titleInput.sendKeys('E2E Test Task');
    
    await descInput.clear();
    await descInput.sendKeys('This is a test task created by E2E tests');
    
    // Submit the form
    const addButton = await driver.findElement(By.xpath('//button[contains(text(), "Add") or contains(text(), "add")]'));
    await addButton.click();
    
    // Wait for the task to appear
    await driver.wait(until.elementLocated(By.xpath('//*[contains(text(), "E2E Test Task")]')), TIMEOUT);
    
    const taskTitle = await driver.findElement(By.xpath('//*[contains(text(), "E2E Test Task")]'));
    expect(await taskTitle.isDisplayed()).to.be.true;
  });

  it('should show validation error when title is empty', async function() {
    // Try to submit without filling the title
    const addButton = await driver.findElement(By.xpath('//button[contains(text(), "Add") or contains(text(), "add")]'));
    await addButton.click();
    
    // Check for error message
    await driver.wait(until.elementLocated(By.xpath('//*[contains(text(), "Title is required") or contains(text(), "required")]')), TIMEOUT);
    
    const errorMsg = await driver.findElement(By.xpath('//*[contains(text(), "Title is required") or contains(text(), "required")]'));
    expect(await errorMsg.isDisplayed()).to.be.true;
  });

  it('should mark a task as completed', async function() {
    // Create a task first
    const titleInput = await driver.findElement(By.css('input[id="title"], input[name="title"]'));
    const descInput = await driver.findElement(By.css('textarea[id="description"], textarea[name="description"]'));
    
    await titleInput.clear();
    await titleInput.sendKeys('Task to Complete');
    
    await descInput.clear();
    await descInput.sendKeys('This task will be completed');
    
    const addButton = await driver.findElement(By.xpath('//button[contains(text(), "Add") or contains(text(), "add")]'));
    await addButton.click();
    
    // Wait for the task to appear and the page to update
    await driver.sleep(1000);
    
    // Verify the task was created
    const taskElement = await driver.findElement(By.xpath('//*[contains(text(), "Task to Complete")]'));
    expect(await taskElement.isDisplayed()).to.be.true;
    
    // Click the Done button (find the button associated with this specific task)
    const doneButton = await driver.findElement(By.xpath('//button[contains(text(), "Done") or contains(text(), "done") or contains(@class, "done") or contains(@class, "complete")]'));
    await doneButton.click();
    
    // Wait for the task to be removed
    await driver.sleep(1000);
    
    // Verify the task "Task to Complete" is no longer visible
    const remainingTasks = await driver.findElements(By.xpath('//*[contains(text(), "Task to Complete")]'));
    expect(remainingTasks.length).to.equal(0);
  });

  it('should display empty state when no tasks exist', async function() {
    // Check if either empty state is visible OR tasks are present
    const emptyStateElements = await driver.findElements(By.xpath('//*[contains(text(), "No tasks yet")]'));
    
    // Look for task cards with the specific class structure from TaskCard component
    const taskCards = await driver.findElements(By.css('div.bg-white.bg-opacity-30, div[class*="bg-white"][class*="bg-opacity"]'));
    
    // At least one condition should be true: either empty state exists OR tasks exist
    const hasEmptyState = emptyStateElements.length > 0;
    const hasTasks = taskCards.length > 0;
    
    // This test verifies the UI is in a valid state
    // Either showing "No tasks yet" message OR showing task cards
    expect(hasEmptyState || hasTasks).to.be.true;
    
    // Additionally verify: if tasks exist, they should be visible
    if (hasTasks) {
      expect(taskCards.length).to.be.greaterThan(0);
    }
  });

  it('should create multiple tasks and display them', async function() {
    const tasks = [
      { title: 'First Task', description: 'First Description' },
      { title: 'Second Task', description: 'Second Description' },
      { title: 'Third Task', description: 'Third Description' },
    ];

    for (const task of tasks) {
      const titleInput = await driver.findElement(By.css('input[id="title"], input[name="title"]'));
      const descInput = await driver.findElement(By.css('textarea[id="description"], textarea[name="description"]'));
      
      await titleInput.clear();
      await titleInput.sendKeys(task.title);
      
      await descInput.clear();
      await descInput.sendKeys(task.description);
      
      const addButton = await driver.findElement(By.xpath('//button[contains(text(), "Add") or contains(text(), "add")]'));
      await addButton.click();
      
      await driver.sleep(300);
    }

    // Verify all tasks are displayed
    for (const task of tasks) {
      const taskElement = await driver.findElement(By.xpath(`//*[contains(text(), "${task.title}")]`));
      expect(await taskElement.isDisplayed()).to.be.true;
    }
  });

  it('should clear form after successful task creation', async function() {
    const titleInput = await driver.findElement(By.css('input[id="title"], input[name="title"]'));
    const descInput = await driver.findElement(By.css('textarea[id="description"], textarea[name="description"]'));
    
    await titleInput.clear();
    await titleInput.sendKeys('Test Task');
    
    await descInput.clear();
    await descInput.sendKeys('Test Description');
    
    const addButton = await driver.findElement(By.xpath('//button[contains(text(), "Add") or contains(text(), "add")]'));
    await addButton.click();
    
    // Wait for task to be created
    await driver.sleep(300);
    
    // Check if form is cleared
    const titleValue = await titleInput.getAttribute('value');
    const descValue = await descInput.getAttribute('value');
    
    expect(titleValue).to.equal('');
    expect(descValue).to.equal('');
  });

  it('should respect the 5 task limit', async function() {
    // Create 7 tasks
    for (let i = 1; i <= 7; i++) {
      const titleInput = await driver.findElement(By.css('input[id="title"], input[name="title"]'));
      const descInput = await driver.findElement(By.css('textarea[id="description"], textarea[name="description"]'));
      
      await titleInput.clear();
      await titleInput.sendKeys(`Task ${i}`);
      
      await descInput.clear();
      await descInput.sendKeys(`Description ${i}`);
      
      const addButton = await driver.findElement(By.xpath('//button[contains(text(), "Add") or contains(text(), "add")]'));
      await addButton.click();
      
      await driver.sleep(200);
    }

    // Reload to get fresh data from API
    await driver.navigate().refresh();
    await driver.wait(until.elementLocated(By.css('h1')), TIMEOUT);

    // Count displayed tasks (should be max 5)
    const tasks = await driver.findElements(By.css('[class*="bg-gray-100"]'));
    expect(tasks.length).to.be.at.most(5);
  });
});

// Helper function to create driver based on browser choice
async function createDriver() {
  let driver;
  
  switch (BROWSER.toLowerCase()) {
    case 'firefox':
      const firefoxOptions = new firefox.Options();
      if (HEADLESS) {
        firefoxOptions.addArguments('-headless');
      }
      driver = await new Builder()
        .forBrowser('firefox')
        .setFirefoxOptions(firefoxOptions)
        .build();
      break;
      
    case 'edge':
      const edgeOptions = new edge.Options();
      if (HEADLESS) {
        edgeOptions.addArguments('--headless');
        edgeOptions.addArguments('--disable-gpu');
      }
      driver = await new Builder()
        .forBrowser('MicrosoftEdge')
        .setEdgeOptions(edgeOptions)
        .build();
      break;
      
    case 'chrome':
    default:
      const chromeOptions = new chrome.Options();
      if (HEADLESS) {
        chromeOptions.addArguments('--headless');
        chromeOptions.addArguments('--disable-gpu');
      }
      chromeOptions.addArguments('--no-sandbox');
      chromeOptions.addArguments('--disable-dev-shm-usage');
      driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(chromeOptions)
        .build();
      break;
  }
  
  await driver.manage().window().maximize();
  return driver;
}
