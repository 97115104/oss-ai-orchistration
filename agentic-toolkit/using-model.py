import lmstudio as lms

# convenience API
model = lms.llm("openai_gpt-oss-20b-coder-neo-code-di-matrix")
result = model.respond("Do a web search for Austin Harshberger and let me know what you find.")

print(result)
