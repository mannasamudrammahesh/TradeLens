#!/usr/bin/env python3
"""
Setup Verification Script for TradeLens
Checks if all dependencies and files are in place
"""

import os
import sys
import subprocess
from pathlib import Path

def print_header(text):
    """Print a formatted header."""
    print("\n" + "=" * 60)
    print(f"  {text}")
    print("=" * 60)

def check_file(filepath, description):
    """Check if a file exists."""
    if os.path.exists(filepath):
        print(f"✅ {description}: {filepath}")
        return True
    else:
        print(f"❌ {description} missing: {filepath}")
        return False

def check_python():
    """Check Python installation."""
    try:
        result = subprocess.run(
            [sys.executable, "--version"],
            capture_output=True,
            text=True
        )
        version = result.stdout.strip()
        print(f"✅ Python: {version}")
        return True
    except Exception as e:
        print(f"❌ Python check failed: {e}")
        return False

def check_node():
    """Check Node.js installation."""
    try:
        result = subprocess.run(
            ["node", "--version"],
            capture_output=True,
            text=True
        )
        version = result.stdout.strip()
        print(f"✅ Node.js: {version}")
        return True
    except Exception as e:
        print(f"❌ Node.js not found: {e}")
        return False

def check_backend_files():
    """Check backend files."""
    files = [
        ("backend/main.py", "Main API file"),
        ("backend/models.py", "Pydantic models"),
        ("backend/database.py", "Database config"),
        ("backend/data_generator.py", "Data generator"),
        ("backend/requirements.txt", "Python dependencies"),
        ("backend/test_api.py", "API tests"),
        ("backend/README.md", "Backend docs"),
    ]
    
    all_present = True
    for filepath, description in files:
        if not check_file(filepath, description):
            all_present = False
    
    return all_present

def check_frontend_files():
    """Check frontend files."""
    files = [
        ("src/components/Dashboard.tsx", "Dashboard component"),
        ("src/lib/api.ts", "API client"),
        ("src/lib/stockData.ts", "Mock data"),
        ("package.json", "Node dependencies"),
        ("vite.config.ts", "Vite config"),
    ]
    
    all_present = True
    for filepath, description in files:
        if not check_file(filepath, description):
            all_present = False
    
    return all_present

def check_documentation():
    """Check documentation files."""
    files = [
        ("README.md", "Main documentation"),
        ("SETUP_GUIDE.md", "Setup guide"),
        ("ASSIGNMENT_COMPLETION.md", "Assignment completion"),
        ("PROJECT_SUMMARY.md", "Project summary"),
        ("SUBMISSION_CHECKLIST.md", "Submission checklist"),
    ]
    
    all_present = True
    for filepath, description in files:
        if not check_file(filepath, description):
            all_present = False
    
    return all_present

def check_python_packages():
    """Check if Python packages are installed."""
    packages = [
        "fastapi",
        "uvicorn",
        "sqlalchemy",
        "pandas",
        "numpy",
        "pydantic"
    ]
    
    print("\nChecking Python packages...")
    all_installed = True
    
    for package in packages:
        try:
            __import__(package)
            print(f"✅ {package}")
        except ImportError:
            print(f"❌ {package} not installed")
            all_installed = False
    
    if not all_installed:
        print("\n💡 Install with: pip install -r backend/requirements.txt")
    
    return all_installed

def check_node_modules():
    """Check if node_modules exists."""
    if os.path.exists("node_modules"):
        print("✅ node_modules directory exists")
        return True
    else:
        print("❌ node_modules not found")
        print("💡 Install with: npm install")
        return False

def main():
    """Run all checks."""
    print_header("TradeLens Setup Verification")
    
    results = {}
    
    # Check system requirements
    print_header("System Requirements")
    results["python"] = check_python()
    results["node"] = check_node()
    
    # Check backend files
    print_header("Backend Files")
    results["backend_files"] = check_backend_files()
    
    # Check frontend files
    print_header("Frontend Files")
    results["frontend_files"] = check_frontend_files()
    
    # Check documentation
    print_header("Documentation Files")
    results["documentation"] = check_documentation()
    
    # Check Python packages
    print_header("Python Packages")
    results["python_packages"] = check_python_packages()
    
    # Check Node modules
    print_header("Node Modules")
    results["node_modules"] = check_node_modules()
    
    # Summary
    print_header("Summary")
    
    all_passed = all(results.values())
    
    if all_passed:
        print("\n🎉 All checks passed! Your setup is complete.")
        print("\nNext steps:")
        print("1. Start backend: cd backend && python main.py")
        print("2. Start frontend: npm run dev")
        print("3. Open http://localhost:5173")
    else:
        print("\n⚠️  Some checks failed. Please review the issues above.")
        print("\nFailed checks:")
        for check, passed in results.items():
            if not passed:
                print(f"  ❌ {check}")
    
    print("\n" + "=" * 60)
    
    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(main())
