#!/bin/bash

cd public/images

# Create icons directory if it doesn't exist
mkdir -p icons

# Generate all required sizes
convert AxeVault_logo2.png -resize 16x16 icons/icon-16x16.png
convert AxeVault_logo2.png -resize 32x32 icons/icon-32x32.png
convert AxeVault_logo2.png -resize 57x57 icons/icon-57x57.png
convert AxeVault_logo2.png -resize 70x70 icons/icon-70x70.png
convert AxeVault_logo2.png -resize 72x72 icons/icon-72x72.png
convert AxeVault_logo2.png -resize 76x76 icons/icon-76x76.png
convert AxeVault_logo2.png -resize 96x96 icons/icon-96x96.png
convert AxeVault_logo2.png -resize 114x114 icons/icon-114x114.png
convert AxeVault_logo2.png -resize 120x120 icons/icon-120x120.png
convert AxeVault_logo2.png -resize 128x128 icons/icon-128x128.png
convert AxeVault_logo2.png -resize 144x144 icons/icon-144x144.png
convert AxeVault_logo2.png -resize 150x150 icons/icon-150x150.png
convert AxeVault_logo2.png -resize 152x152 icons/icon-152x152.png
convert AxeVault_logo2.png -resize 180x180 icons/apple-touch-icon.png
convert AxeVault_logo2.png -resize 192x192 icons/icon-192x192.png
convert AxeVault_logo2.png -resize 310x310 icons/icon-310x310.png
convert AxeVault_logo2.png -resize 384x384 icons/icon-384x384.png
convert AxeVault_logo2.png -resize 512x512 icons/icon-512x512.png

echo "All icons generated successfully!" 