import lmstudio as lms
import sys
import threading
import time

def loading_indicator():
    """Display a spinning loading indicator."""
    chars = ['|', '/', '-', '\\']
    idx = 0
    while not loading_indicator.stop:
        sys.stdout.write(f'\rCompleting request. Hold please. {chars[idx % len(chars)]}')
        sys.stdout.flush()
        idx += 1
        time.sleep(0.1)
    sys.stdout.write('\rDone!     \n')

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 using-model.py <model_name> [query]")
        return

    model_name = sys.argv[1]
    query = " ".join(sys.argv[2:]) if len(sys.argv) > 2 else None

    with lms.Client() as client:
        try:
            model = client.llm.model(model_name)
            if query:
                # Start loading indicator in a separate thread
                loading_indicator.stop = False
                loader_thread = threading.Thread(target=loading_indicator)
                loader_thread.daemon = True  # Ensures thread exits when main program does
                loader_thread.start()

                result = model.respond(query)

                # Stop the loading indicator
                loading_indicator.stop = True
                loader_thread.join()

                print(result)
            else:
                prompt = input("Enter your prompt: ")
                result = model.respond(prompt)
                print(result)
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    main()
