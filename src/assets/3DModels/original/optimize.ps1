# Dossiers de travail
$SOURCE_DIR = "d:\Projets\3D_Portfolio\src\assets\3DModels\original"
$OUTPUT_DIR = "d:\Projets\3D_Portfolio\src\assets\3DModels\optimized"
$MOBILE_DIR = "d:\Projets\3D_Portfolio\src\assets\3DModels\mobile"

# Créer les dossiers de sortie s'ils n'existent pas
if (-not (Test-Path $OUTPUT_DIR)) { New-Item -ItemType Directory -Path $OUTPUT_DIR | Out-Null }
if (-not (Test-Path $MOBILE_DIR)) { New-Item -ItemType Directory -Path $MOBILE_DIR | Out-Null }

# Récupération de tous les modèles .glb
$modelsFiles = Get-ChildItem -Path $SOURCE_DIR -Filter "*.glb"

# Traitement de chaque modèle
foreach ($file in $modelsFiles) {
    $sourcePath = $file.FullName
    $outputPath = Join-Path $OUTPUT_DIR $file.Name
    $mobilePath = Join-Path $MOBILE_DIR $file.Name
    
    # Version standard optimisée
    Write-Host "Optimisation de $($file.Name) (standard)..."
    gltf-pipeline -i "$sourcePath" -o "$outputPath" --draco.compressionLevel=7
    
    # Version mobile très compressée
    Write-Host "Optimisation de $($file.Name) (mobile)..."
    gltf-pipeline -i "$sourcePath" -o "$mobilePath" --draco.compressionLevel=10 --draco.quantizePositionBits=14
}

Write-Host "Tous les modèles ont été optimisés!"

# Ajoutez ce code à la fin de votre script pour afficher les résultats
Write-Host "`nRésultats de l'optimisation:"
Write-Host "--------------------------------"

$originalTotal = 0
$optimizedTotal = 0
$mobileTotal = 0

foreach ($file in $modelsFiles) {
    $originalSize = (Get-Item "$SOURCE_DIR\$($file.Name)").Length / 1KB
    $optimizedSize = (Get-Item "$OUTPUT_DIR\$($file.Name)").Length / 1KB
    $mobileSize = (Get-Item "$MOBILE_DIR\$($file.Name)").Length / 1KB
    
    $originalTotal += $originalSize
    $optimizedTotal += $optimizedSize
    $mobileTotal += $mobileSize
    
    $optimizedReduction = (1 - $optimizedSize / $originalSize) * 100
    $mobileReduction = (1 - $mobileSize / $originalSize) * 100
    
    Write-Host "$($file.Name): Original: $([math]::Round($originalSize,2))KB | Optimized: $([math]::Round($optimizedSize,2))KB ($([math]::Round($optimizedReduction,1))% réduit) | Mobile: $([math]::Round($mobileSize,2))KB ($([math]::Round($mobileReduction,1))% réduit)"
}

Write-Host "`nTotal: Original: $([math]::Round($originalTotal,2))KB | Optimized: $([math]::Round($optimizedTotal,2))KB | Mobile: $([math]::Round($mobileTotal,2))KB"
Write-Host "Réduction totale: Optimized: $([math]::Round((1-$optimizedTotal/$originalTotal)*100,1))% | Mobile: $([math]::Round((1-$mobileTotal/$originalTotal)*100,1))%"

Read-Host -Prompt "Appuyez sur Entrée pour continuer"