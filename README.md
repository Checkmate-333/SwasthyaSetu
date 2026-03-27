# SwasthyaSetu
# 🏥 SwasthyaSetu – AI-Powered Unified Health Record System

## ❓ Problem Statement

Rural healthcare in India faces three critical gaps:

- **Fragmented Medical Records** – Patient data is scattered across PHCs, clinics, and hospitals, leading to incomplete histories.  
- **Redundant Diagnostic Tests** – Missing history forces doctors to repeat tests, increasing cost and inconvenience.  
- **Unstructured Prescriptions** – Handwritten prescriptions in multiple languages remain undigitized and hard to track.  

These issues result in delayed diagnoses, higher expenses, and compromised quality of care.

---

## 💡 Solution Overview

**SwasthyaSetu (Health Bridge)** is an AI-powered, offline-first unified health record system that:

- Digitizes handwritten and printed prescriptions  
- Structures medical data using AI  
- Provides intelligent clinical summaries  
- Works seamlessly in low-connectivity rural environments  

---

## ⚙️ How It Works

- 📸 Capture prescription images via mobile  
- 🤖 Use Gemini 2.5 Flash for data extraction  
- 💾 Store data in MongoDB with patient timeline  
- 📋 Generate AI-based clinical summaries  
- 🌐 Sync automatically when internet is available  

---

## ✨ Key Features

| Feature | Description |
|--------|------------|
| 📸 Prescription Digitization | Capture handwritten/printed prescriptions |
| 🤖 AI Extraction | Extract diagnoses, medicines, dosage, tests |
| 💾 Offline-First | IndexedDB storage + auto sync |
| 🏥 Patient Timeline | Complete chronological medical history |
| 📋 Clinical Summaries | AI-generated insights & risk alerts |
| 🖨️ Doctor UI | Clean, printable dashboard |
| 🔒 Privacy | Encrypted + consent-based access |
| 🌐 Multilingual | Supports Hindi & regional languages |
| 🗣️ Voice Support | For low-literacy users |

---

## 🛠️ Tech Stack

| Category | Technology | Purpose |
|----------|------------|--------|
| Frontend | HTML, CSS, JS (PWA) | Lightweight + offline support |
| Backend | Node.js + Express | Fast APIs |
| Database | MongoDB Atlas | Flexible document storage |
| AI Model | Gemini 2.5 Flash | OCR + NLP + summaries |
| Storage | Cloudinary | Image handling |
| Offline | IndexedDB + Service Workers | Offline-first sync |
| Deployment | Vercel + Render | Free hosting |

---

## 🚀 Installation & Setup

### Prerequisites

- Node.js (v18+)  
- MongoDB Atlas  
- Cloudinary Account  
- Gemini API Key  

---

## 👤 Patients / Health Workers

- Open PWA (installable)
- Register via mobile / ABHA (optional)
- Capture prescription (offline supported)
- Auto sync when online

---

## 👨‍⚕️ Doctors

- Login
- Search patient
- View AI summary:
        Past diagnoses
        Medications
        Test history
        Risk alerts
- Access full timeline
- Print report

---

## 🌟 Impact & Benefits

### Social

- Improves continuity of care
- Bridges rural healthcare gap
  
### Economic

- Saves ₹500–2000 per patient
- Reduces doctor workload

### Environmental

- Reduces paper usage
- Cuts unnecessary travel

  
## 🔗 Alignment

- ABDM (Ayushman Bharat Digital Mission)
- Digital India
- National Health Policy

  
## 📚 Research References

- WHO India (2025) – ABHA impact
- ABDM Docs – Health APIs
- Smashing Magazine (2025) – Offline architecture
- arXiv (2025) – Gemini medical AI
- IEEE (2022) – Multilingual NLP
- Oxford Digital Health (2024) – Rural deployment

  
## 👥 Team

- Kuntal Biswas 
- Rishijit Dhar
- Sayantan Dutta
- Arpita Ghosh
- Dibyajyoti Nag


## 📄 License

- Licensed under Apache License 2.0

## ❤️ Built for Rural India

### git clone https://github.com/yourusername/swasthyasetu.git

### cd swasthyasetu
