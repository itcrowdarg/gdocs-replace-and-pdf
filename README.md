# How to run this project

You need to set up a Google Cloud service account to run this, as the code will be interacting with resources in Google Drive.

After that, you need to create your template file & give the service account access to it.

## Creating the service account

You should refer to the [Get Started](https://developers.google.com/workspace/guides/get-started) guide by Google, but here's a quick summary of the steps below:
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project if you haven't got one.
3. Open the left drawer, go to the bottom and expand **More Products** > hover over **Google Workspace** and choose **Product library**.
4. Browse for **Google Drive** and enable it. Repeat 3 & 4 for **Google Docs API**.
5. Now open the left Drawer in the Google Cloud Console and go to **APIs & Services** > **Credentials**.
6. Choose to **Create credentials** > **Service Account**.
7. Follow the steps to create the service account. It doesn't need accessto project, and leave the 3rd step (which is optional) blank.
8. Now you'll see you have the service account, so click on it, go to the **Keys** tab > **Add Key** > **Create New Key** > **JSON**.
9. The downloaded file should now be placed in this project and renamed to `secrets.json`.
10. Copy the `.env.example` file and name it `.env`.

## Sharing resources with the service account

Your credentials file (the json file) will contain a `client_email` property. You should create a drive folder and share it with that email. You should also create a template file and move it to that folder, so that the service account has access to these resources. For reference, [this](https://docs.google.com/document/d/1fveIbEjAxoESW8wK00-2tAaB9XuYqo9q2YqCnUt4bTY/edit) is the template we used in this project.

## Run the project

Now you can `npm i` & `node index.js` and test this script!
