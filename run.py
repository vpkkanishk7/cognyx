#!/usr/bin/env python3
"""
COGNYX Unified Full-Stack Orchestrator
Runs both the Node.js Express backend and the FastAPI ML microservice concurrently.
"""

import os
import sys
import subprocess
import time
import signal
import webbrowser

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(BASE_DIR, "backend")
ML_DIR = os.path.join(BASE_DIR, "ml_service")

def main():
    print("=" * 68)
    print("               COGNYX HEALTH SCIENCES ENGINE")
    print("         Precision Digital Phenotyping & Diagnostic AI")
    print("=" * 68)
    
    # 1. Start ML Microservice
    print("\n[1/3] Starting Python ML Microservice (FastAPI on Port 8000)...")
    ml_cmd = [sys.executable, "-m", "uvicorn", "main:app", "--port", "8000", "--reload"]
    ml_proc = subprocess.Popen(ml_cmd, cwd=ML_DIR)

    time.sleep(2)

    # 2. Open Web Browser
    print("[2/3] Launching web browser at http://localhost:3005...")
    try:
        webbrowser.open("http://localhost:3005")
    except Exception as e:
        print(f"Could not automatically open browser: {e}")

    # 3. Start Backend Server
    print("[3/3] Starting Express Backend Server (Port 3005)...")
    node_cmd = ["node", "server.js"]
    node_proc = subprocess.Popen(node_cmd, cwd=BACKEND_DIR)

    def shutdown(signum=None, frame=None):
        print("\n\nShutting down COGNYX services...")
        try:
            node_proc.terminate()
        except Exception:
            pass
        try:
            ml_proc.terminate()
        except Exception:
            pass
        sys.exit(0)

    signal.signal(signal.SIGINT, shutdown)
    signal.signal(signal.SIGTERM, shutdown)

    try:
        while True:
            time.sleep(1)
            if ml_proc.poll() is not None:
                print("ML service stopped.")
                break
            if node_proc.poll() is not None:
                print("Backend service stopped.")
                break
    except KeyboardInterrupt:
        shutdown()

if __name__ == "__main__":
    main()
