# Design Pattern Diagram Extraction Prompt

Use the following prompt with a Vision-capable AI model (like Gemini 1.5 Pro or GPT-4o) to accurately convert the provided PDF diagrams into Mermaid.js code.

---

## AI Prompt: Architectural Extraction of Design Pattern Diagrams

**Role:** You are an expert Software Architect and Mermaid.js specialist.

**Task:** Your objective is to transform the class diagrams in the attached PDF into detailed, syntactically correct Mermaid.js class diagram code.

**Instructions for Each Pattern:**

1. **Identify the Pattern:** Look for the pattern name (e.g., "Chain of Responsibility", "Observer", "Abstract Factory") and its category (Creational, Structural, Behavioral) [cite: 51, 141, 194, 215, 249].
2. **Model Classes & Interfaces:**
   - Capture all classes and mark interfaces with the `<<interface>>` stereotype [cite: 44, 59, 104, 187].
   - Extract private attributes (prefixed with `-`) and public methods (prefixed with `+`) [cite: 43, 60, 64, 228].
   - Maintain specific parameter names and types as shown in the text (e.g., `+attach(in o: Observer)`) [cite: 60].
3. **Map Relationships:** Use the following Mermaid syntax based on the visual arrows:
   - **Inheritance/Realization:** Use `Subclass --|> Superclass` or `ConcreteImpl ..|> Interface`.
   - **Association:** Use `ClassA --> ClassB`.
   - **Composition:** Use `Container *-- Contained` (e.g., for Composite patterns) [cite: 213, 214].
   - **Labels:** Include relationship labels such as "represents", "observes", "notifies", or "successor" where indicated [cite: 48, 61, 65, 183].
4. **Detail Level:** - Include the "What it is" description as a comment block above each diagram [cite: 25, 52, 112].
   - Ensure self-references are captured (e.g., the `successor` link in Chain of Responsibility) [cite: 48].

**Output Requirement:**
Produce one standalone Mermaid code block for each design pattern found in the document. Ensure no markdown formatting errors exist within the Mermaid blocks.
