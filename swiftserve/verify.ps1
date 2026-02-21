$baseUrl = "http://localhost:8080"
$username = "testuser"
$password = "testpass"

Write-Host "1. Registering User..."
$registerBody = @{
    username = $username
    password = $password
    fullName = "Test User"
    email = "test@example.com"
    bio = "Hello World"
} | ConvertTo-Json
Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $registerBody -ContentType "application/json"
Write-Host "--------------------------------"

Write-Host "2. Logging in..."
$loginBody = @{
    username = $username
    password = $password
} | ConvertTo-Json
$loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
Write-Host "Login Response: " $loginResponse
Write-Host "--------------------------------"

Write-Host "3. Get Profile..."
$profile = Invoke-RestMethod -Uri "$baseUrl/users/profile/$username" -Method Get
Write-Host "Profile: " ($profile | ConvertTo-Json)
Write-Host "--------------------------------"

Write-Host "4. Update Profile..."
$updateBody = @{
    fullName = "Updated Name"
    bio = "Updated Bio"
} | ConvertTo-Json
Invoke-RestMethod -Uri "$baseUrl/users/profile/$username" -Method Put -Body $updateBody -ContentType "application/json"
Write-Host "--------------------------------"

Write-Host "5. Verify Update..."
$updatedProfile = Invoke-RestMethod -Uri "$baseUrl/users/profile/$username" -Method Get
Write-Host "Updated Profile: " ($updatedProfile | ConvertTo-Json)
Write-Host "--------------------------------"

Write-Host "6. Change Password..."
$pwdBody = @{
    newPassword = "newpassword123"
} | ConvertTo-Json
Invoke-RestMethod -Uri "$baseUrl/users/password/$username" -Method Put -Body $pwdBody -ContentType "application/json"
Write-Host "--------------------------------"

Write-Host "7. Login with New Password..."
$newLoginBody = @{
    username = $username
    password = "newpassword123"
} | ConvertTo-Json
$newLoginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $newLoginBody -ContentType "application/json"
Write-Host "New Login Response: " $newLoginResponse
Write-Host "--------------------------------"

Write-Host "8. Upload Photo (Simulated)..."
# Creating a dummy file
"Dummy Image Content" | Set-Content "test_image.txt"
$url = "$baseUrl/users/photo/$username"
$file = "test_image.txt"
# PowerShell Iterate-RestMethod for multipart is complex, using curl for this one if available, otherwise skipping or using basic approach
# Simplifying for the sake of the environment: we will just check if file exists after "upload" via logic if we could, but here we will try to use curl.exe if present
if (Get-Command curl.exe -ErrorAction SilentlyContinue) {
    curl.exe -X POST -F "file=@test_image.txt" "$url"
} else {
    Write-Host "curl.exe not found, skipping photo upload verification in script."
}
Write-Host "`n--------------------------------"
