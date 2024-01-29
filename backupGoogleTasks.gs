function backupGoogleTasks() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  // Get all the task lists from Google Tasks
  var googleTaskLists = Tasks.Tasklists.list().items || [];

  // Create a map for quick lookup of task lists from Google Tasks
  var googleTaskListMap = googleTaskLists.reduce(function(map, taskList) {
    map[taskList.title] = taskList;
    return map;
  }, {});

  // Get all sheets from the spreadsheet
  var sheets = spreadsheet.getSheets();
  var sheetNames = new Set(sheets.map(function(sheet) { return sheet.getName(); }));

  // Loop through each task list from Google Tasks and create a sheet if it doesn't exist
  googleTaskLists.forEach(function(taskList) {
    var taskListName = taskList.title;

    // If a sheet for the task list doesn't exist, create it
    if (!sheetNames.has(taskListName)) {
      var newSheet = spreadsheet.insertSheet(taskListName);
      newSheet.appendRow(['Tasks', 'Status']);
      sheetNames.add(taskListName); // Add the new sheet name to the set
    }

    var sheet = spreadsheet.getSheetByName(taskListName);

    // Get the tasks from the current list
    var tasks = Tasks.Tasks.list(taskList.id).items || [];

    // Process each task
    tasks.forEach(function(task) {
      // Logic to process each task and append to the sheet
      var status = task.status === 'needsAction' ? 'Active' : 'Completed';
      
      // Check if the task is already in the sheet
      var taskExists = sheet.createTextFinder(task.title).matchEntireCell(true).findNext();
      if (!taskExists) {
        // Append new task
        sheet.appendRow([task.title, status]);
      } else {
        // Update existing task status
        var row = taskExists.getRow();
        sheet.getRange(row, 2).setValue(status); // Update status
      }
    });

    // Mark tasks as 'Deleted' if they are no longer in the task list
    var range = sheet.getDataRange();
    var sheetData = range.getValues();
    sheetData.forEach(function(row, index) {
      if (index === 0) return; // Skip header row
      var taskTitle = row[0];
      var taskInList = tasks.some(task => task.title === taskTitle);
      if (!taskInList && row[1] !== 'Deleted') {
        sheet.getRange(index + 1, 2).setValue('Deleted'); // Mark as 'Deleted'
      }
    });
  });

  // Hide sheets that don't have a corresponding task list in Google Tasks
  sheets.forEach(function(sheet) {
    if (sheet.getName() !== 'Sheet1' && !googleTaskListMap[sheet.getName()]) {
      sheet.hideSheet();
    }
  });

  Logger.log('Google Tasks backup completed at: ' + new Date());
}



function createDailyTrigger() {
  // First, delete existing triggers to avoid duplicates
  var existingTriggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < existingTriggers.length; i++) {
    if (existingTriggers[i].getHandlerFunction() === 'backupGoogleTasks') {
      ScriptApp.deleteTrigger(existingTriggers[i]);
    }
  }

  // Create a new daily trigger
  ScriptApp.newTrigger('backupGoogleTasks')
    .timeBased()
    .everyDays(1)
    .atHour(1) // You can set the hour (0-23) when the backup should run
    .create();
}

// Function to create menu items when the spreadsheet is opened
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  var menu = ui.createMenu('Back Up Google Tasks');

  // Main menu item to run backup immediately
  menu.addItem('Run Backup Now', 'backupGoogleTasks');

  // Submenu for setting the backup frequency
  var frequencyMenu = ui.createMenu('Set Backup Frequency');
  frequencyMenu.addItem('Hourly', 'setHourlyTrigger');
  frequencyMenu.addItem('Daily', 'setDailyTrigger');
  frequencyMenu.addItem('Weekly', 'setWeeklyTrigger');

  // Adding the submenu to the main menu
  menu.addSubMenu(frequencyMenu);
  menu.addToUi();
}

// Functions to set triggers for different frequencies
function setHourlyTrigger() {
  setBackupFrequency('hourly');
}

function setDailyTrigger() {
  setBackupFrequency('daily');
}

function setWeeklyTrigger() {
  setBackupFrequency('weekly');
}

// Function to set backup frequency
function setBackupFrequency(frequency) {
  // Clear existing backup triggers
  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function(trigger) {
    if (trigger.getHandlerFunction() === 'backupGoogleTasks') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  // Create a new trigger based on the selected frequency
  var triggerBuilder = ScriptApp.newTrigger('backupGoogleTasks').timeBased();
  
  if (frequency === 'hourly') {
    triggerBuilder.everyHours(1);
  } else if (frequency === 'daily') {
    triggerBuilder.everyDays(1);
  } else if (frequency === 'weekly') {
    triggerBuilder.everyWeeks(1).onWeekDay(ScriptApp.WeekDay.MONDAY);
  }
  
  triggerBuilder.create();
}



