import os
import re
import pandas as pd

ignore_dirs = {'.git', 'node_modules', 'dist', '.gemini'}

def check_csv_telemetry():
    print("--- 1. SCIENTIFIC TELEMETRY VALIDATION ---")
    spatial_path = "public/data/climate/bangladesh_t2m_spatial_trends_filtered.csv"
    seasonal_path = "public/data/climate/bangladesh_t2m_seasonal_trends.csv"
    
    # 1. Spatial
    df_sp = pd.read_csv(spatial_path)
    print(f"Spatial CSV: {len(df_sp)} stations (expected 34)")
    barisal_sp = df_sp[(df_sp['latitude'] == 22.5) & (df_sp['longitude'] == 90.0)]
    print(f"Barisal spatial record count: {len(barisal_sp)}")
    if len(barisal_sp) > 0:
        row = barisal_sp.iloc[0]
        print(f"Barisal lat={row['latitude']}, lon={row['longitude']}, slope_per_dec={row['slope_c_per_decade']}, p={row['p_value']}, inside_bd={row['inside_bangladesh']}")
        
    # 2. Seasonal
    df_se = pd.read_csv(seasonal_path)
    print(f"\nSeasonal CSV: {len(df_se)} records (expected 408)")
    barisal_oct = df_se[(df_se['latitude'] == 22.5) & (df_se['longitude'] == 90.0) & (df_se['month'] == 'October')]
    print(f"Barisal October record count: {len(barisal_oct)}")
    if len(barisal_oct) > 0:
        row = barisal_oct.iloc[0]
        print(f"Barisal Oct: slope_c_per_decade={row['slope_c_per_decade']} (+0.457), p_value={row['p_value']} (0.0070), sen_slope_c_per_decade={row['sen_slope_c_per_decade']}, r2={row['r_squared']}, significant={row['is_significant']}")

def check_authorship_and_anonymity():
    print("\n--- 2. AUTHORSHIP & ANONYMITY SCAN ---")
    legacy_pattern = re.compile(r"god['\s_-]*eye", re.IGNORECASE)
    ai_pattern = re.compile(r"\b(claude|chatgpt|copilot|antigravity)\b", re.IGNORECASE)
    
    legacy_matches = []
    ai_matches = []
    
    docs_to_check = [
        "README.md", "NASA_SPACEAPPS_2026_SUBMISSION.md", "SUBMISSION_PORTAL_GUIDE.md",
        "package.json", "index.html", "API_KEY_MANUAL.md", "CHANGELOG.md", "CONTRIBUTING.md", "SECURITY.md"
    ]
    
    print("\nChecking key project docs and user-facing files:")
    for doc in docs_to_check:
        if os.path.exists(doc):
            with open(doc, 'r', encoding='utf-8', errors='ignore') as f:
                text = f.read()
                leg = legacy_pattern.findall(text)
                ai = ai_pattern.findall(text)
                author_mushfiqur = "Mushfiqur" in text
                team_orion = "Orion" in text
                print(f"  {doc:35} | Size: {len(text):6} B | Legacy: {len(leg)} | AI: {len(ai)} | Author: {author_mushfiqur} | Team Orion: {team_orion}")
                if leg:
                    legacy_matches.append((doc, leg))
                if ai:
                    ai_matches.append((doc, ai))

    # General scan of all src/ and public/
    code_dirs = ['src', 'public']
    for cd in code_dirs:
        for root, dirs, files in os.walk(cd):
            for file in files:
                if file.endswith(('.js', '.mjs', '.html', '.css', '.json', '.md')):
                    fp = os.path.join(root, file)
                    with open(fp, 'r', encoding='utf-8', errors='ignore') as f:
                        txt = f.read()
                        leg = legacy_pattern.findall(txt)
                        ai = ai_pattern.findall(txt)
                        if leg:
                            legacy_matches.append((fp, leg))
                        if ai:
                            ai_matches.append((fp, ai))
                            
    print(f"\nTotal Legacy 'God's Eye' matches found: {len(legacy_matches)}")
    for item in legacy_matches:
        print(f"  Legacy match: {item}")
        
    print(f"Total AI matches found (excluding node_modules/geojsonl): {len(ai_matches)}")
    for item in ai_matches:
        print(f"  AI match: {item}")

def check_nasa_compliance():
    print("\n--- 3. NASA SPACE APPS 2026 COMPLIANCE ---")
    sub_path = "NASA_SPACEAPPS_2026_SUBMISSION.md"
    guide_path = "SUBMISSION_PORTAL_GUIDE.md"
    
    for path in [sub_path, guide_path]:
        if os.path.exists(path):
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            print(f"\nAuditing {path}:")
            questions = ["What", "Where", "How Much", "Is it Significant"]
            for q in questions:
                found = q.lower() in content.lower()
                print(f"  Question '{q}': {'FOUND' if found else 'MISSING'}")

def check_user_facing_files():
    print("\n--- 4. STRICT USER-FACING FILES AUDIT ---")
    files_to_check = [
        "index.html", "README.md", "NASA_SPACEAPPS_2026_SUBMISSION.md",
        "SUBMISSION_PORTAL_GUIDE.md", "API_KEY_MANUAL.md", "package.json",
        "src/agent/OrionMapHarness.js", "src/main.js"
    ]
    pattern_legacy = re.compile(r"god[\s_\-'\"]*eye", re.IGNORECASE)
    pattern_ai = re.compile(r"\b(claude|chatgpt|copilot|antigravity)\b", re.IGNORECASE)
    
    for f in files_to_check:
        if os.path.exists(f):
            with open(f, 'r', encoding='utf-8', errors='ignore') as fp:
                content = fp.read()
                leg_matches = pattern_legacy.findall(content)
                ai_matches = pattern_ai.findall(content)
                print(f"File: {f:30} | Legacy: {len(leg_matches)} | AI: {len(ai_matches)}")
                if leg_matches:
                    print(f"  Legacy details: {leg_matches}")
                if ai_matches:
                    print(f"  AI details: {ai_matches}")

if __name__ == "__main__":
    check_csv_telemetry()
    check_authorship_and_anonymity()
    check_nasa_compliance()
    check_user_facing_files()


