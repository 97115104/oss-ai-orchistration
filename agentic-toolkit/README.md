## LMStudio Python Demo – `using-model.py`

A ready‑to‑run example that shows how to build a **Python‑based AI assistant** on top of LMStudio.  
The script can:

* Load any model known to LMStudio (e.g. `nvidia/nemotron-3-nano`).  
* Accept a prompt from the command line **or** enter an interactive REPL.  
* Explore a local directory tree, read files, search with glob patterns.  
* Safely **create** files / directories after user confirmation.  
* Perform **DuckDuckGo web searches** via the LMStudio plugin.  
* Show a **progress bar** while the model streams its answer.  

---

## Table of Contents
1. [Prerequisites](#prerequisites)  
2. [Installation](#installation)  
3. [Quick Start](#quick-start)  
4. [Command‑Line Arguments](#command-line-arguments)  
5. [Interactive REPL Mode](#interactive-repl-mode)  
6. [File‑System Helpers](#file-system-helpers)  
7. [Web Search (DuckDuckGo)](#web-search-duckduckgo)  
8. [Safety & Confirmation](#safety--confirmation)  
9. [Troubleshooting](#troubleshooting)  
10. [License & Acknowledgements](#license--acknowledgements)  

---

## Prerequisites
| Requirement | Why it’s needed |
|------------|-----------------|
| Python 3.8+ | Modern syntax & type hints |
| `lmstudio` Python SDK | Provides `lmstudio.llm` and the DuckDuckGo plugin |
| `tqdm` (optional) | Pretty progress‑bar while the model generates text |
| Internet connection (for model download & web search) | First‑time model download & DuckDuckGo queries |

You can install the required Python packages with:

```bash
python3 -m pip install --upgrade pip
python3 -m pip install lmstudio tqdm
```

---

## Installation

1. **Clone or copy the script**  
   Save the file `using-model.py` (the one shown in the previous answer) into a folder of your choice.

2. **Make it executable** (optional, Unix‑like systems):

   ```bash
   chmod +x using-model.py
   ```

3. **Verify LMStudio is installed**  

   ```bash
   python3 -c "import lmstudio; print('LMStudio version:', lmstudio.__version__)"
   ```

   If you get an error, reinstall the SDK as shown above.

---

## Quick Start

```bash
# Use the default model (openai_gpt-oss-20b-coder-neo-code-di-matrix)
python3 using-model.py
```

```bash
# Use a custom model and a prompt directly from the CLI
python3 using-model.py nvidia/nemotron-3-nano "Write a hello‑world program in Python."
```

The script will:

* Load the requested model.  
* Show a loading progress indicator.  
* Stream the model’s response token‑by‑token, updating the bar.  
* Print the final answer.

---

## Command‑Line Arguments

| Argument | Short | Description |
|----------|-------|-------------|
| `model` | (positional) | Model identifier to use (default: `openai_gpt-oss-20b-coder-neo-code-di-matrix`). |
| `prompt` | (positional) | Prompt to send to the model. If omitted, the script drops into an interactive REPL. |
| `-d, --directory <path>` |  | Root directory to explore (default: current working directory). |
| `-c, --create <path>` |  | Create a file at `<path>`. Content can be supplied after the path or entered interactively. |
| `-C, --content <text>` |  | Content to write when using `--create`. |
| `-s, --search <glob>` |  | Glob pattern (e.g. `*.py`) to search files under the chosen directory. |
| `-q, --websearch <query>` |  | Run a DuckDuckGo search for `<query>` and display the first few URLs. |
| `-h, --help` |  | Show the help message and exit. |

### Example invocations

```bash
# 1️⃣ Create a new file with a custom name and content
python3 using-model.py nvidia/nemotron-3-nano \
    -d ./my_project -c "./my_project/main.py" \
    "#!/usr/bin/env python3\nprint('Hello, world!')"

# 2️⃣ Search for all Python files under ./my_project
python3 using-model.py nvidia/nemotron-3-nano \
    -d ./my_project -s "*.py" -c "list"

# 3️⃣ Perform a DuckDuckGo search for “best Python IDE”
python3 using-model.py nvidia/nemotron-3-nano -q "best Python IDE"
```

---

## Interactive REPL Mode

When **no prompt** is supplied on the command line, the script drops into a tiny REPL:

```
>>> list                # list all files in the current directory
>>> read ./script.py    # display the contents of a file
>>> search *.txt       # find files matching a glob pattern
>>> create new.txt "print('generated')"   # creates/overwrites after confirmation
>>> mkdir new_folder    # makes a new directory
>>> websearch "AI tools"   # performs a DuckDuckGo search
>>> exit                # quit
```

*Each command prints a short progress bar while it works.*  
Type `exit` or press **Ctrl‑C**/**Ctrl‑D** to leave.

---

## File‑System Helpers (used internally)

| Function | Purpose |
|----------|---------|
| `list_local_files(root)` | Recursively collect every regular file under `root`. |
| `read_file_text(path)` | Safely read a text file (UTF‑8). |
| `write_file(path, content)` | Overwrite (or create) a file, creating missing parent directories. |
| `search_files(root, pattern)` | Return files whose **full path** matches a glob pattern. |
| `confirm(prompt, resp='y')` | Ask the user yes/no; only proceeds if the response matches `resp`. |
| `duckduckgo_search(query, max_results)` | Call the LMStudio DuckDuckGo plugin and return matching URLs. |
| `ask_model(model_name, prompt)` | Create a `lmstudio.llm` client, stream the answer, and show a progress bar. |

All of these helpers are defined at the top of `using-model.py` for easy reference and modification.

---

## Safety & Confirmation

* When creating a file, the script asks **“Create file? [y/n]”**.  
* If the target path is an absolute location (e.g., `/tmp/...`) or attempts to write outside a safe sandbox, the script aborts with a warning.  
* The user can abort at any time by answering with anything other than `y` (case‑insensitive).  

Feel free to adjust the confirmation logic in the source if you need stricter or more permissive rules.

---

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| `ImportError: No module named 'lmstudio'` | LMStudio SDK not installed | `python3 -m pip install lmstudio` |
| Model download hangs forever | Poor internet or firewall | Check connectivity; try a smaller model or a pre‑downloaded checkpoint. |
| `tqdm` not showing a bar | `tqdm` not installed | `python3 -m pip install tqdm` (the script falls back to a no‑op wrapper). |
| “DuckDuckGo plugin not available” | Plugin not packaged in your LMStudio install | Install the plugin via the LMStudio UI or `python3 -m pip install lmstudio-duckduckgo` (if available). |
| Permission denied when creating files | Trying to write to a protected directory | Use a directory you own (e.g., `./my_project`) or run with appropriate privileges. |

---

## License & Acknowledgements

* **Script author**: *Your Name* (or leave blank if you prefer anonymity).  
* **LMStudio** – https://lmstudio.ai  
* **DuckDuckGo** – https://duckduckgo.com  
* **tqdm** – https://github.com/tqdm/tqdm  

This work is released under the **MIT License** – feel free to adapt, extend, and share.

--- 

*Happy hacking!* 🎉  



--- 