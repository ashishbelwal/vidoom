# Vidoom 🎬

Vidoom is a lightweight and efficient **video editor** built with modern web technologies. It enables users to **upload, trim, and download** videos seamlessly through a sleek and intuitive interface.

## 🚀 Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Video Processing**: GStreamer
- **Styling**: Tailwind CSS

## ✨ Features

- ✅ **Upload Videos** – Supports various formats for easy processing
- ✅ **Trim Videos** – Select start and end times to extract specific clips
- ✅ **Download Trimmed Videos** – Get the processed video with a single click

### 🔧 Installation & Setup

#### Clone the Repository

```sh
git clone https://github.com/ashishbelwal/vidoom.git
```

#### Folder Structure

```sh
vidoom
    ├── vidoom-frontend/
    │   ├── src/
    │   │   ├── assets/
    │   │   ├── components/
    │   ├── public/
    ├── vidoom-backend/
    │   ├── apis/
    │   ├── uploads/
    ├── README.md
```

#### Project Dependencies

- Node.js
- GStreamer
- Express

#### Install Dependencies FRONTEND

```sh
cd vidoom-frontend
npm install
```

#### Install Dependencies BACKEND

```sh
cd vidoom-backend
npm install
```

#### Frontend .env (Create a .env file inside vidoom-frontend/)

```sh
VITE_API_URL=http://localhost:5000
MAX_FILE_SIZE= 50 * 1024 * 1024; # 50MB in bytes
```

#### Run the Application

```sh
cd vidoom-frontend
npm run dev
```

```sh
cd vidoom-backend
npm run start
```
