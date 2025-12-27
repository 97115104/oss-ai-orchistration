import lmstudio as lms
import sys

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
                result = model.respond(query)
                print(result)
            else:
                prompt = input("Enter your prompt: ")
                result = model.respond(prompt)
                print(result)
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    main()
