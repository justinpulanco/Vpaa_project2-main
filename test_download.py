import requests

# Test the certificate download
response = requests.get('http://localhost:8000/api/attendances/16/download_certificate/')

print(f'Status Code: {response.status_code}')
print(f'Content-Type: {response.headers.get("Content-Type")}')
print(f'Content-Disposition: {response.headers.get("Content-Disposition")}')
print(f'Size: {len(response.content)} bytes')
print(f'First 20 bytes: {response.content[:20]}')

if response.status_code == 200:
    # Save to file
    with open('test_certificate.pdf', 'wb') as f:
        f.write(response.content)
    print('\n✓ Certificate saved as test_certificate.pdf')
    print('Try opening it to verify it works!')
else:
    print(f'\n✗ Error: {response.text}')
