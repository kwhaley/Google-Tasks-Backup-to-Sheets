# Google Tasks Backup to Sheets

Hey there! 👋 This is a neat little project that backs up your Google Tasks into a Google Sheet. Perfect for those who don't want to lose their tasks and lists, especially since Google Tasks doesn't have a recycle bin feature. 

## What's This All About?

This Google Apps Script automatically backs up your Google Tasks into a Google Sheet. It's a straightforward way to ensure that your tasks are safe, even if they accidentally get deleted from Google Tasks.

## Features

- **Automatic Backup:** Creates a separate sheet for each of your task lists in Google Tasks and backs up your tasks neatly.
- **Status Tracking:** Keeps track of tasks' statuses, identifying what's active or deleted.
- **Customizable Backup Frequency:** Choose how often you want to back up your tasks - hourly, daily, or weekly.

## Getting Started

1. **Open Google Sheets:** Start with a new Google Sheet for this adventure.
2. **Open the Script Editor:** In the Sheets menu, click on `Extensions > Apps Script`.
3. **Copy-Paste the Script:** Copy the script from this repo and paste it into the script editor.
4. **Run the Script:** Click on `Run > Run function > onOpen` to create the custom menu.
5. **Authorize the Script:** Follow the prompts to authorize the script if required.
6. **Access the Custom Menu:** In your Google Sheet, you will see a new menu 'Back Up Google Tasks'. 

## Using the Script

- **Run Backup Now:** Click this to immediately back up your Google Tasks.
- **Set Backup Frequency:** Hover over this option to set the frequency of automatic backups. Choose from hourly, daily, or weekly backups.

## Note

- Remember to enable the Google Tasks API from your Google Cloud Console for the script to work.
- This script runs within the Google environment, ensuring your data's privacy and security.

## Contributing

Feel free to fork this repo, tweak it, and submit improvements! Got an idea or suggestion? Open an issue and let's make this script even better.
