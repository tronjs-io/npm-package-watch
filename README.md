
# npm-package-watch

##  Project Overview

`npm-package-watch` is a lightweight Node.js tool that monitors specific npm packages (e.g., `tronweb`, `tronbox`) for new releases and sends notifications via **Telegram Bot**.  

**Features:**

- Configurable package list stored in `config.json`  
- Automatically checks the latest npm versions and compares with previous records  
- Sends Telegram notifications when a new version is released  
- Supports GitHub Actions for scheduled hourly checks  
- Sends alerts for network errors or other script failures  

---

##  Installation

```bash
git clone https://github.com/tronjs-io/npm-package-watch.git
cd npm-package-watch
npm install
```

---

## Configuration

### `config.json`

Create a `config.json` file in the root directory (example already included):

```json
{
  "packages": ["tronweb", "tronbox"]
}
```

- `packages`: Array of npm packages to monitor

You can add more packages in the array.  

### Telegram Bot Setup

1. Create a Telegram Bot using [@BotFather](https://t.me/BotFather)  
2. Obtain the **Bot Token**  
3. Send a message to the bot to generate a `chat_id`  
4. Check the `chat_id` using:

```
https://api.telegram.org/bot<YourBotToken>/getUpdates
```

5. Add **Bot Token** and **chat_id** as GitHub Secrets:

| Secret Name            | Value                   |
|------------------------|------------------------|
| TELEGRAM_BOT_TOKEN     | Your Bot Token          |
| TELEGRAM_CHAT_ID       | Your chat ID            |

---

##  Usage

### Manual Run

```bash
node scripts/monitor-npm.js
```

- Reads the package list from `config.json`  
- Sends a Telegram notification if any package has a new version  
- Updates `tron_versions.json` to store the latest detected versions  

### GitHub Actions Scheduled Run

Workflow file: `.github/workflows/monitor-tron-npm.yml`

- Runs hourly (or manually via `workflow_dispatch`)  
- Checks the latest versions  
- Sends Telegram notifications on updates  
- Updates `tron_versions.json` and commits changes back to the repository  

Example schedule:

```yaml
on:
  schedule:
    - cron: "0 * * * *" # Every hour
  workflow_dispatch: # Manual trigger
```

---

##  Project Structure

```
.
├── .github/
│   └── workflows/
│       └── npm-monitor.yml   # GitHub Actions workflow
├── scripts/
│   └── npm-monitor.js             # Monitoring script
├── tron_versions.json             # Stores the last detected versions
├── config.json                    # Package monitoring configuration
└── package.json
```

---

##  Telegram Notification Example

New version detected:

```
🚀 Monitor tronweb & tronbox npm packages for new releases.

📦 tronweb updated: 5.3.0 → 5.4.0
📦 tronbox updated: 3.2.6 → 3.3.0
```

Network error or script failure:

```
⚠️ Failed to check tronweb: network error message
```

---

## Customization

- Add any npm package to monitor in `config.json -> packages`   
- Use GitHub Actions `workflow_dispatch` to trigger checks manually  

---

## License

MIT
