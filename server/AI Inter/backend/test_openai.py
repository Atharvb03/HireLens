import os
from dotenv import load_dotenv

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
print(f"API Key loaded: {GOOGLE_API_KEY[:20]}..." if GOOGLE_API_KEY else "No API key found")
print(f"API Key is valid: {GOOGLE_API_KEY and GOOGLE_API_KEY != 'your-google-gemini-api-key-here'}")

try:
    import google.generativeai as genai
    print("✓ Google Generative AI library imported successfully")
    
    if GOOGLE_API_KEY and GOOGLE_API_KEY != "your-google-gemini-api-key-here":
        genai.configure(api_key=GOOGLE_API_KEY)
        print("✓ Google Gemini client configured")
        
        # Test API call
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content("Say 'Hello'")
        print(f"✓ API call successful: {response.text}")
    else:
        print("✗ No valid API key found in .env")
except Exception as e:
    print(f"✗ Error: {e}")
