$urls = @(
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
    "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&h=300&fit=crop", 
    "https://images.unsplash.com/photo-1558981285-6f0c94958bb6?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1532298229144-0ec0c57dc48c?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-R9_cs4T-j_E?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1514972365-5c4c9f3f6e5b?w=400&h=300&fit=crop"
)

foreach ($url in $urls) {
    try {
        $response = Invoke-WebRequest -Uri $url -Method Head -ErrorAction Stop
        Write-Host "OK: $url"
    } catch {
        Write-Host "FAIL: $url"
    }
}
