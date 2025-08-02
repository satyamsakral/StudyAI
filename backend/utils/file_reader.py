import fitz  # PyMuPDF
import docx
import tempfile

async def extract_text_from_file(file):
    ext = file.filename.split(".")[-1].lower()
    contents = await file.read()
    if ext == "pdf":
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp.write(contents)
            tmp.flush()
            doc = fitz.open(tmp.name)
            text = "\n".join(page.get_text() for page in doc)
            doc.close()
        return text
    elif ext == "docx":
        with tempfile.NamedTemporaryFile(delete=False, suffix=".docx") as tmp:
            tmp.write(contents)
            tmp.flush()
            doc = docx.Document(tmp.name)
            text = "\n".join([p.text for p in doc.paragraphs])
        return text
    elif ext == "txt":
        return contents.decode("utf-8")
    else:
        raise ValueError("Unsupported file type") 