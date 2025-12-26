**TL;DR:** Below is a `README.md` file that accompanies the `install_agentic.sh` script. It includes installation instructions, usage examples, customization options, and troubleshooting tips.

---

# **Agentic Installer**
A production-ready Bash script to set up a local LLM inference environment using `llama.cpp` with LM Studio model support.

---

## **Table of Contents**
1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Customization](#customization)
5. [Troubleshooting](#troubleshooting)

---

## **Prerequisites**
- **macOS** (Apple Silicon recommended for optimal performance).
- **Homebrew** (installed automatically if missing).
- **LM Studio** installed with models in:
  `/Users/$USER/.lmstudio/hub/models/`

---

## **Installation**
1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/agentic-installer.git
   cd agentic-installer
   ```
2. Make the script executable:
   ```bash
   chmod +x install_agentic.sh
   ```
3. Run the installer:
   ```bash
   ./install_agentic.sh --model-name mistralai/devstral-small-2-2512
   ```

---

## **Usage**
### **Basic Installation**
```bash
./install_agentic.sh --model-name mistralai/devstral-small-2-2512
```
- Installs dependencies, builds `llama.cpp`, and starts an HTTP wrapper on `localhost:8000`.

### **Custom Target Directory & Port**
```bash
./install_agentic.sh --target-dir ~/custom_path --port 9000
```
- Installs everything in `~/custom_path` and uses port `9000`.

### **Help Menu**
```bash
./install_agentic.sh --help
```
- Displays available options.

---

## **Customization**
### **Environment Variables**
Override defaults via environment variables:
```bash
TARGET_DIR=~/my_llama WRAPPER_PORT=9000 ./install_agentic.sh --model-name mistralai/devstral-small-2-2512
```

### **Supported Options**
| Option | Description |
|--------|-------------|
| `--model-name` | LM Studio model name (e.g., `mistralai/devstral-small-2-2512`). |
| `--target-dir` | Installation directory (default: `~/agentic`). |
| `--port` | HTTP wrapper port (default: `8000`). |

---

## **Troubleshooting**
### **1. Homebrew Installation Fails**
- Ensure you have admin privileges.
- Manually install Homebrew:
  ```bash
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  ```

### **2. Model Not Found in LM Studio**
- Verify the model exists at:
  `/Users/$USER/.lmstudio/hub/models/{MODEL_NAME}`.
- Check for typos in the `--model-name` argument.

### **3. `llama.cpp` Build Errors**
- Ensure you have enough disk space.
- Try rebuilding with:
  ```bash
  cd ~/agentic/llama.cpp && make clean && make -j$(sysctl -n hw.logicalcpu)
  ```

### **4. HTTP Wrapper Not Responding**
- Check logs:
  ```bash
  tail -f ~/agentic/wrapper.log
  ```
- Restart the wrapper:
  ```bash
  pkill -f "python3 ~/agentic/wrapper.py"
  nohup python3 ~/agentic/wrapper.py > ~/agentic/wrapper.log 2>&1 &
  ```

---

## **Notes**
- The script automatically copies the model from LM Studio to avoid path conflicts.
- For large models, ensure sufficient disk space in the target directory.

---

## **Contributing**
Pull requests are welcome! Open an issue for bugs or feature requests.

---

## **License**
MIT. See `LICENSE` for details.