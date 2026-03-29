import re
from typing import Dict, Any, List

def parse_medical_text(text: str) -> Dict[str, Any]:
    """
    Basic rule-based parser for structured medical text.
    Extracts diagnosis, medications, and tests based on common document headers.
    """
    diagnosis = ""
    medications: List[str] = []
    tests: List[str] = []
    
    if not text:
        return {
            "diagnosis": diagnosis,
            "medications": medications,
            "tests": tests
        }

    # Normalize newlines and perform basic cleaning
    lines = [lin.strip() for lin in text.split('\n') if lin.strip()]
    
    current_section = None
    
    for line in lines:
        lower_line = line.lower()
        
        # Detect sections via simple regexes looking for headers and optional colons
        if re.match(r'^(diagnosis|assessment|impression|dx)[:\-]?(\s|$)', lower_line):
            current_section = 'diagnosis'
            content = re.sub(r'^(diagnosis|assessment|impression|dx)[:\-]?\s*', '', line, flags=re.IGNORECASE)
            if content:
                diagnosis += content + " "
            continue
            
        elif re.match(r'^(medications|meds|rx|prescription|prescriptions)[:\-]?(\s|$)', lower_line):
            current_section = 'medications'
            content = re.sub(r'^(medications|meds|rx|prescription|prescriptions)[:\-]?\s*', '', line, flags=re.IGNORECASE)
            if content:
                medications.append(content)
            continue
            
        elif re.match(r'^(tests|investigations|labs|laboratory|imaging)[:\-]?(\s|$)', lower_line):
            current_section = 'tests'
            content = re.sub(r'^(tests|investigations|labs|laboratory|imaging)[:\-]?\s*', '', line, flags=re.IGNORECASE)
            if content:
                tests.append(content)
            continue
            
        # Append to section boundaries
        if current_section == 'diagnosis':
            diagnosis += line + " "
        elif current_section == 'medications':
            clean_med = re.sub(r'^[\-\*\d\.\s]+', '', line)
            if clean_med:
                medications.append(clean_med)
        elif current_section == 'tests':
            clean_test = re.sub(r'^[\-\*\d\.\s]+', '', line)
            if clean_test:
                tests.append(clean_test)
                
    return {
        "diagnosis": diagnosis.strip(),
        "medications": medications,
        "tests": tests
    }
