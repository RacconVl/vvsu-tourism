#!/bin/bash
# install-watcher.sh
# Run once on WSL2 to install auto-deploy.sh as a systemd user service.
# After installation the service starts automatically on WSL2 boot.

set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
SERVICE_NAME="vvsu-deploy-watcher"
SERVICE_FILE="$HOME/.config/systemd/user/${SERVICE_NAME}.service"

echo "=== VVSU Auto-Deploy Watcher Installer ==="
echo "Repo: $REPO_DIR"
echo ""

# Make auto-deploy.sh executable
chmod +x "$REPO_DIR/auto-deploy.sh"

# Create systemd user service directory
mkdir -p "$HOME/.config/systemd/user"

# Write service unit
cat > "$SERVICE_FILE" <<EOF
[Unit]
Description=VVSU Tourism Auto-Deploy Watcher
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
WorkingDirectory=${REPO_DIR}
ExecStart=/bin/bash ${REPO_DIR}/auto-deploy.sh
Restart=on-failure
RestartSec=10s
StandardOutput=journal
StandardError=journal
Environment=DEPLOY_POLL_INTERVAL=60

[Install]
WantedBy=default.target
EOF

echo "✅ Service file written: $SERVICE_FILE"

# Enable lingering so user services start without login
loginctl enable-linger "$USER" 2>/dev/null || true

# Reload systemd and enable/start the service
systemctl --user daemon-reload
systemctl --user enable "$SERVICE_NAME"
systemctl --user restart "$SERVICE_NAME"

echo ""
echo "✅ Service installed and started!"
echo ""
echo "Useful commands:"
echo "  systemctl --user status $SERVICE_NAME    # check status"
echo "  journalctl --user -u $SERVICE_NAME -f    # live logs"
echo "  systemctl --user stop $SERVICE_NAME      # stop"
echo "  systemctl --user disable $SERVICE_NAME   # uninstall"
echo ""
echo "The watcher polls GitHub every 60 seconds."
echo "When you push from Replit, WSL2 auto-rebuilds Docker within 1 minute."
