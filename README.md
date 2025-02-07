# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Introduction

This SPA is the second version of the Mermaid Dashboard.

# Installation

1. Clone this repo onto your local machine
2. Navigate into the directory on your local machine where you cloned the repo to
3. Create a `.env` file in the main directory and populate it with the environment variables found in `.env.sample`
4. Install dependencies with `yarn install`
5. Start the app locally with `yarn dev`
6. Navigate to `localhost:3030` to view the app

# Mobile Testing

## Approach 1

1. Run the dev server with the `--host` flag. `Yarn dev --host`.
2. Open the site on your mobile device using the network address for the app printed in the dev server console. Make sure you are using https.
3. Proceed past the warning about untrusted certificates to view the app

## Approach 2

1. Download Termius on your mobile (scroll down for download link for iOS) https://termius.com/download/android
2. Open Termius on your phone. You don't need to create an account for the app to work
3. Create a new host

- Label: whatever you want to call it
- IP or Hostname: your computer's IP. Example: 192.168.x.xx. You can also find this by starting the development server with `yarn dev --host` and looking at the network
- Port: leave as default 22
- Username: the name of your computer. If you are unsure you can open up a new terminal and typing `whoami`
- Password: the password to sign into your computer

4. Save the new host
5. Create a new port forwarding rule

- Select local forwarding
- Local port: 3030
- Bind address (optional): localhost
- Intermediate host: select the host created above
- Destination address: localhost
- Destination port number: 3030
- Set the label: whatever you want to call it

6. Click done to finish creating the new port forwarding rule
7. Start the newly created host and port forwarding rule
8. Start this app on your computer with `yarn dev`
9. Open up the browser on your phone and navigate to `localhost:3030` and you will see this dashboard app
