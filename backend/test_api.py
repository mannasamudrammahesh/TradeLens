"""Test script for API endpoints."""
import requests
import json

BASE_URL = "http://localhost:8000"


def test_root():
    """Test root endpoint."""
    print("\n🧪 Testing Root Endpoint...")
    response = requests.get(f"{BASE_URL}/")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")


def test_companies():
    """Test companies endpoint."""
    print("\n🧪 Testing /companies...")
    response = requests.get(f"{BASE_URL}/companies")
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Found {len(data)} companies")
    if data:
        print(f"Sample: {json.dumps(data[0], indent=2)}")


def test_stock_data():
    """Test stock data endpoint."""
    print("\n🧪 Testing /data/RELIANCE.NS...")
    response = requests.get(f"{BASE_URL}/data/RELIANCE.NS?days=30")
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Found {len(data)} data points")
    if data:
        print(f"Latest: {json.dumps(data[-1], indent=2)}")


def test_summary():
    """Test summary endpoint."""
    print("\n🧪 Testing /summary/TCS.NS...")
    response = requests.get(f"{BASE_URL}/summary/TCS.NS")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")


def test_compare():
    """Test compare endpoint."""
    print("\n🧪 Testing /compare...")
    response = requests.get(f"{BASE_URL}/compare?symbol1=INFY.NS&symbol2=TCS.NS")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")


if __name__ == "__main__":
    print("=" * 60)
    print("Stock Data Intelligence API - Test Suite")
    print("=" * 60)
    
    try:
        test_root()
        test_companies()
        test_stock_data()
        test_summary()
        test_compare()
        
        print("\n" + "=" * 60)
        print("✅ All tests completed!")
        print("=" * 60)
    except requests.exceptions.ConnectionError:
        print("\n❌ Error: Could not connect to API")
        print("Make sure the server is running: python main.py")
    except Exception as e:
        print(f"\n❌ Error: {e}")
