# IP Calculator Extension

A clean, modern browser extension for calculating IPv4 and IPv6 subnet details. Built for network engineers, developers, and students who need quick and accurate IP calculations properly styled for your browser.

<a href="https://chromewebstore.google.com/detail/ip-calculator/nmkflmaamikcjacnllcflhjhbnpbklom">
  <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" width="24" height="24" /> 
  Download for Chrome 
</a>

<br>

<a href="https://addons.mozilla.org/en-US/firefox/addon/ip-calc/">
  <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" width="24" height="24" /> 
  Download for Firefox
</a>


## Features

- **Dual Mode Support**: Seamlessly switch between **IPv4** and **IPv6** calculations.
- **Detailed Output**:
  - **IPv4**: Netmask, Wildcard, Network Address, Broadcast Address, Host Range (Min/Max), and Total Usable Hosts.
  - **IPv6**: Compressed & Expanded Address, Network Prefix, Prefix Length, Total Hosts, and full Range (Start/End).
- **Smart Inputs**:
  - Split fields for IP Address and CIDR for clarity.
  - Interactive validation.
- **Productivity Focused**:
  - **Click-to-Copy**: Click any result field to instantly copy the value to your clipboard.
  - **Visual Feedback**: Green flash confirmation on copy.
  - **Clean UI**: Modern, segmented control layout with a focus on readability.

## Installation

This extension is built to be loaded as an "unpacked" extension in Chromium-based browsers (Chrome, Edge, Brave, Opera).

1.  **Clone or Download** this repository to your local machine.
2.  Open your browser and navigate to the extensions management page:
    *   **Chrome/Brave**: `chrome://extensions`
    *   **Edge**: `edge://extensions`
3.  Enable **Developer Mode** (usually a toggle in the top-right corner).
4.  Click **Load unpacked**.
5.  Select the directory where you cloned/downloaded this project.
6.  The **IP Calculator** icon should appear in your toolbar.

## Usage

1.  Click the extension icon to open the popup.
2.  Select **IPv4** or **IPv6** using the toggle at the top.
3.  Enter an IP Address (e.g., `192.168.1.1` or `2001:db8::1`) and a CIDR suffix (e.g., `24` or `64`).
4.  The results will calculate automatically as you type.
5.  **Click** on any result field (like Netmask or Network) to copy it to your clipboard.

## Technologies

- HTML5 & CSS3 (CSS Variables, Flexbox, Grid)
- Vanilla JavaScript (ES6+)

